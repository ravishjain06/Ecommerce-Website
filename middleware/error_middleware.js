export const errorMiddleware = (err, req, res, next) => {
    try {
      let error = { ...err };
  
      error.message = err.message || 'Something went wrong';
      error.statusCode = err.statusCode || 500;
  
      console.error(err); // Log the original error for debugging
  
      if (err.name === 'CastError') {
        error.message = 'Resource not found';
        error.statusCode = 404;
      }
  
      if (err.code === 11000) {
        const duplicateKey = Object.keys(err.keyValue || {}).join(', ');
        error.message = `Duplicate key: ${duplicateKey}`;
        error.statusCode = 400;
      }
  
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors || {}).map((val) => val.message);
        error.message = messages.join(', ');
        error.statusCode = 400;
      }
  
      // Zod errors handling
      if (err.errors && Array.isArray(err.errors)) {
        error.message = err.errors.map((e) => e.message).join(', ');
        error.statusCode = err.statusCode || 400;
      }
  
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } catch (error) {
      next(error);
    }
  };
  