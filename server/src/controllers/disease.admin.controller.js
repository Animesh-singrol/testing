const Disease = require("../models/Disease");
const logger = require("../config/logger");
const { body, validationResult } = require("express-validator");

exports.getAllDiseases = async (req, res, next) => {
  try {
    const diseases = await Disease.findAll();
    // const diseases = await Disease.findAll({
    //   where: {
    //     status: 1,
    //   },
    // });
    res.status(200).json(diseases);
    logger.info("Fetched all diseases successfully");
  } catch (error) {
    logger.error(`Error fetching diseases: ${error.message}`);
    next(error); // Pass the error to the global error handler
  }
};

exports.getDiseaseById = async (req, res, next) => {
  try {
    const diseaseId = req.params.id; // Get disease ID from the request parameters

    const disease = await Disease.findOne({
      where: { id: diseaseId },
    });

    if (!disease) {
      return res.status(404).json({ message: "Disease not found" });
    }

    res.status(200).json(disease);
    logger.info(`Fetched disease with ID: ${diseaseId} successfully`);
  } catch (error) {
    logger.error(`Error fetching disease by ID: ${error.message}`);
    next(error); // Pass the error to the global error handler
  }
};

exports.createDisease = async (req, res, next) => {
  console.log(req.body);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn("Validation failed", { errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }

  const {diseaseName,diseaseApi,numOfImgs,imgsLabels,status} = req.body;

  try {
    // Check if the disease already exists by its name or URL
    const existingDisease = await Disease.findOne({
      where: { diseaseName },
    });

    if (existingDisease) {
      logger.warn(`Disease already exists with name: ${diseaseName}`);
      return res.status(409).json({ message: "A disease with this name already exists." });
    }

    // Create the disease
    const createdDisease = await Disease.create({
      diseaseName,
      diseaseApi,
      numOfImgs,
      imgsLabels,
      status
    });

    logger.info(`Disease created successfully: ID=${createdDisease.id}, Name=${diseaseName}`);
    return res.status(201).json({
      message: "Disease created successfully",
      diseaseId: createdDisease.id,
    });
  } catch (error) {
    logger.error(`Error creating disease: ${error.message}`);
    next(error);
  }
};

exports.updateDisease = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn("Validation failed", { errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, name, url, labels, numOfImages } = req.body;
  const {diseaseName,diseaseApi,numOfImgs,imgsLabels,status} = req.body;

  try {
    // Fetch the disease by ID
    const disease = await Disease.findByPk(id);

    if (!disease) {
      logger.warn(`Disease not found: ID=${id}`);
      return res.status(404).json({ message: "Disease not found" });
    }

    // Update disease fields
    if (diseaseName) disease.diseaseName = diseaseName;
    if (diseaseApi) disease.diseaseApi = diseaseApi;
    if (imgsLabels) disease.imgsLabels = imgsLabels;
    if (numOfImgs) disease.numOfImgs = numOfImgs;
    if (status) disease.status = status;


    // Save the updated disease
    await disease.save();

    logger.info(`Disease updated successfully: ID=${id}, Name=${name || disease.name}`);
    return res.status(200).json({ message: "Disease updated successfully" });
  } catch (error) {
    logger.error(`Error updating disease: ${error.message}`);
    next(error);
  }
};

exports.toggleDiseaseStatus = async (req, res, next) => {
  
  const { id } = req.body; // Get disease ID from the request body
  
  try {
    // Find the disease by ID
    const disease = await Disease.findByPk(id);

    if (!disease) {
      return res.status(404).json({ message: "Disease not found" });
    }

    // Toggle the status (if active, set to inactive; if inactive, set to active)
    disease.status = !disease.status;

    // Save the updated disease object
    await disease.save();

    res.status(200).json({
      message: "Disease status updated successfully",
      status: disease.status,
    });
  } catch (error) {
    logger.error(`Error toggling disease status: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
