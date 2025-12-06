# 🚀 Complete Deployment Guide - Option 1

## Architecture
- **Backend**: Railway (API-only)
- **Frontend**: Vercel (React app)

---

## ✅ Setup Checklist

### 1. Frontend: Add .env File

Create `frontend/.env` file:

```bash
# Local development
VITE_API_URL=http://localhost:4000/api
```

**After Railway deployment**, update to:
```bash
VITE_API_URL=https://your-railway-backend-url.up.railway.app/api
```

**Example:**
```bash
VITE_API_URL=https://it-helpdesk-production.up.railway.app/api
```

> ✅ **Good news!** Your frontend already uses `import.meta.env.VITE_API_URL` everywhere via the centralized `API` instance in `frontend/src/api.ts`. No code changes needed!

---

### 2. Frontend: API Configuration ✅ Already Done!

Your frontend already uses the centralized API configuration:

- ✅ `frontend/src/api.ts` uses `import.meta.env.VITE_API_URL`
- ✅ All pages use the `API` instance from `api.ts`
- ✅ Automatically includes authentication tokens
- ✅ Works for local dev and production

**No changes needed!** 🎉

---

### 3. Backend: CORS Configuration ✅ Already Done!

Your backend already has CORS configured in `backend/src/index.ts`:

```typescript
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || !process.env.FRONTEND_URL) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

**What you need to do:**

1. Deploy frontend to Vercel first
2. Get your Vercel URL (e.g., `https://your-app.vercel.app`)
3. Set in Railway environment variables:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```

---

### 4. Backend: PORT Configuration ✅ Already Done!

Your backend already uses Railway's PORT:

```typescript
const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || "0.0.0.0";
```

**No changes needed!** 🎉

---

## 📋 Deployment Steps

### Step 1: Deploy Backend to Railway

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Node.js

3. **Set Root Directory**
   - Go to Railway Service → Settings
   - Set **Root Directory** to: `backend`
   - Save

4. **Add PostgreSQL Database**
   - In Railway, click "+ New"
   - Select "Database" → "Add PostgreSQL"
   - Railway automatically sets `DATABASE_URL`

5. **Set Environment Variables** (Railway → Variables)
   ```
   DATABASE_URL      # Auto-set by Railway PostgreSQL ✅
   JWT_SECRET        # Your secret key (min 32 characters)
   PORT              # Auto-set by Railway ✅
   FRONTEND_URL      # Set after Vercel deployment (see Step 2)
   ```

6. **Deploy**
   - Railway will auto-deploy on push
   - Wait for build to complete
   - Get your Railway URL (e.g., `https://it-helpdesk-production.up.railway.app`)

7. **Run Database Migrations**
   ```bash
   # In Railway, go to Service → Deployments → Latest
   # Click "..." → "Open Shell"
   cd backend
   npx prisma migrate deploy
   # or
   npx prisma db push
   ```

---

### Step 2: Deploy Frontend to Vercel

1. **Push frontend to GitHub** (if not already)

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Set Environment Variables** (Vercel → Settings → Environment Variables)
   ```
   VITE_API_URL=https://your-railway-backend-url.up.railway.app/api
   ```
   
   Replace `your-railway-backend-url` with your actual Railway URL from Step 1.

   **Example:**
   ```
   VITE_API_URL=https://it-helpdesk-production.up.railway.app/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Get your Vercel URL (e.g., `https://your-app.vercel.app`)

---

### Step 3: Update CORS in Railway

1. **Go back to Railway**
2. **Add Environment Variable:**
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
   (Use your actual Vercel URL from Step 2)

3. **Redeploy** (Railway will auto-redeploy when env vars change)

---

### Step 4: Test Everything

1. **Test Backend:**
   - Visit: `https://your-railway-backend-url.up.railway.app/health`
   - Should return: `{"status":"ok","service":"IT Helpdesk API","ready":true}`

2. **Test Frontend:**
   - Visit: `https://your-app.vercel.app`
   - Try logging in
   - Create a ticket
   - Check browser console for errors

---

## 🔧 Troubleshooting

### Frontend can't connect to backend

1. **Check Vercel Environment Variables:**
   - Go to Vercel → Settings → Environment Variables
   - Make sure `VITE_API_URL` is set correctly
   - Should include `/api` at the end

2. **Check CORS:**
   - Make sure `FRONTEND_URL` is set in Railway
   - Check Railway logs for CORS errors

3. **Check Railway URL:**
   - Visit Railway URL + `/health`
   - Should return JSON status

### Backend not starting

1. **Check Railway Logs:**
   - Railway → Service → Deployments → Latest → View Logs

2. **Check Environment Variables:**
   - `DATABASE_URL` must be set
   - `JWT_SECRET` must be set

3. **Check Database:**
   - Make sure PostgreSQL is running
   - Run migrations: `npx prisma migrate deploy`

### 404 Errors

1. **Check Root Directory:**
   - Railway: Should be `backend`
   - Vercel: Should be `frontend`

2. **Check Build Commands:**
   - Railway: `cd backend && npm run build`
   - Vercel: `npm run build`

---

## ✅ Final Checklist

- [ ] Backend deployed to Railway
- [ ] Database connected and migrations run
- [ ] Frontend deployed to Vercel
- [ ] `VITE_API_URL` set in Vercel
- [ ] `FRONTEND_URL` set in Railway
- [ ] Health check works: `/health`
- [ ] Frontend loads successfully
- [ ] Can login from frontend
- [ ] Can create tickets

---

## 🎉 You're Done!

Your application is now live:
- **Backend**: `https://your-railway-backend-url.up.railway.app`
- **Frontend**: `https://your-app.vercel.app`

Enjoy your deployed IT Helpdesk! 🚀

