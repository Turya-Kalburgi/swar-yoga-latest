# Life Planner Data Persistence Fix

## Problem
Life Planner additions (goals, tasks, visions, etc.) were not persisting after page refresh. New items would disappear when refreshing the browser.

## Root Cause
The `src/utils/database.ts` file was using **in-memory mock data** as a fallback when the backend API was unavailable. This mock data was lost on page refresh since it wasn't persisted to localStorage or any permanent storage.

## Solution
**Removed all mock data fallbacks** and now rely **only on the backend API** for data persistence.

### Changes Made

#### File: `src/utils/database.ts`

**Before:**
```typescript
// Mock data with localStorage fallback
let mockData = loadMockData();

async function tryServer<T>(
  serverFn: () => Promise<T>, 
  mockFn: () => T | Promise<T>
): Promise<T> {
  // Try server first, fallback to mock if fails
}

// All API methods had fallbacks like:
export const goalsAPI = {
  create: async (goalData: any) => {
    return tryServer(
      async () => { /* API call */ },
      () => { /* Mock creation */ }
    );
  }
}
```

**After:**
```typescript
// NO mock data - only real API calls
export const goalsAPI = {
  create: async (goalData: any) => {
    const response = await apiClient.post('/goals', goalData);
    return response.data;
  }
}
```

### API Refactoring
All these APIs now use **only backend API calls** with no fallbacks:
- ✅ visionAPI (CRUD operations)
- ✅ goalsAPI (CRUD operations)
- ✅ tasksAPI (CRUD operations)
- ✅ todosAPI (CRUD operations)
- ✅ dailyWordsAPI (CRUD operations)
- ✅ affirmationsAPI (CRUD operations)
- ✅ healthAPI (CRUD operations)
- ✅ peopleAPI (CRUD operations)

## How Data Persistence Works Now

### Flow:
1. User adds a new item (e.g., goal, task)
2. Component calls API (e.g., `goalsAPI.create(goalData)`)
3. API makes HTTP request to backend: `POST https://swar-yoga-dec.onrender.com/api/goals`
4. Backend saves to Supabase database
5. Backend returns created item with ID
6. Component updates state with returned data
7. User refreshes page
8. Component loads data again via `goalsAPI.getAll()`
9. API fetches from backend: `GET https://swar-yoga-dec.onrender.com/api/goals`
10. Backend retrieves from Supabase
11. Data is restored to component

### Key Points:
- ✅ **Single source of truth**: Backend/Supabase database
- ✅ **No data loss on refresh**: Data persists on server
- ✅ **Real-time sync**: All clients see same data
- ✅ **User isolation**: Data is per-user via userId header
- ✅ **Error handling**: Components must handle API errors properly

## Backend Requirements

For this to work, the backend API (`https://swar-yoga-dec.onrender.com/api`) must:

### Required Endpoints:
```
GET    /api/goals
POST   /api/goals
PUT    /api/goals/:id
DELETE /api/goals/:id

GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id

GET    /api/todos
POST   /api/todos
PUT    /api/todos/:id
DELETE /api/todos/:id

GET    /api/visions
POST   /api/visions
PUT    /api/visions/:id
DELETE /api/visions/:id

GET    /api/affirmations
POST   /api/affirmations
PUT    /api/affirmations/:id
DELETE /api/affirmations/:id

GET    /api/health
POST   /api/health
PUT    /api/health/:id
DELETE /api/health/:id

GET    /api/daily-words
POST   /api/daily-words
PUT    /api/daily-words/:id
DELETE /api/daily-words/:id

GET    /api/people
POST   /api/people
PUT    /api/people/:id
DELETE /api/people/:id
```

### Database:
- Supabase PostgreSQL with tables for each entity
- User isolation via `userId` header or JWT token
- Timestamps for audit trail

## Components to Update (If Needed)

Components that call these APIs should:

1. **Handle loading state** properly
2. **Show error messages** if API fails
3. **Use try-catch** blocks
4. **Don't assume mock fallback** exists

Example:
```typescript
const [goals, setGoals] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  let mounted = true;
  (async () => {
    try {
      setLoading(true);
      const data = await goalsAPI.getAll();
      if (mounted) setGoals(data || []);
    } catch (err) {
      if (mounted) setError(err.message);
    } finally {
      if (mounted) setLoading(false);
    }
  })();
  return () => { mounted = false; };
}, []);

if (loading) return <p>Loading goals...</p>;
if (error) return <p>Error: {error}</p>;
```

## Benefits

✅ **Data persistence guaranteed** - No more lost data on refresh  
✅ **Simplified code** - Removed complex tryServer/mock logic  
✅ **Better error handling** - Clear errors vs silent failures  
✅ **True real-time** - Multiple users see same data  
✅ **Scalable** - Can add caching layer in future without changing API  
✅ **Secure** - Backend can enforce permissions  

## Testing

To verify data persistence works:

1. Add a new goal/task/vision in Life Planner
2. Refresh the browser (Cmd+R)
3. ✅ Data should still be visible
4. Close and reopen browser
5. ✅ Data should still be visible (assuming user still logged in)

## Git Commit
```
commit 6ca0ba0e
refactor: Remove all mock data fallbacks - use only backend API for persistence
```

## Important Notes

⚠️ **The backend API must be running** for any Life Planner features to work  
⚠️ **Supabase database must be configured and accessible**  
⚠️ **User must be logged in** (userId is required for all requests)  
⚠️ **Network errors will now show to users** (not silently fail)
