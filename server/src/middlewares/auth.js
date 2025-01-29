// middleware/auth.js
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

// Middleware to authenticate requests using JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  // Verify the token
  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = user; // Attach decoded user information to request object
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateJWT;
