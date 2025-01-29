const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Patient = require('./Patient');

const Photo = sequelize.define('Photo', {
  photoId: {
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
  photoUrl: {
    type: DataTypes.JSON, // This will store an array of photo URLs
    allowNull: true,
    defaultValue: [],// Assuming this stores the URL or path of the photo
  },
}, {
  timestamps: true,
});

Patient.hasMany(Photo, { foreignKey: 'patientId' , as: 'photos'});
Photo.belongsTo(Patient, { foreignKey: 'patientId' });

module.exports = Photo;
