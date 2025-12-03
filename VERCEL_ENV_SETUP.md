# Vercel Environment Variables Setup

## ⚠️ Important: Mobile Login Issue Fix

If you're getting "Invalid credentials" on mobile but it works on desktop, check:

### 1. Verify Environment Variable is Set

In Vercel Dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Verify `VITE_API_URL` is set correctly:
   ```
   VITE_API_URL=https://your-railway-backend.up.railway.app/api
   ```
3. Make sure there are **no trailing slashes**
4. Make sure it includes `/api` at the end

### 2. Redeploy After Setting Variables

After adding/changing environment variables:
1. Go to **Deployments**
2. Click **"Redeploy"** on the latest deployment
3. Or push a new commit to trigger redeploy

### 3. Check Mobile Browser Console

On mobile, open browser developer tools (if possible) or use remote debugging:
- Check Network tab to see what URL is being called
- Check Console for any errors
- Verify the API URL is correct

### 4. Common Issues

**Issue**: Environment variable not set
- **Fix**: Set `VITE_API_URL` in Vercel dashboard

**Issue**: Wrong API URL format
- **Wrong**: `https://backend.up.railway.app` (missing `/api`)
- **Correct**: `https://backend.up.railway.app/api`

**Issue**: CORS blocking mobile requests
- **Fix**: Add your Vercel URL to Railway backend `FRONTEND_URL`

**Issue**: Mobile browser caching old build
- **Fix**: Clear browser cache or use incognito mode

### 5. Debug Steps

Add this to your Login component temporarily to debug:

```typescript
console.log("API URL:", import.meta.env.VITE_API_URL);
console.log("Full API Base:", API.defaults.baseURL);
```

Check the console output on mobile to see what URL is being used.

### 6. Railway Backend CORS

Make sure your Railway backend has:

```env
FRONTEND_URL=https://it-help-desk-1.vercel.app
```

Or if you have multiple frontends:

```env
FRONTEND_URL=https://it-help-desk-1.vercel.app,https://your-other-domain.com
```

## Quick Fix Checklist

- [ ] `VITE_API_URL` is set in Vercel
- [ ] URL includes `/api` at the end
- [ ] No trailing slash
- [ ] Redeployed after setting variable
- [ ] Railway backend has `FRONTEND_URL` set
- [ ] Cleared mobile browser cache
- [ ] Tested in incognito/private mode

