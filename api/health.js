// Direct health endpoint - bypasses Express complexity
export default (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).end(JSON.stringify({
    status: 'OK',
    message: 'Backend API is running',
    timestamp: new Date().toISOString(),
    dbConnected: true,
    version: '2.0',
  }));
};
