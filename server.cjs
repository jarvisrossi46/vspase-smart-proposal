/**
 * VS PASE Smart Proposal Management System
 * Express API with Puppeteer PDF Generation
 * Deploy to Render/Railway
 */

const express = require('express');
const cors = require('cors');
const handlebars = require('handlebars');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'VS PASE PDF Generator',
    timestamp: new Date().toISOString()
  });
});

// PDF Generation Endpoint
app.post('/api/v1/generate', async (req, res) => {
  let browser = null;
  
  try {
    const proposalData = req.body;
    
    // Validate required fields
    if (!proposalData.offerNumber || !proposalData.clientName) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'offerNumber and clientName are required'
      });
    }
    
    // Read HTML template
    const templatePath = path.join(__dirname, 'templates', 'proposal-template.html');
    const templateSource = await fs.readFile(templatePath, 'utf-8');
    
    // Compile template with Handlebars
    const template = handlebars.compile(templateSource);
    const html = template(proposalData);
    
    // Launch Puppeteer with Render-compatible args
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set content and wait for resources to load
    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0'
      },
      preferCSSPageSize: true
    });
    
    // Close browser
    await browser.close();
    
    // Generate filename
    const filename = `VS_PASE_Proposal_${proposalData.offerNumber.replace(/\//g, '_')}.pdf`;
    
    // Send PDF response
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length
    });
    
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    
    if (browser) {
      await browser.close().catch(console.error);
    }
    
    res.status(500).json({
      error: 'PDF Generation Failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 VS PASE PDF Generator running on port ${PORT}`);
  console.log(`📄 Health check: http://localhost:${PORT}/health`);
  console.log(`📑 PDF endpoint: POST http://localhost:${PORT}/api/v1/generate`);
});

module.exports = app;