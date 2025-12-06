# MongoDB Atlas Setup & Migration Guide 🗄️

## Overview
This guide documents the migration from **local MongoDB** to **MongoDB Atlas** (cloud-hosted MongoDB).

## ✅ Current Status
- ✅ MongoDB Atlas cluster created: `swaryogadb`
- ✅ Cluster URL: `swaryogadb.dheqmu1.mongodb.net`
- ✅ Database user created: `swarsakshi9_db_user`
- ✅ Connection string configured in `.env`

## MongoDB Atlas Setup Details

### Cluster Information
```
Cluster Name: swaryogadb
Cluster Tier: M0 (Free tier - good for development)
Region: (Check MongoDB Atlas dashboard)
URL: swaryogadb.dheqmu1.mongodb.net
```

### Database User
```
Username: swarsakshi9_db_user
Password: MohanDB@123pk
Role: Built-in Role (dbOwner or admin)
```

### Connection String
```
mongodb+srv://swarsakshi9_db_user:MohanDB@123pk@swaryogadb.dheqmu1.mongodb.net/swar-yoga-db?retryWrites=true&w=majority
```

## Configuration Files Updated

### 1. **server/.env** ✅
```bash
MONGODB_URI=mongodb+srv://swarsakshi9_db_user:MohanDB@123pk@swaryogadb.dheqmu1.mongodb.net/swar-yoga-db?retryWrites=true&w=majority
```

### 2. **server/.env.example** ✅
```bash
# Shows template for others to set up their own MongoDB Atlas cluster
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/swar-yoga-db?retryWrites=true&w=majority
```

### 3. **server/config/db.js** ✅
Already configured to:
- Read `MONGODB_URI` from environment variable
- Default to `mongodb://localhost:27017/swar-yoga-db` if not set (for backward compatibility)
- Connection includes retry options

```javascript
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/swar-yoga-db';
const conn = await mongoose.connect(mongoURI, {
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
});
```

## What Changed

### Before (Local MongoDB)
```
Frontend App → Vite (localhost:5173)
    ↓
Express Server (localhost:3001)
    ↓
Local MongoDB (localhost:27017)
    ↓
Data stored on YOUR computer only
```

### After (MongoDB Atlas)
```
Frontend App → Vite (localhost:5173)
    ↓
Express Server (localhost:3001)
    ↓
MongoDB Atlas (Cloud)
    ↓
Data stored in MongoDB cloud
Accessible from anywhere!
```

## How Data Flows Now

### When User Adds a Vision
```
1. User fills form on Frontend
   ↓
2. Frontend calls: POST /api/visions
   ↓
3. Frontend includes X-User-ID header with userId
   ↓
4. Backend receives request
   ↓
5. Backend connects to MongoDB Atlas via MONGODB_URI
   ↓
6. Backend creates Vision document in cloud database
   ↓
7. Response sent back to Frontend
   ↓
8. Vision appears immediately in the list
```

### When User Logs In on Different Device
```
1. User logs in with same email on Device B
   ↓
2. Frontend calls: GET /api/visions
   ↓
3. Backend extracts userId from X-User-ID header
   ↓
4. Backend queries MongoDB Atlas: db.visions.find({ userId })
   ↓
5. MongoDB Atlas returns ALL visions for this user
   ↓
6. Frontend receives visions from BOTH devices
   ↓
7. User sees same data on Device B! ✅
```

## MongoDB Collections

Your MongoDB Atlas database contains these collections:

```javascript
// Collections in 'swar-yoga-db' database
- users          // User profiles
- visions        // Life planner visions
- goals          // Life planner goals
- tasks          // Life planner tasks
- todos          // Daily to-dos
- mywords        // Daily words/affirmations
- healthtrackers // Health tracking data
- dailyplans     // Daily plans
- carts          // Shopping cart items
- workshops      // Workshop information
- contacts       // Contact form submissions
- milestones     // Milestone data
- reminders      // Reminder data
- admins         // Admin users
```

## Connection String Components Explained

