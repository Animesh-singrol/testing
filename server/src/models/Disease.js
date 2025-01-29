const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Disease = sequelize.define('Disease', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  diseaseName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  diseaseApi: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numOfImgs: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  imgsLabels: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'Diseases', // Optional: Specify table name
  timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = Disease;
