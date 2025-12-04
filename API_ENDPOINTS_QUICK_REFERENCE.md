# 📡 API ENDPOINTS - QUICK REFERENCE GUIDE

## 🎯 BASE URL

```
http://localhost:4000/api/admin/workshops
```

---

## 📋 ENDPOINT SUMMARY TABLE

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| GET | `/` | Get all workshops | ✅ Working |
| GET | `/public` | Get public workshops only | ✅ Working |
| POST | `/` | Create new workshop | ✅ Working |
| GET | `/:id` | Get single workshop | ✅ Working |
| PUT | `/:id` | Update workshop | ✅ Working |
| DELETE | `/:id` | Delete workshop | ✅ Working |
| PATCH | `/:id/visibility` | Toggle visibility | ✅ Working |

---

## 🔑 DETAILED ENDPOINTS

### 1️⃣ GET ALL WORKSHOPS

```
Endpoint: GET /api/admin/workshops
Purpose: Retrieve all workshops (admin view)
Authentication: Not required (dev mode)
```

**cURL Example:**
```bash
curl http://localhost:4000/api/admin/workshops
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Basic Swar Yoga Master Class",
      "instructor": "Mohan Kalburgi",
      ...
    }
  ],
  "count": 2
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### 2️⃣ GET PUBLIC WORKSHOPS

```
Endpoint: GET /api/admin/workshops/public
Purpose: Get only public workshops (for public page)
Authentication: Not required
Filtering: Only isPublic: true
```

**cURL Example:**
```bash
curl http://localhost:4000/api/admin/workshops/public
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Basic Swar Yoga Master Class",
      "isPublic": true,
      ...
    }
  ],
  "count": 1
}
```

**Use Case:** Public workshop listing page

---

### 3️⃣ CREATE WORKSHOP

```
Endpoint: POST /api/admin/workshops
Method: POST
Authentication: Not required (dev mode)
Content-Type: application/json
```

**cURL Example:**
```bash
curl -X POST http://localhost:4000/api/admin/workshops \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced Yoga",
    "instructor": "Ravi Kumar",
    "startDate": "2025-07-01",
    "endDate": "2025-07-07",
    "duration": "1 Week",
    "startTime": "06:00",
    "endTime": "18:00",
    "priceINR": 8000,
    "priceNPR": 12000,
    "priceUSD": 100,
    "maxParticipants": 50,
    "category": "Advanced",
    "mode": "Online",
    "language": "Hindi",
    "level": "Advanced",
    "location": "Zoom",
    "isPublic": true
  }'
```

**Required Fields:**
- `title` - Workshop name
- `instructor` - Instructor name
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)

**Optional Fields:**
- `duration` - Duration string (e.g., "3 Days")
- `startTime` - Start time (HH:MM)
- `endTime` - End time (HH:MM)
- `priceINR` - Price in INR
- `priceNPR` - Price in NPR
- `priceUSD` - Price in USD
- `maxParticipants` - Max participants
- `category` - Category
- `mode` - Online/Hybrid/In-person
- `language` - Language
- `level` - Beginner/Intermediate/Advanced
- `location` - Location
- `image` - Image URL
- `youtubeId` - YouTube video ID
- `paymentLinks` - Payment URLs
- `prerequisites` - Prerequisites
- `learningOutcomes` - What to learn
- `includedItems` - What's included
- `isPublic` - Public/Private (true/false)

**Response:**
```json
{
  "success": true,
  "message": "Workshop created successfully",
  "data": {
    "id": "1701648250123",
    "title": "Advanced Yoga",
    "instructor": "Ravi Kumar",
    ...all fields...
    "created_at": "2025-12-04T15:45:00.000Z",
    "updated_at": "2025-12-04T15:45:00.000Z"
  }
}
```

**Auto-Generated Fields:**
- `id` - Unique ID (timestamp)
- `created_at` - Creation timestamp
- `updated_at` - Update timestamp
- `enrolledCount` - Defaults to 0
- `rating` - Defaults to 4.5

**Status Codes:**
- `201` - Created successfully
- `400` - Missing required fields
- `500` - Server error

---

### 4️⃣ GET SINGLE WORKSHOP

```
Endpoint: GET /api/admin/workshops/:id
Purpose: Get workshop by ID
Parameter: id - Workshop ID
```

**cURL Example:**
```bash
curl http://localhost:4000/api/admin/workshops/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Basic Swar Yoga Master Class",
    ...all fields...
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Workshop not found
- `500` - Server error

---

### 5️⃣ UPDATE WORKSHOP

```
Endpoint: PUT /api/admin/workshops/:id
Method: PUT
Purpose: Update workshop fields
Parameter: id - Workshop ID
Content-Type: application/json
```

**cURL Example:**
```bash
curl -X PUT http://localhost:4000/api/admin/workshops/1 \
  -H "Content-Type: application/json" \
  -d '{
    "priceINR": 6000,
    "priceUSD": 70,
    "maxParticipants": 75
  }'
```

**Request Body:**
- Any fields to update (optional)
- ID cannot be changed
- created_at cannot be changed
- updated_at is auto-updated

