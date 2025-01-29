// config/sequelize.js
const { Sequelize } = require('sequelize');

// Create Sequelize instance and connect to MySQL database
const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'test',
  logging: false, // Set to true to log SQL queries for debugging purposes
});

module.exports = sequelize;