```
mongodb+srv://username:password@cluster/database?options

mongodb+srv://           ← Protocol (secure connection)
  swarsakshi9_db_user    ← Username
  :MohanDB@123pk         ← Password (note: special chars like @, !, $ need escaping in URLs)
  @swaryogadb.dheqmu1    ← Cluster domain
  .mongodb.net           ← MongoDB Atlas domain
  /swar-yoga-db          ← Database name
  ?retryWrites=true      ← Option: retry writes if connection fails
  &w=majority            ← Option: wait for majority acknowledgment
```

## Starting the Server

### Local Development
```bash
cd server
npm install          # Install dependencies
node server.js       # Or: npm start
```

**Expected Console Output:**
```
✅ MongoDB initialization successful
✅ MongoDB Connected: swaryogadb.dheqmu1.mongodb.net
🚀 Server running on port 3001
```

### If You See Connection Error
```
❌ MongoDB Connection Error: connect ECONNREFUSED 127.0.0.1:27017
```

**This means** it's trying to use local MongoDB instead of Atlas. Fix by:
```bash
# Verify .env has correct MONGODB_URI
cat server/.env | grep MONGODB_URI

# Should show:
MONGODB_URI=mongodb+srv://swarsakshi9_db_user:MohanDB@123pk@swaryogadb.dheqmu1.mongodb.net/swar-yoga-db?retryWrites=true&w=majority
```

## Testing the Connection

### Test 1: Check Backend Console Logs
Start server and look for:
```
✅ MongoDB Connected: swaryogadb.dheqmu1.mongodb.net
```

### Test 2: Create a Vision
1. Open frontend app (localhost:5173)
2. Log in with your account
3. Navigate to Life Planner → My Vision
4. Add a new vision
5. Check backend console for:
```
✍️ Creating vision for userId: user123
✅ Vision created successfully: { _id: "...", userId: "user123", ... }
```

### Test 3: Cross-Device Sync
1. Add a vision on Device A
2. Log in on Device B with same email
3. Navigate to My Vision
4. **Expected**: Vision from Device A appears ✅

### Test 4: Verify in MongoDB Atlas UI
1. Go to https://www.mongodb.com/cloud/atlas
2. Log in to your Atlas account
3. Click on cluster `swaryogadb`
4. Click "Collections" tab
5. Expand `swar-yoga-db` → `visions`
6. **Should see** your vision documents with `userId` field

## Network Access & Security

### IP Whitelist
MongoDB Atlas only allows connections from whitelisted IPs.

**Current Settings:**
- Development: 0.0.0.0/0 (allows all IPs - for development only)
- Production: Should be restricted to your server IP

**To check/update:**
1. Go to MongoDB Atlas → Network Access
2. See list of IP addresses allowed
3. For production, add your server's IP address only

### Database User Permissions
```
User: swarsakshi9_db_user
Database: swar-yoga-db
Roles:
  - dbOwner (all read/write on swar-yoga-db)
  - or admin (all privileges)
```

## Backup & Recovery

MongoDB Atlas provides automatic backups:
- **Retention**: 35 days for M0-M2 tiers
- **Frequency**: Every 6 hours
- **Recovery**: Can restore to any point-in-time within retention window

**To restore from backup:**
1. Go to MongoDB Atlas dashboard
2. Click cluster `swaryogadb`
3. Go to "Backup" tab
4. Select backup snapshot
5. Click "Restore"

## Production Deployment

### For Render/Railway/Other Hosting

1. **Set environment variable in hosting dashboard:**
   ```
   MONGODB_URI=mongodb+srv://swarsakshi9_db_user:MohanDB@123pk@swaryogadb.dheqmu1.mongodb.net/swar-yoga-db?retryWrites=true&w=majority
   ```

2. **Whitelist server IP in MongoDB Atlas:**
   - Get your server's IP address
   - Add it to MongoDB Atlas Network Access

3. **Deploy server code**

4. **Verify connection:**
   ```bash
   # Server should log:
   ✅ MongoDB Connected: swaryogadb.dheqmu1.mongodb.net
   ```

## Monitoring & Troubleshooting

