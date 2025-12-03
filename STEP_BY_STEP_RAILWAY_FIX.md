# 🚨 STEP-BY-STEP: Fix Railway DATABASE_URL Error

## ⚠️ CRITICAL: You MUST Add PostgreSQL Database First!

The backend **cannot start** without `DATABASE_URL`. This is **required** - not optional.

## 📋 Step-by-Step Instructions

### Step 1: Go to Your Railway Project

1. **Open**: https://railway.com/project/ba992519-9d9f-40b5-ac41-0a4bcdc29ba6
2. **Log in** if needed

### Step 2: Check if Database Exists

Look at your project dashboard. Do you see:
- ✅ A **PostgreSQL** service? → Go to Step 3
- ❌ **No database**? → Go to Step 2A

#### Step 2A: Add PostgreSQL Database

1. **Click the "+ New" button** (top right of the project)
2. **Click "Database"**
3. **Click "Add PostgreSQL"**
4. **Wait** for Railway to create it (takes ~30 seconds)
5. Railway will automatically:
   - Create the database
   - Set `DATABASE_URL` environment variable
   - Link it to your backend service

### Step 3: Verify Database is Linked

1. **Click on your backend service** (not the database)
2. **Go to "Variables" tab** (left sidebar)
3. **Look for `DATABASE_URL`** in the list

**If you see `DATABASE_URL`:**
- ✅ Database is linked correctly
- Go to Step 4

**If you DON'T see `DATABASE_URL`:**
- ❌ Database isn't linked
- Go to Step 3A

#### Step 3A: Manually Link Database

**Option 1: Copy from Database Service**
1. **Click on your PostgreSQL database service**
2. **Go to "Variables" tab**
3. **Find `DATABASE_URL`** - it will look like:
   ```
   postgresql://postgres:password@host:port/railway
   ```
4. **Copy the entire value**
5. **Go back to your backend service**
6. **Go to "Variables" tab**
7. **Click "New Variable"**
8. **Set**:
   - **Name**: `DATABASE_URL`
   - **Value**: Paste the copied value
   - **Environment**: All (Production, Preview, Development)
9. **Click "Add"**

**Option 2: Use Railway's Service Connection**
1. **Click on your PostgreSQL database service**
2. **Go to "Settings" tab**
3. **Look for "Connected Services"** section
4. **Make sure your backend service is listed**
5. If not, Railway should auto-link, but you may need to redeploy

### Step 4: Verify Variables are Set

In your **backend service** → **Variables** tab, you should see:

✅ **Required:**
- `DATABASE_URL` (should be set automatically)
- `JWT_SECRET` (you need to add this manually)

✅ **Optional but Recommended:**
- `FRONTEND_URL` (for CORS - set to your Vercel URL)

### Step 5: Add JWT_SECRET (If Missing)

1. **In backend service** → **Variables** tab
2. **Click "New Variable"**
3. **Set**:
   - **Name**: `JWT_SECRET`
   - **Value**: Generate a random string (see below)
   - **Environment**: All
4. **Click "Add"**

**Generate JWT_SECRET:**
- Use: `openssl rand -base64 32` (in terminal)
- Or use any long random string (at least 32 characters)

### Step 6: Redeploy Backend

1. **Go to "Deployments" tab**
2. **Click "..."** (three dots) on latest deployment
3. **Click "Redeploy"**
4. **Wait** for deployment (1-2 minutes)

### Step 7: Check Logs

After redeploy:

1. **Go to "Deployments"** → Latest deployment
2. **Click "Logs" tab**
3. **Look for**:
   - ✅ `Server running on http://localhost:4000` = Success!
   - ❌ `DATABASE_URL is not set` = Still missing, go back to Step 3

### Step 8: Run Database Migrations

Once backend starts successfully:

1. **Go to "Deployments"** → Latest deployment
2. **Click "Shell" tab**
3. **Run**:
   ```bash
   npx prisma migrate deploy
   ```
4. **Wait** for migrations to complete
5. **(Optional) Seed data**:
   ```bash
   npm run seed
   ```

## 🔍 Troubleshooting

### Still Getting DATABASE_URL Error?

1. **Double-check Variables**:
   - Backend service → Variables → Is `DATABASE_URL` there?
   - Is it enabled for the correct environment?

2. **Check Database Service**:
   - Is PostgreSQL service running?
   - Check its status in Railway dashboard

3. **Try Manual Copy**:
   - Copy `DATABASE_URL` from database service
   - Paste into backend service variables
   - Redeploy

### Database Service Not Showing?

- Make sure you're in the correct Railway project
- Check if database was created successfully
- Try creating a new PostgreSQL database

### Variables Not Saving?

- Make sure you're logged into Railway
- Check if you have permissions for the project
- Try refreshing the page

## ✅ Success Checklist

- [ ] PostgreSQL database added to Railway project
- [ ] Database service is visible in project dashboard
- [ ] `DATABASE_URL` appears in backend service variables
- [ ] `JWT_SECRET` is set (if needed)
- [ ] Backend service redeployed
- [ ] Logs show "Server running" (no errors)
- [ ] Database migrations run successfully

## 🎯 After Backend Works

Once backend is running:
1. Get Railway backend URL (Settings → Networking)
2. Set `VITE_API_URL` in Vercel
3. Redeploy frontend
4. Test mobile login

---

**Need help?** Check Railway documentation or their support.

