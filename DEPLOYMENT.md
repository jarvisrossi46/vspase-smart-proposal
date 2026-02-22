# VS PASE Smart Proposal System - Deployment Guide

Complete deployment instructions for taking the VS PASE Smart Proposal Management System live.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    USER (Mobile/Tablet)                      │
│                  React PWA (Vercel)                         │
│              Offline-First + Zustand State                  │
└──────────────────────────┬──────────────────────────────────┘
                           │ POST /api/v1/generate
                           │ JSON Payload
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                Express API (Render)                          │
│           Puppeteer + Handlebars → PDF                      │
│              Kept-Warm Backend Service                       │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Sequence

### Phase 1: Deploy Backend to Render (First!)

**Why first?** The frontend needs the API URL to connect to.

#### 1.1 Push Backend to GitHub

```bash
cd /Users/arry/.openclaw/workspace/vspase-pwa

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: VS PASE Smart Proposal System

- Express API with Puppeteer PDF generation
- Zustand store with offline-first persistence
- Handlebars HTML template
- Production-ready for Render"

# Create GitHub repo (via gh CLI or web)
gh repo create vspase-smart-proposal --public --source=. --push
```

#### 1.2 Create Render Service

1. Go to [render.com](https://render.com) → Sign up with GitHub
2. Click **New Web Service**
3. Connect your GitHub repo: `vspase-smart-proposal`
4. Configure:

| Setting | Value |
|---------|-------|
| **Name** | vspase-pdf-engine |
| **Environment** | Node |
| **Region** | Singapore (closest to India) |
| **Branch** | main |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free ($0) |

5. **Environment Variables** (Add in Render Dashboard):

```
NODE_ENV=production
FRONTEND_URL=https://vspase-proposals.vercel.app
PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
```

6. Click **Create Web Service**

7. Wait for deployment (~5 minutes first time)

8. **Get your API URL:**
   - Will be: `https://vspase-pdf-engine.onrender.com`
   - Test: `https://vspase-pdf-engine.onrender.com/health`

#### 1.3 Keep-Alive for Free Tier (Optional but Recommended)

Free tier sleeps after 15 min. Add this cron job to keep it warm:

```bash
# In your local machine, add to crontab
crontab -e

# Add this line (pings every 10 minutes)
*/10 * * * * curl -s https://vspase-pdf-engine.onrender.com/health > /dev/null
```

Or use a free service like [UptimeRobot](https://uptimerobot.com) to ping every 5 minutes.

---

### Phase 2: Prepare Frontend for Vercel

#### 2.1 Update API URL

Create production environment file:

```bash
cd /Users/arry/.openclaw/workspace/vspase-pwa
```

Edit `src/config/api.ts` (create if doesn't exist):

```typescript
// src/config/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  generatePDF: `${API_BASE_URL}/api/v1/generate`,
  health: `${API_BASE_URL}/health`
};
```

#### 2.2 Create Vercel Config

Already created: `vercel.json` (prevents Service Worker caching)

#### 2.3 Build Configuration

Create `vite.config.ts` (if using Vite):

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'VS PASE Proposal Manager',
        short_name: 'VS PASE',
        description: 'Smart Proposal Management System',
        theme_color: '#1e40af',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

#### 2.4 Update package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

---

### Phase 3: Deploy Frontend to Vercel

#### 3.1 Push to GitHub

```bash
# Already committed in Phase 1
# Just ensure all frontend files are pushed
git add .
git commit -m "Add frontend PWA configuration for Vercel"
git push origin main
```

#### 3.2 Create Vercel Project

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **Add New Project**
3. Import your GitHub repo: `vspase-smart-proposal`
4. Configure:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `./` (or `./frontend` if monorepo) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

5. **Environment Variables**:

```
VITE_API_URL=https://vspase-pdf-engine.onrender.com
```

6. Click **Deploy**

7. **Get your frontend URL:**
   - Will be: `https://vspase-proposals.vercel.app`
   - Custom domain: Add your own in Vercel settings

#### 3.3 Update CORS on Render

Go back to Render Dashboard → Environment:

```
FRONTEND_URL=https://vspase-proposals.vercel.app
```

(Remove the `*` wildcard, use actual Vercel domain for security)

---

### Phase 4: End-to-End Testing

#### 4.1 Test Backend

```bash
# Health check
curl https://vspase-pdf-engine.onrender.com/health

# Expected: {"status":"OK","service":"VS PASE PDF Generator",...}
```

#### 4.2 Test Frontend

1. Open: `https://vspase-proposals.vercel.app`
2. Verify PWA install prompt appears
3. Check DevTools → Application → Service Workers (should be registered)
4. Test offline mode (DevTools → Network → Offline)

#### 4.3 Test Full Flow

1. Create new proposal in PWA
2. Fill client details
3. Add technical specs
4. Add commercials
5. Click **Generate PDF**
6. Verify PDF downloads
7. Check PDF content matches input

---

### Phase 5: Production Checklist

#### Security
- [ ] API key authentication (if needed)
- [ ] Rate limiting on `/api/v1/generate`
- [ ] CORS restricted to specific domains
- [ ] HTTPS enforced (Vercel/Render do this by default)

#### Performance
- [ ] Render service on paid tier ($7/month) for 24/7 uptime
- [ ] Or keep-alive cron job for free tier
- [ ] Vercel Edge Network caching configured
- [ ] Images optimized (Stable Diffusion facility photos)

#### Monitoring
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Error tracking (Sentry)
- [ ] Analytics (Plausible or Google Analytics)

#### Team Access
- [ ] Ashwin has login credentials
- [ ] Ashutosh has login credentials
- [ ] Training session completed
- [ ] Clone-from-previous feature demonstrated

---

## File Structure for Deployment

```
vspase-pwa/
├── .env                    # Local environment (gitignored)
├── .env.example            # Template for env vars
├── .gitignore
├── package.json
├── README.md
├── vercel.json             # Vercel config (no-cache SW)
├── server.js               # Express backend
├── vite.config.ts          # Vite + PWA config
│
├── src/
│   ├── config/
│   │   └── api.ts          # API URL config
│   ├── store/
│   │   └── proposalStore.ts  # Zustand store
│   ├── types/
│   │   └── proposal.types.ts # TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
│
├── templates/
│   └── proposal-template.html  # Handlebars template
│
└── public/
    ├── icon-192x192.png    # PWA icons
    ├── icon-512x512.png
    └── manifest.webmanifest
```

---

## Troubleshooting

### PDF Generation Fails

**Symptom:** 500 error from `/api/v1/generate`

**Fix:**
1. Check Render logs for Puppeteer errors
2. Verify template file exists at `templates/proposal-template.html`
3. Ensure JSON payload has required fields

### CORS Errors

**Symptom:** `Access-Control-Allow-Origin` error in browser

**Fix:**
1. Check `FRONTEND_URL` on Render matches actual Vercel domain
2. Verify no trailing slash mismatch
3. Test with `*` temporarily (not for production)

### PWA Not Updating

**Symptom:** Old version shows after deployment

**Fix:**
1. Check `vercel.json` has no-cache headers for `sw.js`
2. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
3. Unregister service worker in DevTools → Application

### Offline Mode Not Working

**Symptom:** App fails when network disconnected

**Fix:**
1. Verify Service Worker registered
2. Check `vite-plugin-pwa` config
3. Test in DevTools Network tab → Offline

---

## Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| **Render** | Free | $0 (sleeps after 15min) |
| **Render** | Starter | $7/month (24/7 uptime) |
| **Vercel** | Free | $0 (generous limits) |
| **Total** | Production | $7/month |

---

## Support & Next Steps

**Immediate:**
1. Deploy backend to Render
2. Get API URL
3. Update frontend env var
4. Deploy frontend to Vercel
5. Test end-to-end

**Future Enhancements:**
- User authentication (Clerk/Auth0)
- Proposal history dashboard
- Admin panel for Ashwin
- Email notifications
- WhatsApp integration
- Analytics dashboard

---

**Questions?** Check the troubleshooting section or review component READMEs:
- `README.md` (backend API)
- `src/store/README.md` (Zustand store)
- `templates/README.md` (HTML template)

**System Status:** ✅ Ready for Production Deployment