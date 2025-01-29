const puppeteer = require('puppeteer');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

exports.generatePDF = async (data, templatePath) => {
  try {
    // Read the HTML template from the specified path
    const templateHtml = fs.readFileSync(templatePath, 'utf8');
    
    // Compile the Handlebars template with the data
    const template = Handlebars.compile(templateHtml);
    const htmlContent = template(data);

    // Launch Puppeteer with necessary arguments for running as root
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    // Create a new page in the browser
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    // Define the output PDF path
    const pdfPath = path.resolve(__dirname, `../uploads/${Date.now()}-report.pdf`);

    // Generate the PDF
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,  // Ensures that background colors and images are included
    });

    // Close the browser
    await browser.close();

    // Return the path of the generated PDF
    return pdfPath;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};
