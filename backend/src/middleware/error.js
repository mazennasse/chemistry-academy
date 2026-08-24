export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

export const errorHandler = (err, _req, res, _next) => {
  console.error(err);
  const status = err.status || (err.name === 'SequelizeValidationError' ? 400 : 500);
  const message = err.name === 'SequelizeUniqueConstraintError' ? 'A record with this unique value already exists.' : err.message || 'Server error.';
  res.status(status).json({ success: false, message, details: err.details });
};
