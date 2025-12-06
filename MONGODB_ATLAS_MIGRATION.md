# MongoDB Atlas Migration Guide 🚀

## Current Status
- **Current Database**: Local MongoDB (`mongodb://localhost:27017/swar-yoga-db`)
- **Target Database**: MongoDB Atlas (Cloud-hosted)
- **Benefit**: No need to run MongoDB locally, automatic backups, scalability

## Step 1: Create MongoDB Atlas Account & Cluster

### 1.1 Sign Up / Log In
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" or sign in
3. Create account or log in

### 1.2 Create Organization (if needed)
1. Click "Create an organization"
2. Name: `Swar Yoga` (or your preference)
3. Click "Create Organization"

### 1.3 Create Project
1. Click "Create a project"
2. Project name: `Swar-Yoga` (matches your repo name)
3. Click "Create Project"

### 1.4 Create Cluster
1. Click "Create a deployment"
2. Select **"M0 (Free Tier)"** - This is free and perfect for development
3. Click "Create Deployment"

### 1.5 Configure Cluster Settings
```
Database Engine: MongoDB (latest version - 7.0+)
Cloud Provider: AWS (or your preference)
Region: us-east-1 (or closest to your users)
Tier: Free M0 (512 MB storage)
```

### 1.6 Wait for Cluster Creation
- Takes 2-3 minutes
- You'll see "Cluster is running" when ready

## Step 2: Create Database User

### 2.1 Create Admin User
1. Go to "Security" → "Database Access"
2. Click "Add New Database User"
3. Fill in:
   ```
   Username: admin
   Password: [Generate secure password - copy and save this!]
   Database User Privileges: Atlas admin
   ```
4. Click "Add User"

**Save these credentials securely!** You'll need them in the connection string.

### 2.2 Add IP Whitelist
1. Go to "Security" → "Network Access"
2. Click "Add IP Address"
3. Choose one of these options:
   - **Option A (Dev)**: Add `0.0.0.0/0` (allows all IPs - only for development!)
   - **Option B (Prod)**: Add your server's IP address
4. For Render deployment: Use `0.0.0.0/0` (Render IPs are dynamic)
5. Click "Confirm"

## Step 3: Get Connection String

### 3.1 View Connection String
1. Go to "Deployment" → "Database"
2. Click "Connect"
3. Choose "Drivers" tab
4. Select:
   - **Driver**: Node.js
   - **Version**: Latest (4.x or 5.x)

### 3.2 Copy Connection String
You'll see something like:
```
mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Important**: Replace `<password>` with your actual password!

### 3.3 Format Your Connection String
```
mongodb+srv://admin:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/swar-yoga-db?retryWrites=true&w=majority
```

Example:
```
mongodb+srv://admin:MySecure123Pass@cluster0.abc123.mongodb.net/swar-yoga-db?retryWrites=true&w=majority
```

## Step 4: Update Server Configuration

### 4.1 Update `.env` file
Edit `/server/.env`:

```properties
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/swar-yoga-db?retryWrites=true&w=majority
NODE_ENV=development
PORT=3001

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# JWT (if needed in future)
JWT_SECRET=your-secret-key-here
```

### 4.2 Update `.env.example` (for reference)
Edit `/server/.env.example`:

```properties
# MongoDB Atlas Configuration (for development/production)
# Get this from MongoDB Atlas console after creating cluster
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/swar-yoga-db?retryWrites=true&w=majority

# Local MongoDB (backup/offline option)
# MONGODB_URI=mongodb://localhost:27017/swar-yoga-db

NODE_ENV=development
PORT=3001

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# JWT Secret
JWT_SECRET=your-secret-key-here-min-32-characters
```

## Step 5: Update Database Configuration File

The `server/config/db.js` file already supports MongoDB Atlas! Just update the URI:

**Current (Works with both):**
```javascript
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/swar-yoga-db';
```

This will automatically use:
1. `MONGODB_URI` from `.env` (MongoDB Atlas)
2. Fallback to local MongoDB if not set

## Step 6: Test Connection Locally

### 6.1 Install Dependencies
```bash
cd "/Users/mohankalburgi/Downloads/project 13/server"
npm install
```

### 6.2 Start Server with Atlas
```bash
npm start
```

Expected output:
```
✅ MongoDB initialization successful
✅ MongoDB Connected: cluster0.abc123.mongodb.net
✨ Server running on port 3001
```

### 6.3 Verify Data Sync
1. Open frontend: http://localhost:5173
2. Log in with your email
3. Add a vision/goal
4. Check MongoDB Atlas console:
   - Go to "Deployment" → "Database"
   - Click "Browse Collections"
   - See your data in `swar-yoga-db`!

## Step 7: Migrate Existing Data (if any)

### 7.1 Export Local Data
```bash
# Start MongoDB locally
mongosh

# In MongoDB shell
use swar-yoga-db
db.visions.find().pretty()
db.goals.find().pretty()
```

### 7.2 Import to Atlas
```bash
# Export from local
mongoexport --uri "mongodb://localhost:27017/swar-yoga-db" \
  --collection visions \
  --out visions.json

mongoexport --uri "mongodb://localhost:27017/swar-yoga-db" \
  --collection goals \
  --out goals.json

# Import to Atlas
mongoimport --uri "mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/swar-yoga-db" \
  --collection visions \
  --file visions.json \
  --jsonArray

mongoimport --uri "mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/swar-yoga-db" \
  --collection goals \
  --file goals.json \
  --jsonArray
