const logger = require('../config/logger');

// Middleware for handling errors
const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
