const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  getAllDoctor,
  getDoctorById,
  createDoctor,
  updateDoctor,
  toggleDoctor,
} = require("../controllers/doctor.admin.conroller");

router.get("/", getAllDoctor);

router.get("/:id", getDoctorById);

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  createDoctor
);

// Validation rules for updating a user
const updateDoctorValidation = [
  body("name")
    .optional() // name is optional during update
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("password")
    .optional() // email is optional during update
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .normalizeEmail(),
];

// Validation middleware for updating a Doctor
router.put("/", updateDoctorValidation, updateDoctor);

router.patch("/", async (req, res, next) => {
  // Check if validation errors exist (if any)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Call the toggleDoctor function from the controller
    await toggleDoctor(req, res, next);
  } catch (error) {
    // Pass errors to the next error handler
    next(error);
  }
});

module.exports = router;
