# 🔧 SWAR YOGA - FIELD NAME MAPPING GUIDE

## 🚨 Issue Identified

The TypeScript interfaces in `src/utils/sadhakaPlannerData.ts` don't match the actual MongoDB database field names. This causes:

1. ❌ Incorrect field names when submitting forms
2. ❌ Type checking issues in components
3. ❌ Confusion about required fields

---

## 📋 Actual Database Fields vs. Frontend Types

### Vision

| Database Field | Frontend Type | Correct? |
|---|---|---|
| `visionStatement` ✅ | `title` ❌ | NO - Use `visionStatement` |
| `description` ✅ | `description` ✅ | YES |
| `category` ✅ | (missing) ❌ | Need to add |
| `priority` ✅ | `priority` ✅ | YES |
| `status` ✅ | `status` (different values) ⚠️ | Enum mismatch |
| `timeFrame` ✅ | `timelineMonths` ❌ | NO - Use `timeFrame` |
| `visualImageUrl` ✅ | `imageUrl` ❌ | NO - Use `visualImageUrl` |
| `affirmations` ✅ | (missing) ❌ | Need to add |

**Action Required:** Update Vision interface to match database

---

### Goal

| Database Field | Frontend Type | Correct? |
|---|---|---|
| `goalTitle` ✅ | `title` ❌ | NO - Use `goalTitle` |
| `description` ✅ | `description` ✅ | YES |
| `linkedVisionId` ✅ | `visionId` ❌ | NO - Use `linkedVisionId` |
| `category` ✅ | (missing) ❌ | Need to add |
| `priority` ✅ | `priority` ✅ | YES |
| `status` ✅ | `status` (different values) ⚠️ | Enum mismatch |
| `progress` ✅ | `progress` ✅ | YES |
| `targetDate` ✅ | `targetDate` ✅ | YES |
| `timeFrame` ✅ | (missing) ❌ | Need to add |
| `milestones` ✅ | (missing) ❌ | Need to add |

**Action Required:** Update Goal interface to match database

---

### Task

| Database Field | Frontend Type | Correct? |
|---|---|---|
| `taskTitle` ✅ | `title` ❌ | NO - Use `taskTitle` |
| `description` ✅ | `description` ✅ | YES |
| `linkedGoalId` ✅ | (missing) ❌ | Need to add |
| `category` ✅ | (missing) ❌ | Need to add |
| `priority` ✅ | `priority` ✅ | YES |
| `status` ✅ | `status` (different values) ⚠️ | Enum mismatch: DB uses `Pending\|In Progress\|Completed\|On Hold` |
| `dueDate` ✅ | `dueDate` ✅ | YES |
| `timeRequired` ✅ | (missing) ❌ | Need to add |
| `subtasks` ✅ | (missing) ❌ | Need to add |
| `attachments` ✅ | (missing) ❌ | Need to add |

**Action Required:** Update Task interface to match database

---

### Health

Database Field Names (Correct):
```
userId (always provided)
date (required, YYYY-MM-DD format)
mood (optional)
energy (optional, 0-10)
sleepHours (optional)
water (optional, number of glasses)
exercise (optional, minutes)
dietQuality (optional)
notes (optional)
```

**Status:** ✅ No issues found (Health type not in sadhakaPlannerData.ts)

---

## ✅ Corrected Interface Types

### Vision (CORRECTED)
```typescript
export interface Vision {
  _id?: string;
  userId: string;
  visionStatement: string;  // ← Was "title"
  description?: string;
  category?: string;        // ← Add this
  priority?: 'High' | 'Medium' | 'Low';
  status?: 'Active' | 'Paused' | 'Archived';  // ← Changed from 'Completed' | 'On Hold' | 'Not Started' | 'In Progress'
  timeFrame?: string;       // ← Was "timelineMonths"
  visualImageUrl?: string;  // ← Was "imageUrl"
  affirmations?: string[];  // ← Add this
  createdAt?: string;
  updatedAt?: string;
}
```

### Goal (CORRECTED)
```typescript
export interface Goal {
  _id?: string;
  userId: string;
  goalTitle: string;        // ← Was "title"
  description?: string;
  linkedVisionId?: string;  // ← Was "visionId"
  category?: string;        // ← Add this
  priority?: 'High' | 'Medium' | 'Low';
  status?: 'Active' | 'Paused' | 'Archived' | 'Completed';  // ← Changed
  progress?: number;        // 0-100
  targetDate?: string;
  timeFrame?: string;       // ← Add this
  milestones?: string[];    // ← Add this
  createdAt?: string;
  updatedAt?: string;
}
```

