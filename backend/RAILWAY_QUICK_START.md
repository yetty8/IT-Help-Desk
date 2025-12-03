# Railway Quick Start Guide

## 🚀 Quick Deploy Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2. Deploy on Railway

1. **Go to [railway.app](https://railway.app)** and sign in
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. **Important**: Set **Root Directory** to `backend`
5. Railway will auto-detect Node.js

### 3. Add PostgreSQL Database

1. In your project, click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway automatically sets `DATABASE_URL`

### 4. Set Environment Variables

Go to your service → **Variables** and add:

```env
JWT_SECRET=<generate with: openssl rand -base64 32>
FRONTEND_URL=https://your-frontend-domain.com  # Optional, for CORS
```

### 5. Deploy & Run Migrations

Railway will auto-deploy. After first deploy:

1. Go to **Deployments** → Latest deployment → **Shell**
2. Run: `npx prisma migrate deploy`
3. (Optional) Run: `npm run seed` to seed initial data

### 6. Get Your API URL

1. Go to **Settings** → **Networking**
2. Enable **"Generate Domain"**
3. Copy the URL (e.g., `https://your-app.up.railway.app`)

### 7. Update Frontend

Update your frontend `.env`:
```env
VITE_API_URL=https://your-app.up.railway.app/api
```

## 📋 Environment Variables Checklist

- [ ] `DATABASE_URL` (auto-set by Railway PostgreSQL)
- [ ] `JWT_SECRET` (required - generate strong secret)
- [ ] `PORT` (auto-set by Railway)
- [ ] `FRONTEND_URL` (optional - for CORS)
- [ ] `SMTP_*` variables (optional - for email)

## ⚠️ Important Notes

1. **File Uploads**: Railway uses ephemeral storage. Files will be lost on redeploy.
   - **Solution**: Use Railway Volume or external storage (S3, Cloudinary)

2. **Database Migrations**: Run `npx prisma migrate deploy` after first deploy

3. **CORS**: Update `FRONTEND_URL` in environment variables to allow your frontend

4. **Logs**: Check Railway dashboard → **Deployments** → **Logs** for debugging

## 🔧 Troubleshooting

**Build fails?**
- Check logs in Railway dashboard
- Ensure `package.json` scripts are correct
- Verify Node.js version (18+)

**Database connection error?**
- Verify `DATABASE_URL` is set
- Check PostgreSQL service is running
- Run migrations: `npx prisma migrate deploy`

**CORS errors?**
- Set `FRONTEND_URL` environment variable
- Or update CORS in `src/index.ts`

## 📚 Full Documentation

See `RAILWAY_DEPLOYMENT.md` for detailed instructions.

