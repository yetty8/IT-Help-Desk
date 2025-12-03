# 🚨 Quick Fix: Mobile Login Issue

## The Problem
Mobile shows "Invalid credentials" because `VITE_API_URL` is not set in Vercel.

## ✅ Solution (5 Minutes)

### Step 1: Find Your Railway Backend URL

1. **Log into Railway**: https://railway.com
2. **Go to your project**: https://railway.com/project/ba992519-9d9f-40b5-ac41-0a4bcdc29ba6
3. **Click on your backend service**
4. **Go to Settings** → **Networking** (or look at the top of the service page)
5. **Find the Public Domain** - it will look like:
   ```
   https://your-service-name.up.railway.app
   ```
6. **Copy this URL**

### Step 2: Add `/api` to the End

Your Railway URL: `https://your-service-name.up.railway.app`

Add `/api`: `https://your-service-name.up.railway.app/api`

**Example:**
- Railway URL: `https://backend-production.up.railway.app`
- API URL: `https://backend-production.up.railway.app/api`

### Step 3: Set in Vercel

1. **Go to Vercel**: https://vercel.com/yetbareks-projects
2. **Click on project**: `it-help-desk-1`
3. **Go to**: Settings → Environment Variables
4. **Click**: "Add New" (or edit existing)
5. **Set**:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-service-name.up.railway.app/api` (paste your Railway URL + `/api`)
   - **Environments**: ✅ Production ✅ Preview ✅ Development (select all)
6. **Click**: "Save"

### Step 4: REDEPLOY (CRITICAL!)

**This is the most important step!**

1. **Go to**: Deployments tab
2. **Click**: "..." (three dots) on the latest deployment
3. **Click**: "Redeploy"
4. **Wait**: 1-2 minutes for deployment to complete

### Step 5: Test

1. **Visit**: https://it-help-desk-1.vercel.app/login
2. **Look at the yellow debug box** at the top of the login form
3. **It should show**: `API URL: https://your-service-name.up.railway.app/api`
4. **If it shows**: `localhost` or `NOT SET` → The environment variable wasn't set correctly

### Step 6: Test on Mobile

1. **Clear mobile browser cache** (or use incognito mode)
2. **Visit**: https://it-help-desk-1.vercel.app/login
3. **Check the debug box** - should show Railway URL
4. **Try logging in**

## 🔍 Quick Test: Is Your Railway Backend Working?

Test your Railway backend directly:

Open this URL in your browser (replace with your Railway URL):
```
https://your-service-name.up.railway.app/api/stats
```

**Expected results:**
- ✅ **JSON response** (even if error) = Backend is working
- ❌ **Cannot connect** = Backend might not be deployed or domain not generated

## ⚠️ Common Mistakes

❌ **Wrong**: `VITE_API_URL=https://backend.up.railway.app` (missing `/api`)
✅ **Correct**: `VITE_API_URL=https://backend.up.railway.app/api`

❌ **Wrong**: `VITE_API_URL=https://backend.up.railway.app/api/` (trailing slash)
✅ **Correct**: `VITE_API_URL=https://backend.up.railway.app/api`

❌ **Wrong**: Setting variable but forgetting to redeploy
✅ **Correct**: Always redeploy after changing environment variables

❌ **Wrong**: Using `http://` instead of `https://`
✅ **Correct**: Always use `https://` for production

## 🐛 Still Not Working?

### Check Railway Logs
1. Railway → Deployments → Latest → Logs
2. Look for login attempts
3. Check for errors

### Check Vercel Logs
1. Vercel → Deployments → Latest → Logs
2. Look for build errors
3. Check runtime errors

### Verify Environment Variable
1. Vercel → Settings → Environment Variables
2. Make sure `VITE_API_URL` is set correctly
3. Make sure it's enabled for Production environment

### Test API Directly
Open this in your browser (replace with your Railway URL):
```
https://your-service-name.up.railway.app/api/stats
```

If this doesn't work, your Railway backend might not be deployed correctly.

## 📝 After It Works

Once mobile login works, you can remove the debug box by editing:
- `frontend/src/pages/Login.tsx`
- Remove or comment out the yellow debug div

---

**Need help finding your Railway URL?** See `FIND_RAILWAY_URL.md`