### Task (CORRECTED)
```typescript
export interface Task {
  _id?: string;
  userId: string;
  taskTitle: string;        // ← Was "title"
  description?: string;
  linkedGoalId?: string;    // ← Add this
  category?: string;        // ← Add this
  priority?: 'High' | 'Medium' | 'Low';
  status?: 'Pending' | 'In Progress' | 'Completed' | 'On Hold';  // ← Changed
  dueDate?: string;
  timeRequired?: number;    // ← Add this (in minutes)
  subtasks?: string[];      // ← Add this
  attachments?: string[];   // ← Add this
  createdAt?: string;
  updatedAt?: string;
}
```

---

## 🔄 Impact Analysis

### Components Using These Interfaces

Affected files that need updating:
- `src/pages/SadhakaPlannerPage.tsx` - Uses Vision, Goal, Task types
- `src/components/VisionForm.tsx` - Uses Vision type
- `src/components/GoalForm.tsx` - Uses Goal type
- `src/components/TaskForm.tsx` - Uses Task type
- `src/components/GoalsComponent.tsx` - Uses Goal type
- `src/components/TasksComponent.tsx` - Uses Task type
- `src/components/MilestonesComponent.tsx` - Uses Milestone type

### Current Behavior (WRONG)
```typescript
// Component tries to use:
const vision = {
  title: "My vision",        // ← Wrong! Should be visionStatement
  imageUrl: "...",           // ← Wrong! Should be visualImageUrl
}

// API receives wrong field names, fails validation
// Error: "Path `visionStatement` is required."
```

### Corrected Behavior
```typescript
// Component uses:
const vision = {
  visionStatement: "My vision",  // ✅ Correct
  visualImageUrl: "...",         // ✅ Correct
}

// API receives correct field names, creates successfully
// Success: Vision created with ID: uuid
```

---

## 🔧 How to Fix

### Option 1: Update Interfaces (RECOMMENDED)
Replace the Vision, Goal, Task interfaces in `src/utils/sadhakaPlannerData.ts` with the corrected versions above.

**Pros:**
- ✅ Types match database exactly
- ✅ IDE autocomplete works correctly
- ✅ Form components build correctly
- ✅ No runtime field name errors

**Cons:**
- Need to update all components using old field names
- Search & replace: `title` → `visionStatement` (in Vision context)
- Search & replace: `imageUrl` → `visualImageUrl`
- etc.

### Option 2: Add Mapping Layer
Create a translation layer between frontend and API:

```typescript
// Before sending to API
const visionData = {
  visionStatement: vision.title,  // Map title → visionStatement
  visualImageUrl: vision.imageUrl, // Map imageUrl → visualImageUrl
  // ... rest of fields
}

await apiClient.post('/visions', visionData);
```

**Pros:**
- ✅ Don't need to update components
- ✅ Maintains backward compatibility

**Cons:**
- ❌ Extra maintenance burden
- ❌ Easy to miss mappings
- ❌ Types don't match reality

---

## 📊 Current Status

| Model | Interface Match | Components Affected | Fix Priority |
|-------|---|---|---|
| Vision | ❌ No (3 wrong fields) | VisionForm, SadhakaPlannerPage | 🔴 High |
| Goal | ❌ No (3 wrong fields) | GoalForm, GoalsComponent, SadhakaPlannerPage | 🔴 High |
| Task | ❌ No (4 wrong fields) | TaskForm, TasksComponent, SadhakaPlannerPage | 🔴 High |
| Health | ✅ Yes (not defined) | HealthComponent, SadhakaPlannerPage | 🟡 Medium |
| Milestone | ⚠️ Partial | MilestonesComponent | 🟡 Medium |
| Workshop | ✅ Yes (separate file) | AdminWorkshops, workshopPage | 🟢 Low |

---

## ✅ Testing After Fix

Once interfaces are corrected:

```bash
# Run the test script to verify
/tmp/test_full_workflow.sh

# Expected output:
# [1] Creating Vision... ✅
# [2] Creating Goal... ✅
# [3] Creating Task... ✅
# [4] Creating Health Entry... ✅
# [5] Fetching all user data... ✅
# ... (all tests pass)
# === ALL TESTS PASSED ✅ ===
```

---

## 📌 Key Takeaways

1. **Database is correct** ✅ - All field names are properly defined in MongoDB models
2. **API is correct** ✅ - All endpoints work and save data properly
3. **Frontend types are outdated** ❌ - Interfaces don't match database
4. **Solution:** Update interfaces in `src/utils/sadhakaPlannerData.ts`

---

**Created:** December 9, 2025  
**Status:** Ready for implementation
