// models/doctor.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Doctor = sequelize.define("Doctor", {
  // Define your model attributes here
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true, // Default status is active (true)
  },
});

module.exports = Doctor;
