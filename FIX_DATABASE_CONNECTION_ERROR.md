# 🔧 Fix: "Database connection error" on Register/Login

## The Problem

When trying to register or login on Vercel, you get:
```
Database connection error. Please try again later.
```

## Root Cause

The backend **cannot connect to the database**. This means:
1. ❌ PostgreSQL database is not added to Railway, OR
2. ❌ `DATABASE_URL` is not set in Railway, OR
3. ❌ Database service is not running

## ✅ Solution

### Step 1: Add PostgreSQL Database to Railway

1. **Go to Railway**: https://railway.com/project/ba992519-9d9f-40b5-ac41-0a4bcdc29ba6
2. **Click "+ New"** button (top right)
3. **Click "Database"**
4. **Click "Add PostgreSQL"**
5. **Wait 30-60 seconds** for Railway to create it

Railway will automatically:
- Create the database
- Set `DATABASE_URL` environment variable
- Link it to your backend service

### Step 2: Verify DATABASE_URL is Set

1. **Click on your backend service** (not the database)
2. **Go to "Variables" tab**
3. **Look for `DATABASE_URL`** - it should appear automatically

**If you see `DATABASE_URL`:**
- ✅ Good! Continue to Step 3

**If you DON'T see `DATABASE_URL`:**
- ❌ See "Manual Fix" below

### Step 3: Run Database Migrations

After the database is added:

1. **Go to**: Deployments → Latest deployment → **Shell** tab
2. **Run**:
   ```bash
   npx prisma migrate deploy
   ```
3. **Wait** for migrations to complete
4. **(Optional) Seed data**:
   ```bash
   npm run seed
   ```

### Step 4: Redeploy Backend

1. **Go to**: Deployments tab
2. **Click**: "..." → "Redeploy"
3. **Wait** 1-2 minutes

### Step 5: Test

After redeploying:
1. **Try registering** on Vercel
2. **Should work** now! ✅

## 🔧 Manual Fix (If DATABASE_URL Didn't Appear)

### Copy DATABASE_URL from Database Service

1. **Click on your PostgreSQL database service**
2. **Go to "Variables" tab**
3. **Find `DATABASE_URL`** - it looks like:
   ```
   postgresql://postgres:password@host.railway.app:5432/railway
   ```
4. **Click the copy icon** (or copy the value)
5. **Go back to your backend service**
6. **Go to "Variables" tab**
7. **Click "New Variable"**
8. **Set**:
   - **Name**: `DATABASE_URL`
   - **Value**: Paste what you copied
   - **Environment**: All (Production, Preview, Development)
9. **Click "Add"**
10. **Redeploy** backend service

## 📋 Checklist

- [ ] PostgreSQL database added to Railway project
- [ ] Database service is running (green status)
- [ ] `DATABASE_URL` appears in backend service variables
- [ ] Database migrations have been run (`npx prisma migrate deploy`)
- [ ] Backend service has been redeployed
- [ ] Backend logs show "Server running" (no errors)

## 🎯 Expected Result

After fixing:
- ✅ Backend can connect to database
- ✅ Registration works
- ✅ Login works
- ✅ No "Database connection error"

## 🐛 Still Getting Errors?

### Check Railway Logs

1. **Railway** → **Backend Service** → **Deployments** → **Latest** → **Logs**
2. **Look for**:
   - `DATABASE_URL is not set` → Database not added
   - Database connection errors → Check `DATABASE_URL` format
   - Prisma errors → Run migrations

### Check Database Service

1. **Railway** → **PostgreSQL Service**
2. **Verify**:
   - Status is green (running)
   - Service is in the same project as backend
   - Service is linked to backend

### Test Database Connection

1. **Railway** → **Backend Service** → **Deployments** → **Latest** → **Shell**
2. **Run**:
   ```bash
   node -e "console.log(process.env.DATABASE_URL ? 'DATABASE_URL is set' : 'DATABASE_URL is NOT set')"
   ```
3. **Should show**: "DATABASE_URL is set"

---

**The fix: Add PostgreSQL database in Railway, run migrations, and redeploy backend!**

