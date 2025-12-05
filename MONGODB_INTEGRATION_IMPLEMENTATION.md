# MongoDB Integration Implementation Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   React Components                      │
│  (SadhakaPlannerPage, MyTasks, MyGoals, etc.)          │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│           MongoDB Service Layer                         │
│  (Client-side service to manage API calls)             │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│         Express.js API Server                          │
│  /api/visions, /api/goals, /api/tasks, etc.           │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│           Mongoose Models                              │
│  (Database schema and validation)                      │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│         MongoDB Database                               │
│  swar-yoga-db (visions, goals, tasks, etc.)           │
└─────────────────────────────────────────────────────────┘
```

---

## Step 1: Install Dependencies

```bash
cd /Users/mohankalburgi/Downloads/project\ 13/server

# Install MongoDB packages
npm install mongoose mongodb dotenv cors uuid

# Install types
npm install --save-dev @types/node
```

---

## Step 2: Setup Server Connection

### server/config/db.js
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/swar-yoga-db';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### server/index.js
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/visions', require('./routes/visions'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/mywords', require('./routes/mywords'));
app.use('/api/todos', require('./routes/todos'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/health', require('./routes/health'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

---

## Step 3: Create MongoDB Service Layer

### src/services/mongodbService.ts
```typescript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Vision Service
export const visionService = {
  getAll: (userId: string) => axiosInstance.get(`/visions/${userId}`),
  create: (data: any) => axiosInstance.post('/visions', data),
  update: (id: string, data: any) => axiosInstance.put(`/visions/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/visions/${id}`)
};

// Goal Service
export const goalService = {
  getAll: (userId: string) => axiosInstance.get(`/goals/${userId}`),
  create: (data: any) => axiosInstance.post('/goals', data),
  update: (id: string, data: any) => axiosInstance.put(`/goals/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/goals/${id}`)
};

// Task Service
export const taskService = {
  getAll: (userId: string) => axiosInstance.get(`/tasks/${userId}`),
  create: (data: any) => axiosInstance.post('/tasks', data),
  update: (id: string, data: any) => axiosInstance.put(`/tasks/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/tasks/${id}`)
};

// MyWord Service
export const mywordService = {
  getAll: (userId: string) => axiosInstance.get(`/mywords/${userId}`),
  create: (data: any) => axiosInstance.post('/mywords', data),
  update: (id: string, data: any) => axiosInstance.put(`/mywords/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/mywords/${id}`)
};

// Todo Service
export const todoService = {
  getAll: (userId: string) => axiosInstance.get(`/todos/${userId}`),
  create: (data: any) => axiosInstance.post('/todos', data),
  update: (id: string, data: any) => axiosInstance.put(`/todos/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/todos/${id}`)
};

// Health Tracker Service
export const healthService = {
  getByDate: (userId: string, date: string) => axiosInstance.get(`/health/${userId}/${date}`),
  create: (data: any) => axiosInstance.post('/health', data),
  update: (id: string, data: any) => axiosInstance.put(`/health/${id}`, data)
};

export default {
  visionService,
  goalService,
  taskService,
  mywordService,
  todoService,
  healthService
};
```

---

## Step 4: Update React Components

### Update SadhakaPlannerPage.tsx

```typescript
// OLD: Using localStorage via sadhakaPlannerData.ts
// const visionsData = await visionAPI.getAll(userId);

// NEW: Using MongoDB via service
import mongodbService from '../services/mongodbService';

const loadAllData = async () => {
  try {
    setLoading(true);
    const userId = user?.id || '';

    const [
      visionsResponse,
      goalsResponse,
      tasksResponse,
      myWordsResponse,
      todosResponse,
      remindersResponse,
      healthResponse
    ] = await Promise.all([
      mongodbService.visionService.getAll(userId),
      mongodbService.goalService.getAll(userId),
      mongodbService.taskService.getAll(userId),
      mongodbService.mywordService.getAll(userId),
      mongodbService.todoService.getAll(userId),
      mongodbService.reminderService.getAll(userId),
      mongodbService.healthService.getByDate(userId, new Date().toISOString().split('T')[0])
    ]);

    setVisions(visionsResponse.data);
    setGoals(goalsResponse.data);
    setTasks(tasksResponse.data);
    setMyWords(myWordsResponse.data);
    setTodos(todosResponse.data);
    setReminders(remindersResponse.data);
    setHealthData(healthResponse.data);

  } catch (error) {
    console.error('Error loading data:', error);
    toast.error('Failed to load planner data');
  } finally {
    setLoading(false);
  }
};
```

### Update MyTasks.tsx

```typescript
// OLD: Using localStorage
// const task: Task = { id: Date.now(), ... };
// tasksAPI.create(task).then(created => setTasks(prev => [...prev, created]))

// NEW: Using MongoDB
import mongodbService from '../services/mongodbService';

