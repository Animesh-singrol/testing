const express = require("express");
const { getDashboardCount } = require("../controllers/dashboard.admin.controller");
const router = express.Router();

router.get("/counts",getDashboardCount);

module.exports = router;
