# 🔧 Fix CORS Error and API URL Issue

## The Problem

You're getting two errors:

1. **Still using placeholder URL**: `your-railway-url.up.railway.app` (not your actual Railway URL)
2. **CORS error**: Backend not allowing requests from Vercel

## ✅ Fix 1: Update VITE_API_URL in Vercel

### Current (Wrong)
```
VITE_API_URL = https://it-help-desk-production.up.railway.app/
```

### Should Be
```
VITE_API_URL = https://it-help-desk-production.up.railway.app/api
```

**Steps:**
1. Vercel → Settings → Environment Variables
2. Edit `VITE_API_URL`
3. Change to: `https://it-help-desk-production.up.railway.app/api`
4. **Remove trailing slash**, **add `/api`**
5. Save
6. **Redeploy Vercel** (critical!)

## ✅ Fix 2: Set FRONTEND_URL in Railway

The backend needs to know to allow your Vercel domain.

### Step 1: Add Environment Variable in Railway

1. **Go to Railway**: https://railway.com/project/ba992519-9d9f-40b5-ac41-0a4bcdc29ba6
2. **Click on your backend service**
3. **Go to**: Variables tab
4. **Click**: "New Variable"
5. **Set**:
   - **Name**: `FRONTEND_URL`
   - **Value**: `https://it-help-desk-1.vercel.app`
   - **Environment**: All (Production, Preview, Development)
6. **Click**: "Add"

### Step 2: Redeploy Backend

1. **Go to**: Deployments tab
2. **Click**: "..." on latest deployment
3. **Click**: "Redeploy"
4. **Wait**: 1-2 minutes

## ✅ Fix 3: Verify CORS is Working

After both fixes:

1. **Check Railway logs** - should show CORS allowing requests
2. **Test from Vercel** - try creating a ticket
3. **Check browser console** - should not see CORS errors

## 📋 Complete Checklist

### Vercel:
- [ ] `VITE_API_URL` = `https://it-help-desk-production.up.railway.app/api` (no trailing slash, with `/api`)
- [ ] Variable is set for all environments
- [ ] Vercel has been redeployed after setting variable

### Railway:
- [ ] `FRONTEND_URL` = `https://it-help-desk-1.vercel.app` (set in backend service variables)
- [ ] Backend has been redeployed after setting variable
- [ ] Backend is running (green status)

## 🎯 Expected Result

After both fixes:
- ✅ No CORS errors
- ✅ API requests go to correct Railway URL
- ✅ Tickets can be created successfully

---

**The key is: Update VITE_API_URL to the actual Railway URL + `/api`, and set FRONTEND_URL in Railway!**

