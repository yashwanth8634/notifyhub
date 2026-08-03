export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err);
  
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'INTERNAL_ERROR'
    }
  });
};
