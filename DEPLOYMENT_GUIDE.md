# Deployment Guide - Option 1: Separate Frontend & Backend

## Architecture
- **Backend**: Railway (API-only, Express server)
- **Frontend**: Vercel (React app, fast CDN)

## Backend Setup (Railway)

### 1. Remove Frontend Serving Code
Backend should be API-only, no static file serving.

### 2. Add CORS Configuration
Allow requests from Vercel frontend domain.

### 3. Environment Variables (Railway)
- `DATABASE_URL` - Auto-set by Railway PostgreSQL
- `JWT_SECRET` - Your secret key
- `FRONTEND_URL` - Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
- `PORT` - Auto-set by Railway

## Frontend Setup (Vercel)

### 1. Deploy from `frontend/` directory
Vercel should build from the frontend folder at the repo root.

### 2. Environment Variables (Vercel)
- `VITE_API_URL` - Your Railway backend URL + `/api` (e.g., `https://your-backend.up.railway.app/api`)

### 3. API Configuration
Frontend will call Railway backend API.

## Benefits
✅ Clean separation
✅ Fast frontend delivery (Vercel CDN)
✅ Easy backend management (Railway)
✅ Independent scaling
✅ Easier debugging
