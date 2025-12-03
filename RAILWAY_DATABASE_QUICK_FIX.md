# ⚡ Quick Fix: Railway DATABASE_URL Error

## Problem
```
Error: DATABASE_URL is not set in environment variables
```

## Solution (2 Steps)

### 1. Add PostgreSQL Database

1. Go to: https://railway.com/project/ba992519-9d9f-40b5-ac41-0a4bcdc29ba6
2. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway auto-sets `DATABASE_URL` ✅

### 2. Redeploy Backend

1. Go to your **backend service**
2. **Deployments** → **"..."** → **"Redeploy"**
3. Wait for deployment

### 3. Run Migrations (After Deploy)

1. **Deployments** → Latest → **"Shell"**
2. Run: `npx prisma migrate deploy`

## Done! ✅

Backend should now start without errors.

See `FIX_RAILWAY_DATABASE.md` for detailed troubleshooting.

