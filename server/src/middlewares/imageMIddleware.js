// middlewares/imageMiddleware.js
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator');
const Image = require('../models/Photos');
const uploadsPath = path.join(__dirname, '../uploads');

// Create the uploads folder if it doesn't exist
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath); // Save files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Prevent filename conflicts
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5 MB per file
});

// Image upload middleware to handle multiple photos
const imageUploadMiddleware = [
  upload.array('photos', 5), // Expecting up to 5 photos
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    try {
      const uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          const originalFilePath = path.join(uploadsPath, file.filename);
          const tempFilePath = path.join(uploadsPath, 'compressed-' + file.filename);

          await sharp(originalFilePath)
            .resize({ width: 1000, height: 1000, fit: sharp.fit.inside })
            .jpeg({ quality: 90 })
            .toFile(tempFilePath);
          const BASE_URL = process.env.BASE_URL;
          const imageUrl = `${BASE_URL}/uploads/compressed-${file.filename}`;

          // Optionally, delete the original file
          fs.unlinkSync(originalFilePath);

          return { originalName: file.originalname, filePath: imageUrl, fileSize: fs.statSync(tempFilePath).size };
        })
      );

      req.uploadedImages = uploadedImages;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Error uploading or compressing images', error: error.message });
    }
  },
];

module.exports = imageUploadMiddleware;
