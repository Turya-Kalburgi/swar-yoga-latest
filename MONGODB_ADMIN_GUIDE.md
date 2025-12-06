# 📊 MongoDB Atlas Admin Dashboard Guide

## How to See All Your Data in MongoDB Atlas

### 🔗 Step 1: Access MongoDB Atlas

1. **Open MongoDB Atlas**: https://cloud.mongodb.com
2. **Sign in** with your MongoDB account
3. **Click "Deployment"** on the left sidebar
4. **Find cluster**: `swaryogadb`
5. **Click "Browse Collections"** button

---

## 📦 Data Collections You'll See

### 1. **USERS Collection**
Stores all registered user accounts

```json
{
  "_id": ObjectId("..."),
  "email": "swarsakshi9@gmail.com",
  "name": "Sakshi",
  "phone": "+1-234-567-8900",
  "password": "(hashed-for-security)",
  "country": "India",
  "state": "Karnataka",
  "gender": "Female",
  "age": 25,
  "profession": "Engineer",
  "createdAt": "2025-12-06T09:15:30.000Z",
  "updatedAt": "2025-12-06T09:15:30.000Z"
}
```

**What to see**: Total signup users count
**Query in MongoDB**: `db.users.countDocuments({})`

---

### 2. **SIGNUPDATA Collection**
Records every user registration with details

```json
{
  "_id": ObjectId("..."),
  "email": "newuser@example.com",
  "name": "John Doe",
  "phone": "+1-234-567-8900",
  "country": "USA",
  "state": "California",
  "gender": "Male",
  "age": 30,
  "profession": "Developer",
  "source": "signup",
  "timestamp": "2025-12-06T10:30:00.000Z"
}
```

**What to see**: Total signups, when people signed up
**Query in MongoDB**: `db.signupdata.countDocuments({})`
**Advanced**: `db.signupdata.aggregate([{$group: {_id: "$country", count: {$sum: 1}}}])`

---

### 3. **SIGNINDATA Collection**
Records every user login with device/IP info

```json
{
  "_id": ObjectId("..."),
  "email": "swarsakshi9@gmail.com",
  "name": "Sakshi",
  "success": true,
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "device": "desktop",
  "timestamp": "2025-12-06T14:45:20.000Z"
}
```

**What to see**: Total logins, user activity
**Query in MongoDB**: `db.signindata.countDocuments({})`
**Get logins for specific user**: `db.signindata.find({email: "swarsakshi9@gmail.com"})`

---

### 4. **CONTACTS Collection**
Contact form submissions from users

```json
{
  "_id": ObjectId("..."),
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-234-567-8900",
  "subject": "Support Request",
  "message": "I have a question about...",
  "status": "new",
  "createdAt": "2025-12-06T15:30:00.000Z",
  "updatedAt": "2025-12-06T15:30:00.000Z"
}
```

**What to see**: Total contact submissions
**Query in MongoDB**: `db.contacts.countDocuments({})`

---

## 👤 User Data Collections (Per User)

These collections store **user-specific data** with `userId` field:

### 5. **VISIONS Collection**
User's visions/dreams

```json
{
  "_id": ObjectId("..."),
  "userId": "swarsakshi9@gmail.com",
  "title": "Learn Yoga",
  "description": "Master all yoga poses",
  "priority": "High",
  "status": "In Progress",
  "createdAt": "2025-12-06T09:00:00.000Z"
}
```

**Query for user**: `db.visions.find({userId: "swarsakshi9@gmail.com"})`

### 6. **GOALS Collection**
User's personal goals

```json
{
  "_id": ObjectId("..."),
  "userId": "swarsakshi9@gmail.com",
  "title": "Achieve Inner Peace",
  "priority": "Medium",
  "status": "Not Started"
}
```

### 7. **TASKS Collection**
Work/project tasks

### 8. **TODOS Collection**
Daily to-do items

### 9. **HEALTH Collection**
Health tracking data (steps, weight, sleep, etc.)

### 10. **REMINDERS Collection**
User reminders and notifications

### 11. **DAILYPLANS Collection**
Daily planning data