**Response:**
```json
{
  "success": true,
  "message": "Workshop updated successfully",
  "data": {
    "id": "1",
    "title": "Basic Swar Yoga Master Class",
    "priceINR": 6000,
    "priceUSD": 70,
    "maxParticipants": 75,
    "updated_at": "2025-12-04T16:00:00.000Z",
    ...
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Workshop not found
- `500` - Server error

---

### 6️⃣ DELETE WORKSHOP

```
Endpoint: DELETE /api/admin/workshops/:id
Method: DELETE
Purpose: Delete workshop
Parameter: id - Workshop ID
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:4000/api/admin/workshops/2
```

**Response:**
```json
{
  "success": true,
  "message": "Workshop deleted successfully",
  "data": {
    "id": "2",
    "title": "90 Days Weight Loss Program",
    ...deleted workshop data...
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Workshop not found
- `500` - Server error

---

### 7️⃣ TOGGLE VISIBILITY

```
Endpoint: PATCH /api/admin/workshops/:id/visibility
Method: PATCH
Purpose: Toggle public/private visibility
Parameter: id - Workshop ID
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:4000/api/admin/workshops/1/visibility
```

**Logic:**
- If `isPublic: true` → becomes `false` (hidden)
- If `isPublic: false` → becomes `true` (visible)

**Response:**
```json
{
  "success": true,
  "message": "Workshop is now private",
  "data": {
    "id": "1",
    "title": "Basic Swar Yoga Master Class",
    "isPublic": false,
    "updated_at": "2025-12-04T16:05:00.000Z",
    ...
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Workshop not found
- `500` - Server error

---

## 🎯 COMMON WORKFLOWS

### Create, Update, Delete Cycle

```
1. CREATE Workshop
   POST /api/admin/workshops
   → Returns new workshop with ID
   → Data saved to server-data.json
   → BroadcastChannel notifies public page

2. GET Workshop by ID
   GET /api/admin/workshops/{id}
   → Retrieves workshop details
   → Useful for editing form

3. UPDATE Workshop
   PUT /api/admin/workshops/{id}
   → Updates specific fields
   → Timestamps updated automatically
   → Data saved immediately

4. TOGGLE Visibility
   PATCH /api/admin/workshops/{id}/visibility
   → Makes workshop public/private
   → Public page auto-reflects change

5. DELETE Workshop
   DELETE /api/admin/workshops/{id}
   → Removes workshop completely
   → Data saved (removed from file)
```

---

## 📊 DATA PERSISTENCE

### Where Data is Saved
```
File: /project 13/server-data.json
Location: Root project directory
Format: JSON
```

### What Gets Saved
```json
{
  "workshops": [
    {
      "id": "...",
      "title": "...",
      "instructor": "...",
      "startDate": "2025-05-15",
      "endDate": "2025-05-17",
      "priceINR": 5000,
      "priceNPR": 8000,
      "priceUSD": 60,
      "isPublic": true,
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-12-04T16:00:00.000Z"
    }
  ]
}
```

### When Data is Saved
- ✅ Immediately after POST (create)
- ✅ Immediately after PUT (update)
- ✅ Immediately after DELETE (delete)
- ✅ Immediately after PATCH (toggle)

---

## 🔄 AUTO-UPDATE FLOW

### After Any Change
```
1. API endpoint processes request
   ↓
2. Data saved to server-data.json
   ↓
3. Response sent to frontend
   ↓
4. Frontend admin component receives response
   ↓
5. BroadcastChannel broadcasts update
   ↓
6. localStorage trigger set
   ↓
7. Public page receives broadcast
   ↓
8. Public page calls GET /api/admin/workshops/public
   ↓
9. New data fetched
   ↓
10. Component re-renders
    ↓
11. ✅ User sees changes instantly
```

---

## 🛡️ ERROR RESPONSES

### Bad Request (400)
```json
{
  "success": false,
  "error": "Missing required fields: title, instructor, startDate, endDate"
}
```

**Common Causes:**
- Missing required fields in POST
- Invalid data format

### Not Found (404)
```json
{
  "success": false,
  "error": "Workshop not found"
}
```

**Common Causes:**
- Wrong ID in GET, PUT, DELETE, PATCH
- Workshop was deleted

### Server Error (500)
```json
{
  "success": false,
  "error": "Failed to create workshop"
}
```

**Common Causes:**
- File system error
- JSON parsing error
- Server crash

---

## 💡 USAGE TIPS

### 1. Test Endpoints
Use Postman, Insomnia, or curl to test endpoints

### 2. Check Data
```bash
# View current data in file
cat /project\ 13/server-data.json

# Or use jq for formatted output
cat /project\ 13/server-data.json | jq '.workshops'
```

### 3. Monitor Changes
```
Open DevTools (F12)
→ Network tab
→ Filter by "workshops"
→ Watch API calls
```

### 4. Debug Issues
Check:
- Server running on port 4000?
- Network tab showing errors?
- Browser console showing errors?
- server-data.json exists?

---

## ✅ VERIFICATION

All endpoints ✅ working perfectly
All data ✅ persisting correctly
All routes ✅ responding properly
All errors ✅ handled gracefully

---

**Last Updated:** December 4, 2025  
**Status:** ✅ Production Ready  
**All Endpoints:** ✅ Verified Working
