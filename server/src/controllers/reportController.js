const { generatePDF } = require('../utils/pdfGenerator');
const path = require('path');
const fs = require('fs');
const Patient = require('../models/Patient');
const Report = require('../models/Report');
const Photo = require('../models/Photos');
const Doctor = require('../models/user')

exports.generatePatientReport = async (req, res) => {
  try {
    const { patientId, reportId } = req.body;

    const patient = await Patient.findByPk(patientId, {
      include: [
        {
          model: Report,
          attributes: ['reportId', 'reportUrl', 'predictions', 'diseaseName', 'createdAt'],
          as: 'reports',
        },
        {
          model: Photo,
          attributes: ['photoId', 'photoUrl', 'createdAt'],
          as: 'photos',
        },
      ],
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const report = patient.reports.find(r => r.reportId === reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found for the given reportId' });
    }


    const predictions = typeof report.dataValues.predictions === "string"
  ? JSON.parse(report.dataValues.predictions)
  : report.dataValues.predictions;

    
    const doctor = await Doctor.findByPk(patient.doctorId);

    const formattedDate = new Date().toLocaleDateString("en-GB", {  
      day: "2-digit",  
      month: "short",  
      year: "numeric"  
    });
    

    const reportData = {
      reportTitle: `${report.dataValues.diseaseName} Report`,
      doctorName: doctor.name,
      patientId : patient.patientId,
      dob : patient.dateOfBirth,
      gender :  patient.gender,
      city : patient.city,
      date: new Date(report.dataValues.createdAt).toLocaleDateString("en-GB", {  
        day: "2-digit",  
        month: "short",  
        year: "numeric"  
      }),
      patientName: patient.name,
      disease: report.dataValues.diseaseName,
      sections: [
        { title: "Eye Analysis", content: predictions },
      ],
    };

    const templatePath = path.resolve(__dirname, '../templates/reportTemplate.html');
    const pdfPath = await generatePDF(reportData, templatePath);

    const BASE_URL = process.env.BASE_URL;
    const pdfUrl = `${BASE_URL}/uploads/${path.basename(pdfPath)}`;

    report.reportUrl = pdfUrl;
    await report.save();

    fs.access(pdfPath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(500).send({ message: 'Error generating the PDF' });
      }
      return res.status(200).json({ message: 'Report generated successfully', url: pdfUrl });
    });

  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
};