```

## Step 8: Deploy to Production (Render)

### 8.1 Update Environment Variables on Render
1. Go to your Render dashboard: https://dashboard.render.com
2. Find your service: `swar-yoga-backend` (or similar)
3. Go to "Environment"
4. Click "Edit Environment Variables"
5. Update or add:
   ```
   MONGODB_URI=mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/swar-yoga-db?retryWrites=true&w=majority
   ```
6. Click "Save"
7. Render will automatically redeploy

### 8.2 Verify Production Deployment
1. Check Render logs for connection success
2. Test the app: https://your-domain.com
3. Add a vision
4. Check MongoDB Atlas for the new data

## Troubleshooting

### Issue: "Authentication failed"
**Solution**: 
- Verify username and password in connection string
- Check if special characters in password are URL-encoded
- Example: `p@ssw0rd` → `p%40ssw0rd`

### Issue: "connect ECONNREFUSED"
**Cause**: IP not whitelisted
**Solution**:
1. Go to MongoDB Atlas → Security → Network Access
2. Add `0.0.0.0/0` for development
3. Add specific IP for production

### Issue: "Server Selection Timeout"
**Cause**: Network connectivity issue
**Solution**:
1. Verify internet connection
2. Check MongoDB Atlas cluster is running
3. Verify connection string format
4. Test with MongoDB Compass: https://www.mongodb.com/products/compass

### Issue: "Cannot connect locally after switching to Atlas"
**Solution**: Keep local MongoDB running for development
```bash
# macOS - Start MongoDB locally
brew services start mongodb-community

# Keep both available by using different env vars
```

## Comparison: Local vs Atlas

| Feature | Local MongoDB | MongoDB Atlas |
|---------|---------------|---------------|
| Setup | Manual install | Automatic |
| Maintenance | Manual | Automatic |
| Backup | Manual | Automatic daily |
| Scalability | Limited | Unlimited |
| Cost | Free | Free tier available |
| Monitoring | Limited | Advanced |
| Uptime | Dependent on machine | 99.99% SLA |
| Data Access | CLI only | Web console |
| Performance | Local machine | Optimized servers |

## Security Best Practices

### 1. Use Strong Passwords
✅ Generate secure password in MongoDB Atlas UI
✅ Use 16+ character passwords with mixed case, numbers, symbols

### 2. Whitelist IPs
✅ Production: Add only your server's IP
✅ Development: Can use `0.0.0.0/0` temporarily

### 3. Rotate Credentials Regularly
- Change database user password every 90 days
- Create backup users before rotating

### 4. Monitor Access
- Check MongoDB Atlas activity logs
- Set up alerts for unusual activity

### 5. Backup Strategy
- MongoDB Atlas: Automatic daily backups (free tier)
- Create manual snapshots before major changes
- Export critical data periodically

## Backup & Recovery

### 8.1 Automatic Backups (Atlas)
MongoDB Atlas automatically backs up all data:
1. Go to "Deployment" → "Backup"
2. See all automated backups
3. Click to download or restore

### 8.2 Manual Backup
```bash
# Export all databases
mongodump --uri "mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/swar-yoga-db" \
  --out ./backup/$(date +%Y%m%d)
```

### 8.3 Restore from Backup
1. Go to MongoDB Atlas → Backup
2. Click "Restore" on desired backup
3. Choose restore destination
4. Atlas will restore automatically

## Monitoring & Alerts

### 8.1 Monitor Cluster Health
1. Go to "Deployment" → "Database"
2. Check:
   - ✅ Cluster status (should be "Running")
   - ✅ Connections count
   - ✅ Storage usage
   - ✅ Network stats

### 8.2 Set Up Alerts
1. Go to "Alerts"
2. Create alerts for:
   - High connection count
   - Storage usage > 80%
   - Replication lag
   - Authentication failures

## Connection String Reference

### Format
```
mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER_URL]/[DATABASE]?[OPTIONS]
```

### Example
```
mongodb+srv://admin:myPassword123@cluster0.abc123xyz.mongodb.net/swar-yoga-db?retryWrites=true&w=majority
```

### Components
- `admin` = Database username
- `myPassword123` = Database password (URL-encode special chars)
- `cluster0.abc123xyz.mongodb.net` = Cluster connection string (from Atlas)
- `swar-yoga-db` = Database name
- `retryWrites=true` = Retry failed writes automatically
- `w=majority` = Wait for write acknowledgment from majority

## Testing Checklist

✅ Local development:
- [ ] Server starts without errors
- [ ] Can create visions/goals
- [ ] Data appears in MongoDB Atlas console
- [ ] Can view data on different device with same login
- [ ] Can update/delete data

✅ Production deployment:
- [ ] Environment variable set on Render
- [ ] Server deployed successfully
- [ ] App accessible at domain
- [ ] Can create/view/update data
- [ ] Monitoring shows healthy status

## Summary

**Before Migration**:
- Local MongoDB only
- Data lost on machine restart
- Not accessible remotely
- Manual maintenance required

**After Migration** ✅:
- MongoDB Atlas cloud database
- Automatic backups and redundancy
- Accessible from anywhere
- Automatic monitoring and alerts
- Enterprise-grade reliability
- Free tier available for development

**Next Steps**:
1. Create MongoDB Atlas account
2. Set up cluster (M0 free tier)
3. Create database user
4. Get connection string
5. Update `.env` file
6. Test locally
7. Deploy to production
8. Verify data syncing

Your app is now ready for production with MongoDB Atlas! 🎉
