const puppeteer = require('puppeteer');
const fs = require('fs');
const handlebars = require('handlebars');

const proposalData = {
  offerNumber: 'VS/2025/TEST-001',
  offerDate: '23-Feb-2025',
  clientName: 'The Seksaria Biswan Sugar Factory Ltd.',
  clientAddress: 'Village - Pasgawan, Sitapur Road, Lakhimpur Kheri, Uttar Pradesh - 261201',
  projectName: 'Expansion of Sugar Drying Facility',
  enquiryReference: 'SB/SM/01/2025-26',
  contactPerson: 'Mr. Rakesh Seksaria',
  contactPhone: '+91-9876543210',
  contactEmail: 'rakesh@seksariasugar.com',
  equipment: [
    {srNo: 1, description: 'Fluidized Bed Dryer - 60 TPD', specifications: 'Model: SD 6065, SS304, 125 HP', quantity: 1, unit: 'Nos', unitPrice: 2450000, totalPrice: 2450000},
    {srNo: 2, description: 'Fluidized Bed Dryer - 75 TPD', specifications: 'Model: SD 7575, SS316, 150 HP', quantity: 1, unit: 'Nos', unitPrice: 2850000, totalPrice: 2850000}
  ],
  subTotal: 5300000,
  taxes: [{name: 'GST @ 18%', amount: 954000}],
  grandTotal: 6254000,
  totalAmountWords: 'Sixty Two Lakhs Fifty Four Thousand Only',
  delivery: '8-10 weeks from date of Purchase Order',
  paymentTerms: '30% advance, 70% against delivery',
  warranty: '12 months from commissioning',
  validity: '30 days from date of quotation'
};

(async () => {
  try {
    const templateHtml = fs.readFileSync('./templates/proposal-template.html', 'utf-8');
    const template = handlebars.compile(templateHtml);
    const html = template(proposalData);
    
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('Browser launched');
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    console.log('Content set');
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    console.log('PDF generated, size:', pdfBuffer.length);
    
    fs.writeFileSync('/tmp/vspase-proposal.pdf', pdfBuffer);
    console.log('Saved to /tmp/vspase-proposal.pdf');
    
    await browser.close();
  } catch(e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();