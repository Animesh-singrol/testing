const express = require('express');
const { generatePatientReport } = require('../controllers/reportController');

const router = express.Router();

// Route for generating and downloading a PDF report
router.post('/generate', generatePatientReport);

module.exports = router;
