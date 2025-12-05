# 🔧 Railway Build Fix

## Problem
Railway is building from `backend` directory, so `cd ../frontend` fails.

## Solution: Change Railway Root Directory

**Go to Railway Dashboard:**
1. Railway → Your Service → **Settings**
2. Find **"Root Directory"** field
3. Change it to: **EMPTY** (or `/` for repo root)
4. **DO NOT** set it to `backend`
5. Save changes
6. Redeploy

## Alternative: If you can't change Root Directory

The `railway.json` at repo root should handle this automatically,
but Railway might be ignoring it if Root Directory is set in dashboard.

## Current Configuration
- `railway.json` exists at repo root ✅
- Build command: `cd backend && npm run build` ✅
- This should work IF Root Directory is repo root