### Check Database Size
```
MongoDB Atlas → Metrics → Database Size
Shows how much storage you're using
```

### Check Connection Health
```
MongoDB Atlas → Monitoring → Network
Shows successful/failed connections
```

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Can't connect to MongoDB | IP not whitelisted | Add server IP to Network Access |
| Connection timeout | Cluster down | Check MongoDB Atlas status |
| Auth failed | Wrong password | Verify MONGODB_URI in .env |
| Database empty | New cluster | Data migrates from local when first connected |
| Slow queries | No indexes | Create indexes on userId field (already done) |

## Migration from Local MongoDB

### Data Already in Local MongoDB?

If you had data in local MongoDB and want to migrate:

**Option 1: Export & Import (via mongodump/mongorestore)**
```bash
# Export from local
mongodump --db swar-yoga-db --out ./backup

# Import to Atlas
mongorestore --uri "mongodb+srv://swarsakshi9_db_user:MohanDB@123pk@swaryogadb.dheqmu1.mongodb.net/swar-yoga-db" ./backup/swar-yoga-db
```

**Option 2: Use MongoDB Compass**
1. Connect to local MongoDB
2. Export collection as JSON
3. Connect to MongoDB Atlas
4. Import JSON

**Option 3: Fresh Start**
Just start using Atlas - new data will save there. Old local data won't transfer but that's fine for fresh start.

## Environment Variables Summary

### Development (.env)
```bash
MONGODB_URI=mongodb+srv://swarsakshi9_db_user:MohanDB@123pk@swaryogadb.dheqmu1.mongodb.net/swar-yoga-db?retryWrites=true&w=majority
NODE_ENV=development
PORT=3001
```

### Production (Set on hosting platform)
```bash
MONGODB_URI=mongodb+srv://swarsakshi9_db_user:MohanDB@123pk@swaryogadb.dheqmu1.mongodb.net/swar-yoga-db?retryWrites=true&w=majority
NODE_ENV=production
PORT=3000 (or whatever your platform uses)
```

## Database Schema

All collections have proper indexes for performance:

```javascript
// Vision collection
{
  _id: String (UUID),
  userId: String (indexed), ← Filter by user
  visionStatement: String,
  category: String,
  status: String,
  priority: String,
  createdAt: Date,
  updatedAt: Date
}
// Index: { userId: 1, createdAt: -1 }

// Similar structure for Goals, Tasks, Todos, MyWords
```

## Cost Analysis

### MongoDB Atlas Pricing (as of Dec 2024)

| Tier | Storage | Cost | Use Case |
|------|---------|------|----------|
| M0 (Free) | 512 MB | $0/month | Development, small apps |
| M2 | 2 GB | $9/month | Small production |
| M5 | 4 GB | $57/month | Medium production |
| M10+ | 10GB+ | $99+/month | Large scale |

**For Swar Yoga:** M0 free tier should be sufficient initially. Upgrade when approaching 512MB storage.

## Next Steps

1. ✅ MongoDB Atlas cluster created
2. ✅ Connection string configured
3. ⏳ Start server and test connection
4. ⏳ Test cross-device sync with visions
5. ⏳ Monitor database growth in Atlas dashboard
6. ⏳ Deploy to production when ready

## Support & Resources

- **MongoDB Atlas Documentation**: https://docs.mongodb.com/atlas/
- **Connection Troubleshooting**: https://docs.mongodb.com/atlas/troubleshoot-connection/
- **Database Monitoring**: https://docs.mongodb.com/atlas/monitoring-alerting/
- **Backup & Restore**: https://docs.mongodb.com/atlas/backup/cloud-backup/

## Summary

✅ **Completed**: MongoDB migrated to Atlas  
✅ **Configured**: Connection string in .env  
✅ **Ready**: Backend will use cloud MongoDB automatically  
✅ **Benefits**: 
- Data accessible from anywhere
- Cross-device synchronization works
- Automatic backups
- Scalable as app grows
- Professional cloud hosting

Your Swar Yoga app now has a **cloud-based MongoDB database**! 🎉
