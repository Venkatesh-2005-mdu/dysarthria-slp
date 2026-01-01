# 🚀 Complete Railway Deployment Guide

## Your Project is Ready for Live Deployment!

### Current Status:
- ✅ Frontend (React + Vite) - Ready
- ✅ Backend (FastAPI) - Running on Railway
- ✅ Dynamic API configuration - Implemented
- ✅ All components updated to use environment variables

---

## Step 1: Get Your Railway Public URL

1. Go to **Railway Dashboard**: https://railway.app/dashboard
2. Click on your **dysarthria-slp** project
3. Look for **Domains** section on the right panel
4. Copy the **Public URL** (it looks like: `https://dysarthria-slp-production.railway.app`)

---

## Step 2: Configure Environment Variables

1. In Railway Dashboard → Your Project → **Variables**
2. Add the following variable:
   ```
   VITE_API_BASE=<your-railway-public-url>
   ```
   Example:
   ```
   VITE_API_BASE=https://dysarthria-slp-production.railway.app
   ```

3. **Redeploy** - Railway will automatically rebuild and redeploy

---

## Step 3: Verify Your Live Deployment

After Railway redeploys (~3-5 minutes), test:

### Backend Test:
```
GET https://your-railway-url/
```
Should return: `{"message":"SLP Backend Running Successfully"}`

### API Documentation:
```
https://your-railway-url/docs
```

### Frontend:
```
https://your-railway-url/
```
Should load the React app

---

## Step 4: Test Assessment Features

1. Open frontend: `https://your-railway-url/`
2. Navigate to any assessment (e.g., Phonation Assessment)
3. Record audio - it should upload to your Railway backend
4. Verify results are returned from backend API

---

## Key Changes Made for Deployment:

### 1. **Dynamic API Configuration**
   - Created `src/config/api.js` - centralized API base URL
   - Uses environment variable `VITE_API_BASE` for Railway
   - Falls back to current host if not specified

### 2. **Updated All Assessment Pages**
   - `PhonationAssessment.jsx`
   - `SZAssessment.jsx`
   - `RateOfSpeechAssessment.jsx`
   - `RessonanceAndArticulationAssessment.jsx`
   - `VoiceTestAssessment.jsx`
   
   All now import API_BASE from centralized config instead of hardcoded URL

### 3. **Vite Configuration Updated**
   - Added proxy support for API requests
   - Supports environment variable in dev server

### 4. **.env.example**
   - Template for environment variables
   - Copy and customize for different environments

---

## Auto-Deployment

Any push to the `main` branch automatically triggers:
1. ✅ GitHub detects new commit
2. ✅ Railway pulls latest code
3. ✅ Docker image built (frontend + backend)
4. ✅ New version deployed
5. ✅ Your app is live!

Deployment time: **2-3 minutes**

---

## Local Development (Optional)

To test locally with the deployed backend:

```bash
# Set environment variable
export VITE_API_BASE=https://your-railway-url

# Or in PowerShell:
$env:VITE_API_BASE="https://your-railway-url"

# Run dev server
npm run dev
```

Frontend will connect to your deployed Railway backend.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│             RAILWAY.APP DEPLOYMENT                       │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  DOCKER CONTAINER (Python 3.11)                  │   │
│  │                                                  │   │
│  │  ┌─────────────┐          ┌──────────────────┐  │   │
│  │  │  Frontend   │   ←→     │  FastAPI Backend │  │   │
│  │  │  (Vite Build)          │  (Uvicorn)       │  │   │
│  │  │  Port 3000  │          │  Port 8080       │  │   │
│  │  └─────────────┘          └──────────────────┘  │   │
│  │                                                  │   │
│  │  Assets:                                        │   │
│  │  • libsndfile (audio processing)               │   │
│  │  • ffmpeg (media conversion)                   │   │
│  │  • librosa, scipy, numpy (analysis)            │   │
│  └──────────────────────────────────────────────────┘   │
│                       ↓                                   │
│              PUBLIC URL (HTTPS)                          │
│          https://your-app.railway.app                   │
│                                                          │
└─────────────────────────────────────────────────────────┘

Browser ←→ Railway Frontend ←→ Railway Backend ←→ Audio Processing
```

---

## Troubleshooting

### Frontend not loading?
- Check Railway logs: Project → Logs
- Verify `VITE_API_BASE` environment variable is set
- Clear browser cache (Ctrl+Shift+Delete)

### API calls failing?
- Verify backend is running: Open `/docs` in Railway URL
- Check CORS is enabled (it is by default in your app.py)
- Verify `VITE_API_BASE` matches your Railway domain exactly

### Audio not uploading?
- Check that `backend/uploads/` directory exists
- Verify audio file is valid WAV/WebM format
- Check browser console for detailed error messages

---

## Monitoring & Logs

View real-time deployment and runtime logs:
1. Railway Dashboard → Your Project
2. Click "Logs" tab
3. Filter by **build** or **runtime**

---

## Next Steps (Optional)

1. **Custom Domain**: 
   - Project Settings → Domains
   - Add your custom domain (e.g., dysarthria.yourcompany.com)
   - Point DNS to Railway

2. **Database** (if needed in future):
   - Add PostgreSQL/MongoDB from Railway Marketplace
   - Update backend to connect

3. **Monitoring**:
   - Set up error tracking (Sentry, LogRocket)
   - Add performance monitoring

---

## Summary

✅ **Your app is deployed and live!**

**Live URL**: `https://your-railway-url`

**What's running**:
- React frontend (React 19, React Router 7)
- FastAPI backend (Python 3.11)
- Audio processing (librosa, scipy, soundfile)
- Auto-scaling & SSL included

**Auto-deploy**: Every git push to `main` = automatic redeploy

**Time to production**: Done! 🎉

---

*For questions or issues, check Railway documentation: https://docs.railway.app*
