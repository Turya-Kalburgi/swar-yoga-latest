# ✅ Auto-Restart Configuration Complete
**Date:** December 10, 2025  
**Status:** ACTIVE & VERIFIED

---

## 🔄 Configuration Summary

Both **Swar Yoga** services are now configured to **auto-restart every 10 minutes**:

### Backend Service (swar-backend)
- **Port:** 4000 (Express API)
- **Script:** `server/server.ts`
- **Restart Interval:** Every 10 minutes (`*/10 * * * *`)
- **Max Memory:** 500MB
- **Auto-start on reboot:** ✅ Enabled

### Frontend Service (swar-frontend)
- **Port:** 5173 (Vite Dev Server)
- **Restart Interval:** Every 10 minutes (`*/10 * * * *`)
- **Max Memory:** 500MB
- **Auto-start on reboot:** ✅ Enabled

---

## 📋 Configuration Changes Made

### 1. Updated `ecosystem.config.cjs`
```javascript
// Backend: changed from hourly (0 * * * *) to every 10 minutes
cron_restart: '*/10 * * * *'

// Frontend: changed from every 30 min (*/30 * * * *) to every 10 minutes
cron_restart: '*/10 * * * *'
```

### 2. PM2 Setup
✅ Started both services with PM2  
✅ Configured launchd for system startup  
✅ Saved process list to `~/.pm2/dump.pm2`

---

## 🔍 Current Status

```
pm2 list output (as of setup):
┌────┬──────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┐
│ id │ name             │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │
├────┼──────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┤
│ 0  │ swar-backend     │ default     │ 0.0.0   │ fork    │ 3399     │ 102s   │ 1    │ online    │
│ 1  │ swar-frontend    │ default     │ 0.0.0   │ fork    │ 3398     │ 102s   │ 1    │ online    │
└────┴──────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┘
```

---

## 🛠️ Useful PM2 Commands

### Monitor Services
```bash
pm2 list                 # View all services
pm2 monit               # Real-time monitoring dashboard
pm2 show swar-backend   # Backend details
pm2 show swar-frontend  # Frontend details
```

### View Logs
```bash
pm2 logs swar-backend   # Backend logs with timestamps
pm2 logs swar-frontend  # Frontend logs with timestamps
pm2 logs               # All logs
```

### Control Services
```bash
pm2 restart all        # Restart all services
pm2 stop all          # Stop all services
pm2 start all         # Start all services
pm2 delete all        # Remove all services from PM2
```

### Save/Restore Configuration
```bash
pm2 save              # Save current configuration
pm2 resurrect        # Restore last saved configuration
```

---

## 📍 Service URLs

- **Backend API:** `http://localhost:4000`
- **Frontend UI:** `http://localhost:5173`

---

## ⏰ Auto-Restart Schedule

| Time | Action |
|------|--------|
| 00:00, 00:10, 00:20, etc. | Restart both services |
| Every 10 minutes | Graceful restart |
| On max memory (500MB) | Restart immediately |
| On error | Auto-restart |

---

## 🔒 System Auto-Start (macOS)

Services will automatically start on system reboot via launchd:
- **Plist location:** `~/Library/LaunchAgents/pm2.mohankalburgi.plist`
- **Trigger:** System login
- **Service:** PM2 daemon resurrects saved process list

To disable auto-start:
```bash
pm2 unstartup launchd
```

---

## ✨ Benefits

1. **Memory Cleanup:** Prevents memory leaks with periodic restarts
2. **High Availability:** Auto-restart on crashes or errors
3. **Consistent Uptime:** Regular restarts keep services fresh
4. **System Persistence:** Survives system reboots
5. **Easy Monitoring:** PM2 dashboard for real-time status

---

**Setup completed and verified on:** December 10, 2025 at ~13:00 UTC
