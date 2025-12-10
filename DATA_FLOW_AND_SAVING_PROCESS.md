# 📊 Data Flow & Saving Process - Swar Yoga

## Overview
This document explains how data flows through the Swar Yoga application, from user input to MongoDB storage, and retrieval.

---

## 🔄 Complete Data Flow Diagram

```
User Interaction (Frontend)
        ↓
React Component (e.g., VisionForm.tsx)
        ↓
sadhakaPlannerData.ts (API SDK)
        ↓
Axios HTTP Request with Headers
        ↓
Express.js Backend (Port 4000)
        ↓
Route Handler (e.g., routes/visions.ts)
        ↓
MongoDB Model (e.g., models/Vision.ts)
        ↓
MongoDB Atlas Database
        ↓
Response sent back to Frontend
        ↓
React State Update & UI Re-render
```

---

## 1️⃣ STEP 1: User Interaction (Frontend - React Component)

### Where It Happens
**File:** `src/pages/SadhakaPlannerPage.tsx` (or any form component)

### Example: Creating a Vision

```typescript
// User clicks "Create Vision" button
const handleCreateVision = async (formData: {
  title: string;
  description: string;
  priority: string;
}) => {
  try {
    // Call the API SDK function
    const result = await visionAPI.create(formData);
    
    if (result.success) {
      // Update local state with new vision
      setVisions([...visions, result.data]);
      // Show success message
      toast.success('Vision created successfully!');
    }
  } catch (error) {
    // Handle error
    toast.error('Failed to create vision');
  }
};
```

### Data Object Structure
```typescript
interface Vision {
  userId: string;           // Extracted from localStorage
  title: string;            // User input
  description: string;      // User input
  priority: 'High' | 'Medium' | 'Low'; // User selection
  status: 'Active' | 'Completed';      // Default: 'Active'
  createdAt: Date;          // Auto-generated
  updatedAt: Date;          // Auto-generated
}
```

---

## 2️⃣ STEP 2: API SDK Layer (sadhakaPlannerData.ts)

### Purpose
Single source of truth for all API calls. Ensures consistency and handles:
- User ID extraction
- Header management
- Error handling
- Fallback mechanisms

### File Location
`src/utils/sadhakaPlannerData.ts` (782 lines)

### How Vision API Works

#### Create Vision
```typescript
export const visionAPI = {
  create: async (data: Partial<Vision>) => {
    try {
      // Make POST request to /api/visions
      const response = await apiClient.post('/visions', {
        title: data.title,
        description: data.description,
        priority: data.priority || 'Medium',
        status: 'Active'
      });
      
      // Cache the response
      localStorage.setItem('cached_visions', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      // Fallback to cached data
      const cached = JSON.parse(localStorage.getItem('cached_visions') || '[]');
      return cached;
    }
  },
  
  list: async () => {
    // GET /api/visions
    const response = await apiClient.get('/visions');
    return response.data;
  },
  
  update: async (id: string, data: Partial<Vision>) => {
    // PUT /api/visions/:id
    const response = await apiClient.put(`/visions/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    // DELETE /api/visions/:id
    const response = await apiClient.delete(`/visions/${id}`);
    return response.data;
  }
};
```

### Axios Interceptor - Adding User ID to Every Request

```typescript
// In sadhakaPlannerData.ts (lines 37-51)
apiClient.interceptors.request.use((config) => {
  try {
    // 1. Try to get userId from localStorage directly
    let userId = localStorage.getItem('userId');
    
    // 2. If not found, parse the 'user' object
    if (!userId) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        userId = userObj.id || userObj._id;  // Both fields may exist
      }
    }
    
    // 3. Add as header to every API request
    if (userId) {
      config.headers['X-User-ID'] = userId;
      console.log(`📤 API Request with User ID: ${userId}`);
    }
  } catch (error) {
    console.error('❌ Error getting user ID:', error);
  }
  return config;
});
```

### Environment Detection

```typescript
const getAPIUrl = () => {
  // Production URL from environment variable
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl) return envUrl;
  
  // Check if running locally or in production
  const isDev = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1';
  
  if (isDev) {
    return 'http://localhost:4000/api';  // Local development
  } else {
    return '/api';  // Production (Vercel routes to backend)
  }
};
```

---

## 3️⃣ STEP 3: HTTP Request & Network Layer

### Request Format

```http
POST /api/visions HTTP/1.1
Host: localhost:4000
Content-Type: application/json
X-User-ID: 67a1b2c3d4e5f6g7h8i9j0k1
Authorization: Bearer [optional_token]

