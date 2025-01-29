// controllers/patientController.js
const Patient = require('../models/Patient');
const logger = require('../config/logger');
const Photo = require('../models/Photos')
const Report = require('../models/Report');
const { normalizeKeysToCamelCase } = require('../utils/normalizeKeys');

// Get all patients
const getAllPatients = async (req, res, next) => {

  const { doctorId } = req.body;
  try {
    const patients = await Patient.findAll({
      where: {
        doctorId: doctorId,
      },
      include: [
        {
          model: Report,
          attributes: ['reportId', 'predictions','reportUrl', 'createdAt'],
          as: 'reports', // Alias for the reports
        },
        {
          model: Photo,
          attributes: ['photoId', 'photoUrl', 'createdAt'],
          as: 'photos', // Alias for the photos
        },
      ],
    }); // Sequelize method to fetch all patients

    res.status(200).json(patients);
    logger.info('Fetched all patients successfully');
  } catch (error) {
    logger.error(`Error fetching patients: ${error.message}`);
    next(error); // Pass the error to the global error handler
  }
};

const getPatientsReport = async (req, res, next) => {
  const body = normalizeKeysToCamelCase(req.body);
  const { patientId } = body;

  try {
    const patientReports = await Patient.findAll({
      where: {
        patientId: patientId,
      },
      include: [
        {
          model: Report,
          attributes: ['reportId', 'reportUrl', 'createdAt'],
          as: 'reports',
        },
      ],
    });
    

    if (!patientReports || patientReports.length === 0) {
      return res.status(404).json({ message: "No reports found for this patient." });
    }

    res.status(200).json({ success: true, patientReports });
    logger.info('Fetched patient reports successfully');
  } catch (error) {
    logger.error(`Error fetching patient reports: ${error.message}`);
    next(error);
  }
};

const registerPatient = async (req, res) => {
  try {
    const body = normalizeKeysToCamelCase(req.body);

    const { name, gender, medicalHistory, doctorId, city, dateOfBirth, patientId } = body;

    if (!name || !dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: 'name and Date of Birth are required',
      });
    }

    let patient;
    const nameInitials = name
      .split(" ")
      .map((part) => part[0].toLowerCase())
      .join("");
    const genderInitial = gender ? gender[0].toLowerCase() : "u";
    const dobFormatted = dateOfBirth.replace(/-/g, "");
    const newPatientID = `${genderInitial}${nameInitials}${dobFormatted}`;

    patient = await Patient.findByPk(newPatientID);

    if (patient) {
      res.status(201).json({
        success: true,
        message: 'Patient registered successfully',
        patient,
      });
    } else if (patientId) {
      await Patient.update(
        {
          name: name,
          gender: gender || null,
          medicalHistory: medicalHistory || null,
          doctorId: doctorId || null,
          dateOfBirth: dateOfBirth,
          city : city
        },
        { where: { patientId: patientId } }
      );

      patient = await Patient.findByPk(patientId);
    } else {
      patient = await Patient.create({
        patientId: newPatientID,
        name: name,
        gender: gender || null,
        medicalHistory: medicalHistory || null,
        doctorId: doctorId || null,
        dateOfBirth: dateOfBirth,
        city : city
      });
    }

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      patient,
    });
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({ message: 'Error registering patient', error: error.message });
  }
};

const createPatientRecords = async (req, res, next) => {
  const {
    patientId,
    doctorId,
    name,
    dateOfBirth,
    gender,
    medicalHistory,
    reports = [],
    photos = []
  } = req.body;
  

  try {
    // Check if the patient already exists
    let patient = await Patient.findOne({ where: { patientId } });

    if (!patient) {
      // If patient doesn't exist, create a new patient
      patient = await Patient.create({
        patientId,
        doctorId,
        name,
        dateOfBirth,
        gender,
        medicalHistory
      });
    }

    // Create reports if any
    if (reports.length > 0) {
      const reportsData = reports.map((report) => ({
        reportUrl: report.reportUrl,
        patientId: patient.patientId,
        reportId:  report.reportId,
        predictions: report.predictions,
      }));
      await Report.bulkCreate(reportsData);
    }

    // Create photos if any
    if (photos.length > 0) {
      const photosData = photos.map((photo) => ({
        photoUrl: photo.photoUrl,
        patientId: patient.patientId,
        photoId: photo.photoId
      }));
      await Photo.bulkCreate(photosData);
    }

    res.status(200).json({
      message: patient
        ? 'Patient, reports, and photos created successfully'
        : 'Reports and photos added successfully for existing patient',
      patient
    });
  } catch (error) {
    logger.error(`Error creating patient records: ${error.message}`);
    next(error);
  }
};

module.exports = { registerPatient, getAllPatients, getPatientsReport, createPatientRecords };
