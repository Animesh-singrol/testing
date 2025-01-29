
const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for the backend application.",
    },
    servers: [
      {
        url: "http://localhost:8000", // Replace with your server URL
      },
    ],
  },
  apis: ["./routes/*.js"], // Points to your route files for Swagger comments
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
module.exports = swaggerSpec;
