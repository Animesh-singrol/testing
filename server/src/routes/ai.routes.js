const express = require('express');
const router = express.Router();
const AiReport = require('../controllers/aiReport.controller')

// Route to handle image uploads
router.post('/analyse', AiReport.AiReport);

module.exports = router;
