const express = require("express");

const imageUploadMiddleware = require("../middlewares/imageMIddleware");
const { body, validationResult } = require("express-validator");
const { getAllPatients, getPatientsReport } = require("../controllers/patient.admin.controller");

const router = express.Router();

router.get("/fetch", getAllPatients);

// Patient registration validation
const validatePatientRegistration = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  body("age")
    .notEmpty()
    .withMessage("Age is required")
    .isInt({ min: 1 })
    .withMessage("Age must be a valid number"),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be Male, Female, or Other"),

  body("doctorId")
    .notEmpty()
    .withMessage("Doctor ID is required")
    .isInt({ min: 1 })
    .withMessage("Doctor ID must be a valid number"),

  body("medicalHistory")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Medical history should not exceed 500 characters"),
];

router.post("/report", getPatientsReport);

// // Define the route for registering a patient and use the image upload middleware
// router.post("/register", validatePatientRegistration, registerPatient);

module.exports = router;
