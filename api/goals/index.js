// api/goals/index.js
// Vercel Serverless Function - Goals Management
// Handles CRUD operations for user goals

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-User-ID');

  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  const method = req.method || 'GET';
  const userId = req.headers['x-user-id'];

  if (method === 'GET') {
    // Retrieve all goals for user
    sendJson(res, 200, {
      success: true,
      data: [],
      count: 0,
      message: 'Goals list retrieved (stub - MongoDB connection coming soon)',
    });
  } else if (method === 'POST') {
    // Create new goal
    sendJson(res, 201, {
      success: true,
      data: { _id: `goal_${Date.now()}`, ...req.body },
      message: 'Goal created successfully (stub backend)',
    });
  } else if (method === 'PUT') {
    // Update goal
    sendJson(res, 200, {
      success: true,
      data: req.body,
      message: 'Goal updated successfully (stub backend)',
    });
  } else if (method === 'DELETE') {
    // Delete goal
    sendJson(res, 200, {
      success: true,
      message: 'Goal deleted successfully (stub backend)',
    });
  } else {
    sendJson(res, 405, {
      success: false,
      message: `Method ${method} not allowed`,
    });
  }
};
