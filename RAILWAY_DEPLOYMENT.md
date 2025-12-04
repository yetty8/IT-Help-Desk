# Railway Deployment Guide

This guide will help you deploy the backend to Railway.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. GitHub repository with your code pushed
3. Railway CLI (optional, but helpful)

## Step-by-Step Deployment

### 1. Create a New Project on Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Select the **`backend`** folder as the root directory

### 2. Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically create a PostgreSQL database
4. The `DATABASE_URL` will be automatically set as an environment variable

### 3. Configure Environment Variables

Go to your service → **Variables** tab and add:

#### Required Variables:
```env
DATABASE_URL=<automatically set by Railway PostgreSQL>
JWT_SECRET=<generate a strong secret: openssl rand -base64 32>
PORT=<automatically set by Railway>
```

#### Optional Variables (for email):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

### 4. Run Database Migrations

Railway will automatically run migrations, but you can also run them manually:

**Option A: Using Railway Dashboard**
1. Go to your service → **Deployments**
2. Click on the latest deployment
3. Open the **"Shell"** tab
4. Run: `npx prisma migrate deploy`

**Option B: Using Railway CLI**
```bash
railway run npx prisma migrate deploy
```

### 5. Configure Build Settings

Railway should auto-detect Node.js, but verify:

1. Go to your service → **Settings**
2. Under **"Build Command"**, ensure it's:
   ```
   npm install && npm run build && npx prisma generate
   ```
3. Under **"Start Command"**, ensure it's:
   ```
   npm start
   ```

### 6. Set Up File Storage (Important!)

⚠️ **Railway uses ephemeral storage** - uploaded files will be lost on redeploy.

**Option A: Use Railway Volume (Recommended)**
1. In your Railway project, click **"+ New"**
2. Select **"Volume"**
3. Mount it to `/app/uploads` in your service settings
4. Update your service to use the volume

**Option B: Use External Storage (Better for Production)**
- Use AWS S3, Cloudinary, or similar
- Update file upload logic to use external storage

### 7. Deploy

1. Railway will automatically deploy when you push to GitHub
2. Or click **"Deploy"** in the Railway dashboard
3. Wait for the build to complete
4. Your API will be available at: `https://your-app-name.up.railway.app`

### 8. Get Your API URL

1. Go to your service → **Settings**
2. Under **"Networking"**, enable **"Generate Domain"**
3. Copy the generated URL (e.g., `https://your-app.up.railway.app`)
4. Update your frontend `.env` with:
   ```
   VITE_API_URL=https://your-app.up.railway.app/api
   ```

## Troubleshooting

### Build Fails
- Check build logs in Railway dashboard
- Ensure `package.json` has correct scripts
- Verify Node.js version (Railway uses Node 18+)

### Database Connection Issues (500 Errors)

If you're getting **500 errors** on register/login, the backend can't connect to the database.

#### Quick Diagnosis Steps:

1. **Check Railway Logs**
   - Go to your backend service → **"Logs"** tab
   - Look for error messages when registering
   - Common errors:
     - `DATABASE_URL is not set` → Database not added
     - `Can't reach database server` → Database not running
     - `Authentication failed` → DATABASE_URL is incorrect
     - `relation "User" does not exist` → Migrations not run

2. **Verify Database is Added**
   - Check if you see a **PostgreSQL** service in your Railway project
   - If missing: Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
   - Railway will automatically set `DATABASE_URL` for your backend

3. **Check Environment Variables**
   - Go to backend service → **"Variables"** tab
   - Verify `DATABASE_URL` exists (should be auto-set by Railway)

4. **Run Database Migrations**
   - Database tables might not exist yet
   - Use Railway Shell: `npx prisma migrate deploy`
   - Or Railway CLI: `railway run npx prisma migrate deploy`

5. **Test Database Connection**
   - Visit: `https://your-railway-backend.up.railway.app/api/test-db`
   - Should return database connection status

#### Common Fixes:

- **Database Not Added**: Add PostgreSQL in Railway (see Step 2 above)
- **DATABASE_URL Not Set**: Railway should auto-set it when PostgreSQL is added
- **Migrations Not Run**: Run `npx prisma migrate deploy` (see Step 4 above)
- **Database Service Stopped**: Check if PostgreSQL service is running and restart if needed

### File Uploads Not Working
- Railway's file system is ephemeral
- Use Railway Volume or external storage (S3, Cloudinary)

### CORS Errors
- Update CORS settings in `backend/src/index.ts`:
  ```typescript
  app.use(cors({
    origin: ['https://your-frontend-domain.com'],
    credentials: true
  }));
  ```

## Railway CLI (Optional)

Install Railway CLI for easier management:

```bash
npm i -g @railway/cli
railway login
railway link  # Link to your project
railway up    # Deploy
railway logs  # View logs
railway shell # Open shell
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (auto-set by Railway) |
| `JWT_SECRET` | ✅ | Secret for JWT tokens (generate with `openssl rand -base64 32`) |
| `PORT` | ✅ | Server port (auto-set by Railway) |
| `SMTP_HOST` | ❌ | SMTP server hostname |
| `SMTP_PORT` | ❌ | SMTP server port |
| `SMTP_USER` | ❌ | SMTP username |
| `SMTP_PASS` | ❌ | SMTP password |
| `SMTP_FROM` | ❌ | From email address |

## Next Steps

1. Deploy frontend (Vercel, Netlify, or Railway)
2. Update frontend API URL to point to Railway backend
3. Test all endpoints
4. Set up monitoring and alerts
5. Configure custom domain (optional)

## Production Checklist

- [ ] Strong JWT_SECRET set (32+ characters)
- [ ] Database migrations deployed
- [ ] CORS configured for frontend domain
- [ ] File storage configured (Volume or external)
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up
- [ ] Backups configured

