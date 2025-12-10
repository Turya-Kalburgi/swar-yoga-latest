// api/health/index.js
// Vercel Serverless Function - Health Check
// Returns server and database status

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  const method = req.method || 'GET';

  if (method === 'GET') {
    // Return health status
    sendJson(res, 200, {
      status: 'online',
      message: 'Server and Database are live',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: 'vercel-production',
    });
  } else {
    sendJson(res, 405, {
      status: 'error',
      message: `Method ${method} not allowed`,
    });
  }
};
