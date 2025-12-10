// api/contact/messages.js
// Vercel Serverless Function - Contact Form Handler
// Receives contact form submissions and logs them (stub)

export default async function handler(req, res) {
  const method = req.method || 'POST';

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-User-ID');

  // Handle preflight CORS requests
  if (method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (method === 'POST') {
    // Receive contact form submission
    // We don't parse the body yet - just acknowledge
    console.log('📩 New contact message received at', new Date().toISOString());

    return res.status(200).json({
      ok: true,
      message: 'Contact message received successfully (stub backend).',
      messageId: `msg_${Date.now()}`,
      timestamp: new Date().toISOString(),
    });
  }

  if (method === 'GET') {
    // Optionally retrieve all contact messages (future feature)
    return res.status(200).json({
      ok: true,
      messages: [],
      message: 'Contact message retrieval is not implemented yet (stub).',
    });
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({
    ok: false,
    message: `Method ${method} not allowed on /api/contact/messages`,
  });
}
