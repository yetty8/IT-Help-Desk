# Vercel Deployment Guide

Deploy your frontend to Vercel.

## 🚀 Quick Deployment Steps

### Step 1: Push to GitHub

Make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite project

### Step 3: Configure Project Settings

In the project configuration:

1. **Framework Preset**: Vite (auto-detected)
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `dist` (auto-detected)
5. **Install Command**: `npm install` (auto-detected)

### Step 4: Set Environment Variables

Go to **Settings** → **Environment Variables** and add:

```env
VITE_API_URL=https://your-railway-backend.up.railway.app/api
```

**Important**: Replace `your-railway-backend.up.railway.app` with your actual Railway backend URL.

### Step 5: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your frontend
3. Your app will be live at: `https://your-project.vercel.app`

### Step 6: Update Backend CORS

After getting your Vercel URL, update your Railway backend:

1. Go to Railway → Your backend service → **Variables**
2. Add/Update:
   ```env
   FRONTEND_URL=https://your-project.vercel.app
   ```
3. Redeploy your backend (or it will auto-redeploy)

## 📋 Configuration Details

### Vercel Configuration (`vercel.json`)

- **Framework**: Vite (auto-detected)
- **Build Output**: `dist` directory
- **SPA Routing**: All routes redirect to `index.html` for React Router
- **Asset Caching**: Static assets cached for 1 year

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Your Railway backend API URL |

### Build Settings

- **Node.js Version**: 18.x (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify `package.json` has correct scripts
- Ensure all dependencies are listed

### API Connection Errors
- Verify `VITE_API_URL` is set correctly
- Check Railway backend is running
- Verify CORS is configured on backend
- Check browser console for CORS errors

### Routing Issues (404 on refresh)
- `vercel.json` includes SPA rewrite rules
- All routes should redirect to `index.html`

### Environment Variables Not Working
- Variables must start with `VITE_` to be exposed to frontend
- Redeploy after adding/changing variables
- Check variable names match exactly

## 🔄 Updating Deployment

Vercel automatically deploys on every push to your main branch:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Build your project
3. Deploy to production

## 🌐 Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel will automatically configure SSL

## 📊 Preview Deployments

Every pull request gets a preview deployment:
- Automatic preview URLs for PRs
- Test changes before merging
- Share preview links with team

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Repository connected to Vercel
- [ ] Root directory set to `frontend`
- [ ] `VITE_API_URL` environment variable set
- [ ] Backend CORS updated with Vercel URL
- [ ] Build succeeds
- [ ] Frontend accessible at Vercel URL
- [ ] API calls working
- [ ] Authentication working
- [ ] All routes working

## 🔗 Links

- **Vercel Dashboard**: https://vercel.com
- **Vercel Docs**: https://vercel.com/docs
- **Vite + Vercel**: https://vercel.com/docs/frameworks/vite

## 🎯 Next Steps After Deployment

1. ✅ Frontend deployed to Vercel
2. ✅ Backend deployed to Railway
3. ✅ Environment variables configured
4. ⏭️ Test all features
5. ⏭️ Set up custom domain (optional)
6. ⏭️ Configure analytics (optional)
7. ⏭️ Set up monitoring

