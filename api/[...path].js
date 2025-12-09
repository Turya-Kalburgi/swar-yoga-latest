import app from './index.js';

// Vercel serverless function configuration
export const config = {
  api: {
    // Increase max body size for file uploads
    bodyParser: {
      sizeLimit: '50mb',
    },
    // Increase function timeout
    maxDuration: 60,
  },
};

/**
 * Universal API handler for all routes
 * This acts as the entry point for all /api/* requests in Vercel
 */
export default async (req, res) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // CORS headers (in case Express CORS middleware doesn't apply)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-User-ID, X-Admin-ID, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Access-Control-Allow-Credentials', 'false');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Log incoming request (debugging)
  const startTime = Date.now();
  console.log(`📨 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log(`   Headers:`, {
    'x-user-id': req.headers['x-user-id'],
    'content-type': req.headers['content-type'],
    'user-agent': req.headers['user-agent']?.substring(0, 50),
  });

  // Call Express app
  try {
    await app(req, res);
    const duration = Date.now() - startTime;
    console.log(`✅ Response sent in ${duration}ms | Status: ${res.statusCode}`);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Error after ${duration}ms:`, error);
    
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      });
    }
  }
};