### 12. **MILESTONES Collection**
Major achievements/milestones

---

## 📊 Quick Stats Dashboard

### View All Statistics:

```
Total Users:
  db.users.countDocuments({})

Total Signups:
  db.signupdata.countDocuments({})

Total Login Events:
  db.signindata.countDocuments({})

Total Contact Submissions:
  db.contacts.countDocuments({})

Total Visions (all users):
  db.visions.countDocuments({})

Total Goals (all users):
  db.goals.countDocuments({})

Total Todos (all users):
  db.todos.countDocuments({})

Signups by Country:
  db.signupdata.aggregate([{$group: {_id: "$country", count: {$sum: 1}}}])

Logins by Date:
  db.signindata.aggregate([{$group: {_id: {$dateToString: {format: "%Y-%m-%d", date: "$timestamp"}}, count: {$sum: 1}}}])
```

---

## 🎯 Queries for Admin Dashboard

### Get specific user:
```
db.users.findOne({email: "swarsakshi9@gmail.com"})
```

### Get all data for a specific user:
```
db.visions.find({userId: "swarsakshi9@gmail.com"})
db.goals.find({userId: "swarsakshi9@gmail.com"})
db.todos.find({userId: "swarsakshi9@gmail.com"})
db.health.find({userId: "swarsakshi9@gmail.com"})
```

### Get recent logins:
```
db.signindata.find().sort({timestamp: -1}).limit(10)
```

### Get unread contacts:
```
db.contacts.find({status: "new"})
```

### Get users from specific country:
```
db.users.find({country: "India"})
```

---

## 📈 Create Charts in MongoDB Atlas

### Step 1: Go to Atlas Charts
1. In MongoDB Atlas, click **"Charts"** (left sidebar)
2. Click **"New Chart"**

### Step 2: Select Data Source
1. Database: `swar-yoga-db`
2. Collection: Choose collection (e.g., `signupdata`)

### Step 3: Create Visualizations

**Example 1: Users by Country**
- Chart Type: Bar Chart
- X-Axis: `country`
- Y-Axis: Count

**Example 2: Signups Over Time**
- Chart Type: Line Chart
- X-Axis: `timestamp` (grouped by date)
- Y-Axis: Count

**Example 3: User Distribution by Profession**
- Chart Type: Pie Chart
- Category: `profession`
- Value: Count

**Example 4: Recent Logins**
- Chart Type: Table
- Columns: email, device, timestamp
- Sort: timestamp descending

---

## 🔐 Database Credentials

```
Cluster: swaryogadb
Database: swar-yoga-db

Connection String:
mongodb+srv://admin:admin%402024@swaryogadb.dheqmu1.mongodb.net/swar-yoga-db

Username: admin
Password: admin@2024
```

---

## ✅ Data Summary

### Currently Saved:

| Collection | Count | Type |
|-----------|-------|------|
| users | 2 | User accounts |
| signupdata | 2+ | Signup records |
| signindata | Multiple | Login records |
| contacts | Multiple | Contact submissions |
| visions | 1 | User data |
| goals | 1 | User data |
| todos | 2 | User data |
| health | 1 | User data |
| reminders | 2 | User data |
| dailyplans | 1 | User data |

---

## 📱 Mobile Access

You can also view MongoDB data on mobile:
1. Open MongoDB Atlas in mobile browser
2. https://cloud.mongodb.com
3. Sign in to your account
4. View collections and data

---

## 🎯 Next Steps

1. **Go to MongoDB Atlas** (cloud.mongodb.com)
2. **Browse Collections** to see your data
3. **Run queries** to analyze user information
4. **Create charts** for visual dashboard
5. **Export data** if needed

---

## 💡 Tips

- **Search**: Use the search box to filter documents
- **Export**: Right-click collection → Export as JSON
- **Indexes**: Check performance with Index recommendations
- **Backup**: MongoDB Atlas automatically backs up your data
- **Monitoring**: Use "Metrics" tab to see database health

---

**Your data is safely stored in MongoDB Atlas Cloud! 🎉**
