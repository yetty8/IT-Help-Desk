# 🔧 Fix: Works on Localhost but Not on Vercel

## The Problem
- ✅ Works: `http://localhost:5174/`
- ❌ Fails: `https://it-help-desk-1.vercel.app/create`

## Root Cause (99% Certain)
**`VITE_API_URL` environment variable is NOT set in Vercel**, so the frontend is trying to connect to `localhost:4000/api` which doesn't exist in production.

## ✅ Solution

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

### Step 2: Set Environment Variable in Vercel

1. **Go to Vercel**: https://vercel.com/yetbareks-projects
2. **Click on project**: `it-help-desk-1`
3. **Go to**: Settings → Environment Variables
4. **Click**: "Add New" (or edit if it exists)
5. **Set**:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-railway-url.up.railway.app/api`
   - **Environment**: ✅ Production ✅ Preview ✅ Development (select all)
6. **Click**: "Save"

### Step 3: REDEPLOY (CRITICAL!)

**This is the most important step!**

1. **Go to**: Deployments tab
2. **Click**: "..." (three dots) on latest deployment
3. **Click**: "Redeploy"
4. **Wait**: 1-2 minutes for deployment to complete

### Step 4: Verify

After redeploying:

1. **Visit**: https://it-help-desk-1.vercel.app/create
2. **Open browser console** (F12)
3. **Look for**: `🔗 API Base URL: https://your-railway-url.up.railway.app/api`
4. **If you see**: `localhost:4000/api` → Environment variable wasn't set correctly

## 🔍 How to Verify It's Fixed

### Check Browser Console

1. Open https://it-help-desk-1.vercel.app/create
2. Open browser console (F12)
3. Look for these logs:
   ```
   🔗 API Base URL: https://your-railway-url.up.railway.app/api
   📦 VITE_API_URL: https://your-railway-url.up.railway.app/api
   ```

**If you see:**
- ✅ Railway URL = Good!
- ❌ `localhost:4000/api` or `NOT SET` = Environment variable not set

### Test Creating a Ticket

1. Try creating a ticket
2. Check browser console for errors
3. Check Network tab → Look for POST request to `/tickets`
4. Verify the request URL is your Railway backend, not localhost

## 🐛 Other Possible Issues

### Backend Not Running

If backend is still crashing:
1. Check Railway logs
2. Make sure PostgreSQL database is added
3. Make sure `DATABASE_URL` is set
4. Run migrations: `npx prisma migrate deploy`

### CORS Issues

If you see CORS errors:
1. Railway backend → Variables
2. Add: `FRONTEND_URL` = `https://it-help-desk-1.vercel.app`
3. Redeploy backend

### Authentication Issues

If you see 401 errors:
1. Try logging out and logging back in
2. Clear browser cache
3. Check if token is being sent (Network tab → Headers)

## 📋 Quick Checklist

- [ ] Railway backend is running (green status)
- [ ] PostgreSQL database is added
- [ ] `DATABASE_URL` is set in Railway
- [ ] Database migrations have been run
- [ ] Railway backend URL is known
- [ ] `VITE_API_URL` is set in Vercel (with `/api` at the end)
- [ ] Vercel frontend has been redeployed
- [ ] Browser console shows Railway URL (not localhost)

## ⚠️ Common Mistakes

❌ **Wrong**: `VITE_API_URL=https://backend.up.railway.app` (missing `/api`)
✅ **Correct**: `VITE_API_URL=https://backend.up.railway.app/api`

❌ **Wrong**: `VITE_API_URL=https://backend.up.railway.app/api/` (trailing slash)
✅ **Correct**: `VITE_API_URL=https://backend.up.railway.app/api`

❌ **Wrong**: Setting variable but not redeploying
✅ **Correct**: Always redeploy after changing environment variables

❌ **Wrong**: Using `http://` instead of `https://`
✅ **Correct**: Always use `https://` for production

## 🎯 Expected Result

After fixing:
- ✅ Browser console shows Railway API URL
- ✅ Network requests go to Railway backend
- ✅ Tickets can be created successfully
- ✅ No "Failed to create ticket" errors

---

**The fix is simple: Set `VITE_API_URL` in Vercel and redeploy!**

