// src/middlewares/errorHandler.js
export default function errorHandler(err, req, res, next) {
  console.error(err);

  // If it's our DB wrapper error with sql info
  if (err.sql) {
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      detail: err.message,
      // Do not expose err.params in production
    });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ status: 'error', message });
}
