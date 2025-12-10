// api/admin/index.js
// Vercel Serverless Function - Admin Dashboard
// Handles admin operations and data retrieval

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-ID, X-User-ID');

  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  const method = req.method || 'GET';
  const adminId = req.headers['x-admin-id'];

  // Check if admin is authenticated
  if (!adminId) {
    return sendJson(res, 401, {
      success: false,
      message: 'Unauthorized: Admin ID required',
    });
  }

  if (method === 'GET') {
    // Retrieve admin dashboard data
    sendJson(res, 200, {
      success: true,
      data: {
        totalUsers: 0,
        totalVisions: 0,
        totalGoals: 0,
        totalTasks: 0,
        recentActivity: [],
      },
      message: 'Admin dashboard data retrieved (stub - MongoDB connection coming soon)',
    });
  } else if (method === 'POST') {
    // Admin action
    sendJson(res, 201, {
      success: true,
      message: 'Admin action completed successfully (stub backend)',
    });
  } else if (method === 'PUT') {
    // Update admin settings
    sendJson(res, 200, {
      success: true,
      message: 'Admin settings updated (stub backend)',
    });
  } else if (method === 'DELETE') {
    // Delete admin action
    sendJson(res, 200, {
      success: true,
      message: 'Admin action deleted (stub backend)',
    });
  } else {
    sendJson(res, 405, {
      success: false,
      message: `Method ${method} not allowed`,
    });
  }
};
