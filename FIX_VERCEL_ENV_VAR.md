# 🔧 Fix Vercel Environment Variable

## Current (Wrong)
```
VITE_API_URL = https://it-help-desk-production.up.railway.app/
```

## Issues:
1. ❌ Missing `/api` at the end
2. ❌ Has trailing slash `/` (should be removed)

## Correct Value
```
VITE_API_URL = https://it-help-desk-production.up.railway.app/api
```

## ✅ How to Fix

### Step 1: Edit the Variable

1. **Go to Vercel**: https://vercel.com/yetbareks-projects
2. **Click on project**: `it-help-desk-1`
3. **Go to**: Settings → Environment Variables
4. **Find**: `VITE_API_URL`
5. **Click**: Edit (or the three dots → Edit)

### Step 2: Update the Value

**Change from:**
```
https://it-help-desk-production.up.railway.app/
```

**Change to:**
```
https://it-help-desk-production.up.railway.app/api
```

**Important:**
- ✅ Remove the trailing slash `/`
- ✅ Add `/api` at the end
- ✅ No trailing slash after `/api`

### Step 3: Save

1. **Click**: "Save" or "Update"
2. **Verify**: All environments are selected (Production, Preview, Development)

### Step 4: REDEPLOY (CRITICAL!)

1. **Go to**: Deployments tab
2. **Click**: "..." on latest deployment
3. **Click**: "Redeploy"
4. **Wait**: 1-2 minutes for deployment

### Step 5: Verify

After redeploying:

1. **Visit**: https://it-help-desk-1.vercel.app/create
2. **Look at the yellow debug box**
3. **Should show**: `https://it-help-desk-production.up.railway.app/api`
4. **Should NOT show**: `localhost:4000/api` or the old URL with trailing slash

## ✅ Correct Format

```
https://it-help-desk-production.up.railway.app/api
```

**Breakdown:**
- `https://` - Protocol
- `it-help-desk-production.up.railway.app` - Your Railway domain
- `/api` - API path (no trailing slash)

## ❌ Common Mistakes

❌ **Wrong**: `https://it-help-desk-production.up.railway.app/` (missing `/api`, has trailing slash)
✅ **Correct**: `https://it-help-desk-production.up.railway.app/api`

❌ **Wrong**: `https://it-help-desk-production.up.railway.app/api/` (trailing slash after `/api`)
✅ **Correct**: `https://it-help-desk-production.up.railway.app/api`

❌ **Wrong**: `http://it-help-desk-production.up.railway.app/api` (using `http` instead of `https`)
✅ **Correct**: `https://it-help-desk-production.up.railway.app/api`

---

**After fixing and redeploying, ticket creation should work!**

