# Common Backend Documentation

## Project Structure

```
Diabetic-Retinopathy/
├── server/
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   │   ├── db.js        # Database connection
│   │   │   ├── logger.js    # Winston logger
│   │   │   ├── sequelize.js # Sequelize config
│   │   ├── controllers/     # Business logic
│   │   ├── middlewares/     # Custom middlewares
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── templates/       # Report templates
│   │   ├── utils/           # Helper functions
│   │   ├── app.js          # App initialization
│   │   ├── server.js       # Entry point
│   ├── uploads/            # File uploads
├── client/                 # Frontend
├── .env                    # Environment variables
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker services
```

## API Routes Overview

### User Management
- **`/users`**: User operations
  - `GET`: Fetch users
  - `POST`: Create user
  - `PUT`: Update user
  - `DELETE`: Remove user

### Authentication
- **`/auth`**: Authentication endpoints
  - `POST /signin`: Login with credentials
  - `POST /signup`: Register new user
    ```json
    {
      "name": "User Name",
      "email": "user@example.com",
      "password": "userpassword"
    }
    ```
### Admin Routes
- **`/admin`**: Administrative functions
  - `/dashboard`: System metrics
  - `/doctor`: Doctor management
  - `/patients`: Patient oversight
  - `/disease`: Disease records


### Patient Management
- **`/patients`**: Patient operations
  - `GET`: List patients
  - `POST`: Add patient
  - `PUT`: Update patient
  - `DELETE`: Remove patient

### Report Management
- **`/reports`**: Report operations
  - `GET`: View reports
  - `POST`: Generate report
  - `PUT`: Update report
  - `DELETE`: Remove report


## Admin API Specifications

### Dashboard Endpoints
- `GET /admin/dashboard/counts`: Retrieve system metrics

### Doctor Management
- `GET /admin/doctor`: List all doctors
- `GET /admin/doctor/:id`: Get specific doctor
- `POST /admin/doctor`: Create doctor
- `PUT /admin/doctor`: Update doctor
- `PATCH /admin/doctor`: Toggle doctor status

### Patient Management
- `GET /admin/patient/fetch`: List all patients
- `POST /admin/patient/report`: Get patient report
- `POST /admin/patient/register`: Register new patient

## AI Report Integration

### Prediction System
The system includes AI-powered image analysis with the following features:

- Image processing and validation
- Integration with prediction service
- Report generation and storage
- Error handling and validation

### Response Format Example
```json
{
  "success": true,
  "message": "Success",
  "predictions": {
    "label1": "prediction_result",
    "label2": "prediction_result"
  },
  "reportId": "w1619210938912"
}
```

## Core Components

### Controllers
Located in `/controllers`, handle business logic:
- Authentication
- Patient management
- Report generation
- Image processing

### Models
Database schemas using Sequelize:
- User/Doctor profiles
- Patient records
- Report data
- Image metadata

### Middleware
Custom middleware functions:
- JWT authentication
- Error handling
- Image processing
- Request validation

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
JWT_SECRET=your-jwt-secret
```

3. Run the application:
```bash
npm start
```

## Security Features

- JWT-based authentication
- Request validation
- Error handling
- Secure file uploads
- Database encryption

## API Error Handling

The system implements centralized error handling with standardized responses:

- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Each error response includes:
```json
{
  "message": "Error description",
  "errors": ["Detailed error information"]
}
```

