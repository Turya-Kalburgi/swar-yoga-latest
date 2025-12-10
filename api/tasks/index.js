// api/tasks/index.js
// Vercel Serverless Function - Tasks Management
// Handles CRUD operations for user tasks

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-User-ID');

  if (req.method === 'OPTIONS') {
    res.status(200);
    return res.json({ ok: true });
  }

  const method = req.method || 'GET';
  const userId = req.headers['x-user-id'];

  if (method === 'GET') {
    res.status(200);
    return res.json({
      success: true,
      data: [],
      count: 0,
      message: 'Tasks list retrieved (stub - MongoDB connection coming soon)',
    });
  } else if (method === 'POST') {
    res.status(201);
    return res.json({
      success: true,
      data: { _id: `task_${Date.now()}`, ...req.body },
      message: 'Task created successfully (stub backend)',
    });
  } else if (method === 'PUT') {
    res.status(200);
    return res.json({
      success: true,
      data: req.body,
      message: 'Task updated successfully (stub backend)',
    });
  } else if (method === 'DELETE') {
    res.status(200);
    return res.json({
      success: true,
      message: 'Task deleted successfully (stub backend)',
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405);
    return res.json({
      success: false,
      message: `Method ${method} not allowed`,
    });
  }
};
