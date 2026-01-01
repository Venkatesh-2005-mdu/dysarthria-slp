# Railway Deployment Guide

## Prerequisites
- GitHub account (already connected, repo: https://github.com/Venkatesh-2005-mdu/dysarthria-slp)
- Railway account (free tier available)

## Deployment Steps (Fastest Way)

### 1. Create Railway Account
- Go to https://railway.app
- Sign up with GitHub (recommended)
- Connect your GitHub account

### 2. Deploy Project
- Click "New Project" on Railway dashboard
- Select "Deploy from GitHub repo"
- Select: `Venkatesh-2005-mdu/dysarthria-slp`
- Click "Deploy Now"
- Railway will automatically:
  ✅ Detect Dockerfile
  ✅ Build multi-stage Docker image (frontend + backend)
  ✅ Deploy to cloud
  ✅ Assign domain URL (e.g., `yourapp.railway.app`)

### 3. Set Environment Variables (Optional)
If your backend needs env vars:
- Go to Project → Variables
- Add any custom env vars
- Railway automatically handles `PORT`

### 4. Access Your App
- Frontend: `https://yourapp.railway.app/`
- Backend API: `https://yourapp.railway.app/api/analyze`
- API Docs: `https://yourapp.railway.app/docs`

## What's Deployed
- **Frontend**: React + Vite (built from npm run build)
- **Backend**: FastAPI + Uvicorn (Python 3.11)
- **Audio Support**: libsndfile, ffmpeg included
- **Port**: Automatically assigned by Railway (via PORT env var)

## Auto-Deploy on Git Push
Once connected, any push to the `main` branch triggers automatic redeployment.

## Deployment Time
- First deploy: ~3-5 minutes
- Subsequent deploys: ~2-3 minutes
- Cold start: <5 seconds

## Monitoring
View logs in Railway dashboard:
- Real-time build logs
- Runtime logs
- Error tracking
- Resource usage

## Custom Domain (Optional)
- Go to Project Settings → Domains
- Add custom domain (requires DNS configuration)
- Railway provides SSL automatically

---
**Total setup time: ~10 minutes from now**
