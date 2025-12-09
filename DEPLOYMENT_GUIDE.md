# 🚀 PM2 Auto-Restart & Vercel Deployment Guide

## Quick Start

### Enable PM2 Auto-Restart Mode (Local)

```bash
chmod +x PM2_SETUP.sh
./PM2_SETUP.sh
```

This will:
✅ Install PM2 globally  
✅ Start all services with auto-restart enabled  
✅ Configure auto-start on system reboot  
✅ Display status and logs  

### Deploy to Vercel (Production)

```bash
chmod +x DEPLOY_TO_VERCEL.sh
./DEPLOY_TO_VERCEL.sh
```

This will:
✅ Check Vercel CLI is installed  
✅ Build project locally  
✅ Push changes to GitHub  
✅ Deploy to Vercel production  

---

## PM2 Auto-Restart Configuration

### What's Enabled:

**Backend (swar-backend):**
- ✅ Auto-restart on crash
- ✅ Max 15 restarts allowed
- ✅ Min 10 seconds uptime before counting restart
- ✅ Memory limit: 500MB (auto-restart if exceeded)
- ✅ Periodic restart: Every 1 hour (cron: `0 * * * *`)
- ✅ Auto-start on system reboot

**Frontend (swar-frontend):**
- ✅ Auto-restart on crash
- ✅ Max 15 restarts allowed
- ✅ Min 10 seconds uptime before counting restart
- ✅ Memory limit: 500MB (auto-restart if exceeded)
- ✅ Periodic restart: Every 30 minutes (cron: `*/30 * * * *`)
- ✅ Watch mode for config changes

### Manual PM2 Commands:

```bash
# Start all services
pm2 start ecosystem.config.cjs

# Stop all services
pm2 stop all

# Restart all services
pm2 restart all

# View live logs
pm2 logs

# View backend logs only
pm2 logs swar-backend

# View frontend logs only
pm2 logs swar-frontend

# Monitor CPU/Memory in real-time
pm2 monit

# Show service status
pm2 status

# Remove all services from PM2
pm2 delete all

# Disable auto-start on reboot
pm2 unstartup
```

---

## Vercel Deployment Configuration

### Current Settings in `vercel.json`:

```json
{
  "buildCommand": "npm ci && npm run build",
  "outputDirectory": "dist",
  "cleanUrls": false,
  "trailingSlash": false,
  "functions": {
    "api/[...path].js": { "maxDuration": 30 },
    "api/index.js": { "maxDuration": 30 }
  }
}
```

### Environment Variables (Set in Vercel Dashboard):

```
MONGODB_URI=mongodb+srv://[user]:[pass]@cluster.mongodb.net/swar-yoga-db
NODE_ENV=production
PORT=4000
```

### How to Set Environment Variables in Vercel:

1. Go to https://vercel.com/dashboard
2. Select your `swar-yoga-dec1` project
3. Click **Settings** → **Environment Variables**
4. Add each variable:
   - Key: `MONGODB_URI`
   - Value: Your MongoDB connection string
   - Environments: Production, Preview, Development
5. Click **Save**

### API Routes (Vercel Serverless):

- `/api/visions` → `api/index.js` (routes to backend)
- `/api/goals` → `api/[...path].js` (dynamic routing)
- All other `/api/*` endpoints → `api/[...path].js`

The Vercel API serverless functions proxy requests to your backend Express server.

---

## Verification Checklist

After deployment:

- [ ] Frontend loads at https://swar-yoga-dec1.vercel.app
- [ ] PM2 services running: `pm2 status`
- [ ] Backend logs clean: `pm2 logs swar-backend`
- [ ] Frontend logs clean: `pm2 logs swar-frontend`
- [ ] User can login
- [ ] Data persists after reload
- [ ] API requests include X-User-ID header
- [ ] No 404 errors in network tab
- [ ] MongoDB connection successful

---

## Troubleshooting

### PM2 Issues

**App keeps restarting:**
```bash
# Check logs for errors
pm2 logs swar-backend --err

# Increase max_restarts in ecosystem.config.cjs
# Increase min_uptime threshold
```

**Memory leak prevention:**
```bash
# Current: Periodic restart every hour (backend) / 30 min (frontend)
# To change: Edit ecosystem.config.cjs → cron_restart value
```

**Auto-start not working on reboot:**
```bash
# Restore startup service
pm2 startup launchd -u $(whoami) --hp /Users/$(whoami)
pm2 save

# Verify
pm2 unstartup  # This shows your current startup setup
```

### Vercel Deployment Issues

**Build fails:**
```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npm run lint

# Verify all required .env variables are set
```

**API not responding:**
- Check backend is running: `pm2 logs swar-backend`
- Verify MONGODB_URI in Vercel env vars
- Check API route in `api/[...path].js` properly proxies requests

**Data not persisting:**
- Verify X-User-ID header is sent: Check Network tab in DevTools
- Verify user ID is in localStorage after login
- Check MongoDB connection in backend logs

---

## Architecture

```
┌─────────────────────────┐
│   Vercel (Frontend)     │
│  https://swar-yoga...   │
│    - Serves React SPA   │
│    - /dist folder       │
└────────────┬────────────┘
             │
    API calls to /api/*
             │
             ↓
┌─────────────────────────┐
│  Vercel Serverless      │
│  (api/[...path].js)     │
│  - Routes to backend    │
└────────────┬────────────┘
             │
     (in production)
   Backend Express server
             │
             ↓
┌─────────────────────────┐
│  MongoDB Atlas          │
│  (Cloud Database)       │
└─────────────────────────┘
```

---

## Local Development vs Production

| Feature | Local | Production |
|---------|-------|-----------|
| Frontend | Vite dev server (5173) | Vercel CDN (swar-yoga-dec1.vercel.app) |
| Backend | Express (4000) | Vercel Serverless OR Cloud Server |
| Auto-restart | PM2 enabled | PM2 on cloud server OR Vercel auto-restarts |
| Logs | `pm2 logs` | Vercel Dashboard OR PM2 logs on cloud server |
| Database | MongoDB Atlas | MongoDB Atlas (same) |

---

## Next Steps

1. ✅ Run `./PM2_SETUP.sh` to enable auto-restart locally
2. ✅ Run `./DEPLOY_TO_VERCEL.sh` to deploy to production
3. ✅ Monitor `pm2 logs` for any issues
4. ✅ Test production URL: https://swar-yoga-dec1.vercel.app
5. ✅ Set up monitoring alerts (optional)

---

**Last Updated:** December 9, 2025  
**Status:** PM2 Auto-Restart Enabled + Vercel Deployment Ready
