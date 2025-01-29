const Doctor = require("../models/user");
const logger = require("../config/logger");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.getAllDoctor = async (req, res, next) => {
  try {
    const users = await Doctor.findAll({
      attributes: { exclude: ["password"] },
    }); // Sequelize method to fetch all users
    res.status(200).json(users);
    logger.info("Fetched all doctor successfully");
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    next(error); // Pass the error to the global error handler
  }
};

exports.getDoctorById = async (req, res, next) => {
  try {
    const doctorId = req.params.id; // Get doctor ID from the request parameters

    const doctor = await Doctor.findOne({
      where: { id: doctorId },
      // attributes: { exclude: ["password"] }, // Exclude the password field
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
    logger.info(`Fetched doctor with ID: ${doctorId} successfully`);
  } catch (error) {
    logger.error(`Error fetching doctor by ID: ${error.message}`);
    next(error); // Pass the error to the global error handler
  }
};

exports.createDoctor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn("Validation failed", { errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if the doctor already exists
    const existingDoctor = await Doctor.findOne({ where: { email } });
    if (existingDoctor) {
      logger.warn(`Doctor already exists with email: ${email}`);
      return res
        .status(409)
        .json({ message: "A doctor with this email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS || 10)
    );

    // Create the doctor
    const createdDoctor = await Doctor.create({
      name,
      email,
      password: hashedPassword,
    });

    logger.info(
      `Doctor created successfully: ID=${createdDoctor.id}, Email=${email}`
    );
    return res.status(201).json({
      message: "Doctor created successfully",
      doctorId: createdDoctor.id,
    });
  } catch (error) {
    logger.error(`Error creating doctor: ${error.message}`);
    next(error);
  }
};

exports.updateDoctor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn("Validation failed", { errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, name, password } = req.body;

  try {
    // Fetch the doctor by ID
    const doctor = await Doctor.findByPk(id);

    if (!doctor) {
      logger.warn(`Doctor not found: ID=${id}`);
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Update the doctor's name if provided
    if (name) {
      doctor.name = name;
    }

    // Hash and update the password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(
        password,
        parseInt(process.env.SALT_ROUNDS || 10)
      );
      doctor.password = hashedPassword;
    }

    // Save the updated doctor details
    await doctor.save();

    logger.info(
      `Doctor updated successfully: ID=${id}, Name=${
        name || doctor.name
      }, Password Updated=${password ? "Yes" : "No"}`
    );
    return res.status(200).json({ message: "Doctor updated successfully" });
  } catch (error) {
    logger.error(`Error updating doctor: ${error.message}`);
    next(error);
  }
};

exports.toggleDoctor = async (req, res, next) => {
  const { email } = req.body; // Get email from the request body
  try {
    // Find the doctor by email
    const doctor = await Doctor.findOne({ where: { email } });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Toggle the status (if true, set to false, if false, set to true)
    doctor.status = !doctor.status;

    // Save the updated doctor object
    await doctor.save();

    // Return success response
    res
      .status(200)
      .json({
        message: "Doctor status updated successfully",
        status: doctor.status,
      });
  } catch (error) {
    // Handle unexpected errors
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
