# How to Find Your Railway Backend URL

## Step-by-Step Instructions

### Step 1: Log into Railway
1. Go to: https://railway.com
2. Click **"Login"** and sign in

### Step 2: Navigate to Your Service
1. Go to your project: https://railway.com/project/ba992519-9d9f-40b5-ac41-0a4bcdc29ba6
2. Click on your backend service

### Step 3: Find the Domain
You have **two options**:

#### Option A: From the Service Overview
1. Look at the top of the service page
2. You should see a section called **"Networking"** or **"Public Domain"**
3. There will be a URL like: `https://your-service-name.up.railway.app`
4. **Copy this URL**

#### Option B: From Settings
1. Click **"Settings"** tab (left sidebar)
2. Scroll down to **"Networking"** section
3. Look for **"Public Domain"** or **"Custom Domain"**
4. You'll see something like: `https://your-service-name.up.railway.app`
5. **Copy this URL**

### Step 4: Add `/api` to the End
Your Railway URL will look like:
```
https://your-service-name.up.railway.app
```

Add `/api` to make it:
```
https://your-service-name.up.railway.app/api
```

**Important**: 
- ✅ Include `https://`
- ✅ Include `/api` at the end
- ❌ No trailing slash after `/api`

### Step 5: Set in Vercel
1. Go to: https://vercel.com/yetbareks-projects
2. Click on project: **it-help-desk-1**
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"** (or edit if it exists)
5. Set:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-service-name.up.railway.app/api`
   - **Environment**: Select all (Production, Preview, Development)
6. Click **"Save"**

### Step 6: REDEPLOY (CRITICAL!)
1. Go to **Deployments** tab
2. Click **"..."** (three dots) on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete (usually 1-2 minutes)

### Step 7: Test
1. Visit: https://it-help-desk-1.vercel.app/login
2. Look at the yellow debug box
3. It should show: `API URL: https://your-service-name.up.railway.app/api`
4. If it shows `localhost` or `NOT SET`, the environment variable wasn't set correctly

## Example Railway URLs

Your Railway URL will typically look like one of these patterns:
- `https://backend-production.up.railway.app`
- `https://it-helpdesk-backend.up.railway.app`
- `https://backend-1234.up.railway.app`

Then add `/api`:
- `https://backend-production.up.railway.app/api`
- `https://it-helpdesk-backend.up.railway.app/api`
- `https://backend-1234.up.railway.app/api`

## Quick Test

Once you have the URL, test it directly in your browser:
```
https://your-railway-url.up.railway.app/api/stats
```

You should see JSON response (even if it's an error, that means the API is reachable).

## Still Can't Find It?

If you can't find the domain:
1. Make sure your Railway service is **deployed** (not just created)
2. Check if you have a **public domain** enabled
3. Railway might need you to generate a domain first:
   - Go to Settings → Networking
   - Click **"Generate Domain"** if available

