const express = require('express');
const router = express.Router();
const imageController = require('../controllers/image.controller');
const imageUploadMiddleware = require('../middlewares/imageMIddleware');

// Route to handle image uploads
router.post('/upload', imageUploadMiddleware, imageController.imageUpload);

module.exports = router;
