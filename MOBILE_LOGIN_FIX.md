# Mobile Login Issue - Troubleshooting Guide

## Problem
Getting "Invalid credentials" error on mobile, but login works fine on desktop at https://it-help-desk-1.vercel.app/login

## Most Likely Causes

### 1. Environment Variable Not Set in Vercel ⚠️ MOST COMMON

**Check:**
1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Verify `VITE_API_URL` is set to: `https://your-railway-backend.up.railway.app/api`
3. Make sure it includes `/api` at the end
4. No trailing slash

**Fix:**
- Add the environment variable if missing
- **Redeploy** after adding/changing (Deployments → Redeploy)

### 2. Mobile Browser Caching Old Build

Mobile browsers cache aggressively. The old build might have `localhost` as the API URL.

**Fix:**
- Clear browser cache on mobile
- Use incognito/private mode
- Hard refresh: Close and reopen browser

### 3. CORS Not Allowing Mobile Requests

**Check Railway Backend:**
1. Go to Railway → Your Backend → **Variables**
2. Verify `FRONTEND_URL` includes your Vercel URL:
   ```
   FRONTEND_URL=https://it-help-desk-1.vercel.app
   ```

**Fix:**
- Add/update `FRONTEND_URL` in Railway
- Backend will auto-redeploy

### 4. Email/Password Input Issues on Mobile

Mobile keyboards can add extra spaces or change case.

**Fix Applied:**
- Code now trims email and password
- Converts email to lowercase
- Better error messages

### 5. Network Timeout on Mobile

Mobile networks can be slower.

**Fix Applied:**
- Increased API timeout to 30 seconds
- Better error handling for network issues

## Quick Fix Steps

### Step 1: Verify Vercel Environment Variable

```bash
# In Vercel Dashboard:
Settings → Environment Variables → Add:
VITE_API_URL=https://your-railway-backend.up.railway.app/api
```

### Step 2: Redeploy Vercel

After setting the variable:
- Go to **Deployments**
- Click **"Redeploy"** on latest deployment
- Or push a new commit

### Step 3: Verify Railway CORS

```bash
# In Railway Dashboard:
Variables → Add/Update:
FRONTEND_URL=https://it-help-desk-1.vercel.app
```

### Step 4: Test on Mobile

1. Clear browser cache
2. Use incognito mode
3. Try logging in again

## Debugging

### Check What URL is Being Used

Add this temporarily to Login.tsx (remove after debugging):

```typescript
useEffect(() => {
  console.log("API URL:", import.meta.env.VITE_API_URL);
  console.log("API Base:", API.defaults.baseURL);
}, []);
```

Then check mobile browser console (if accessible) or use remote debugging.

### Test API Connection

Visit this URL on mobile to test API:
```
https://your-railway-backend.up.railway.app/api/stats
```

Should return JSON data if API is accessible.

## Common Mistakes

❌ **Wrong**: `VITE_API_URL=https://backend.up.railway.app` (missing `/api`)
✅ **Correct**: `VITE_API_URL=https://backend.up.railway.app/api`

❌ **Wrong**: `VITE_API_URL=https://backend.up.railway.app/api/` (trailing slash)
✅ **Correct**: `VITE_API_URL=https://backend.up.railway.app/api`

❌ **Wrong**: Not redeploying after setting environment variable
✅ **Correct**: Always redeploy after changing environment variables

## Verification Checklist

- [ ] `VITE_API_URL` is set in Vercel
- [ ] URL includes `/api` at the end
- [ ] No trailing slash
- [ ] Redeployed Vercel after setting variable
- [ ] `FRONTEND_URL` is set in Railway
- [ ] Railway backend is running
- [ ] Cleared mobile browser cache
- [ ] Tested in incognito mode

## Still Not Working?

1. **Check Railway Logs**: Railway Dashboard → Deployments → Logs
   - Look for CORS errors
   - Look for authentication errors

2. **Check Vercel Logs**: Vercel Dashboard → Deployments → Logs
   - Look for build errors
   - Look for runtime errors

3. **Test API Directly**: Try calling the API endpoint directly from mobile browser
   ```
   https://your-backend.up.railway.app/api/auth/login
   ```
   (This will fail without credentials, but confirms API is reachable)

4. **Check Network Tab**: Use mobile browser dev tools to see:
   - What URL is being called
   - What error is returned
   - Response status code

## Code Changes Made

✅ Improved API URL handling
✅ Added email/password trimming (mobile keyboard fix)
✅ Better error messages
✅ Increased timeout for mobile networks
✅ Improved CORS configuration
✅ Better network error handling

