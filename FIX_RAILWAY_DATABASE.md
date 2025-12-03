# 🚨 Fix Railway Backend Crash - DATABASE_URL Missing

## The Problem
Your Railway backend is crashing with:
```
Error: DATABASE_URL is not set in environment variables
```

## Root Cause
Railway needs a PostgreSQL database connected to your backend service. The `DATABASE_URL` is automatically set when you add a database, but it seems like:
1. No database was added, OR
2. The database isn't linked to your backend service

## ✅ Solution (5 Minutes)

### Step 1: Add PostgreSQL Database to Railway

1. **Go to your Railway project**: https://railway.com/project/ba992519-9d9f-40b5-ac41-0a4bcdc29ba6
2. **Click "+ New"** button (top right)
3. **Select "Database"** → **"Add PostgreSQL"**
4. Railway will automatically:
   - Create a PostgreSQL database
   - Set `DATABASE_URL` environment variable
   - Link it to your backend service

### Step 2: Verify DATABASE_URL is Set

1. **Click on your backend service** (not the database)
2. **Go to "Variables" tab**
3. **Look for `DATABASE_URL`** - it should be there automatically
4. If you see it, Railway has linked the database correctly ✅

### Step 3: If DATABASE_URL is Missing

If you added the database but don't see `DATABASE_URL`:

1. **Click on your PostgreSQL database service**
2. **Go to "Variables" tab**
3. **Copy the `DATABASE_URL`** value
4. **Go back to your backend service**
5. **Go to "Variables" tab**
6. **Click "Add Variable"**
7. **Set**:
   - **Name**: `DATABASE_URL`
   - **Value**: Paste the copied value
   - **Environment**: All environments
8. **Click "Save"**

### Step 4: Link Database to Backend (If Not Auto-Linked)

1. **Click on your PostgreSQL database service**
2. **Go to "Settings" tab**
3. **Look for "Connected Services"** or **"Service Connections"**
4. **Make sure your backend service is listed**
5. If not, Railway should auto-link, but you can manually connect them

### Step 5: Redeploy Backend

After setting `DATABASE_URL`:

1. **Go to your backend service**
2. **Go to "Deployments" tab**
3. **Click "..."** on latest deployment
4. **Click "Redeploy"**
5. **Wait** for deployment to complete

### Step 6: Run Database Migrations

After the backend starts successfully:

1. **Go to Deployments** → Latest deployment
2. **Click "Shell" tab** (or "View Logs" → "Shell")
3. **Run**:
   ```bash
   npx prisma migrate deploy
   ```
4. **Wait** for migrations to complete
5. **(Optional) Seed initial data**:
   ```bash
   npm run seed
   ```

### Step 7: Verify Backend is Running

1. **Check the logs** - should see: `Server running on http://localhost:4000`
2. **No more DATABASE_URL errors** ✅

## 🔍 Troubleshooting

### Database Already Exists?

If you already have a PostgreSQL database:

1. **Check if it's linked to your backend service**
2. **Go to backend service** → **Variables** → Look for `DATABASE_URL`
3. If missing, manually add it (see Step 3 above)

### Still Getting Errors?

1. **Check Railway logs**: Deployments → Latest → Logs
2. **Verify DATABASE_URL format**: Should start with `postgresql://`
3. **Test database connection**: Use Railway Shell to test:
   ```bash
   node -e "console.log(process.env.DATABASE_URL)"
   ```

### Database Connection Issues?

If backend starts but can't connect to database:

1. **Verify database is running**: Check database service status
2. **Check DATABASE_URL format**: Should be valid PostgreSQL connection string
3. **Run migrations**: `npx prisma migrate deploy`

## 📋 Checklist

- [ ] PostgreSQL database added to Railway project
- [ ] Database is linked to backend service
- [ ] `DATABASE_URL` appears in backend service variables
- [ ] Backend service redeployed
- [ ] Database migrations run (`npx prisma migrate deploy`)
- [ ] Backend logs show "Server running" (no errors)

## 🎯 Quick Test

Once backend is running:

1. **Get your Railway backend URL** (Settings → Networking)
2. **Test API**: `https://your-backend.up.railway.app/api/stats`
3. **Should return JSON** (even if error, means backend is working)

---

**After fixing this, continue with mobile login fix** - see `QUICK_FIX_MOBILE_LOGIN.md`

