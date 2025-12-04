# Troubleshooting 500 Error on Register/Login

If you're getting a **500 error** when trying to register or login, it means the backend is running but can't connect to the database.

## Quick Diagnosis Steps

### Step 1: Check Railway Logs

1. Go to your Railway backend service: https://railway.com/project/ba992519-9d9f-40b5-ac41-0a4bcdc29ba6
2. Click on your backend service
3. Go to the **"Logs"** tab
4. Look for error messages when you try to register

Common errors you might see:
- `DATABASE_URL is not set` → Database not added
- `Can't reach database server` → Database not running
- `Authentication failed` → DATABASE_URL is incorrect
- `relation "User" does not exist` → Migrations not run

### Step 2: Verify Database is Added

1. In your Railway project, check if you see a **PostgreSQL** service
2. If you don't see one:
   - Click **"+ New"**
   - Select **"Database"** → **"Add PostgreSQL"**
   - Railway will automatically set `DATABASE_URL` for your backend

### Step 3: Check Environment Variables

1. Go to your backend service in Railway
2. Click **"Variables"** tab
3. Verify `DATABASE_URL` exists and is set automatically by Railway

### Step 4: Run Database Migrations

Once the database is added:

1. In Railway, go to your backend service
2. Click **"Deployments"** tab
3. Click **"..."** on the latest deployment
4. Click **"View Logs"**
5. Look for migration errors

Alternatively, run migrations manually:
- Connect to Railway CLI or use Railway's shell
- Run: `npx prisma migrate deploy`

### Step 5: Test Database Connection

Test if the backend can reach the database:

```bash
# In your browser, visit:
https://your-railway-backend.up.railway.app/health

# Should return:
{
  "status": "ok",
  "timestamp": "...",
  "uptime": 123
}
```

## Common Fixes

### Fix 1: Database Not Added
**Solution**: Add PostgreSQL database in Railway (see Step 2 above)

### Fix 2: DATABASE_URL Not Set
**Solution**: 
- Railway should auto-set this when you add PostgreSQL
- If missing, copy the `DATABASE_URL` from the PostgreSQL service's **"Variables"** tab
- Paste it into your backend service's **"Variables"** tab

### Fix 3: Migrations Not Run
**Solution**: 
- Database tables don't exist yet
- You need to run Prisma migrations
- See Step 4 above

### Fix 4: Database Service Stopped
**Solution**:
- Check if PostgreSQL service is running in Railway
- Restart it if needed

## Still Not Working?

1. **Check Railway backend logs** for the exact error message
2. **Share the error** from Railway logs (it will show the specific Prisma/database error code)
3. **Verify both services are running** (backend + PostgreSQL)

## Need More Help?

The error logs in Railway will show the exact issue. Look for:
- Prisma error codes (P1000, P1001, etc.)
- Database connection messages
- Migration errors

