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
    cb(null, uploadsPath); // Save files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Prevent filename conflicts
  },
});

// Multer instance with size limit and file handling
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5 MB per file
});

// Image upload and compression handler
exports.uploadImages = [
  upload.array('images', 10), // Handle multiple files
  async (req, res) => {
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

          // Compress the image using sharp and save it to the temporary file path
          await sharp(originalFilePath)
            .resize({ width: 1000, height: 1000, fit: sharp.fit.inside })
            .jpeg({ quality: 90 })
            .toFile(tempFilePath);
            
          const BASE_URL = process.env.BASE_URL;
          // Create the public URL for the image (relative to the server)
          const imageUrl = `${BASE_URL}/uploads/compressed-${file.filename}`;

          // Save the image data to the database (you can customize this to store other metadata)
          const image = await Image.create({
            originalName: file.originalname,
            filePath: imageUrl, // Store the URL path for public access
            fileSize: fs.statSync(tempFilePath).size,
          });

          // Optionally, delete the original uncompressed file to save space
          fs.unlinkSync(originalFilePath);

          return image;
        })
      );

      // Respond with success and the uploaded images
      res.status(200).json({
        message: 'Files uploaded and compressed successfully!',
        images: uploadedImages,
      });
    } catch (error) {
      console.error('Error uploading or compressing images:', error);
      res.status(500).json({ message: 'Error uploading or compressing images', error: error.message });
    }
  },
];