{
  "title": "Complete my yoga certification",
  "description": "Earn Yoga Alliance certification in 6 months",
  "priority": "High",
  "status": "Active"
}
```

### Response Format

```json
{
  "success": true,
  "data": {
    "_id": "vision_550e8400-e29b-41d4-a716-446655440000",
    "userId": "67a1b2c3d4e5f6g7h8i9j0k1",
    "title": "Complete my yoga certification",
    "description": "Earn Yoga Alliance certification in 6 months",
    "priority": "High",
    "status": "Active",
    "createdAt": "2025-12-10T10:15:00.000Z",
    "updatedAt": "2025-12-10T10:15:00.000Z"
  },
  "count": 1
}
```

---

## 4️⃣ STEP 4: Backend Request Handler (Express.js)

### File Location
`server/routes/visions.ts`

### Processing Flow

```typescript
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    // STEP 1: Extract user ID from request header
    const userId = getUserId(req);  // From X-User-ID header
    console.log(`✏️ Creating new vision for user: ${userId}`);

    // STEP 2: Validate required fields
    if (!req.body.title) {
      res.status(400).json({
        success: false,
        message: 'Title is required',
      });
      return;
    }

    // STEP 3: Create new Vision document with userId
    const vision = new Vision({
      userId,                    // User isolation - crucial!
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority || 'Medium',
      status: 'Active'
    });

    // STEP 4: Save to MongoDB
    const savedVision = await vision.save();
    console.log(`✅ Vision saved: ${savedVision._id}`);

    // STEP 5: Return success response
    res.status(201).json({
      success: true,
      data: savedVision,
      message: 'Vision created successfully'
    });
  } catch (error) {
    // Error handling
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error creating vision:', message);
    res.status(500).json({
      success: false,
      error: message
    });
  }
});
```

### User ID Extraction

```typescript
function getUserId(req: Request): string {
  const userId = req.headers['x-user-id'] as string;
  
  if (!userId) {
    console.warn('⚠️ Missing X-User-ID header');
  }
  
  return userId || 'anonymous';  // Fallback to 'anonymous'
}
```

**Why User ID in Header?**
- ✅ Every request is tied to a user
- ✅ Prevents users from accessing other users' data
- ✅ Data isolation and security
- ✅ Enables multi-user sync across devices

---

## 5️⃣ STEP 5: MongoDB Model & Schema

### File Location
`server/models/Vision.ts`

### Schema Definition

```typescript
export interface IVision {
  _id?: string;                    // UUID (not MongoDB ObjectId)
  userId: string;                  // User identifier - INDEXED for fast queries
  visionStatement: string;         // Main vision
  timeFrame?: string;              // Timeline
  description?: string;            // Detailed description
  category?: string;               // Vision category
  visualImageUrl?: string;         // Vision image URL
  affirmations?: string[];         // Affirmation statements
  status?: 'Active' | 'Paused' | 'Archived';
  priority?: 'High' | 'Medium' | 'Low';
  createdAt?: Date;                // Auto-generated by MongoDB
  updatedAt?: Date;                // Auto-updated by MongoDB
}

const visionSchema = new Schema<IVision>(
  {
    _id: {
      type: String,
      default: () => uuidv4()  // Generate UUID instead of MongoDB ObjectId
    },
    
    userId: {
      type: String,
      required: true,
      index: true  // ⚡ INDEXED for fast user-based queries
    },
    
    visionStatement: {
      type: String,
      required: true
    },
    
    status: {
      type: String,
      enum: ['Active', 'Paused', 'Archived'],
      default: 'Active'
    },
    
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    }
  },
  {
    _id: false,           // Don't auto-create _id field (we're using UUID)
    timestamps: true      // Auto-add createdAt and updatedAt
  }
);

