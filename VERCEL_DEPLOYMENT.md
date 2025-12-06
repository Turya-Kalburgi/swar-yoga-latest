# 🚀 Vercel Deployment Setup Guide

**Date:** December 6, 2025  
**Status:** ✅ Ready for Deployment

---

## 📋 Step-by-Step Deployment Instructions

### Step 1: Connect GitHub to Vercel ✅

1. Go to https://vercel.com
2. Click "New Project"
3. Click "Import Git Repository"
4. Search for `swar-yoga-dec`
5. Click "Import"

### Step 2: Configure Project Settings

**Framework Preset:** React  
**Build Command:** `npm run build`  
**Output Directory:** `dist`  
**Install Command:** `npm install`

### Step 3: Add Environment Variables

In Vercel Project Settings → Environment Variables, add:

```
VITE_API_URL=https://your-backend-api.vercel.app
VITE_API_BASE_URL=https://your-backend-api.vercel.app/api
REACT_APP_API_URL=https://your-backend-api.vercel.app
```

**Replace `your-backend-api.vercel.app` with your actual backend URL**

### Step 4: Deploy

Click "Deploy" and wait for the build to complete.

---

## 🔧 Fix 404 Errors on Page Refresh

### The Problem:
When you refresh a page that's not the home page (e.g., `/visions`), Vercel returns 404 because it's looking for a physical file instead of the React app.

### The Solution:

Your `vercel.json` already has the correct configuration:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**If you still get 404 errors:**

1. Make sure `vercel.json` is in the **root directory** (not in `src/`)
2. Redeploy: Click "Redeploy" in Vercel dashboard
3. Clear browser cache: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)

### What This Does:
- All routes are rewritten to serve `index.html`
- React Router takes over and handles routing in the browser
- No more 404 errors on page refresh ✅

---

## 📝 Your Repository Configuration

### vercel.json (Root Directory)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "react",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### public/_redirects (For Additional Routing)
```
/*    /index.html   200
```

### vite.config.ts (Build Configuration)
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
```

---

## 🌐 Backend API Configuration

### For Development:
```
http://localhost:3001
```

### For Production (Vercel):
```
https://your-backend-api.vercel.app
```

**Common Backend Hosting Options:**
- Railway.app
- Render.com
- Heroku (paid only now)
- AWS
- DigitalOcean
- Custom VPS

---

## ✅ Testing Your Deployment

### Test 1: Home Page
```
https://your-app.vercel.app/
✅ Should work
```

### Test 2: Route Navigation
```
https://your-app.vercel.app/visions
✅ Should work
```

### Test 3: Page Refresh
```
1. Go to https://your-app.vercel.app/visions
2. Press F5 or Cmd+R to refresh
✅ Should work (not 404)
```

### Test 4: API Calls
```
Check Network tab in browser DevTools
✅ API calls should go to your backend URL
```

---

## 🐛 Troubleshooting

### Problem: Still getting 404 on refresh
**Solution:**
1. Delete `.vercel` folder from local machine
2. Run `vercel --token YOUR_TOKEN` to redeploy
3. Wait for build to complete
4. Clear browser cache and try again

### Problem: API calls not working
**Solution:**
1. Check Environment Variables in Vercel dashboard
2. Make sure backend URL is correct
3. Check backend is running and accessible
4. Check CORS settings on backend

### Problem: Build fails
**Solution:**
1. Run `npm run build` locally to check for errors
2. Fix any TypeScript errors
3. Push to GitHub
4. Vercel will auto-redeploy

---

## 🚀 Automatic Deployments

### How It Works:

1. ✅ Connect GitHub repo to Vercel
2. ✅ Push code to GitHub (main branch)
3. ✅ Vercel automatically builds and deploys
4. ✅ Your site is live!

### View Deployments:

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Your Project:** https://vercel.com/projects/swar-yoga-dec
- **Live URL:** https://swar-yoga-dec.vercel.app (or your custom domain)

---

## 🔐 API Token Info

Your Vercel API token is set and can be used for:

```bash
# Deploy from CLI
vercel --token vck_2WxfLuUfHpDdfQj9RtGRVQthyFZAD8dlXtxtAiXI0UH7UGGUdN3gQIup

# Or set as environment variable
export VERCEL_TOKEN=vck_2WxfLuUfHpDdfQj9RtGRVQthyFZAD8dlXtxtAiXI0UH7UGGUdN3gQIup
vercel deploy
```

---

## 📊 Current System Ready for Deployment

```
Frontend:    React 18.3.1 ✅
Backend:     Node.js Express ⏳ (Needs deployment)
Database:    MongoDB Atlas ✅
Vercel:      Connected ✅
GitHub:      swar-yoga-dec ✅
```

---

## 🎯 Complete Checklist

- [x] Vercel account created
- [x] GitHub repository connected
- [x] API token generated
- [x] vercel.json configured
- [x] Environment variables ready
- [ ] Backend deployed (Railway/Render)
- [ ] Backend URL added to Vercel env vars
- [ ] Frontend deployed to Vercel
- [ ] Test home page navigation
- [ ] Test page refresh (no 404)
- [ ] Test API calls to backend

---

## 📞 Quick Commands

```bash
# Check if build works locally
npm run build

# Preview production build
npm run preview

# Deploy from CLI
vercel deploy --prod

# Check Vercel status
vercel status
```

---

**Status:** ✅ Ready to Deploy  
**Next Step:** Deploy backend first, then update Vercel env vars, then deploy frontend

