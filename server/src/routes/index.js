const express = require("express");
const router = express.Router();
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const imageRoutes = require("./image.routes");
const patientRoutes = require("./patient.routes");
const reportRoutes = require("./report.routes");
const paymentRoutes = require("./payment");
const aiReport = require("./ai.routes");
const image = require("./image.routes");

const adminAuthRoutes = require("./auth.admin.routes");
const adminDashboardRoutes = require("./dashboard.admin.routes");
const adminDoctorsRoutes = require("./doctors.admin.routes");
const adminPAtientRoutes = require("./patient.admin.routes");
const adminDiseaseRoutes = require("./disease.admin.routes");

// Add specific routes
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/images", imageRoutes);
router.use("/patients", patientRoutes);
router.use("/reports", reportRoutes);
router.use("/payments", paymentRoutes);
router.use("/patient", aiReport);
router.use("/image", image);

//admin routes

router.use("/admin/auth", adminAuthRoutes);
router.use("/admin/dashboard", adminDashboardRoutes);
router.use("/admin/doctor", adminDoctorsRoutes);
router.use("/admin/patients", adminPAtientRoutes);
router.use("/admin/disease", adminDiseaseRoutes);

module.exports = router;
