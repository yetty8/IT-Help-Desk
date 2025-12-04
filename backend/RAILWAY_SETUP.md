# Railway Project Setup

## Step 1: Link Your Local Project to Railway

### Option A: Using Railway CLI (Recommended)

```bash
# Install Railway CLI if you haven't
npm i -g @railway/cli

# Login to Railway
railway login

# Link to your existing project
railway link

# When prompted, select your project from the list
```

### Option B: Connect via GitHub

1. Go to your Railway project dashboard
2. Click **"Settings"** → **"Source"**
3. Connect your GitHub repository
4. Set **Root Directory** to `backend`
5. Railway will auto-deploy on push

## Step 2: Configure Service Settings

In your Railway service dashboard:

1. **Settings** → **Root Directory**: Set to `backend`
2. **Settings** → **Build Command**: 
   ```
   npm install && npm run build && npx prisma generate
   ```
3. **Settings** → **Start Command**: 
   ```
   npm start
   ```

## Step 3: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically:
   - Create the database
   - Set `DATABASE_URL` environment variable
   - Link it to your service

## Step 4: Set Environment Variables

Go to your service → **Variables** tab and add:

### Required Variables:
```env
JWT_SECRET=<generate with: openssl rand -base64 32>
```

### Optional Variables:
```env
FRONTEND_URL=https://your-frontend-domain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

**Note**: `DATABASE_URL` and `PORT` are automatically set by Railway - don't add them manually.

## Step 5: Deploy

### If using GitHub:
1. Push your code:
   ```bash
   git add .
   git commit -m "Configure for Railway deployment"
   git push origin main
   ```
2. Railway will automatically deploy

### If using Railway CLI:
```bash
railway up
```

## Step 6: Run Database Migrations

After first deployment:

1. Go to your service → **Deployments** → Latest deployment
2. Click **"Shell"** tab
3. Run:
   ```bash
   npx prisma migrate deploy
   ```
4. (Optional) Seed initial data:
   ```bash
   npm run seed
   ```

## Step 7: Get Your API URL

1. Go to **Settings** → **Networking**
2. Enable **"Generate Domain"** if not already enabled
3. Copy your service URL (e.g., `https://your-service.up.railway.app`)
4. Your API will be available at: `https://your-service.up.railway.app/api`

## Step 8: Update Frontend

Update your frontend `.env` file:
```env
VITE_API_URL=https://your-service.up.railway.app/api
```

## Troubleshooting

### Check Build Logs
- Go to **Deployments** → Click on deployment → **Logs**
- Look for any build errors

### Check Runtime Logs
- Go to **Deployments** → Click on deployment → **Logs**
- Scroll to see runtime logs

### Common Issues

**Build fails:**
- Verify `package.json` has correct scripts
- Check Node.js version (should be 18+)
- Ensure all dependencies are in `package.json`

**Database connection error:**
- Verify PostgreSQL service is running
- Check `DATABASE_URL` is set (should be automatic)
- Run migrations: `npx prisma migrate deploy`

**CORS errors:**
- Set `FRONTEND_URL` environment variable
- Or update CORS in `src/index.ts` to allow your frontend domain

## Railway CLI Commands

```bash
# View logs
railway logs

# Open shell
railway shell

# Run migrations
railway run npx prisma migrate deploy

# Deploy
railway up

# View environment variables
railway variables
```

## Next Steps

1. ✅ Deploy backend to Railway
2. ✅ Run database migrations
3. ✅ Get API URL
4. ⏭️ Deploy frontend (Vercel/Netlify/Railway)
5. ⏭️ Update frontend API URL
6. ⏭️ Test all endpoints
7. ⏭️ Set up custom domain (optional)

