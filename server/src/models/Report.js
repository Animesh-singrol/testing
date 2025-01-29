const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Patient = require('./Patient');

const Report = sequelize.define('Report', {
  reportId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  patientId: {
    type: DataTypes.STRING,
    references: {
      model: Patient,
      key: 'patientId',
    },
    allowNull: false,
  },
  diseaseName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  predictions: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  reportUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

Patient.hasMany(Report, { foreignKey: 'patientId', as: 'reports' });
Report.belongsTo(Patient, { foreignKey: 'patientId', as: 'Patient' });

module.exports = Report;
