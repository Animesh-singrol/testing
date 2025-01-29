const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  getAllDiseases,
  getDiseaseById,
  createDisease,
  updateDisease,
  toggleDiseaseStatus,
} = require("../controllers/disease.admin.controller");

router.get("/", getAllDiseases);

router.get("/:id", getDiseaseById);

router.post(
  "/",
  [
    body("diseaseName").notEmpty().withMessage("Disease name is required"),
  ],
  createDisease
);

const updateDiseaseValidation = [
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Disease name must be at least 3 characters long"),
  body("description")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Disease description must be at least 5 characters long"),
];

router.put("/", updateDiseaseValidation, updateDisease);

router.patch("/", async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await toggleDiseaseStatus(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
