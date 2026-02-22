# VS PASE PDF Generator Backend

Node.js Express API for generating professional PDF proposals from JSON data using Puppeteer and Handlebars.

## Features

- **POST /api/v1/generate** - Convert JSON proposal data to A4 PDF
- Handlebars templating with custom HTML/Tailwind CSS
- Puppeteer headless browser with Render-compatible args
- CORS enabled for PWA frontend
- Health check endpoint
- Error handling and validation

## Local Development

```bash
# Install dependencies
npm install

# Start server
npm start

# Dev mode with auto-reload
npm run dev
```

Server runs on `http://localhost:3000`

## API Endpoints

### Health Check
```bash
GET /health
```

### Generate PDF
```bash
POST /api/v1/generate
Content-Type: application/json

{
  "offerNumber": "QT/78039-3",
  "offerDate": "2024-02-21",
  "clientName": "The Seksaria Biswan Sugar Factory Ltd.",
  "clientAddress": {
    "line1": "Sidhauli Road",
    "city": "Biswan",
    "state": "Uttar Pradesh",
    "pincode": "261201",
    "country": "India"
  },
  "subject": {
    "subjectLine": "Techno Commercial Offer for Fluidized Bed Sugar Dryer"
  },
  "technicalSpecifications": {
    "equipmentDetails": [...],
    "warrantyPeriod": "12 months from commissioning"
  },
  "commercialDetails": {
    "currency": "INR",
    "grandTotal": 5535000,
    "terms": {
      "paymentTerms": "30% advance, 70% against delivery"
    }
  }
}
```

## Deploy to Render

### 1. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub

### 2. Create New Web Service
- Connect your GitHub repo
- Select the `vspase-pwa` directory

### 3. Configuration

| Setting | Value |
|---------|-------|
| **Name** | vspase-pdf-generator |
| **Environment** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free |

### 4. Environment Variables

Add these in Render Dashboard → Environment:

```
NODE_ENV=production
FRONTEND_URL=https://your-pwa-domain.vercel.app
PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
```

### 5. Puppeteer on Render (IMPORTANT)

Render's free tier requires special Puppeteer configuration:

- `--no-sandbox` and `--disable-setuid-sandbox` are already in server.js
- No additional buildpacks needed
- Puppeteer downloads Chromium automatically on first run

### 6. Keep Service Alive

Free tier services sleep after 15 min inactivity. For production:

- Upgrade to paid tier ($7/month) for 24/7 uptime
- Or use a cron job to ping `/health` every 10 minutes

## File Structure

```
vspase-pwa/
├── server.js              # Express server
├── package.json           # Dependencies
├── templates/
│   └── proposal-template.html  # Handlebars template
└── README.md             # This file
```

## Troubleshooting

### PDF Generation Fails
1. Check template file exists at `templates/proposal-template.html`
2. Verify JSON payload has required fields (offerNumber, clientName)
3. Check Render logs for Puppeteer errors

### CORS Errors
- Add your PWA domain to `FRONTEND_URL` env variable
- Use `*` for development (not recommended for production)

### Memory Issues on Render
- Free tier has 512MB RAM
- Large PDFs may fail — optimize template or upgrade plan

## Frontend Integration

From your React PWA:

```javascript
const generatePDF = async (proposalData) => {
  const response = await fetch('https://vspase-pdf-generator.onrender.com/api/v1/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(proposalData)
  });
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  
  // Download PDF
  const a = document.createElement('a');
  a.href = url;
  a.download = `VS_PASE_Proposal_${proposalData.offerNumber}.pdf`;
  a.click();
};
```

## Next Steps

1. ✅ Test locally: `npm start`
2. ✅ Deploy to Render
3. ✅ Connect PWA frontend
4. 🔄 Test end-to-end PDF generation
5. 🚀 Production deployment

---

Built with ❤️ for VS Projects & System Engineers