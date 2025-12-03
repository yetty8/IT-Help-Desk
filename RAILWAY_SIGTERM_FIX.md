# 🔧 Fix Railway SIGTERM Issue - Container Keeps Stopping

## The Problem
Railway keeps stopping your backend container with SIGTERM even though the server starts successfully.

## Root Causes

### 1. Health Check Failing (Most Likely)
Railway checks if your service is healthy. If the health check fails or times out, Railway stops the container.

### 2. Health Check Not Configured
Railway might not know where to check for health.

### 3. Service Not Responding Fast Enough
Health check might be timing out.

## ✅ Solutions

### Solution 1: Configure Health Check in Railway Dashboard

1. **Go to Railway**: https://railway.com/project/ba992519-9d9f-40b5-ac41-0a4bcdc29ba6
2. **Click on your backend service**
3. **Go to Settings** → **Health Check** (or **Networking** → **Health Check**)
4. **Set**:
   - **Path**: `/health`
   - **Timeout**: `10` seconds
   - **Interval**: `30` seconds
   - **Initial Delay**: `10` seconds (give server time to start)
5. **Save**

### Solution 2: Disable Health Check (Temporary)

If health check is causing issues:

1. **Railway Dashboard** → **Backend Service** → **Settings**
2. **Find "Health Check"** section
3. **Disable health check** (if option available)
4. **Save and redeploy**

### Solution 3: Check Railway Service Settings

1. **Railway Dashboard** → **Backend Service** → **Settings**
2. **Check**:
   - **Root Directory**: Should be `backend`
   - **Start Command**: Should be `npm start`
   - **Build Command**: Should be `npm install && npm run build && npx prisma generate`
3. **Look for any "Health" or "Health Check" settings**

### Solution 4: Verify Database Connection

If the server crashes on database connection:

1. **Check Railway logs** for database errors
2. **Verify** `DATABASE_URL` is set
3. **Make sure** PostgreSQL database is added and running

## 🔍 Debugging Steps

### Step 1: Check Railway Logs

1. **Railway** → **Backend Service** → **Deployments** → **Latest** → **Logs**
2. **Look for**:
   - Errors after "Server running"
   - Database connection errors
   - Health check failures

### Step 2: Test Health Endpoint Manually

Once you get your Railway URL:

1. **Test**: `https://your-railway-url.up.railway.app/health`
2. **Should return**: `{ "status": "ok", ... }`
3. **If it fails**: Health endpoint might not be working

### Step 3: Check Service Status

1. **Railway Dashboard** → **Backend Service**
2. **Check status**:
   - ✅ **Green/Running** = Good
   - ❌ **Red/Stopped** = Problem
   - ⚠️ **Yellow/Restarting** = Health check failing

## 📋 What I've Already Fixed

✅ Server binds to `0.0.0.0` (not localhost)
✅ Health endpoint at `/health`
✅ Root endpoint at `/`
✅ Process error handlers
✅ Graceful shutdown handlers
✅ Railway health check config in `railway.json`

## 🎯 Next Steps

1. **Check Railway Dashboard** for health check settings
2. **Configure health check** path and timeout
3. **Verify** database is connected
4. **Check logs** for any errors after startup

## ⚠️ If Still Not Working

Try this in Railway Dashboard:

1. **Settings** → **Networking**
2. **Disable "Public Domain"** temporarily
3. **Redeploy**
4. **Check if it stays running**
5. **Re-enable** public domain

Or:

1. **Settings** → **Deploy**
2. **Change "Restart Policy"** to `ON_FAILURE` (should already be set)
3. **Increase "Max Retries"** to 20
4. **Redeploy**

---

**The most common fix is configuring the health check path and timeout in Railway's dashboard settings.**

