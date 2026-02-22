# VS PASE Smart Proposal Management System

**Complete Full-Stack Solution for VS Projects & System Engineers**

Generate professional, branded PDF proposals from mobile devices — even in remote sugar mills with poor connectivity.

---

## 🎯 What We Built

A **$0/month** offline-first Progressive Web App (PWA) that lets field engineers:

1. ✅ Create quotes on mobile (even offline)
2. ✅ Clone previous proposals (save time!)
3. ✅ Auto-save to device (never lose data)
4. ✅ Generate PDFs via cloud backend
5. ✅ Download & share instantly

---

## 📁 Project Structure

```
vspase-pwa/
├── 📄 Frontend (React + TypeScript + Tailwind)
│   ├── src/
│   │   ├── App.tsx              # Main wizard container
│   │   ├── store/
│   │   │   └── proposalStore.ts # Zustand + localforage
│   │   ├── components/
│   │   │   ├── Stepper.tsx      # 4-step navigation
│   │   │   ├── steps/
│   │   │   │   ├── ClientDetailsStep.tsx
│   │   │   │   ├── TechnicalSpecsStep.tsx
│   │   │   │   ├── CommercialsStep.tsx
│   │   │   │   └── ReviewGenerateStep.tsx
│   │   │   └── ui/              # Reusable components
│   │   ├── types/
│   │   │   └── proposal.types.ts # TypeScript interfaces
│   │   └── config/
│   │       └── api.ts           # Backend URL config
│   ├── templates/
│   │   └── proposal-template.html # Handlebars template
│   ├── index.html
│   ├── vite.config.ts           # PWA config
│   └── ...config files
│
├── ⚙️ Backend (Node + Express + Puppeteer)
│   ├── server.js                # PDF generation API
│   └── ...deployment files
│
└── 📚 Documentation
    ├── DEPLOYMENT.md            # Step-by-step deployment
    ├── README.md                # Backend API docs
    └── .env.example             # Environment template
```

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    USER (Mobile/Tablet)                     │
│              React PWA (Vercel - $0/month)                 │
│         Offline-First + Zustand State + IndexedDB          │
└──────────────────────────┬─────────────────────────────────┘
                           │ POST /api/v1/generate
                           │ JSON Payload
                           ▼
┌────────────────────────────────────────────────────────────┐
│           Express API (Render - $0/month)                   │
│    Puppeteer + Handlebars → A4 PDF (Keep-alive pinged)     │
└────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd /Users/arry/.openclaw/workspace/vspase-pwa
npm install
```

### 2. Start Development Server (Frontend)

```bash
npm run dev
```
Opens at: `http://localhost:5173`

### 3. Start Backend Server (In new terminal)

```bash
npm run server:dev
```
Opens at: `http://localhost:3000`

### 4. Test the Full Flow

1. Open `http://localhost:5173` in browser
2. Fill client details
3. Add technical specifications
4. Enter commercial terms
5. Click "Generate PDF"
6. PDF downloads automatically!

---

## 📱 Features

### For Field Engineers (Ashwin, Ashutosh)

| Feature | Benefit |
|---------|---------|
| **Offline-First** | Work in remote sugar mills without internet |
| **Auto-Save** | Every keystroke saved to device automatically |
| **Clone Proposals** | Copy previous quotes, just change client |
| **Mobile-Optimized** | Touch-friendly (44px+ tap targets) |
| **4-Step Wizard** | Client → Technical → Commercial → Review |

### For Business

| Feature | Benefit |
|---------|---------|
| **$0/month** | Vercel + Render Free Tiers |
| **Professional PDFs** | Branded 12-page proposals |
| **Fast Generation** | ~5 seconds per PDF |
| **Global Access** | Cloud backend, edge CDN frontend |

---

## 🎨 UI Components

### Stepper Navigation
- Visual progress through 4 steps
- Jump back to completed steps
- Mobile-optimized horizontal scroll

### Forms
- **Client Details**: Company, address, contacts
- **Technical Specs**: Equipment type, MOC, motor HP, scope
- **Commercials**: Pricing, GST, payment terms, delivery
- **Review**: Summary + Generate PDF button

### Offline Handling
- All data persists in IndexedDB
- Sync queue for pending uploads
- Automatic retry on reconnect

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **localforage** for IndexedDB persistence
- **Vite PWA** for offline capabilities

### Backend
- **Node.js** + Express
- **Puppeteer** for PDF generation
- **Handlebars** for templating
- **CORS** for cross-origin

### Infrastructure
- **Vercel** (Frontend) - Free tier
- **Render** (Backend) - Free tier + UptimeRobot keep-alive

---

## 💰 $0/Month Deployment

### The Keep-Awake Trick

Render's free tier sleeps after 15 min. Solution:

1. **UptimeRobot** (free) pings `/health` every 14 minutes
2. Backend stays awake 24/7
3. PDF generation is instant

### Setup Steps

1. **Deploy Backend to Render**
   ```bash
   git push origin main
   # Create web service on render.com
   # Add environment variables
   ```

2. **Set up UptimeRobot**
   - Add monitor: `https://your-app.onrender.com/health`
   - Interval: 14 minutes
   - Free tier: 50 monitors

3. **Deploy Frontend to Vercel**
   ```bash
   # Connect GitHub repo to Vercel
   # Set VITE_API_URL to Render URL
   # Deploy!
   ```

See `DEPLOYMENT.md` for detailed instructions.

---

## 📄 API Endpoints

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
  "clientName": "The Seksaria Biswan Sugar Factory Ltd.",
  "technicalSpecs": { ... },
  "commercials": { ... }
}
```

Returns: `application/pdf` file

---

## 🔧 Environment Variables

Create `.env` file:

```bash
# Backend
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:3000
```

---

## 🧪 Testing

### Local Testing
```bash
# Terminal 1: Backend
npm run server:dev

# Terminal 2: Frontend
npm run dev

# Test: Open http://localhost:5173
```

### Production Testing
1. Deploy to Render + Vercel
2. Open Vercel URL on mobile
3. Create proposal → Generate PDF
4. Verify PDF content and formatting

---

## 🎯 Next Steps

### Immediate (You)
1. ✅ Review all code
2. ✅ Test locally
3. 🔄 Deploy to Render
4. 🔄 Deploy to Vercel
5. 🔄 Test end-to-end

### Future Enhancements
- User authentication (Clerk/Auth0)
- Proposal history dashboard
- Admin panel for Ashwin
- Email notifications
- WhatsApp integration
- Analytics dashboard
- Multi-language support

---

## 📞 Support

### Files Reference
| File | Purpose |
|------|---------|
| `DEPLOYMENT.md` | Step-by-step deployment guide |
| `server.js` | Express API with Puppeteer |
| `src/store/proposalStore.ts` | Zustand store with offline sync |
| `templates/proposal-template.html` | PDF template |

### Common Issues

**PDF Generation Fails**
- Check Render logs
- Verify template file exists
- Ensure JSON has required fields

**CORS Errors**
- Check `FRONTEND_URL` on Render
- Verify Vercel domain matches

**Offline Not Working**
- Check Service Worker in DevTools
- Verify `vite-plugin-pwa` config

---

## 🏆 Mission Accomplished

✅ **Phase 1 Complete**: $0 MVP ready for Ashwin and team

- JSON Schema designed
- Zustand store with offline persistence
- Mobile-first React UI
- HTML/Tailwind PDF template
- Express API with Puppeteer
- $0 deployment strategy

**Time to production: ~30 minutes**

---

**Built with ❤️ for VS Projects & System Engineers**

Questions? Check `DEPLOYMENT.md` or review component files.