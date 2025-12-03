# 🔧 Troubleshooting: "Failed to create ticket" Error

## Common Causes & Solutions

### 1. ⚠️ Backend Not Running (Most Likely)

**Symptom**: Network error or "Cannot reach backend"

**Check**:
1. Go to Railway: https://railway.com/project/ba992519-9d9f-40b5-ac41-0a4bcdc29ba6
2. Check if backend service is running (green status)
3. Check logs for `DATABASE_URL` errors

**Fix**:
- If backend is crashing: Add PostgreSQL database (see `URGENT_ADD_DATABASE.md`)
- If backend is stopped: Redeploy it

### 2. 🔗 API URL Not Set in Vercel

**Symptom**: Error shows "localhost" or "NOT SET" in error message

**Check**:
1. Go to Vercel: https://vercel.com/yetbareks-projects
2. Project → Settings → Environment Variables
3. Look for `VITE_API_URL`

**Fix**:
1. Get your Railway backend URL (Settings → Networking)
2. Set `VITE_API_URL` = `https://your-railway-url.up.railway.app/api`
3. Redeploy frontend

### 3. 🔐 Authentication Issue

**Symptom**: "You are not logged in" error

**Check**:
1. Open browser console (F12)
2. Check if token exists: `localStorage.getItem("token")`
3. Try logging out and logging back in

**Fix**:
- Log out and log back in
- Clear browser cache
- Check if backend JWT_SECRET is set

### 4. 🗄️ Database Not Migrated

**Symptom**: Server error (500) with database-related message

**Check**:
1. Railway → Backend service → Logs
2. Look for Prisma/database errors

**Fix**:
1. Railway → Deployments → Latest → Shell
2. Run: `npx prisma migrate deploy`
3. Redeploy backend

### 5. 📁 File Upload Issue

**Symptom**: Error only when uploading files

**Check**:
- File size (should be < 10MB)
- File type (images, PDFs, documents)

**Fix**:
- Try creating ticket without file first
- Check Railway logs for multer errors

## 🔍 How to Debug

### Step 1: Check Browser Console

1. Open browser console (F12)
2. Try creating a ticket
3. Look for error messages
4. Check the detailed error object

### Step 2: Check Network Tab

1. Open browser DevTools → Network tab
2. Try creating a ticket
3. Find the `/tickets` POST request
4. Check:
   - **Status**: Should be 200 (not 401, 500, etc.)
   - **Request URL**: Should be your Railway backend URL
   - **Request Headers**: Should include `Authorization: Bearer ...`
   - **Response**: Check error message

### Step 3: Check Railway Logs

1. Railway → Backend service → Deployments → Latest → Logs
2. Look for:
   - "Create ticket error:" messages
   - Database errors
   - Authentication errors

### Step 4: Test Backend Directly

Test if backend is reachable:
```
https://your-railway-url.up.railway.app/api/stats
```

Should return JSON (even if error, means backend is working).

## 📋 Quick Checklist

- [ ] Backend is running in Railway (green status)
- [ ] `DATABASE_URL` is set in Railway backend variables
- [ ] Database migrations have been run
- [ ] `VITE_API_URL` is set in Vercel
- [ ] Frontend has been redeployed after setting `VITE_API_URL`
- [ ] You are logged in (token exists in localStorage)
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows request reaching backend

## 🎯 Most Common Fix

**90% of the time**, the issue is:
1. Backend not running (DATABASE_URL missing)
2. API URL not set in Vercel

**Quick fix**:
1. Add PostgreSQL database in Railway
2. Set `VITE_API_URL` in Vercel
3. Redeploy both backend and frontend

## 💡 After Fixing

Once it works:
1. Test creating a ticket
2. Check browser console for any warnings
3. Verify ticket appears in ticket list

---

**Still having issues?** Check the detailed error message in the browser console - it now shows more information to help diagnose the problem.

