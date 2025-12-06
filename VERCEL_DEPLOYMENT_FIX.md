# 🚀 Vercel Deployment Guide - Swar Yoga Life Planner

**Date:** December 6, 2025  
**Status:** ✅ Deployment Ready

---

## 🎯 Problem & Solution

### Issue: 404 NOT_FOUND on Page Refresh
**Problem:** When refreshing any page other than home (e.g., `/dashboard`, `/goals`), Vercel returns 404 error.

**Root Cause:** Single Page Application (SPA) routing issue - Vercel tries to find physical files instead of serving index.html for all routes.

**Solution:** Proper rewrites configuration in `vercel.json` + `_redirects` file

---

## ✅ Configuration Files (Updated)

### 1. `vercel.json` - Main Deployment Config
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    {
      "source": "/((?!api|_next|_static|\\.[a-z]+$).*)",
      "destination": "/index.html"
    }
  ]
}
```

**What it does:**
- `buildCommand`: Builds with Vite
- `outputDirectory`: Outputs to dist folder
- `cleanUrls`: Removes .html extensions from URLs
- `rewrites`: Routes all requests (except API calls) to index.html

### 2. `public/_redirects` - Redirect Rules
```plaintext
/* /index.html 200
```

**What it does:**
- Redirects all routes to index.html with 200 status (not a 301/302 redirect)
- This is picked up by Vercel's rewrite system

### 3. `.env.production` - Environment Variables
```
VITE_API_URL=https://swar-yoga-backend.onrender.com/api
VITE_PRODUCTION_API_URL=https://swar-yoga-backend.onrender.com/api
```

**Note:** Update `swar-yoga-backend.onrender.com` with your actual backend URL

---

## 📋 Deployment Checklist

### Before Deploying:
- [ ] Backend API is deployed and working
- [ ] Backend URL is correct in `.env.production`
- [ ] `vercel.json` has correct rewrites
- [ ] `public/_redirects` file exists
- [ ] All TypeScript compiles without errors
- [ ] Build command runs successfully: `npm run build`

### Step-by-Step Deployment:

#### 1. Update Backend URL
Edit `.env.production` with your actual backend URL:
```bash
VITE_API_URL=https://your-backend-url.com/api
```

#### 2. Commit Changes
```bash
git add vercel.json .env.production vite.config.ts
git commit -m "🚀 Fix Vercel SPA routing configuration"
git push origin main
```

#### 3. Deploy to Vercel
**Option A: From Vercel Dashboard**
1. Go to https://vercel.com
2. Import the GitHub repository
3. Click "Deploy"
4. Vercel will automatically:
   - Detect `vercel.json`
   - Run build command
   - Deploy to production

**Option B: Using Vercel CLI**
```bash
npm i -g vercel
vercel
# Follow prompts and deploy
```

#### 4. Verify Deployment
After deployment:
```bash
# Test different routes:
curl https://your-vercel-url.vercel.app/
curl https://your-vercel-url.vercel.app/dashboard
curl https://your-vercel-url.vercel.app/goals
curl https://your-vercel-url.vercel.app/admin
```

#### 5. Test in Browser
1. Go to your Vercel deployment URL
2. Click around all pages (don't use reload)
3. Now refresh each page - should work fine
4. Check browser console for any API errors

---

## 🔍 How the Routing Fix Works

### Before Fix (Broken):
```
User visits: https://yourdomain.com/dashboard
         ↓
Vercel looks for: /dist/dashboard (file not found)
         ↓
Error: 404 NOT_FOUND
```

### After Fix (Working):
```
User visits: https://yourdomain.com/dashboard
         ↓
vercel.json rewrites to: /index.html
         ↓
React app loads (index.html)
         ↓
React Router handles /dashboard route
         ↓
Correct page displays
```

---

## 🔗 API Integration

### API Calls Use Environment Variable:
```typescript
// src/services/mongodbService.ts
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';
```

### Automatic Environment Selection:
- **Development (local):** Uses `http://localhost:3001/api`
- **Production (Vercel):** Uses `VITE_API_URL` from `.env.production`

---

## 🚨 Common Issues & Fixes

### Issue 1: Still Getting 404 on Page Refresh
**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Verify `public/_redirects` file exists
3. Check `vercel.json` rewrites are correct
4. Trigger new deployment in Vercel dashboard

### Issue 2: API Calls Failing
**Solution:**
1. Verify backend URL in `.env.production`
2. Check backend is deployed and running
3. Verify CORS is enabled on backend
4. Check API endpoints are correct

### Issue 3: Blank Page After Deployment
**Solution:**
1. Check browser console for errors (F12)
2. Check Vercel build logs
3. Verify build command succeeded
4. Check all dependencies are installed

### Issue 4: Styling or Assets Not Loading
**Solution:**
1. Verify `dist` folder is generated
2. Check Vercel output directory is `dist`
3. Rebuild and redeploy
4. Clear Vercel cache and rebuild

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────────┐
│   GitHub Repository (main branch)   │
├─────────────────────────────────────┤
│  Frontend (React + TypeScript)      │
│  ├─ src/                            │
│  ├─ public/                         │
│  ├─ vercel.json ✅ (routing)        │
│  └─ .env.production ✅ (API URL)    │
└─────────────────────────────────────┘
             ↓ Push
┌─────────────────────────────────────┐
│   Vercel CI/CD Pipeline             │
├─────────────────────────────────────┤
│ 1. Detect vercel.json               │
│ 2. Run: npm run build               │
│ 3. Generate: dist/ folder           │
│ 4. Deploy to CDN                    │
└─────────────────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│   Production: yourdomain.vercel.app │
├─────────────────────────────────────┤
│ All routes → /index.html            │
│ React Router handles routing        │
│ API calls → Backend (Render)        │
└─────────────────────────────────────┘
```

---

## 🔐 Environment Variables on Vercel

### Set via Vercel Dashboard:
1. Go to your project → Settings → Environment Variables
2. Add these variables:

| Key | Value | Environment |
|-----|-------|-------------|
| VITE_API_URL | https://your-backend.onrender.com/api | Production |

### Automatic from `.env.production`:
All variables in `.env.production` are automatically used during build.

---

## ✨ Features After Deployment

✅ **All Routes Work:**
- Home page
- Dashboard
- Goals, Visions, Tasks, Todos
- Admin panel
- Checkout
- Any custom routes

✅ **Page Refresh Works:**
- No more 404 errors
- State persists across refreshes

✅ **API Integration:**
- Calls backend API correctly
- Environment-specific URLs

✅ **Performance:**
- CDN-served files (fast)
- Automatic caching headers
- Optimized React build

---

## 📝 Example Vercel Deployment URL

Once deployed, your site will be available at:
```
https://swar-yoga-dec.vercel.app
https://swar-yoga-dec-<branch>.vercel.app (preview deployments)
```

Add custom domain:
1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records (Vercel provides instructions)

---

## 🎯 Next Steps

1. **Verify Backend Deployment**
   - Make sure backend is deployed (Render, Railway, Heroku, etc.)
   - Get backend URL

2. **Update Configuration**
   - Add backend URL to `.env.production`
   - Commit changes

3. **Deploy**
   - Push to GitHub
   - Vercel auto-deploys

4. **Test**
   - Visit all pages
   - Refresh to confirm no 404s
   - Check console for API errors

---

## 📞 Support

**Vercel Documentation:**
- https://vercel.com/docs/frameworks/react
- https://vercel.com/docs/concepts/edge-config/redirects

**React Router Documentation:**
- https://reactrouter.com/en/main

**Common SPA Deployment Issues:**
- https://vercel.com/knowledge/how-do-i-enable-cors

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Home page loads at https://yourdomain.vercel.app
- [ ] Can navigate to /dashboard without errors
- [ ] Can refresh /dashboard and it loads (not 404)
- [ ] Can navigate to /goals and refresh (not 404)
- [ ] Can navigate to /admin and refresh (not 404)
- [ ] API calls work (no CORS errors)
- [ ] Console shows no errors
- [ ] Network tab shows successful API responses

---

**Status:** ✅ Ready for Production Deployment

**Version:** 1.0.0  
**Last Updated:** December 6, 2025

