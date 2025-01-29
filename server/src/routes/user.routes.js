const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userController = require('../controllers/user.controller');
const authenticateJWT = require('../middlewares/auth');

router.get('/', userController.getAllUsers);

// Validation rules for creating a user
const userValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  body('email')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(), // Automatically normalize email to lowercase
];

// Validation rules for updating a user
const updateUserValidation = [
  body('name')
    .optional() // name is optional during update
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  body('email')
    .optional() // email is optional during update
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
];

// Validation middleware for creating a user
router.post('/', userValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  userController.createUser(req, res, next);
});

// Validation middleware for updating a user
router.put('/:id', updateUserValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  userController.updateUser(req, res, next);
});

router.delete('/:id', userController.deleteUser);

module.exports = router;
