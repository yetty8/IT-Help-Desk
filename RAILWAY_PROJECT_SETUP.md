# Railway Project Setup Guide

**Your Railway Project**: [View Dashboard](https://railway.com/project/ba992519-9d9f-40b5-ac41-0a4bcdc29ba6/service/028ccea4-b540-49ee-aaf4-f8aed1a405a5)

## 🚀 Quick Setup Steps

### Step 1: Connect Your Repository

**Option A: Via Railway Dashboard (Easiest)**
1. Go to your Railway project: https://railway.com/project/ba992519-9d9f-40b5-ac41-0a4bcdc29ba6/service/028ccea4-b540-49ee-aaf4-f8aed1a405a5
2. Click **"Settings"** → **"Source"**
3. Connect your GitHub repository
4. Set **Root Directory** to: `backend`
5. Railway will auto-deploy on push

**Option B: Via Railway CLI**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link ba992519-9d9f-40b5-ac41-0a4bcdc29ba6

# Deploy
railway up
```

### Step 2: Configure Service Settings

In your Railway service dashboard, go to **Settings**:

1. **Root Directory**: `backend`
2. **Build Command**: `npm install && npm run build && npx prisma generate`
3. **Start Command**: `npm start`

### Step 3: Add PostgreSQL Database

1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically:
   - Create PostgreSQL database
   - Set `DATABASE_URL` environment variable
   - Link it to your backend service

### Step 4: Set Environment Variables

Go to your service → **Variables** tab and add:

#### Required:
```env
JWT_SECRET=<generate with: openssl rand -base64 32>
```

#### Optional (for CORS):
```env
FRONTEND_URL=https://your-frontend-domain.com
```

#### Optional (for email):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

**Important**: 
- `DATABASE_URL` is automatically set by Railway PostgreSQL - don't add it manually
- `PORT` is automatically set by Railway - don't add it manually

### Step 5: Deploy

**If connected via GitHub:**
```bash
git add .
git commit -m "Configure for Railway deployment"
git push origin main
```
Railway will automatically deploy!

**If using Railway CLI:**
```bash
railway up
```

### Step 6: Run Database Migrations

After the first deployment:

1. Go to your service → **Deployments** → Click on latest deployment
2. Click **"Shell"** tab
3. Run:
   ```bash
   npx prisma migrate deploy
   ```
4. (Optional) Seed initial data:
   ```bash
   npm run seed
   ```

### Step 7: Get Your API URL

1. Go to **Settings** → **Networking**
2. Enable **"Generate Domain"** (if not already enabled)
3. Copy your service URL (e.g., `https://your-service.up.railway.app`)
4. Your API endpoints will be at: `https://your-service.up.railway.app/api`

### Step 8: Update Frontend

Update your frontend `.env` file:
```env
VITE_API_URL=https://your-service.up.railway.app/api
```

## 🔍 Verify Deployment

Test your API:
```bash
# Health check (if you add one)
curl https://your-service.up.railway.app/api/stats

# Or test from browser
# Open: https://your-service.up.railway.app/api/stats
```

## 📊 Monitoring

- **View Logs**: Deployments → Latest → Logs
- **View Metrics**: Service dashboard → Metrics tab
- **View Variables**: Settings → Variables

## 🐛 Troubleshooting

### Build Fails
- Check **Deployments** → **Logs** for errors
- Verify `package.json` scripts are correct
- Ensure Node.js 18+ is being used

### Database Connection Error
- Verify PostgreSQL service is running
- Check `DATABASE_URL` is set (should be automatic)
- Run migrations: `npx prisma migrate deploy`

### CORS Errors
- Set `FRONTEND_URL` environment variable
- Or manually update CORS in `backend/src/index.ts`

### File Uploads Not Working
- Railway uses ephemeral storage (files lost on redeploy)
- **Solution**: Add Railway Volume or use external storage (S3/Cloudinary)

## 📝 Checklist

- [ ] Repository connected to Railway
- [ ] Root directory set to `backend`
- [ ] PostgreSQL database added
- [ ] `JWT_SECRET` environment variable set
- [ ] Build command configured
- [ ] Start command configured
- [ ] Code pushed/deployed
- [ ] Database migrations run
- [ ] API URL obtained
- [ ] Frontend `.env` updated

## 🎯 Next Steps

1. ✅ Deploy backend to Railway
2. ✅ Run migrations
3. ✅ Get API URL
4. ⏭️ Deploy frontend (Vercel/Netlify)
5. ⏭️ Update frontend API URL
6. ⏭️ Test all endpoints
7. ⏭️ Set up custom domain (optional)

