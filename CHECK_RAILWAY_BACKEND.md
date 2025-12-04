# 🔍 How to Check Your Railway Backend

## Step 1: Log into Railway

1. **Go to**: https://railway.com
2. **Click "Login"** and sign in
3. **Navigate to your project**: https://railway.com/project/ba992519-9d9f-40b5-ac41-0a4bcdc29ba6

## Step 2: Find Your Backend Service

1. **Click on your backend service** (the Node.js service)
2. You should see the service dashboard

## Step 3: Check Service Status

Look for:
- ✅ **Green status** = Service is running
- ❌ **Red status** = Service is stopped/crashed
- ⚠️ **Yellow status** = Service is restarting

## Step 4: Get Your Public Domain (Backend URL)

### Option A: From Service Overview
1. Look at the top of the service page
2. You should see a section showing the **Public Domain** or **URL**
3. It will look like: `https://backend-production-xxxx.up.railway.app`
4. **Copy this URL**

### Option B: From Settings
1. Click **"Settings"** tab (left sidebar)
2. Scroll down to **"Networking"** section
3. Look for **"Public Domain"** or **"Custom Domain"**
4. You'll see something like: `https://backend-production-xxxx.up.railway.app`
5. **Copy this URL**

### Option C: Generate Domain (If Not Visible)
1. **Settings** → **Networking**
2. Click **"Generate Domain"** (if available)
3. Wait for Railway to generate it
4. Copy the generated URL

## Step 5: Test Your Backend

Once you have the URL:

1. **Test health endpoint**: `https://your-railway-url.up.railway.app/health`
   - Should return: `{ "status": "ok", ... }`

2. **Test root endpoint**: `https://your-railway-url.up.railway.app/`
   - Should return: `{ "status": "ok", "service": "IT Helpdesk API", ... }`

3. **Test API endpoint**: `https://your-railway-url.up.railway.app/api/stats`
   - Should return JSON (even if error, means API is reachable)

## Step 6: Check Logs

1. **Go to**: **Deployments** tab
2. **Click on latest deployment**
3. **Click "Logs"** tab
4. **Look for**:
   - `✅ Server running on http://0.0.0.0:4000`
   - `✅ Health check available`
   - Any errors or warnings

## Step 7: Check Environment Variables

1. **Go to**: **Variables** tab
2. **Verify**:
   - ✅ `DATABASE_URL` is set (should be automatic from PostgreSQL)
   - ✅ `JWT_SECRET` is set (you need to add this)
   - ✅ `FRONTEND_URL` is set (optional, for CORS)

## Step 8: Check Database Connection

1. **Look for PostgreSQL service** in your Railway project
2. **Verify** it's running (green status)
3. **Check** if it's linked to your backend service

## 📋 Quick Checklist

- [ ] Logged into Railway
- [ ] Backend service is visible
- [ ] Service status is green (running)
- [ ] Public Domain is visible/generated
- [ ] Health endpoint works (`/health`)
- [ ] Logs show "Server running"
- [ ] `DATABASE_URL` is set in Variables
- [ ] PostgreSQL database is running

## 🎯 What You Need for Vercel

Once you have your Railway backend URL:

1. **Copy the URL**: `https://your-service-name.up.railway.app`
2. **Add `/api`**: `https://your-service-name.up.railway.app/api`
3. **Set in Vercel**: `VITE_API_URL` = `https://your-service-name.up.railway.app/api`
4. **Redeploy Vercel**

## 🐛 Common Issues

### No Public Domain Visible?
- Go to Settings → Networking
- Click "Generate Domain"
- Wait for Railway to create it

### Service Not Running?
- Check logs for errors
- Verify `DATABASE_URL` is set
- Make sure PostgreSQL is running

### Health Check Failing?
- Check if server is actually running
- Verify port is correct (should be 4000 or Railway's PORT)
- Check logs for startup errors

---

**After you get your Railway URL, update `VITE_API_URL` in Vercel with the actual URL (not the placeholder)!**

