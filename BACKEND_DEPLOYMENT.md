# 🚀 Backend Deployment Guide - Railway/Render

**Date:** December 6, 2025  
**Status:** Ready for Deployment

---

## 🎯 Quick Start - Deploy Backend in 5 Minutes

### Option 1: Railway (Recommended - Easiest)

#### Step 1: Connect GitHub
1. Go to https://railway.app
2. Click "New Project"
3. Click "Deploy from GitHub"
4. Select `swar-yoga-dec` repository
5. Click "Deploy"

#### Step 2: Configure Environment Variables
In Railway dashboard, add:

```env
MONGODB_URI=mongodb+srv://admin:Admin%40123@swaryogadb.dheqmu1.mongodb.net/swar-yoga-db
PORT=3001
NODE_ENV=production
```

#### Step 3: Deploy
Click "Deploy" and wait for the build to complete.

**Your backend will be live at:** `https://your-app.railway.app`

---

### Option 2: Render.com

#### Step 1: Create New Web Service
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub account
4. Select `swar-yoga-dec` repository
5. Choose `server` as the root directory

#### Step 2: Configure
```
Build Command: npm install
Start Command: npm start
```

#### Step 3: Add Environment Variables
```env
MONGODB_URI=mongodb+srv://admin:Admin%40123@swaryogadb.dheqmu1.mongodb.net/swar-yoga-db
PORT=3001
NODE_ENV=production
```

#### Step 4: Deploy
Click "Deploy" and wait for completion.

**Your backend will be live at:** `https://your-app.onrender.com`

---

## 🗄️ MongoDB Connection String

**Already Configured:**
```
mongodb+srv://admin:Admin%40123@swaryogadb.dheqmu1.mongodb.net/swar-yoga-db
```

**Database Name:** swar-yoga-db  
**Collections:** 13 (users, carts, checkouts, transactions, etc.)

---

## 🔑 Environment Variables for Backend

Add these to your Railway/Render dashboard:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://admin:Admin%40123@swaryogadb.dheqmu1.mongodb.net/swar-yoga-db

# Port
PORT=3001

# Environment
NODE_ENV=production

# Optional CORS
CORS_ORIGIN=https://your-frontend.vercel.app
```

---

## 📝 Backend Entry Point

The backend starts with:
```bash
cd server
npm start
```

Or with tsx:
```bash
cd server
npx tsx server.ts
```

---

## ✅ Verify Backend is Running

After deployment, test with:

```bash
# Test health endpoint
curl https://your-backend-url/api/admin-mongo/dashboard-stats

# Should return JSON with data
```

---

## 🔗 Update Frontend After Backend Deployment

### Step 1: Get Your Backend URL

**From Railway:**
- Go to your project
- Copy the URL from "Deployments"
- Example: `https://swar-yoga-apr2-production.up.railway.app`

**From Render:**
- Go to your service
- Copy the URL
- Example: `https://swar-yoga-backend.onrender.com`

### Step 2: Update Vercel Environment Variables

1. Go to Vercel Dashboard
2. Select your project (`swar-yoga-dec`)
3. Go to Settings → Environment Variables
4. Update/Add:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   VITE_API_BASE_URL=https://your-backend-url.railway.app/api
   ```
5. Click "Save"
6. Redeploy frontend: Click "Redeploy" button

---

## 🧪 Test After Deployment

### Test 1: Backend Health
```bash
curl https://your-backend.railway.app/api/admin-mongo/dashboard-stats
```
✅ Should return: `{"success": true, "data": {...}}`

### Test 2: Frontend Home Page
```
https://your-app.vercel.app
```
✅ Should load without errors

### Test 3: Frontend Route Navigation
```
https://your-app.vercel.app/visions
```
✅ Should work without 404

### Test 4: Page Refresh
```
1. Go to https://your-app.vercel.app/goals
2. Press F5 to refresh
```
✅ Should work (not 404)

### Test 5: API Call from Frontend
```
1. Open Browser DevTools (F12)
2. Go to Network tab
3. Navigate to any page
4. Check API calls are going to your backend
```
✅ Should see requests to your backend URL

---

## 📊 Deployment Sequence

```
1. Deploy Backend First
   ├─ Railway or Render
   ├─ Set MongoDB URI
   └─ Get backend URL
          ↓
2. Update Frontend Environment Variables
   ├─ Add backend URL to Vercel
   └─ Trigger redeploy
          ↓
3. Test Everything
   ├─ Test backend health
   ├─ Test frontend routes
   ├─ Test API calls
   └─ Test page refresh
```

---

## 🆘 Troubleshooting

### Backend Won't Deploy

**Check:**
1. ✅ `server/package.json` exists
2. ✅ `server/server.ts` is the entry point
3. ✅ All dependencies are in package.json
4. ✅ No TypeScript errors: Run `npm run build` locally

**Fix:**
```bash
cd server
npm install
npm run build
```

### Backend Deployed but Frontend Can't Connect

**Check:**
1. ✅ Backend URL is correct in Vercel env vars
2. ✅ Backend is actually running: `curl https://backend-url/api/admin-mongo/dashboard-stats`
3. ✅ CORS is enabled on backend (it should be)
4. ✅ No typos in environment variable names

**Fix:**
1. Redeploy frontend after updating env vars
2. Clear browser cache
3. Check Network tab in DevTools

### Getting 404 on Page Refresh

**This is Frontend Issue:**
1. ✅ Make sure `vercel.json` has rewrites
2. ✅ Redeploy frontend
3. ✅ Clear browser cache
4. ✅ Try incognito/private mode

---

## 📈 Monitoring & Logs

### Railway Logs
1. Go to your project
2. Click "Logs" tab
3. Watch real-time logs
4. Check for errors

### Render Logs
1. Go to your service
2. Click "Logs" in sidebar
3. View deployment and runtime logs

---

## 💾 Database Backups

MongoDB Atlas automatically backs up your data:
- **Automatic Backups:** Every 24 hours
- **Manual Backups:** Done already
- **Access:** MongoDB Atlas Dashboard → Backups tab

---

## 🎯 Final Checklist

### Backend Deployment
- [ ] Choose Railway or Render
- [ ] Connect GitHub account
- [ ] Add MONGODB_URI env var
- [ ] Deploy and get URL
- [ ] Test backend endpoint

### Frontend Deployment
- [ ] Add backend URL to Vercel env vars
- [ ] Trigger frontend redeploy
- [ ] Test home page
- [ ] Test navigation
- [ ] Test page refresh
- [ ] Test API calls

### Testing
- [ ] Backend health check
- [ ] Frontend loads
- [ ] Routes don't give 404
- [ ] API calls work
- [ ] Data displays correctly

---

## 🚀 Production URLs

After successful deployment:

**Frontend:** https://your-app.vercel.app  
**Backend:** https://your-backend.railway.app (or .onrender.com)  
**Database:** MongoDB Atlas (swaryogadb)  
**GitHub:** https://github.com/Turya-Kalburgi/swar-yoga-dec  

---

**Status:** ✅ Ready to Deploy  
**Timeline:** ~10 minutes total deployment time

