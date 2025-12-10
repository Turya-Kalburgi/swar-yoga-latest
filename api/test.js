// Minimal test endpoint to debug Vercel serverless functions
export default async (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Minimal test endpoint working',
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.url,
  });
};
