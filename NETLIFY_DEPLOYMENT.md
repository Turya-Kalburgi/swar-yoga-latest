# 🚀 Netlify Deployment Guide - Swar Yoga Life Planner

**Status:** ✅ Production Ready  
**Last Updated:** December 6, 2025

---

## 📋 Pre-Deployment Checklist

- [x] Frontend built successfully with Vite
- [x] All dependencies installed
- [x] Environment variables configured
- [x] Backend API deployed (separate service)
- [x] MongoDB Atlas database connected
- [x] Git repository ready

---

## 🚀 Quick Deployment Steps

### Step 1: Prepare Backend API

Deploy your backend to **Railway.app**, **Render.com**, or **Heroku**:

```bash
# Backend should be running at a public URL like:
# https://swar-yoga-backend.railway.app
# https://swar-yoga-backend.onrender.com
```

### Step 2: Connect GitHub to Netlify

1. Go to [Netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Select GitHub and authorize
4. Choose repository: `swar-yoga-dec`
5. Branch: `main`
6. Click "Deploy site"

### Step 3: Configure Environment Variables

In Netlify Dashboard:

1. Go to **Site Settings** → **Build & Deploy** → **Environment**
2. Click **Add a variable**
3. Add these variables:

```
VITE_API_URL=https://your-backend-url.com
REACT_APP_API_URL=https://your-backend-url.com
```

### Step 4: Configure Build Settings

In Netlify Dashboard:

1. Go to **Site Settings** → **Build & Deploy** → **Build settings**
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Node version: `20`

### Step 5: Deploy

Netlify will automatically deploy when you:
- Push to `main` branch
- Or manually trigger deploy in dashboard

---

## 🔧 Common Issues & Solutions

### Issue 1: API Calls Returning 404

**Problem:** Frontend can't connect to backend API

**Solution:**
1. Check backend URL is correct in environment variables
2. Ensure backend CORS is configured:
   ```typescript
   app.use(cors({
     origin: 'https://your-netlify-site.netlify.app',
     credentials: true
   }));
   ```

### Issue 2: Blank Page / 404 on Routes

**Problem:** React Router routes return 404

**Solution:** 
- ✅ Already configured in `netlify.toml`
- Redirects all routes to `/index.html`
- Ensures SPA works correctly

### Issue 3: CSS/JS Files Not Loading

**Problem:** 404 errors for static assets

**Solution:**
- Ensure `vite.config.ts` has correct `build.outDir: 'dist'`
- Check `netlify.toml` has correct `publish = "dist"`
- Clear cache and retry deploy

### Issue 4: Slow Initial Load

**Problem:** Site takes long to load

**Solution:**
1. Enable Gzip compression (automatic on Netlify)
2. Minimize bundle size:
   ```bash
   npm run build
   # Check size with: ls -lh dist/
   ```

### Issue 5: Environment Variables Not Available

**Problem:** VITE_API_URL undefined in code

**Solution:**
1. Access in code with: `import.meta.env.VITE_API_URL`
2. Not `process.env.VITE_API_URL` (doesn't work in Vite)
3. Restart deploy after adding environment variables

---

## 📝 Netlify Configuration Files

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"
  node_version = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### .env.example
```env
VITE_API_URL=https://your-backend-url.com
REACT_APP_API_URL=https://your-backend-url.com
```

---

## 🔐 Security Configuration

### 1. CORS Setup on Backend

```typescript
// server/server.ts
const cors = require('cors');

app.use(cors({
  origin: [
    'https://your-netlify-site.netlify.app',
    'https://your-custom-domain.com',
    'http://localhost:5173' // Development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 2. Update Environment Variables

In Netlify Dashboard → Environment variables:

```
VITE_API_URL=https://your-backend-api-url.com
REACT_APP_API_URL=https://your-backend-api-url.com
```

### 3. Add Custom Domain (Optional)

1. Netlify Dashboard → **Domain Management**
2. Click **Add domain**
3. Configure DNS records
4. SSL certificate auto-generated

---

## 📊 Deployment Checklist

### Before Deployment
- [ ] Backend API deployed and running
- [ ] Backend CORS configured correctly
- [ ] Environment variables ready
- [ ] All code committed to GitHub
- [ ] Tests passing locally

### During Deployment
- [ ] GitHub connected to Netlify
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] Deploy triggered

### After Deployment
- [ ] Site loads without errors
- [ ] API calls working
- [ ] Navigation working
- [ ] Forms submitting correctly
- [ ] Database operations working
- [ ] Payment test (if applicable)

---

## 🧪 Testing on Netlify

### Test API Connection
```bash
# In browser console on live site
fetch('https://your-backend-url.com/api/admin-mongo/dashboard-stats')
  .then(r => r.json())
  .then(d => console.log('✅ Connected:', d))
  .catch(e => console.error('❌ Error:', e))
```

### Test Site Functionality
1. Register new user
2. Create vision/goal/task
3. Add workshop to cart
4. Checkout
5. View admin dashboard

---

## 🔍 Monitoring & Debugging

### View Build Logs
1. Netlify Dashboard → **Deploys**
2. Click latest deploy
3. See "Deploy log" tab

### View Site Analytics
1. Netlify Dashboard → **Analytics**
2. Monitor page views, builds, etc.

### Enable Function Logs
1. Dashboard → **Functions**
2. Click function name
3. View real-time logs

---

## 🚀 Production Optimization

### 1. Enable Caching
Already configured in `netlify.toml`:
```toml
[[headers]]
  for = "/dist/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 2. Enable Compression
Automatic on Netlify for:
- JavaScript files
- CSS files
- JSON responses
- API calls

### 3. Monitor Performance
```bash
# Build stats
npm run build
# Check size of dist/ folder
du -sh dist/
```

### 4. Enable Analytics (Optional)
In Netlify Dashboard:
1. **Site settings** → **Analytics**
2. Enable Netlify Analytics
3. View visitor data

---

## 📞 Support & Troubleshooting

### Netlify Support
- Dashboard: https://app.netlify.com
- Docs: https://docs.netlify.com
- Status: https://status.netlify.com

### Common Commands
```bash
# Build locally
npm run build

# Preview built site
npm run preview

# Check for errors
npm run lint
```

### Contact Information
- Repository: https://github.com/Turya-Kalburgi/swar-yoga-dec
- Issues: Use GitHub Issues tab
- Email: your-email@example.com

---

## ✅ Deployment Complete!

Your site is now live on Netlify at:
```
https://your-site-name.netlify.app
```

### What's Next?
1. Test all features
2. Monitor deployment
3. Set up domain name
4. Configure email notifications
5. Monitor analytics

---

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev)
- [Netlify Docs](https://docs.netlify.com)
- [React Router Guide](https://reactrouter.com)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

**Version:** 1.0.0  
**Last Updated:** December 6, 2025  
**Status:** ✅ PRODUCTION READY

