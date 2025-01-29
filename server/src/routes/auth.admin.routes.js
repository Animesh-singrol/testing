// routes/auth.admin.routes.js
const express = require("express");
const { body } = require("express-validator");
const {
  adminSignIn,
  adminSignUp,
} = require("../controllers/auth.admin.controller");
const router = express.Router();

router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  adminSignIn
);

router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  adminSignUp
);

module.exports = router;
