const User = require('../models/user');
const logger = require('../config/logger');

// Get all users
exports.getAllUsers = async (req, res, next) => {
  
  try {
    const users = await User.findAll(); // Sequelize method to fetch all users
    res.status(200).json(users);
    logger.info('Fetched all users successfully');
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    next(error); // Pass the error to the global error handler
  }
};

// Create a user
exports.createUser = async (req, res, next) => {
  const { name, email } = req.body;
  const password = '123456'
  try {
    // Sequelize method to create a new user
    const user = await User.create({ name, email, password });
    res.status(201).json(user); // Return the created user object
    logger.info(`User created successfully: ID=${user.id}, Name=${user.name}, Email=${user.email}`);
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`);
    next(error); // Pass the error to the global error handler
  }
};

// Update a user
exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    // Sequelize method to find and update the user by ID
    const user = await User.findByPk(id); // Find user by primary key (id)

    if (!user) {
      logger.warn(`User not found: ID=${id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user attributes
    user.name = name || user.name; // If name is provided, update it
    user.email = email || user.email; // If email is provided, update it

    await user.save(); // Save changes to the database

    res.status(200).json({ message: 'User updated successfully' });
    logger.info(`User updated successfully: ID=${id}, Name=${name}, Email=${email}`);
  } catch (error) {
    logger.error(`Error updating user: ${error.message}`);
    next(error); // Pass the error to the global error handler
  }
};

// Delete a user
exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      logger.warn(`User not found: ID=${id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Sequelize method to delete the user by primary key
    await user.destroy();

    res.status(200).json({ message: 'User deleted successfully' });
    logger.info(`User deleted successfully: ID=${id}`);
  } catch (error) {
    logger.error(`Error deleting user: ${error.message}`);
    next(error); // Pass the error to the global error handler
  }
};
