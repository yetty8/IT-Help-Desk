# 🚨 URGENT: Mobile Login Fix

## The Problem
Mobile login shows "Invalid credentials" but desktop works fine.

## Root Cause (99% Certain)
**`VITE_API_URL` environment variable is NOT set in Vercel**, so mobile is trying to connect to `localhost:4000/api` which doesn't exist.

## ✅ IMMEDIATE FIX (Do This Now)

### Step 1: Get Your Railway Backend URL

1. **Log into Railway**: https://railway.com
2. **Go to your project**: https://railway.com/project/ba992519-9d9f-40b5-ac41-0a4bcdc29ba6
3. **Click on your backend service** (service ID: 028ccea4-b540-49ee-aaf4-f8aed1a405a5)
4. **Go to Settings** → **Networking** (or check the top of the service page)
5. **Find the Public Domain** - it will look like: `https://your-service-name.up.railway.app`
6. **Copy this URL**
7. **Add `/api` to the end**: `https://your-service-name.up.railway.app/api`

### Step 2: Set Environment Variable in Vercel

1. Go to: https://vercel.com/yetbareks-projects
2. Click on project: **it-help-desk-1**
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Set:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-railway-backend.up.railway.app/api`
   - **Environment**: Production, Preview, Development (select all)
6. Click **"Save"**

### Step 3: REDEPLOY (CRITICAL!)

After setting the variable:
1. Go to **Deployments**
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

### Step 4: Clear Mobile Cache

On your mobile:
1. Clear browser cache
2. Or use incognito/private mode
3. Try logging in again

## 🔍 Verify It's Fixed

After redeploying, visit: https://it-help-desk-1.vercel.app/login

You should see a yellow debug box showing:
- API URL: `https://your-backend.up.railway.app/api` ✅
- NOT: `localhost:4000/api` or `NOT SET` ❌

## 📱 Test on Mobile

1. Open https://it-help-desk-1.vercel.app/login on mobile
2. Check the debug box at the top
3. If it shows the correct Railway URL, try logging in
4. If it still shows `localhost` or `NOT SET`, the environment variable wasn't set correctly

## 🐛 Still Not Working?

### Check Railway Backend CORS

Make sure Railway has:
```
FRONTEND_URL=https://it-help-desk-1.vercel.app
```

### Check Railway Logs

1. Railway → Deployments → Logs
2. Look for login attempts
3. Check if requests are reaching the backend

### Check Vercel Logs

1. Vercel → Deployments → Logs
2. Look for any build/runtime errors

## 📝 What I Changed

✅ Added visible debug info on login page (shows API URL)
✅ Added better error logging
✅ Added API connection test on page load
✅ Improved email/password normalization
✅ Added backend logging for login attempts
✅ Improved CORS configuration

## ⚠️ After Fixing

Once mobile login works, you can remove the debug box by editing `Login.tsx` and removing the debug div.

