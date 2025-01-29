// controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const logger = require('../config/logger');

// Sign in user and generate a JWT token
exports.signIn = async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation failed', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find user by email using Sequelize
    const user = await User.findOne({ where: { email } });

    if (!user) {
      logger.warn(`User not found with email: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.warn(`Invalid password for email: ${email}`);
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, name: user.name }, 'your-secret-key', {
      expiresIn: '1h', // Token expires in 1 hour
    });

    // Send token back to the client
    res.status(200).json({ token });
    logger.info(`User signed in successfully: ID=${user.id}, Email=${email}`);
  } catch (error) {
    logger.error(`Error signing in user: ${error.message}`);
    next(error); // Pass the error to the global error handler
  }
};


// Sign up user and hash the password
exports.signUp = async (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation failed', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { name, email, password } = req.body;
  
    try {
      // Check if user already exists by email using Sequelize
      const existingUser = await User.findOne({ where: { email } });
  
      if (existingUser) {
        logger.warn(`User already exists with email: ${email}`);
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user using Sequelize
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
  
      // Send response back to client
      res.status(201).json({ message: 'User created successfully' });
      logger.info(`User created successfully: ID=${user.id}, Email=${email}`);
    } catch (error) {
      logger.error(`Error signing up user: ${error.message}`);
      next(error); // Pass the error to the global error handler
    }
  };