// Compound index for faster user-based queries sorted by date
visionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IVision>('Vision', visionSchema);
```

### Key Features

| Feature | Purpose |
|---------|---------|
| `userId: string` | User isolation - every record belongs to a user |
| `_id: UUID` | Global unique identifier (better than MongoDB ObjectId for UUIDs) |
| `index: true` on userId | Fast queries for "find all visions for user X" |
| `timestamps: true` | Automatic createdAt and updatedAt fields |
| `enum` validations | Only allow specific status/priority values |
| Compound index | `{ userId: 1, createdAt: -1 }` for efficient sorting |

---

## 6️⃣ STEP 6: MongoDB Atlas Database Storage

### Database Structure

```
MongoDB Atlas Cluster (swaryogadb.dheqmu1.mongodb.net)
│
└─ Database: swar-yoga-db
   │
   ├─ Collection: visions
   │  └─ Documents (indexed by userId + createdAt)
   │     ├─ vision_550e8400 (userId: user123, createdAt: 2025-12-10...)
   │     ├─ vision_660e8400 (userId: user456, createdAt: 2025-12-09...)
   │     └─ vision_770e8400 (userId: user123, createdAt: 2025-12-08...)
   │
   ├─ Collection: goals
   │  └─ Similar structure with goalId, userId, etc.
   │
   ├─ Collection: tasks
   ├─ Collection: todos
   ├─ Collection: health
   │
   └─ ... (27+ collections total)
```

### Connection Details

```
MONGODB_URI=mongodb+srv://swarsakshi9_db_user:swardbmongo170776@swaryogadb.dheqmu1.mongodb.net/swar-yoga-db
                                 ↑ Username                              ↑ Password                ↑ Cluster         ↑ Database
```

### How Data is Saved

```typescript
// 1. Create a new document
const vision = new Vision({
  userId: 'user123',
  title: 'My Vision',
  description: 'Description here',
  // ... other fields
});

// 2. Save to MongoDB
const savedVision = await vision.save();
// Mongoose automatically:
// - Validates against schema
// - Generates _id (UUID)
// - Sets createdAt and updatedAt timestamps
// - Sends to MongoDB Atlas
// - Returns the saved document with _id
```

---

## 7️⃣ STEP 7: Response & Frontend Update

### Backend Response

```json
{
  "success": true,
  "data": {
    "_id": "vision_550e8400-e29b-41d4-a716-446655440000",
    "userId": "user123",
    "title": "My Vision",
    "description": "Description here",
    "status": "Active",
    "priority": "High",
    "createdAt": "2025-12-10T10:15:00.000Z",
    "updatedAt": "2025-12-10T10:15:00.000Z"
  }
}
```

### Frontend Processing

```typescript
// 1. Receive response in sadhakaPlannerData.ts
const response = await apiClient.post('/visions', data);

// 2. Cache locally (offline fallback)
localStorage.setItem('cached_visions', JSON.stringify(response.data));

// 3. Return to component
return response.data;

// 4. Component updates state and UI
setVisions([...visions, result.data]);

// 5. Browser re-renders with new vision visible
```

---

## 🔐 Data Security & User Isolation

### Multi-Layer Protection

#### Layer 1: Header-Based Filtering
```typescript
// Backend always filters by userId from headers
const userId = req.headers['x-user-id'];
const visions = await Vision.find({ userId });  // Only user's visions
```

#### Layer 2: MongoDB Index
```typescript
// Index on userId ensures fast, safe queries
visionSchema.index({ userId: 1, createdAt: -1 });
```

#### Layer 3: Frontend Validation
```typescript
// localStorage['user'] set during signin
// Must exist for any API request to work
const userStr = localStorage.getItem('user');
const userObj = JSON.parse(userStr);
const userId = userObj.id || userObj._id;
```

---

## 📱 Complete User Journey Example

### Scenario: User Creates a Goal

#### 1. USER ACTION
```
User opens Life Planner → Clicks "Add Goal" → Fills form → Clicks "Save"
```

#### 2. FRONTEND CODE (React Component)
```typescript
const handleAddGoal = async (formData) => {
  const result = await goalAPI.create({
    title: formData.title,
    description: formData.description,
    visionId: selectedVisionId
  });
  
  setGoals([...goals, result.data]);  // Update UI
};
```

#### 3. API SDK CALL (sadhakaPlannerData.ts)
```typescript
// Makes POST request with automatic X-User-ID header
const response = await apiClient.post('/goals', {
  title: 'Complete 30-day yoga challenge',
  description: 'Practice daily yoga for 30 days',
  visionId: 'vision_123'
});
```

#### 4. HTTP REQUEST
```
POST /api/goals HTTP/1.1
X-User-ID: user_abc123
Content-Type: application/json

