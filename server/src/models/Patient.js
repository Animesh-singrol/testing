const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize"); // your database configuration file
const Doctor = require("../models/user");

const Patient = sequelize.define(
  "Patient",
  {
    patientId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.STRING, // Store as a string
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    medicalHistory: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

Patient.beforeCreate((patient) => {
  let dateOfBirth = "06-06-1997";
      const nameInitials = patient.name.split(" ")
        .map((part) => part[0].toLowerCase())
        .join(""); // Get initials from Name
      const genderInitial = patient.gender[0].toLowerCase(); // Use "u" if Gender is undefined
      const dobFormatted = dateOfBirth.replace(/-/g, ""); // Format DOB as DDMMYYYY
      patient.patientId = `${genderInitial}${nameInitials}${dobFormatted}`;
});

Patient.belongsTo(Doctor, { foreignKey: "doctorId", as: "Doctor" });

module.exports = Patient;
