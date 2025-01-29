// controllers/auth.admin.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { validationResult } = require("express-validator");
const logger = require("../config/logger");

// Sign in user and generate a JWT token
exports.adminSignIn = async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn("Validation failed", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find user by email using Sequelize
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      logger.warn(`admin not found with email: ${email}`);
      return res.status(404).json({ message: "admin not found" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      logger.warn(`Invalid password for email: ${email}`);
      return res.status(206).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, name: admin.name },
      "your-secret-key",
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );

    // Send token back to the client
    res.status(200).json({ token });
    logger.info(`admin signed in successfully: ID=${admin.id}, Email=${email}`);
  } catch (error) {
    logger.error(`Error signing in admin: ${error.message}`);
    next(error); // Pass the error to the global error handler
  }
};

// Sign up user and hash the password
exports.adminSignUp = async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn("Validation failed", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if user already exists by email using Sequelize
    const existingAdmin = await Admin.findOne({ where: { email } });

    if (existingAdmin) {
      logger.warn(`Admin already exists with email: ${email}`);
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user using Sequelize
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    // Send response back to client
    res.status(201).json({ message: "admin created successfully" });
    logger.info(`admin created successfully: ID=${admin.id}, Email=${email}`);
  } catch (error) {
    logger.error(`Error signing up admin: ${error.message}`);
    next(error); // Pass the error to the global error handler
  }
};
