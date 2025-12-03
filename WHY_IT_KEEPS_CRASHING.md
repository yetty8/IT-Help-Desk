# 🚨 Why Railway Keeps Crashing

## The Answer: DATABASE_URL is Missing

Your backend **CANNOT start** without `DATABASE_URL`. This is a **hard requirement** - not optional.

The error message is clear:
```
Error: DATABASE_URL is not set. Add PostgreSQL database in Railway first!
```

## 🔍 What's Happening

1. Railway tries to start your backend
2. Backend code loads
3. Prisma client tries to connect to database
4. **No DATABASE_URL found** → Backend crashes
5. Railway restarts → Same thing happens again (crash loop)

## ✅ The Solution: Add PostgreSQL Database

You **MUST** add a PostgreSQL database to your Railway project. Here's exactly how:

### Step-by-Step (Do This Now)

#### 1. Go to Railway Dashboard
- Open: https://railway.com/project/ba992519-9d9f-40b5-ac41-0a4bcdc29ba6
- Make sure you're logged in

#### 2. Add PostgreSQL Database

**Look at your project dashboard. Do you see a PostgreSQL service?**

- ❌ **NO PostgreSQL service?** → Continue to Step 2A
- ✅ **YES, PostgreSQL exists?** → Skip to Step 3

**Step 2A: Create Database**
1. Click the **"+ New"** button (big blue button, top right)
2. A menu appears → Click **"Database"**
3. Click **"Add PostgreSQL"**
4. Wait 30-60 seconds for Railway to create it
5. You should see a new service appear (PostgreSQL icon)

#### 3. Verify DATABASE_URL is Set

1. **Click on your BACKEND service** (not the database)
2. **Click "Variables" tab** (left sidebar)
3. **Look for `DATABASE_URL`** in the list

**What you should see:**
- ✅ `DATABASE_URL` = `postgresql://postgres:...@...railway.app:5432/railway`
- ✅ `PORT` = `4000` (or similar)
- ⚠️ `JWT_SECRET` = (might be missing - add this too)

**If DATABASE_URL is there:**
- ✅ Good! Go to Step 4

**If DATABASE_URL is NOT there:**
- ❌ Problem! Go to "Manual Fix" below

#### 4. Redeploy Backend

1. **Go to "Deployments" tab**
2. **Click "..."** (three dots) on latest deployment
3. **Click "Redeploy"**
4. **Wait** 1-2 minutes

#### 5. Check Logs

After redeploy, check logs:
- ✅ `Server running on http://localhost:4000` = **SUCCESS!**
- ❌ `DATABASE_URL is not set` = Still missing (see Manual Fix)

## 🔧 Manual Fix (If DATABASE_URL Didn't Appear)

Sometimes Railway doesn't auto-link the database. Here's how to fix it:

### Option 1: Copy from Database Service

1. **Click on your PostgreSQL database service**
2. **Go to "Variables" tab**
3. **Find `DATABASE_URL`** - it will look like:
   ```
   postgresql://postgres:password@host.railway.app:5432/railway
   ```
4. **Click the copy icon** (or copy the value)
5. **Go back to your backend service**
6. **Go to "Variables" tab**
7. **Click "New Variable"** button
8. **Fill in**:
   - **Name**: `DATABASE_URL`
   - **Value**: Paste what you copied
   - **Environment**: Select all (Production, Preview, Development)
9. **Click "Add"**
10. **Redeploy** backend service

### Option 2: Check Service Connection

1. **Click on PostgreSQL database service**
2. **Go to "Settings" tab**
3. **Look for "Connected Services"** section
4. **Make sure your backend service is listed**
5. If not listed, Railway might need a redeploy to detect it

## 📋 Checklist

Before redeploying, verify:

- [ ] PostgreSQL database service exists in Railway project
- [ ] Database service is running (green status)
- [ ] `DATABASE_URL` appears in backend service variables
- [ ] `DATABASE_URL` value starts with `postgresql://`
- [ ] Backend service is ready to redeploy

## 🎯 Expected Result

After adding database and redeploying:

**Logs should show:**
```
✅ Server running on http://localhost:4000
✅ No DATABASE_URL errors
```

**NOT:**
```
❌ DATABASE_URL is not set
❌ Error: DATABASE_URL is not set
```

## ⚠️ Common Mistakes

1. **Adding database but forgetting to redeploy** → Must redeploy after adding database
2. **Database in different Railway project** → Must be in same project
3. **Copying wrong value** → Make sure it's `DATABASE_URL`, not `POSTGRES_URL` or similar
4. **Not waiting for database creation** → Wait 30-60 seconds after clicking "Add PostgreSQL"

## 🆘 Still Not Working?

If you've done everything above and it still crashes:

1. **Check Railway dashboard**:
   - Is PostgreSQL service visible?
   - Is it running (green status)?
   - Is it in the same project as backend?

2. **Check backend service variables**:
   - Go to backend service → Variables
   - Is `DATABASE_URL` there?
   - What's the value? (Should start with `postgresql://`)

3. **Try creating a fresh database**:
   - Delete old PostgreSQL service (if exists)
   - Create new one
   - Wait for it to fully create
   - Redeploy backend

4. **Check Railway logs**:
   - Look for any other errors
   - Check if database connection is being attempted

## 💡 Why This Happens

Railway needs to know where your database is. The `DATABASE_URL` tells your backend:
- Where the database is located
- How to connect to it
- What credentials to use

**Without this, your backend literally cannot function** - it's like trying to drive a car without gas.

---

## ✅ After It Works

Once backend starts successfully:

1. **Run migrations**: `npx prisma migrate deploy` (in Railway Shell)
2. **Get Railway URL**: Settings → Networking
3. **Set in Vercel**: Add `VITE_API_URL` environment variable
4. **Test**: Try logging in on mobile

---

**Bottom line: You MUST add a PostgreSQL database in Railway. There's no way around it.**