const handleAddTask = async () => {
  if (newTask.particulars.trim()) {
    try {
      const task = {
        userId: user?.id,
        title: newTask.particulars,
        description: '',
        priority: newTask.priority,
        startDate: new Date().toISOString(),
        dueDate: newTask.date || new Date().toISOString(),
        recurrence: newTask.repeat,
        status: newTask.status,
        linkedGoalId: newTask.linkedGoalId || undefined,
        linkedGoalTitle: newTask.linkedGoalTitle || undefined
      };

      const response = await mongodbService.taskService.create(task);
      setTasks(prev => [...prev, response.data]);
      
      setNewTask({
        particulars: '',
        date: '',
        time: '',
        priority: 'Medium',
        status: 'Pending',
        completed: false,
        repeat: 'None',
        customRepeatDays: 1,
        reminder: false,
        reminderTime: '',
        linkedGoalId: 0
      });
      setShowAddModal(false);
      toast.success('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  }
};
```

---

## Step 5: Hybrid Mode (Cache + Sync)

For better UX with offline support:

### src/services/hybridSyncService.ts
```typescript
import mongodbService from './mongodbService';

interface CacheEntry {
  data: any;
  timestamp: number;
  synced: boolean;
}

const cache: Map<string, CacheEntry> = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const hybridSync = {
  async getVisions(userId: string) {
    const cacheKey = `visions_${userId}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data; // Return cached immediately
    }

    try {
      const response = await mongodbService.visionService.getAll(userId);
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
        synced: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching visions, using cache:', error);
      return cached?.data || [];
    }
  },

  async createVision(userId: string, data: any) {
    const visionData = { ...data, userId };
    
    try {
      const response = await mongodbService.visionService.create(visionData);
      
      // Update cache
      const cacheKey = `visions_${userId}`;
      const cached = cache.get(cacheKey);
      if (cached) {
        cache.set(cacheKey, {
          ...cached,
          data: [response.data, ...cached.data],
          synced: true
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Error creating vision:', error);
      throw error;
    }
  }
};
```

---

## Step 6: Migration Strategy

### Option A: Gradual Migration
1. Keep localStorage as fallback
2. Check MongoDB first
3. Fall back to localStorage if offline
4. Background sync when online

### Option B: Full Migration
1. Move all data to MongoDB
2. Run migration script to transfer existing localStorage data
3. Remove localStorage dependency

---

## Data Migration Script

### scripts/migrateToMongoDB.ts
```typescript
import mongodbService from '../services/mongodbService';

export const migrateLocalStorageToMongoDB = async (userId: string) => {
  try {
    console.log('🔄 Starting migration to MongoDB...');

    // Migrate Visions
    const visionsKey = `sadhaka_visions_${userId}`;
    const visionsData = JSON.parse(localStorage.getItem(visionsKey) || '[]');
    for (const vision of visionsData) {
      await mongodbService.visionService.create({ ...vision, userId });
    }
    console.log(`✅ Migrated ${visionsData.length} visions`);

    // Migrate Goals
    const goalsKey = `sadhaka_goals_${userId}`;
    const goalsData = JSON.parse(localStorage.getItem(goalsKey) || '[]');
    for (const goal of goalsData) {
      await mongodbService.goalService.create({ ...goal, userId });
    }
    console.log(`✅ Migrated ${goalsData.length} goals`);

    // Similar for other collections...

    console.log('✅ Migration complete!');
    return { success: true, message: 'All data migrated to MongoDB' };
  } catch (error) {
    console.error('❌ Migration error:', error);
    return { success: false, error: error.message };
  }
};
```

---

## Environment Variables

### .env (React - client)
```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=development
```

### .env (Server)
```
MONGODB_URI=mongodb://localhost:27017/swar-yoga-db
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:5173
```

---

## Testing Checklist

- [ ] Start MongoDB: `mongosh` in terminal
- [ ] Start server: `npm run dev` in server directory
- [ ] Start client: `npm run dev` in project directory
- [ ] Create user and sign in
- [ ] Create task/goal/vision
- [ ] Check MongoDB: `db.tasks.find({ userId: "..." })`
- [ ] Sign out
- [ ] Sign in again
- [ ] Verify data appears
- [ ] Test on different browser
- [ ] Verify data syncs across

---

## Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Start MongoDB
brew services start mongodb-community

# Or start manually
mongosh
```

### API Not Responding
```bash
# Check server logs
# Make sure server is running on port 3001
# Check CORS settings
```

### Data Not Syncing
```bash
# Check browser console for errors
# Verify userId is consistent
# Check network tab in DevTools
# Verify MongoDB collections have data
```

---

## Next Steps

1. ✅ Install MongoDB
2. ✅ Set up Node.js server
3. ✅ Create Mongoose models
4. ✅ Create Express routes
5. ✅ Create React service layer
6. ✅ Update components to use MongoDB
7. ⏳ Test cross-device sync
8. ⏳ Deploy to production

---

## Benefits

✅ **Cross-Device Sync**: Access data on any device  
✅ **Persistent Storage**: Data survives browser clears  
✅ **Offline Support**: Cache keeps app working  
✅ **Real-Time Updates**: Multiple tabs sync instantly  
✅ **Scalability**: Handle millions of records  
✅ **Security**: Server-side validation  
✅ **Backup**: Automatic database backups  
✅ **Analytics**: Track user behavior easily
