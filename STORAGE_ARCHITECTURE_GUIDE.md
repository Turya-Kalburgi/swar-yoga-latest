# Data Storage Architecture: Supabase vs MySQL vs MongoDB

## Overview

The system now has THREE data storage backends. Here's exactly which data goes where and how each handles it:

---

## 1. SUPABASE (Cloud - Production/Backup)
**Purpose:** Production backup, authentication, and archival

### What Goes to Supabase:
- ✅ **Admin workshop data** (read-only backup)
- ✅ **Admin contact form submissions** (backup)
- ✅ **User authentication records** (backup)
- ✅ **Signout backups** (archive)

### How It Handles It:
```
User Data Flow → Supabase:
├─ Before Production Deploy
├─ Scheduled Backups (daily)
├─ Manual Admin Exports
└─ Read-only Archive
```

### Current Implementation:
- Location: `server/supabaseClient.js`
- Used in: Admin backup system
- Frequency: Daily automated + on-demand

---

## 2. MYSQL (Server - Legacy/Admin System)
**Purpose:** Admin panel data storage and historical records

### What Goes to MySQL:
- ✅ **Admin account credentials** (encrypted)
- ✅ **Admin sign-in logs** (for security audit)
- ✅ **Admin sign-up data** (user registrations)
- ✅ **Contact form submissions** (archival)
- ✅ **Workshops (admin management)**
- ✅ **Historical data** (pre-MongoDB)

### How It Handles It:
```
Admin/Workshop Data Flow:
├─ Admin Login → Stored in MySQL
├─ Contact Forms → MySQL + Supabase Backup
├─ Workshop Management → MySQL (admin only)
└─ User Sign-ups → MySQL Log
```

### Current Implementation:
- Location: `server/mysqlAdmin.js`
- Used in: Admin system, backup management
- Tables: admins, signin_logs, signup_users, contact_messages, workshops

### Status:
⚠️ **Currently not connected** (MySQL server not running)
- Can be re-enabled if needed
- Falls back gracefully to MongoDB

---

## 3. MONGODB (Local/Server - PRIMARY User Data)
**Purpose:** Real-time user data, life planner, personal information

### What Goes to MongoDB:
- ✅ **Visions** (life planning)
- ✅ **Goals** (goal tracking)
- ✅ **Tasks** (task management)
- ✅ **Todos** (daily todos)
- ✅ **MyWords** (affirmations)
- ✅ **Health Tracker** (wellness data)
- ✅ **Reminders** (user reminders)
- ✅ **Daily Planner** (schedule)

### How It Handles It:
```
User Personal Data Flow:
├─ Sign In (userId generated)
├─ Create/Update/Read Data
│  ├─ MongoDB (primary - fast access)
│  ├─ localStorage (client-side cache)
│  └─ Sync on sign out
└─ Sign Out (data persisted in MongoDB)
```

