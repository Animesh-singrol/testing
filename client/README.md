# Diabetic Retinopathy (client-side)

A Next.js application for detecting diabetic retinopathy through AI-powered analysis of retinal images.

## Project Structure
```
diabetic-retinopathy
├── client
│   ├── app
│   │   ├── component
│   │   │   ├── Header.jsx
│   │   │   ├── Loader.jsx
│   │   ├── dashboard
│   │   │   ├── add-patient
│   │   │   │   └── page.jsx
│   │   │   ├── existing-patient
│   │   │   │   └── page.jsx
│   │   │   ├── add-new-report
│   │   │   │   ├── GenerateReport.jsx
│   │   │   │   ├── Step1.jsx
│   │   │   │   ├── Step2.jsx
│   │   │   │   └── page.jsx
│   │   │   └── page.jsx
│   │   ├── profile
│   │   ├── signin
│   │   │   └── page.jsx
│   │   ├── globals.css
│   └── redux
│       ├── slices
│       │   └── authSlice.js
│       └── baseApi.js
```

## Application Routes

- `/signin` - Login page for authentication
- `/dashboard` - Main dashboard with options to add new patients or view existing ones
- `/dashboard/add-patient` - Patient registration form
- `/dashboard/existing-patient` - List of registered patients
- `/dashboard/existing-patient/[id]` - Individual patient details and reports
- `/dashboard/add-new-report` - Upload retinal images and generate AI analysis reports

## Key Components

### Header.jsx
Navigation bar component used across the application.

### Loader.jsx
Loading state indicator component.

## Authentication

The application uses JWT-based authentication. Upon successful login:
1. Token is received and decoded
2. User details stored in Redux state
3. Token saved in localStorage
4. User redirected to dashboard

Example authentication flow:
```javascript
try {
  const response = await signIn(values).unwrap();
  const { token } = response;
  if (token) {
    const decoded = jwtDecode(token);
    dispatch(
      setAuth({
        token,
        id: decoded.id,
        name: decoded.name,
      })
    );
  }
  localStorage.setItem("token", token);
  toast.success("Login successful");
  router.push("/dashboard");
} catch (error) {
  console.log("Login failed:", error);
  alert(error?.data?.message);
}
```

## Dashboard Features

### Add New Patient
- Form for patient registration
- Form validation using Formik and Yup
- Fields include name, gender, date of birth, and city

### Existing Patients
- Display list of registered patients
- View individual patient details
- Access patient reports

## Report Generation

### Process
1. Navigate to `/dashboard/add-new-report`
2. Select disease type
3. Upload retinal images
4. Submit for AI analysis
5. View generated report with:
   - Retinal images
   - Disease prediction results
   - PDF download option

## API Endpoints

### Patient Management

#### Register Patient
- **Endpoint:** `POST /patients/register`
- **Request Body:**
```json
{
  "Name": "string",
  "Gender": "string",
  "dateOfBirth": "string",
  "City": "string",
  "doctorId": "string"
}
```

#### Get All Patients
- **Endpoint:** `GET /patients`
- **Response:** Array of patient objects


#### Upload Images
- **Endpoint:** `POST /images/upload`
- **Request:** FormData with image files
- **Response:** `photoId` for uploaded images
- **Hook:** `useUploadImageMutation`

#### Analyze Patient
- **Endpoint:** `POST /patient/analyse`
- **Request:**
  - `patientId`
  - `photoId`
  - `diseaseName`
- **Response:**
  - Prediction array
  - Report ID
- **Hook:** `useAnalyzePatientMutation`

#### Generate Report
- **Endpoint:** `POST /reports/generate`
- **Request:**
  - `patientId`
  - `reportId`
- **Response:** PDF download URL
- **Hook:** `useGenerateReportMutation`

## Components Documentation

### AddNewReport Component
Multi-step form component for report generation:
- Disease selection
- Image upload
- Report generation
- Result display

Features:
- Dynamic step handling
- Image preview
- Form validation
- API integration for analysis and report generation
