const express = require("express");
const User = require("../models/user");
const Patient = require("../models/Patient");
const Report = require("../models/Report");
const Disease = require("../models/Disease");
const logger = require('../config/logger');

exports.getDashboardCount = async (req, res, next) => {
  try {
    // Get count of doctor
    const doctorCount = await User.count();
    // Get count of patients
    const patientCount = await Patient.count();
    // Get count of reports
    const reportCount = await Report.count();
    // Get count of reports
    const diseaseCount = await Disease.count();

    res.status(200).json({
      doctor: doctorCount,
      patients: patientCount,
      reports: reportCount,
      diseases : diseaseCount
    });
    logger.info("Fetched all dashboard Count successfully");
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.status(500).json({ message: "Server Error" });
  }
};