### Current Implementation:
- Location: `server/models/*.js` (7 models)
- Routes: `server/routes/*.js` (6 routes)
- Connection: `server/config/db.js`
- Status: ✅ **ACTIVE and RUNNING** (mongodb://localhost:27017)
- Fallback: localStorage as cache

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     REACT FRONTEND                              │
│   (MyVision, MyGoals, MyTasks, MyTodos, MyWord, HealthTracker)  │
└──────────────┬──────────────────────────────────────────────────┘
               │
               ├─────────────────────────────────────────┐
               │                                         │
         PRIMARY FLOW                         FALLBACK (Offline)
         (MongoDB)                            (localStorage)
               │                                         │
      ┌────────▼────────┐                    ┌──────────▼────────┐
      │   Express API   │                    │  Browser Storage  │
      │  :3001/api      │                    │  (sadhaka_* keys) │
      │                 │                    │                   │
      │ ✅ ACTIVE       │                    │ ✅ Cache Layer    │
      └────────┬────────┘                    └──────────────────┘
               │
      ┌────────▼────────┐
      │   MONGOOSE      │
      │  (ORM Layer)    │
      └────────┬────────┘
               │
      ┌────────▼────────────────────┐
      │   MONGODB (Local)            │
      │   localhost:27017            │
      │   swar-yoga-db              │
      │                              │
      │   Collections:               │
      │   ├─ visions                │
      │   ├─ goals                  │
      │   ├─ tasks                  │
      │   ├─ todos                  │
      │   ├─ mywords                │
      │   ├─ healthtracker          │
      │   ├─ reminders              │
      │   └─ dailyplans             │
      │                              │
      │   ✅ PRIMARY DATA STORE      │
      └──────────────────────────────┘
```

---

## Request Routing by Data Type

### Life Planner Data (User Personal)
```
User → React → Express API → MongoDB → Response
├─ GET /api/visions/:userId      → MongoDB Vision collection
├─ POST /api/visions             → Create in MongoDB
├─ PUT /api/visions/:id          → Update in MongoDB
├─ DELETE /api/visions/:id       → Delete from MongoDB
└─ (Same for goals, tasks, todos, mywords, health)
```

### Admin Data (System/Workshop)
```
Admin → React → Express API → MySQL (fallback to localStorage)
├─ GET /api/admin/signin         → MySQL admin table
├─ POST /api/admin/backup        → MySQL archive
└─ GET /api/admin/workshops      → MySQL workshops table
```

### Supabase Data (Backup Only)
```
Not directly accessed by React
Used only for:
├─ Scheduled backups (cron job)
├─ Data archival
└─ Disaster recovery
```

---

## Component to Backend Mapping

| Component | Data Type | Primary Store | Fallback | Status |
|-----------|-----------|---------------|----------|--------|
| MyVision | Visions | MongoDB | localStorage | ✅ Ready |
| MyGoals | Goals | MongoDB | localStorage | ✅ Ready |
| MyTasks | Tasks | MongoDB | localStorage | ✅ Ready |
| MyTodos | Todos | MongoDB | localStorage | ✅ Ready |
| MyWord | MyWords | MongoDB | localStorage | ✅ Ready |
| HealthTracker | Health | MongoDB | localStorage | ✅ Ready |
| Dashboard | Admin | MongoDB | MySQL | ✅ Ready |
| AdminWorkshops | Workshops | MongoDB | MySQL | ✅ Ready |
| OrderHistory | Orders | MongoDB | localStorage | ⏳ Pending |

---

## Hybrid Mode (Current Implementation)

### How It Works:
1. **Try MongoDB First** - Fast, real-time, synced across devices
2. **Fall Back to localStorage** - If server is down or offline
3. **Auto-sync** - When server comes back online

### Code Example:
```typescript
// useHybridData hook (src/hooks/useHybridData.ts)

export const useHybridData = (dataType) => {
  const fetchData = async () => {
    try {
      // 1. Try MongoDB API
      const response = await mongodbService[`${dataType}Service`].getAll(userId);
      return response.data;
    } catch (error) {
      // 2. Fall back to localStorage
      const data = await legacyAPI[`${dataType}API`].getAll();
      return data;
    }
  };
};
```

---

## Data Persistence & Sync Strategy

### Sign-In Flow:
```
1. User enters email (e.g., john@example.com)
   ↓
2. Email normalized to lowercase: john@example.com
   ↓
3. userId generated: btoa(email).replace(/=/g, "").substring(0, 20)
   ↓
4. Load from MongoDB using userId
   ↓
5. Cache in localStorage under key: sadhaka_[type]_[userId]
   ↓
✅ Data visible in all components
```

### Sign-Out Flow:
```
1. User clicks Sign Out
   ↓
2. All data remains in MongoDB (server-side)
   ↓
3. localStorage cache cleared
   ↓
4. User logged out
   ↓
5. Sign back in → Reload from MongoDB
   ↓
✅ All data persists
```

### Cross-Device Sync:
```
Device A (Chrome)          Device B (Safari)
├─ Sign in                 ├─ Sign in (same email)
├─ Create task             │
├─ Save to MongoDB         ├─ MongoDB fetches ALL tasks
│                          └─ Shows including Device A's task
└─ Data in MongoDB ────────────────────────────→ Device B sees it
```

---

## Service Layer Architecture

### mongodbService.ts (src/services/mongodbService.ts)
```typescript
// Handles ALL MongoDB operations
export const visionService = {
  getAll: (userId) => API_GET(`/visions/${userId}`),
  create: (data) => API_POST(`/visions`, data),
  update: (id, data) => API_PUT(`/visions/${id}`, data),
  delete: (id) => API_DELETE(`/visions/${id}`)
};
// Same for: goalService, taskService, todoService, mywordService, healthService

// Batch operations
export const batchService = {
  getAllData: (userId) => Promise.all([
    visionService.getAll(userId),
    goalService.getAll(userId),
    taskService.getAll(userId),
    todoService.getAll(userId),
    mywordService.getAll(userId),
    healthService.getAll(userId)
  ])
};
```

### database.ts (src/utils/database.ts)
```typescript
// Legacy localStorage API (fallback)
export const visionAPI = {
  getAll: () => JSON.parse(localStorage.getItem('sadhaka_visions_...')),
  create: (data) => {...},
  update: (id, data) => {...},
  delete: (id) => {...}
};
```

---

## Server Architecture

### Port Configuration:
```
Frontend (Vite):  localhost:5173
├─ Requests to MongoDB API

MongoDB Server:   localhost:3001
├─ Express Server
├─ Mongoose ODM
└─ MongoDB Database (localhost:27017)

MySQL Server:     (offline)
├─ Admin system (fallback)
└─ Can be re-enabled anytime

Supabase:         Cloud (https://...)
├─ Backup only
└─ Manual/scheduled sync
```

---

## Environment Variables

### Frontend (.env.local)
```
# MongoDB API (Development)
VITE_API_URL=http://localhost:3001/api

# Supabase (Optional/Production)
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=...

# Feature Flags
VITE_ENABLE_MONGODB=true
VITE_ENABLE_SUPABASE=true
```

### Backend (server/.env)
```
# MongoDB
MONGODB_URI=mongodb://localhost:27017/swar-yoga-db

# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# MySQL (Optional)
MYSQL_HOST=localhost
MYSQL_USER=...
MYSQL_PASSWORD=...

# Supabase (Optional)
SUPABASE_URL=...
SUPABASE_KEY=...
```

---

## Which System to Use When?

### ✅ Use MongoDB For:
- User personal data (visions, goals, tasks)
- Real-time sync across devices
- Offline support (with fallback)
- User-specific queries
- Production deployment

### ✅ Use MySQL For:
- Admin credentials (currently offline)
- Security audit logs
- Historical admin actions
- Multi-tenant admin system

### ✅ Use Supabase For:
- Backup and archival
- Disaster recovery
- Analytics (future)
- Email notifications (future)

### ❌ Don't Mix:
- Don't use MySQL for user personal data → Use MongoDB
- Don't use Supabase for real-time operations → Use MongoDB
- Don't bypass service layer → Always use mongodbService

---

## Migration Status

### ✅ Completed:
- MongoDB installed and running
- All models created (Vision, Goal, Task, Todo, MyWord, HealthTracker)
- All routes created (CRUD operations)
- Service layer created (mongodbService.ts)
- Hybrid fallback implemented (useHybridData hook)
- Email normalization fix (Sign In/Sign Up)
- Entity linking (Task→Goal, Todo→Task, Word→Vision/Goal/Task)

### ⏳ Pending:
- Migrate components to use mongodbService
- Test cross-device persistence
- Enable MySQL (if needed for admin)
- Enable Supabase backups (if needed for production)

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│  WHICH SYSTEM HANDLES YOUR DATA?                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📝 Life Planner Data (Visions, Goals, Tasks, etc.)         │
│  └─ PRIMARY: MongoDB (localhost:27017)                     │
│     FALLBACK: localStorage                                  │
│                                                              │
│  👤 Admin Data (Workshop Management, Sign-ins)              │
│  └─ PRIMARY: MySQL (currently offline)                      │
│     FALLBACK: localStorage                                  │
│                                                              │
│  📊 Backup Data (Archival, Disaster Recovery)               │
│  └─ PRIMARY: Supabase (Cloud)                               │
│     FREQUENCY: Daily + on-demand                            │
│                                                              │
│  🔄 All Requests Route Through:                             │
│  └─ Express Server (localhost:3001)                         │
│     └─ Mongoose ORM                                         │
│        └─ Backend Database (MongoDB/MySQL)                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## How to Check What's Running

```bash
# Check MongoDB
mongosh --eval "db.version()"
# Output: 8.2.2 ✅

# Check Server
curl http://localhost:3001/
# Output: { message: 'Swar Yoga Backend API' } ✅

# Check React Frontend
# Open http://localhost:5173 in browser ✅

# Check Collections
mongosh
> use swar-yoga-db
> show collections
visions
goals
tasks
todos
mywords
healthtracker
```

---

## Troubleshooting

### Data Not Showing After Sign In?
```
❌ Check: MongoDB not running
✅ Solution: brew services start mongodb-community

❌ Check: Server not running
✅ Solution: cd server && npm start

❌ Check: Wrong email case
✅ Solution: Email normalized in Sign In/Sign Up (auto-fixed)
```

### Can't Create Tasks?
```
❌ Check: API not responding
✅ Solution: Verify port 3001 is running

❌ Check: userId not set
✅ Solution: Verify user logged in correctly

❌ Check: MongoDB collection doesn't exist
✅ Solution: Collections auto-created on first write
```

### Cross-Device Sync Not Working?
```
❌ Check: Using different email case
✅ Solution: Use same email (case-insensitive)

❌ Check: Offline mode
✅ Solution: Clear localStorage and sign in again

❌ Check: MongoDB down
✅ Solution: Check MongoDB service status
```

---

## Next Steps

1. ✅ **Migrate Components** - Update MyVision, MyGoals, etc. to use mongodbService
2. ⏳ **Test Cross-Device** - Verify data syncs between devices
3. ⏳ **Enable MySQL** - Set up MySQL for admin system (if needed)
4. ⏳ **Enable Supabase** - Configure automatic backups
5. ⏳ **Deploy to Production** - Move to cloud server
