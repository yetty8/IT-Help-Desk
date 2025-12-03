# Vercel Environment Variable Check

## ⚠️ CRITICAL: Check This First!

The mobile login issue is **99% likely** because `VITE_API_URL` is not set in Vercel.

## How to Check & Fix

### Step 1: Verify Environment Variable in Vercel

1. Go to: https://vercel.com/yetbareks-projects
2. Click on your project: **it-help-desk-1**
3. Go to **Settings** → **Environment Variables**
4. Look for `VITE_API_URL`

**If it's missing or wrong:**
- Click **"Add New"**
- Name: `VITE_API_URL`
- Value: `https://your-railway-backend.up.railway.app/api`
- **Important**: Replace `your-railway-backend.up.railway.app` with your actual Railway backend URL
- Make sure it ends with `/api`
- No trailing slash

### Step 2: Get Your Railway Backend URL

1. Go to Railway: https://railway.com/project/ba992519-9d9f-40b5-ac41-0a4bcdc29ba6
2. Click on your backend service
3. Go to **Settings** → **Networking**
4. Copy the domain (e.g., `https://your-app.up.railway.app`)
5. Add `/api` to the end: `https://your-app.up.railway.app/api`

### Step 3: Set in Vercel

In Vercel → Environment Variables:
```
VITE_API_URL=https://your-app.up.railway.app/api
```

### Step 4: Redeploy

**CRITICAL**: After setting/changing environment variables, you MUST redeploy:

1. Go to **Deployments**
2. Click the **"..."** menu on latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

### Step 5: Clear Mobile Cache

On your mobile phone:
1. Clear browser cache
2. Or use incognito/private mode
3. Or close and reopen browser

## Quick Test

After redeploying, check the browser console (on mobile if possible, or desktop):

1. Open https://it-help-desk-1.vercel.app/login
2. Open browser console (F12 or right-click → Inspect)
3. Look for these logs:
   ```
   🔗 API Base URL: https://your-backend.up.railway.app/api
   📦 VITE_API_URL: https://your-backend.up.railway.app/api
   ```

If you see `localhost` or `NOT SET`, the environment variable is not configured correctly.

## Common Mistakes

❌ **Wrong**: `VITE_API_URL=https://backend.up.railway.app` (missing `/api`)
✅ **Correct**: `VITE_API_URL=https://backend.up.railway.app/api`

❌ **Wrong**: `VITE_API_URL=https://backend.up.railway.app/api/` (trailing slash)
✅ **Correct**: `VITE_API_URL=https://backend.up.railway.app/api`

❌ **Wrong**: Setting variable but not redeploying
✅ **Correct**: Always redeploy after changing environment variables

❌ **Wrong**: Using `http://` instead of `https://`
✅ **Correct**: Always use `https://` for production

## Still Not Working?

1. **Check Railway Logs**: Railway → Deployments → Logs
   - Look for login attempts
   - Check for errors

2. **Check Vercel Logs**: Vercel → Deployments → Logs
   - Look for build errors
   - Check runtime errors

3. **Test API Directly**: Open this URL on mobile:
   ```
   https://your-backend.up.railway.app/api/stats
   ```
   Should return JSON (even if 401, confirms API is reachable)

4. **Check Network Tab**: On mobile browser (if dev tools available):
   - See what URL is being called
   - Check response status
   - Look for CORS errors

