# 🔧 Registration Error Fix

## Problem
Users getting "Error registering" when trying to register on https://it-help-desk-1.vercel.app/register

## Root Cause
The backend `src/` directory was missing (files were deleted). Without backend source files, the API can't run, causing registration to fail.

## ✅ Fix Applied
1. **Restored backend files from git** - All backend source files have been restored
2. **Updated CORS configuration** - Added Vercel frontend URL to allowed origins

## Next Steps

### 1. Push Changes to GitHub
```bash
git add backend/src/
git commit -m "Restore backend source files and fix CORS"
git push origin main
```

### 2. Update Railway Environment Variables
Go to Railway → Your Backend Service → Variables and ensure:

```
FRONTEND_URL=https://it-help-desk-1.vercel.app
DATABASE_URL=<auto-set by Railway>
JWT_SECRET=<your-secret-key>
PORT=<auto-set by Railway>
```

### 3. Update Vercel Environment Variables
Go to Vercel → Your Project → Settings → Environment Variables:

```
VITE_API_URL=https://your-railway-backend-url.up.railway.app/api
```

Replace `your-railway-backend-url` with your actual Railway backend URL.

### 4. Redeploy
- Railway will auto-redeploy when you push to GitHub
- Vercel might need manual redeploy if you update env vars

### 5. Test Registration
1. Go to https://it-help-desk-1.vercel.app/register
2. Fill in the form
3. Check browser console for any errors
4. Check Railway logs if still failing

## Common Issues

### Still getting CORS errors?
- Make sure `FRONTEND_URL` is set in Railway to: `https://it-help-desk-1.vercel.app`
- Check Railway logs for CORS blocking messages

### Still getting network errors?
- Verify `VITE_API_URL` is set correctly in Vercel
- Make sure Railway backend is running (check `/health` endpoint)
- Check browser console for the actual API URL being used

### Database errors?
- Make sure PostgreSQL database is running in Railway
- Verify `DATABASE_URL` is set
- Check Railway logs for database connection errors

## Verification

1. **Check backend health:**
   ```
   https://your-railway-backend-url.up.railway.app/health
   ```
   Should return: `{"status":"ok","service":"IT Helpdesk API","ready":true}`

2. **Test registration endpoint:**
   Use Postman or curl to test:
   ```bash
   curl -X POST https://your-railway-backend-url.up.railway.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
   ```