{
  "title": "Complete 30-day yoga challenge",
  "description": "Practice daily yoga for 30 days",
  "visionId": "vision_123"
}
```

#### 5. BACKEND PROCESSING (routes/goals.ts)
```typescript
router.post('/', async (req, res) => {
  const userId = req.headers['x-user-id'];  // Extract: "user_abc123"
  
  const goal = new Goal({
    userId,                        // Set: "user_abc123"
    title: req.body.title,         // Set: "Complete 30-day yoga challenge"
    description: req.body.description,
    visionId: req.body.visionId,
    status: 'Not Started'          // Default status
  });
  
  const savedGoal = await goal.save();
  res.status(201).json({ success: true, data: savedGoal });
});
```

#### 6. MONGODB STORAGE
```
Database: swar-yoga-db
Collection: goals
New document inserted:
{
  "_id": "goal_550e8400",
  "userId": "user_abc123",        ← Only this user can see this
  "title": "Complete 30-day yoga challenge",
  "description": "Practice daily yoga for 30 days",
  "visionId": "vision_123",
  "status": "Not Started",
  "createdAt": ISODate("2025-12-10T10:15:00Z"),
  "updatedAt": ISODate("2025-12-10T10:15:00Z")
}
```

#### 7. RESPONSE SENT TO FRONTEND
```json
{
  "success": true,
  "data": {
    "_id": "goal_550e8400",
    "userId": "user_abc123",
    "title": "Complete 30-day yoga challenge",
    "createdAt": "2025-12-10T10:15:00.000Z",
    "updatedAt": "2025-12-10T10:15:00.000Z"
  }
}
```

#### 8. FRONTEND UPDATE
```typescript
// Cached locally for offline access
localStorage.setItem('cached_goals', JSON.stringify([...cachedGoals, result.data]));

// State updated
setGoals([...goals, result.data]);

// UI re-renders with new goal visible in the list
```

---

## 🔄 Data Retrieval (Reading Data)

### Fetching User's Goals

```typescript
// Frontend calls
const goals = await goalAPI.list();

// Translates to:
// GET /api/goals
// X-User-ID: user_abc123

// Backend does:
const userId = req.headers['x-user-id'];  // "user_abc123"
const goals = await Goal.find({ userId }).sort({ createdAt: -1 });
// MongoDB returns: only goals where userId === "user_abc123"

