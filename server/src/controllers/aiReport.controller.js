const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const Patient = require("../models/Patient");
const path = require("path");
const Photo = require("../models/Photos");
const Report = require("../models/Report");
const Disease = require("../models/Disease");
const { normalizeKeysToCamelCase } = require("../utils/normalizeKeys");
require("dotenv").config();
async function getPredictions(imgsLabels, photos) {
  const predictionApiUrl = process.env.AI_URL;

  if (imgsLabels.length !== photos.length) {
    return console.error(
      "Number of labels does not match the number of photos!"
    );
  }

  const predictions = {}; // To store predictions dynamically

  for (let i = 0; i < photos.length; i++) {
    const imagePath = photos[i];
    const label = imgsLabels[i];

    const form = new FormData();
    form.append("file", fs.createReadStream(imagePath));

    try {
      const response = await axios.post(predictionApiUrl, form, {
        headers: {
          ...form.getHeaders(),
        },
      });

      // Store prediction by label dynamically
      predictions[label] = response.data;
    } catch (err) {
      console.error(`Error predicting for ${label}:`, err.message);
    }
  }

  return predictions;
}

exports.AiReport = async (req, res) => {
  try {
    const body = normalizeKeysToCamelCase(req.body);
    const { patientId, diseaseName, photoId } = body;

    const patient = await Patient.findByPk(patientId, {
      include: [
        {
          model: Report,
          attributes: [
            "reportId",
            "reportUrl",
            "createdAt",
            "diseaseName",
            "predictions",
          ],
          as: "reports",
        },
        {
          model: Photo,
          attributes: ["photoId", "photoUrl", "createdAt"],
          as: "photos",
        },
      ],
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const photo = patient.photos.find((p) => p.photoId === photoId);
    if (!photo) {
      return res
        .status(404)
        .json({ message: "Photo not found for the given photoId" });
    }

    const images =
      typeof photo.photoUrl === "string"
        ? photo.photoUrl.split(",")
        : photo.photoUrl;

    if (!images || images.length === 0) {
      return res
        .status(400)
        .json({ message: "No photos available for the patient" });
    }

    const extractFileName = (url) => {
      const parts = url?.split("/");
      return parts[parts?.length - 1]
        .replace(/"/g, "")
        .replace(/[\[\]]/g, "")
        .trim();
    };

    // Process all images dynamically
    const photos = images.map((imageUrl) => {
      const fileName = extractFileName(imageUrl);
      return path.join(__dirname, `../uploads/${fileName}`);
    });

    const disease = await Disease.findAll({
      where: {
        diseaseName: diseaseName,
      },
    });

    // const imgLabels = JSON.parse(disease[0].Disease.dataValues.imgsLabels);

    const imgsLabels = typeof disease[0].dataValues.imgsLabels === "string"
  ? JSON.parse(disease[0].dataValues.imgsLabels)
  : disease[0].dataValues.imgsLabels;

    const predictions = await getPredictions(imgsLabels, photos);

    // const predictions = {"Left Eye":{"primary_classification":{"class_name":"Ref","accuracy":0.787159264087677},"sub_classes":{"class_name":"Moderate","accuracy":0.9999955892562866}},"Right Eye":{"primary_classification":{"class_name":"Ref","accuracy":0.787159264087677},"sub_classes":{"class_name":"Moderate","accuracy":0.9999955892562866}},"Other":{"primary_classification":{"class_name":"Ref","accuracy":0.787159264087677},"sub_classes":{"class_name":"Moderate","accuracy":0.9999955892562866}}}

    const timestamp = Date.now();
    const rid = `w${timestamp.toString()}`;

    const report = await Report.create({
      reportId: rid,
      patientId: patientId,
      diseaseName: diseaseName,
      predictions,
      reportUrl: "some_generated_url_or_path", // Adjust this as needed
      createdAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Success",
      predictions,
      reportId: report.reportId,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res
      .status(500)
      .json({ message: "Error generating report", error: error.message });
  }
};
