const logger = require("../config/logger");
const Patient = require("../models/Patient");
const Photo = require("../models/Photos");
const Report = require("../models/Report");
const Doctor = require("../models/user");
// Get all patients
const getAllPatients = async (req, res, next) => {
  try {
    const patients = await Patient.findAll({
      include: [
        {
          model: Report,
          attributes: ["reportId", "reportUrl", "createdAt"],
          as: "reports", // Alias for the reports
        },
        {
          model: Doctor,
          attributes: ["name"],
          as: "Doctor", // Alias for the reports
        },
        {
          model: Photo,
          attributes: ["photoId", "photoUrl", "createdAt"],
          as: "photos", // Alias for the photos
        },
      ],
    }); // Sequelize method to fetch all patients
    const transformedPatients = patients.map((patient) => {
      const patientData = patient.toJSON(); // Convert to plain object
      return {
        patientId: patientData.patientId,
        doctorId: patientData.doctorId,
        Name: patientData.name,
        Gender: patientData.gender,
        medicalHistory: patientData.medicalHistory,
        createdAt: patientData.createdAt,
        updatedAt: patientData.updatedAt,
        DoctorName: patientData.Doctor ? patientData.Doctor.name : null, // Flatten doctor name
        Report: patientData.reports,
      };
    });

    res.status(200).json(transformedPatients);
    logger.info("Fetched all patients successfully");
  } catch (error) {
    logger.error(`Error fetching patients: ${error.message}`);
    next(error); // Pass the error to the global error handler
  }
};
const getPatientsReport = async (req, res, next) => {
  const { patientId } = req.body;

  try {
    const patientReports = await Patient.findAll({
      where: {
        patientId: patientId,
      },
      include: [
        {
          model: Report,
          attributes: ["reportId", "reportUrl", "createdAt"],
          as: "reports",
        },
      ],
    });

    if (!patientReports || patientReports.length === 0) {
      return res
        .status(404)
        .json({ message: "No reports found for this patient." });
    }

    res.status(200).json({ success: true, patientReports });
    logger.info("Fetched patient reports successfully");
  } catch (error) {
    logger.error(`Error fetching patient reports: ${error.message}`);
    next(error);
  }
};
module.exports = { getAllPatients, getPatientsReport };
