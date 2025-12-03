# Vercel Quick Start

**Your Vercel Dashboard**: https://vercel.com/yetbareks-projects

## 🚀 Deploy in 3 Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import to Vercel

1. Go to https://vercel.com/yetbareks-projects
2. Click **"Add New..."** → **"Project"**
3. Select your GitHub repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite (auto-detected)
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-railway-backend.up.railway.app/api
   ```
6. Click **"Deploy"**

### 3. Update Backend CORS

After deployment, get your Vercel URL and update Railway:

1. Railway → Backend → **Variables**
2. Add: `FRONTEND_URL=https://your-project.vercel.app`
3. Backend will auto-redeploy

## ✅ Done!

Your frontend is now live at: `https://your-project.vercel.app`

## 🔄 Auto-Deploy

Vercel automatically deploys on every push to `main` branch!

## 📝 Environment Variables

**Required:**
- `VITE_API_URL` - Your Railway backend API URL

**Set in**: Vercel Dashboard → Project → Settings → Environment Variables

## 🐛 Common Issues

**Build fails?**
- Check Vercel build logs
- Verify `package.json` scripts

**API not connecting?**
- Verify `VITE_API_URL` is set correctly
- Check Railway backend is running
- Update backend CORS with Vercel URL

**404 on page refresh?**
- `vercel.json` handles SPA routing
- Should work automatically

## 📚 Full Guide

See `VERCEL_DEPLOYMENT.md` for detailed instructions.