// Sends back all goals for this user
res.json({
  success: true,
  data: goals,
  count: goals.length
});
```

---

## 📊 All Data Collections

| Collection | Purpose | User-Isolated | Auto-Backup |
|-----------|---------|---------------|------------|
| visions | Life visions/goals | ✅ Yes | ✅ Daily |
| goals | Goals tied to visions | ✅ Yes | ✅ Daily |
| tasks | Tasks for each goal | ✅ Yes | ✅ Daily |
| todos | Daily to-do items | ✅ Yes | ✅ Daily |
| health | Health tracking data | ✅ Yes | ✅ Daily |
| dailyplans | Daily schedule/plans | ✅ Yes | ✅ Daily |
| reminders | Reminder notifications | ✅ Yes | ✅ Daily |
| mywords | Personal affirmations | ✅ Yes | ✅ Daily |
| milestones | Achievement milestones | ✅ Yes | ✅ Daily |
| users | User profiles | ✅ Yes | ✅ Daily |
| carts | Shopping carts | ✅ Yes | ✅ Daily |
| workshops | Workshop listings | ❌ Public | ✅ Daily |
| admins | Admin accounts | ✅ By adminId | ✅ Daily |

---

## 🛡️ Error Handling & Fallbacks

### What Happens If Backend is Down?

```typescript
// sadhakaPlannerData.ts fallback mechanism

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If network error
    if (!error.response && error.message.includes('Network')) {
      console.warn('⚠️ Network error, trying localhost fallback...');
      
      try {
        const fallbackClient = axios.create({
          baseURL: 'http://localhost:4000/api'
        });
        
        const response = await fallbackClient.request(error.config);
        return response;
      } catch (fallbackError) {
        // Use cached data
        const cached = JSON.parse(
          localStorage.getItem('cached_data') || '[]'
        );
        return cached;
      }
    }
  }
);
```

### Offline Mode

Even if backend is completely down:
1. Frontend still works with cached data from `localStorage`
2. User can read goals, visions, tasks
3. Changes queue locally
4. When backend comes back, changes sync automatically

---

## 🔄 Update & Delete Operations

### Update (PUT)

```typescript
// Frontend
const updatedGoal = await goalAPI.update(goalId, {
  status: 'In Progress'
});

// Backend (routes/goals.ts)
router.put('/:id', async (req: Request, res: Response) => {
  const userId = getUserId(req);
  
  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id, userId },      // Find goal for this user
    req.body,                              // Update with new data
    { new: true }                          // Return updated document
  );
  
  res.json({ success: true, data: goal });
});
```

### Delete (DELETE)

```typescript
// Frontend
await goalAPI.delete(goalId);

// Backend (routes/goals.ts)
router.delete('/:id', async (req: Request, res: Response) => {
  const userId = getUserId(req);
  
  const result = await Goal.deleteOne({
    _id: req.params.id,
    userId              // Only delete if user owns it
  });
  
  res.json({
    success: true,
    message: 'Goal deleted',
    deletedCount: result.deletedCount
  });
});
```

---

## 📈 Performance Optimization

### Database Indexes
```typescript
// Fast lookups by userId
visionSchema.index({ userId: 1, createdAt: -1 });

// Allows query:
// db.visions.find({ userId: 'user123' }).sort({ createdAt: -1 })
// to be VERY fast even with millions of documents
```

### Caching Strategy
```typescript
// Local browser cache
localStorage.setItem('cached_visions', JSON.stringify(data));

// Reduces network requests
// Enables offline functionality
// Speeds up subsequent views
```

### Lean Queries
```typescript
// Faster MongoDB queries - returns plain objects, not Mongoose documents
const visions = await Vision.find({ userId }).lean().sort({ createdAt: -1 });
```

---

## 📦 Environment Variables

### Local Development (.env)
```
MONGODB_URI=mongodb+srv://swarsakshi9_db_user:swardbmongo170776@swaryogadb.dheqmu1.mongodb.net/swar-yoga-db?retryWrites=true&w=majority
PORT=4000
NODE_ENV=production
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:4000/api  (dev)
VITE_API_URL=https://swaryoga.com/api   (production)
```

---

## 🎯 Summary

### Complete Data Flow
1. **User** fills form and clicks save
2. **React Component** calls `API SDK` function
3. **API SDK** makes HTTP request with X-User-ID header
4. **Express Router** receives request, extracts userId
5. **Mongoose Model** validates and prepares data
6. **MongoDB** saves document in collection
7. **Backend** returns success with saved data
8. **Frontend** updates state and caches locally
9. **Browser** re-renders with new data visible

### Key Design Patterns
- ✅ **User Isolation**: Every API request includes X-User-ID header
- ✅ **Schema Validation**: MongoDB validates against Mongoose schemas
- ✅ **Error Handling**: Fallback to cached data if backend fails
- ✅ **Performance**: Database indexes and lean queries
- ✅ **Security**: userId filter on every database query
- ✅ **Offline Support**: localStorage caching
- ✅ **Consistency**: Single API SDK for all data operations

---

**Last Updated:** December 10, 2025
**Version:** 1.0
**Environment:** Production Ready
