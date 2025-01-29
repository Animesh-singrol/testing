// controllers/ImageController.js
const Photo = require('../models/Photos')
const { normalizeKeysToCamelCase } = require('../utils/normalizeKeys');

const imageUpload = async (req, res) => {

  const body = normalizeKeysToCamelCase(req.body);
  const { patientId } = body;

  try {
    // Check if images were uploaded
    if (req.uploadedImages && req.uploadedImages.length > 0) {
      const imageUrls = req.uploadedImages.map(image => image.filePath); // Extract file paths (URLs)

    const timestamp = Date.now();
    const pid =  `w${timestamp.toString()}`;

      // Save the image URLs in the patient record
      const photo = await Photo.create({ photoId : pid, patientId : patientId ,photoUrl: imageUrls });

      res.status(201).json({ success: true, message: 'image Uploaded successfully', patientId , photoId: photo.photoId});
    } else {
      res.status(400).json({ message: 'No photos uploaded' });
    }
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Error uploading images', error: error.message });
  }
};


module.exports = { imageUpload };