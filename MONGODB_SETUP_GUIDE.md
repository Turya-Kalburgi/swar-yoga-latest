# MongoDB Setup and Integration Guide

## Quick Start

### Step 1: Download MongoDB Community

#### macOS (Using Homebrew)
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify installation
mongosh
> show dbs
```

#### Windows
Download from: https://www.mongodb.com/try/download/community
- Run installer
- Select "Install MongoDB as a Service"
- Start MongoDB from Services

#### Linux (Ubuntu)
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Step 2: Install MongoDB Packages

```bash
cd /Users/mohankalburgi/Downloads/project\ 13/server
npm install mongoose mongodb dotenv
npm install --save-dev @types/mongoose
```

### Step 3: Environment Configuration

Create `.env` in server directory:
```
MONGODB_URI=mongodb://localhost:27017/swar-yoga-db
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key-here
```

---

## MongoDB Schema Design

### Collections Overview

```
swar-yoga-db/
├── users
├── visions
├── goals
├── milestones
├── tasks
├── mywords (affirmations)
├── todos
├── reminders
├── dailyplans
├── healthtracker
└── workshops
```

### Collection Schemas

#### 1. Visions Collection
```javascript
db.createCollection("visions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "title"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "string", description: "User ID" },
        title: { bsonType: "string" },
        description: { bsonType: "string" },
        imageUrl: { bsonType: "string" },
        timelineMonths: { bsonType: "int" },
        startDate: { bsonType: "date" },
        targetDate: { bsonType: "date" },
        status: { enum: ["Active", "Completed", "On Hold"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
```

#### 2. Goals Collection
```javascript
db.createCollection("goals", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "title", "visionId"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "string" },
        visionId: { bsonType: "string" },
        title: { bsonType: "string" },
        description: { bsonType: "string" },
        progress: { bsonType: "int", minimum: 0, maximum: 100 },
        targetDate: { bsonType: "date" },
        priority: { enum: ["High", "Medium", "Low"] },
        status: { enum: ["Not Started", "In Progress", "Completed"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
```

#### 3. Tasks Collection
```javascript
db.createCollection("tasks", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "title"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "string" },
        title: { bsonType: "string" },
        description: { bsonType: "string" },
        priority: { enum: ["High", "Medium", "Low"] },
        startDate: { bsonType: "date" },
        dueDate: { bsonType: "date" },
        recurrence: { enum: ["Once", "Daily", "Weekly", "Monthly", "Yearly"] },
        status: { enum: ["Pending", "In Progress", "Completed"] },
        linkedGoalId: { bsonType: "string" },
        linkedGoalTitle: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
db.tasks.createIndex({ userId: 1 });
db.tasks.createIndex({ dueDate: 1 });
```

#### 4. MyWords (Affirmations) Collection
```javascript
db.createCollection("mywords", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "commitment"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "string" },
        commitment: { bsonType: "string" },
        committedDate: { bsonType: "date" },
        completionDeadline: { bsonType: "date" },
        recurrence: { enum: ["Once", "Daily", "Weekly", "Monthly", "Yearly"] },
        status: { enum: ["Pending", "In Progress", "Completed"] },
        linkedVisionId: { bsonType: "string" },
        linkedVisionTitle: { bsonType: "string" },
        linkedGoalId: { bsonType: "string" },
        linkedGoalTitle: { bsonType: "string" },
        linkedTaskId: { bsonType: "string" },
        linkedTaskTitle: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
```

#### 5. Todos Collection
```javascript
db.createCollection("todos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "text"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "string" },
        text: { bsonType: "string" },
        completed: { bsonType: "bool" },
        category: { bsonType: "string" },
        dueDate: { bsonType: "date" },
        linkedTaskId: { bsonType: "string" },
        linkedTaskTitle: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
db.todos.createIndex({ userId: 1 });
```

#### 6. Reminders Collection
```javascript
db.createCollection("reminders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "text"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "string" },
        text: { bsonType: "string" },
        reminderTime: { bsonType: "date" },
        priority: { enum: ["Low", "Medium", "High"] },
        recurring: { bsonType: "bool" },
        recurringDays: { bsonType: "int" },
        linkedEntity: { bsonType: "string" },
        linkedEntityId: { bsonType: "string" },
        completed: { bsonType: "bool" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
```

#### 7. Health Tracker Collection
```javascript
db.createCollection("healthtracker", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "date"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "string" },
        date: { bsonType: "date" },
        steps: { bsonType: "int" },
        weight: { bsonType: "double" },
        calories: { bsonType: "int" },
        sleep: { bsonType: "double" },
        heartRate: { bsonType: "int" },
        bloodPressure: { bsonType: "string" },
        water: { bsonType: "int" },
        exercise: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
db.healthtracker.createIndex({ userId: 1, date: 1 });
```

---

## Mongoose Models

Create `server/models/` directory with these files:

### models/Vision.js
```javascript
const mongoose = require('mongoose');

const VisionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  timelineMonths: { type: Number },
  startDate: { type: Date },
  targetDate: { type: Date },
  status: { type: String, enum: ['Active', 'Completed', 'On Hold'], default: 'Active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vision', VisionSchema);
```

### models/Goal.js
```javascript
const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  visionId: { type: String },
  title: { type: String, required: true },
  description: { type: String },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  targetDate: { type: Date },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Goal', GoalSchema);
```

### models/Task.js
```javascript
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  startDate: { type: Date },
  dueDate: { type: Date },
  recurrence: { type: String, enum: ['Once', 'Daily', 'Weekly', 'Monthly', 'Yearly'], default: 'Once' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  linkedGoalId: { type: String },
  linkedGoalTitle: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);
```

### models/MyWord.js
```javascript
const mongoose = require('mongoose');

const MyWordSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  commitment: { type: String, required: true },
  committedDate: { type: Date },
  completionDeadline: { type: Date },
  recurrence: { type: String, enum: ['Once', 'Daily', 'Weekly', 'Monthly', 'Yearly'], default: 'Once' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  linkedVisionId: { type: String },
  linkedVisionTitle: { type: String },
  linkedGoalId: { type: String },
  linkedGoalTitle: { type: String },
  linkedTaskId: { type: String },
  linkedTaskTitle: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MyWord', MyWordSchema);
```

### models/Todo.js
```javascript
const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  category: { type: String },
  dueDate: { type: Date },
  linkedTaskId: { type: String },
  linkedTaskTitle: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Todo', TodoSchema);
```

### models/HealthTracker.js
```javascript
const mongoose = require('mongoose');

const HealthTrackerSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  date: { type: Date, required: true },
  steps: { type: Number },
  weight: { type: Number },
  calories: { type: Number },
  sleep: { type: Number },
  heartRate: { type: Number },
  bloodPressure: { type: String },
  water: { type: Number },
  exercise: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

HealthTrackerSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('HealthTracker', HealthTrackerSchema);
```

---

## API Routes

Create `server/routes/` directory with these files:

### routes/visions.js
```javascript
const express = require('express');
const router = express.Router();
const Vision = require('../models/Vision');

// Get all visions for user
router.get('/:userId', async (req, res) => {
  try {
    const visions = await Vision.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(visions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create vision
router.post('/', async (req, res) => {
  try {
    const vision = new Vision(req.body);
    const saved = await vision.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update vision
router.put('/:id', async (req, res) => {
  try {
    const updated = await Vision.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete vision
router.delete('/:id', async (req, res) => {
  try {
    await Vision.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
```

### routes/goals.js
```javascript
const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');

router.get('/:userId', async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const goal = new Goal(req.body);
    const saved = await goal.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
```

Similar routes for tasks, mywords, todos, health...

---

## Next Steps

1. ✅ Download and install MongoDB
2. ✅ Create database and collections
3. ✅ Set up Mongoose models
4. ✅ Create API routes
5. ⏳ Integration with React components
6. ⏳ Test cross-device persistence

See: `MONGODB_INTEGRATION_IMPLEMENTATION.md` (next document)
