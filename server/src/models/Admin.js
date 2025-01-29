// models/user.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Admin = sequelize.define("Admin", {
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
  }
});

module.exports = Admin;
