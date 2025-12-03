# 🔧 Fix: Works on Localhost but Not on Vercel

## The Problem
- ✅ **Works**: `http://localhost:5174/create` (tickets create successfully)
- ❌ **Fails**: `https://it-help-desk-1.vercel.app/create` (error: "Failed to create ticket")

## Root Cause

**`VITE_API_URL` environment variable is NOT set in Vercel**, so:
- **Localhost**: Uses `http://localhost:4000/api` (works because backend runs locally)
- **Vercel**: Also tries `http://localhost:4000/api` (fails because backend is on Railway, not localhost)

## ✅ Solution (5 Minutes)

### Step 1: Get Your Railway Backend URL

1. **Go to Railway**: https://railway.com/project/ba992519-9d9f-40b5-ac41-0a4bcdc29ba6
2. **Click on your backend service**
3. **Go to Settings** → **Networking**
4. **Find the Public Domain** - it will look like:
   ```
   https://your-service-name.up.railway.app
   ```
5. **Copy this URL**
6. **Add `/api` to the end**: `https://your-service-name.up.railway.app/api`

**Example:**
- Railway URL: `https://backend-production.up.railway.app`
- API URL: `https://backend-production.up.railway.app/api`

### Step 2: Set Environment Variable in Vercel

1. **Go to Vercel**: https://vercel.com/yetbareks-projects
2. **Click on project**: `it-help-desk-1`
3. **Go to**: **Settings** → **Environment Variables**
4. **Click**: **"Add New"** (or edit if `VITE_API_URL` already exists)
5. **Set**:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-railway-url.up.railway.app/api`
   - **Environment**: ✅ **Production** ✅ **Preview** ✅ **Development** (select all three)
6. **Click**: **"Save"**

### Step 3: REDEPLOY (CRITICAL!)

**This is the most important step!**

1. **Go to**: **Deployments** tab
2. **Click**: **"..."** (three dots) on the latest deployment
3. **Click**: **"Redeploy"**
4. **Wait**: 1-2 minutes for deployment to complete

### Step 4: Verify It's Fixed

After redeploying:

1. **Visit**: https://it-help-desk-1.vercel.app/create
2. **Open browser console** (F12)
3. **Look for these logs**:
   ```
   🔗 API Base URL: https://your-railway-url.up.railway.app/api
   📦 VITE_API_URL: https://your-railway-url.up.railway.app/api
   ```

**If you see:**
- ✅ Railway URL = **Good!** Try creating a ticket now
- ❌ `localhost:4000/api` or `NOT SET` = Environment variable wasn't set correctly

### Step 5: Test Creating a Ticket

1. **Fill out the ticket form**
2. **Click "Create Ticket"**
3. **Check browser console** (F12) for any errors
4. **Check Network tab** → Look for POST request to `/tickets`
5. **Verify** the request URL is your Railway backend, not localhost

## 🔍 How to Verify API URL is Set

### Method 1: Browser Console

1. Open https://it-help-desk-1.vercel.app/create
2. Press F12 (open DevTools)
3. Go to **Console** tab
4. Look for:
   ```
   🔗 API Base URL: https://your-railway-url.up.railway.app/api
   ```

### Method 2: Network Tab

1. Open https://it-help-desk-1.vercel.app/create
2. Press F12 → **Network** tab
3. Try creating a ticket
4. Find the POST request to `/tickets`
5. Check the **Request URL** - should be your Railway URL, not localhost

### Method 3: Error Message

If you see an error like:
```
Network error. Cannot reach backend at http://localhost:4000/api
```

This confirms `VITE_API_URL` is not set.

## ⚠️ Common Mistakes

❌ **Wrong**: `VITE_API_URL=https://backend.up.railway.app` (missing `/api`)
✅ **Correct**: `VITE_API_URL=https://backend.up.railway.app/api`

❌ **Wrong**: `VITE_API_URL=https://backend.up.railway.app/api/` (trailing slash)
✅ **Correct**: `VITE_API_URL=https://backend.up.railway.app/api`

❌ **Wrong**: Setting variable but forgetting to redeploy
✅ **Correct**: Always redeploy after changing environment variables

❌ **Wrong**: Only setting for Production environment
✅ **Correct**: Set for Production, Preview, AND Development

❌ **Wrong**: Using `http://` instead of `https://`
✅ **Correct**: Always use `https://` for production

## 🎯 Expected Result

After fixing:
- ✅ Browser console shows Railway API URL (not localhost)
- ✅ Network requests go to Railway backend
- ✅ Tickets can be created successfully
- ✅ No "Failed to create ticket" errors

## 🐛 Still Not Working?

### Check 1: Backend is Running

1. **Railway** → **Backend Service** → **Check status**
2. **Should be**: Green/Running
3. **If stopped**: Check logs, make sure database is added

### Check 2: Backend URL is Correct

1. **Test directly**: `https://your-railway-url.up.railway.app/health`
2. **Should return**: `{ "status": "ok", ... }`
3. **If fails**: Backend might not be running or URL is wrong

### Check 3: CORS is Configured

1. **Railway** → **Backend Service** → **Variables**
2. **Check**: `FRONTEND_URL` = `https://it-help-desk-1.vercel.app`
3. **If missing**: Add it and redeploy backend

### Check 4: Authentication Token

1. **Browser console** → Check if token exists
2. **Try**: Logging out and logging back in
3. **Clear**: Browser cache and try again

## 📋 Quick Checklist

- [ ] Railway backend is running (green status)
- [ ] PostgreSQL database is added
- [ ] `DATABASE_URL` is set in Railway
- [ ] Railway backend URL is known
- [ ] `VITE_API_URL` is set in Vercel (with `/api` at the end)
- [ ] `VITE_API_URL` is enabled for all environments (Production, Preview, Development)
- [ ] Vercel frontend has been redeployed
- [ ] Browser console shows Railway URL (not localhost)
- [ ] Network requests go to Railway backend

---

**The fix is simple: Set `VITE_API_URL` in Vercel to your Railway backend URL + `/api`, then redeploy!**

