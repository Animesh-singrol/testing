const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const logger = require('./config/logger');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');
const sequelize = require('./config/sequelize');
const Image = require('./models/Photos');
const User = require('./models/user');
const Report = require('./models/Report')
const Patient = require('./models/Patient')
const Disease = require('./models/Disease')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require("../swagger");
const swaggerJSDoc = require('swagger-jsdoc');
const app = express();


const corsOptions = {
  origin: '*',
  methods: 'GET, POST, PUT, DELETE,PATCH',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: false,
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cors(corsOptions));

// Security Middleware
app.use(helmet()); // Secure your app by setting HTTP headers

// Sync all models (including Image model) with the database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized successfully');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

// HTTP request logging using Morgan and Winston
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Rate Limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
});

// app.use(limiter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', routes);

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Your API',
      description: 'API documentation for your app',
      version: '1.0.0',
    },
    basePath: 'http://localhost:8000/api',
  },
  apis: ['./routes/*.routes.js', './controllers/*.controller.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// 404 Error Handling for Undefined Routes
app.use((req, res, next) => {
  logger.warn(`404 - Route not found: ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });
});

// Centralized Error Handling
app.use((err, req, res, next) => {
  logger.error(`500 - Internal Server Error: ${err.message}`);
  logger.debug(err.stack); // Detailed stack trace for debugging (optional)
  res.status(500).json({ message: 'Internal server error' });
});


module.exports = app;
