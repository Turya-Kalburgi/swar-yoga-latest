# 🎯 SWAR YOGA API - QUICK REFERENCE GUIDE

## ⚠️ CRITICAL: Correct Field Names

**The most common issue is using wrong field names.** Always use the EXACT field names listed below.

---

## 📌 Vision API

### Create/Update Vision
```bash
curl -X POST http://localhost:4000/api/visions \
  -H "Content-Type: application/json" \
  -H "X-User-ID: user-123" \
  -d '{
    "visionStatement": "My wellness vision",
    "description": "Detailed description",
    "category": "health",
    "priority": "High",
    "status": "Active",
    "timeFrame": "1 year",
    "visualImageUrl": "https://...",
    "affirmations": ["I am healthy", "I am strong"]
  }'
```

**Required:** `visionStatement` (string)  
**Optional:** All other fields  
**Valid Values:**
- priority: `High`, `Medium`, `Low`
- status: `Active`, `Paused`, `Archived`

---

## 📌 Goal API

### Create/Update Goal
```bash
curl -X POST http://localhost:4000/api/goals \
  -H "Content-Type: application/json" \
  -H "X-User-ID: user-123" \
  -d '{
    "goalTitle": "Launch MVP",
    "description": "Release beta version",
    "category": "development",
    "priority": "High",
    "status": "Active",
    "linkedVisionId": "vision-uuid",
    "timeFrame": "3 months",
    "targetDate": "2025-12-31",
    "milestones": ["Design phase", "Development phase"],
    "progress": 50
  }'
```

**Required:** `goalTitle` (string)  
**Optional:** All other fields  
**Valid Values:**
- priority: `High`, `Medium`, `Low`
- status: `Active`, `Paused`, `Archived`, `Completed`

**Common Mistake:** Using `goalName` instead of `goalTitle` ❌

---

## 📌 Task API

### Create/Update Task
```bash
curl -X POST http://localhost:4000/api/tasks \
  -H "Content-Type: application/json" \
  -H "X-User-ID: user-123" \
  -d '{
    "taskTitle": "Design database schema",
    "description": "Plan MongoDB collections",
    "category": "development",
    "priority": "High",
    "status": "In Progress",
    "linkedGoalId": "goal-uuid",
    "dueDate": "2025-12-15",
    "timeRequired": 480,
    "subtasks": ["Step 1", "Step 2"],
    "attachments": ["file-url-1", "file-url-2"]
  }'
```

**Required:** `taskTitle` (string)  
**Optional:** All other fields  
**Valid Values:**
- priority: `High`, `Medium`, `Low`
- status: `Pending`, `In Progress`, `Completed`, `On Hold`

**Common Mistake:** Using `taskName` instead of `taskTitle` ❌

---

## 📌 Health API

### Create/Update Health Entry
```bash
curl -X POST http://localhost:4000/api/health \
  -H "Content-Type: application/json" \
  -H "X-User-ID: user-123" \
  -d '{
    "date": "2025-12-09",
    "mood": "energetic",
    "energy": 8,
    "sleepHours": 7.5,
    "water": 8,
    "exercise": 60,
    "dietQuality": "excellent",
    "notes": "Great day!"
  }'
```

**Required:** `date` (string in YYYY-MM-DD format)  
**Optional:** All other fields  
**Valid Value Ranges:**
- energy: 0-10
- sleepHours: number (e.g., 7.5)
- water: number of glasses
- exercise: minutes

**Common Mistake:** Using wrong date format ❌

---

## 📌 Workshop API

### Create/Update Workshop
```bash
curl -X POST http://localhost:4000/api/workshops \
  -H "Content-Type: application/json" \
  -H "X-User-ID: admin-123" \
  -d '{
    "title": "Yoga Basics",
    "description": "Beginner yoga class",
    "category": "yoga",
    "startDate": "2025-12-15T09:00:00Z",
    "endDate": "2025-12-15T10:00:00Z",
    "location": "New York",
    "price": 29.99,
    "image": "https://...",
    "capacity": 30,
    "isPublic": true,
    "instructorId": "instructor-uuid"
  }'
```

**Required:** `title` (string)  
**Optional:** All other fields

---

## 🔄 CRUD Operations Cheat Sheet

### CREATE (POST)
```bash
curl -X POST http://localhost:4000/api/{resource} \
  -H "Content-Type: application/json" \
  -H "X-User-ID: user-id" \
  -d '{ ... JSON data ... }'
```

### READ (GET) - All
```bash
curl http://localhost:4000/api/{resource} \
  -H "X-User-ID: user-id"
```

### READ (GET) - Single
```bash
curl http://localhost:4000/api/{resource}/{id} \
  -H "X-User-ID: user-id"
```

### UPDATE (PUT)
```bash
curl -X PUT http://localhost:4000/api/{resource}/{id} \
  -H "Content-Type: application/json" \
  -H "X-User-ID: user-id" \
  -d '{ ... JSON data ... }'
```

### DELETE
```bash
curl -X DELETE http://localhost:4000/api/{resource}/{id} \
  -H "X-User-ID: user-id"
```

---

## 🔑 Required Header: X-User-ID

**Every request must include the X-User-ID header:**

```bash
curl http://localhost:4000/api/visions \
  -H "X-User-ID: your-user-id-here"
```

**Without this header:**
- ❌ Request may fail or return empty results
- ❌ Data isolation is compromised
- ❌ User ID defaults to "anonymous"

**Where to get user ID:**
1. After login, check `localStorage['user']`
2. Parse the JSON object: `const user = JSON.parse(localStorage.getItem('user'))`
3. Extract ID: `const userId = user.id || user._id`

---

## 📊 Response Format

### Success Response (2xx)
```json
{
  "success": true,
  "data": {
    "_id": "uuid-here",
    "userId": "user-id",
    "fieldName": "value",
    "createdAt": "2025-12-09T23:21:31.826Z",
    "updatedAt": "2025-12-09T23:21:31.826Z"
  }
}
```

### Error Response (4xx, 5xx)
```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "message": "Alternative error message format"
}
```

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `Path 'goalTitle' is required` | Used `goalName` instead | Use `goalTitle` |
| `Path 'taskTitle' is required` | Used `taskName` instead | Use `taskTitle` |
| `Path 'visionStatement' is required` | Omitted required field | Add `visionStatement` |
| `Path 'date' is required` | Omitted health date | Add `date` in YYYY-MM-DD |
| Empty data returned | Missing X-User-ID header | Add header to request |

---

## ✅ Verification Test

Run this to verify everything works:

```bash
# Get user ID from localStorage (in browser console)
const userId = JSON.parse(localStorage.getItem('user')).id

# Run test
/tmp/test_full_workflow.sh
```

Expected output: `=== ALL TESTS PASSED ✅ ===`

---

## 🚀 Pro Tips

1. **Always use the header:** `X-User-ID: {your-user-id}`
2. **Always use correct field names:** Vision=`visionStatement`, Goal=`goalTitle`, Task=`taskTitle`
3. **Always use proper date format:** `YYYY-MM-DD` for health dates
4. **Always check response:** Look for `"success": true` in response
5. **Always verify field names:** Reference the exact spelling above

---

**Last Updated:** December 9, 2025  
**Status:** ✅ All APIs verified and working
