const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;
const fs = require('fs');
const path = require('path');

// Define log directory path
const logDir = path.join(__dirname, 'logs');

// Ensure logs directory exists, if not, create it
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return stack 
    ? `[${timestamp}] ${level.toUpperCase()}: ${message}\nStack Trace: ${stack}` 
    : `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

// Create a Winston logger instance
const logger = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Include timestamp
    errors({ stack: true }), // Capture stack trace for errors
    logFormat // Use custom format
  ),
  transports: [
    new transports.Console({ level: 'info' }), // Log info and above to console
    new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }), // Log errors to file
    new transports.File({ filename: path.join(logDir, 'combined.log') }) // Log all levels to a combined file
  ],
});

module.exports = logger;
