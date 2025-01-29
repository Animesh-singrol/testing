require('dotenv-flow').config();
const http = require('http');
const app = require('./src/app');
const logger = require('./src/config/logger');

const PORT = process.env.PORT || 8000;

const timestamp = Date.now();
console.log(timestamp); // Example: 1674217247123


// Create the server
const server = http.createServer(app);

// Start listening on the specified port
server.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  logger.error(`Server encountered an error: ${error.message}`);
  process.exit(1); // Exit with failure code
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Server shutting down due to SIGINT (Ctrl+C)');
  process.exit(0); // Exit with success code
});

process.on('SIGTERM', () => {
  logger.info('Server shutting down due to SIGTERM');
  process.exit(0); // Exit with success code
});

// Catch unhandled promise rejections and log them
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1); // Exit with failure code
});
