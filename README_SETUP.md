# 🚀 Quick Start Guide - Swar Yoga

## ✅ Everything is Working!

### Local Development

**Terminal 1 - Frontend**:
```bash
cd "/Users/mohankalburgi/Downloads/project 13"
npm run dev
# Opens http://localhost:5173
```

**Terminal 2 - Backend**:
```bash
cd "/Users/mohankalburgi/Downloads/project 13/server"
node server.js
# Runs on http://localhost:4000
```

---

## 🌐 URLs

| Component | URL | Status |
|-----------|-----|--------|
| **Dev Frontend** | http://localhost:5173 | ✅ Running |
| **Dev Backend** | http://localhost:4000 | ✅ Running |
| **Production Frontend** | https://swaryoga.com | ✅ Deployed |
| **Production Backend** | https://swar-yoga-dec.onrender.com | ✅ Deployed |
| **Database** | Supabase | ✅ Connected |

---

## 📝 Common Commands

### Build
```bash
npm run build
```

### Check Types
```bash
npm run dev  # TypeScript checks on file save
```

### Server Status
```bash
curl http://localhost:4000/
```

---

## 🔐 Credentials

### Location: `.env.local`
✅ Protected by `.gitignore` - Never committed to Git

### What's Inside:
- Supabase URL
- Frontend API Key (Anon)
- Backend API Key (Service Role)
- Backend URL

---

## 🧪 Testing

### Local Testing
```bash
# Test backend
curl http://localhost:4000/

# Test frontend dev
Open http://localhost:5173
Click around, check console for errors
```

### Production Testing
```bash
# Test deep routes (after Vercel deploys)
Visit https://swaryoga.com/workshops
Visit https://swaryoga.com/admin/dashboard
Hard refresh (Cmd+Shift+R on Mac)
Should NOT see 404 errors
```

---

## 📊 Project Structure

```
project 13/
├── src/                          # React Frontend
│   ├── components/               # React components
│   ├── pages/                    # Page components
│   └── utils/                    # Helper functions
│
├── server/                       # Node.js Backend
│   ├── server.js                 # Main server file
│   ├── routes/                   # API routes
│   └── supabaseClient.js          # Supabase connection
│
├── dist/                         # Built frontend (production)
├── .env.local                    # Secrets (⚠️ NOT in Git)
├── .env.local.example            # Template for setup
├── vercel.json                   # Vercel routing config
└── package.json                  # Dependencies
```

---

## 🔄 Deployment Flow

```
Local Changes → Git Push → Vercel Auto-Deploy
```

---

## ✨ Status

**Status**: ✅ All Systems Go! 🚀

Last Updated: December 5, 2025
