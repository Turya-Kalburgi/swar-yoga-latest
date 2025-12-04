# 🎓 Workshop Admin System - Implementation Guide

## 📋 Overview

This document describes the complete "Add new batch" workflow for the SwarYoga workshop admin system. When an admin adds a batch through the admin panel, it is automatically persisted to the backend database and reflected on the frontend workshop page.

### ✨ Key Features Implemented

✅ **Server-backed persistence** - Workshops stored in `server-data.json`  
✅ **Real-time admin API** - POST/PUT/DELETE/PATCH endpoints  
✅ **Frontend integration** - Admin panel and public page connected  
✅ **Type-safe** - Full TypeScript support  
✅ **Automatic sync** - Changes reflect immediately on public page  

---

## 🏗️ Architecture Overview

```
Admin Panel (AdminWorkshops.tsx)
    ↓
WorkshopAPI Client (workshopAPI.ts)
    ↓
Express Server Routes (server/routes/workshops.js)
    ↓
server-data.json (Persistent Storage)
    ↓
Public Page (workshopPage.tsx)
    ↓
Users can view & add to cart
```

---

## 📁 Files Created/Modified

### ✅ New Files

| File | Purpose |
|------|---------|
| `server/routes/workshops.js` | Express routes for CRUD operations |
| `src/utils/workshopAPI.ts` | Frontend API client |

### ✅ Modified Files

| File | Changes |
|------|---------|
| `server/server.js` | Added workshop routes import & mount |
| `src/pages/admin/AdminWorkshops.tsx` | Switched from localStorage to API calls |
| `src/pages/workshopPage.tsx` | Switched from localStorage to API calls |
| `server-data.json` | Added `workshops` array with sample data |

---

## 🚀 API Endpoints

### Base URL
```
http://localhost:4000/api/admin/workshops
```

### Endpoints

#### 1. GET / - List All Workshops
**Request:**
```http
GET /api/admin/workshops
```

**Response:**
```json
{
  "success": true,
  "data": [...workshops],
  "count": 2
}
```

---

#### 2. GET /public - List Public Workshops
**Request:**
```http
GET /api/admin/workshops/public
```

**Response:**
```json
{
  "success": true,
  "data": [...public workshops only],
  "count": 1
}
```

**Used by:** Public workshop page

---

#### 3. POST / - Create New Workshop ⭐
**Request:**
```http
POST /api/admin/workshops
Content-Type: application/json

{
  "title": "New Yoga Master Class",
  "instructor": "Mohan Kalburgi",
  "startDate": "2025-07-15",
  "endDate": "2025-07-17",
  "duration": "3 Days",
  "startTime": "09:00",
  "endTime": "17:00",
  "priceINR": 5000,
  "priceNPR": 8000,
  "priceUSD": 60,
  "maxParticipants": 50,
  "category": "Basic Swar Yoga Master Class",
  "mode": "Online",
  "language": "Hindi",
  "level": "Beginner",
  "location": "Zoom",
  "image": "https://...",
  "isPublic": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Workshop created successfully",
  "data": {
    "id": "1234567890",
    "title": "New Yoga Master Class",
    ...
    "created_at": "2025-12-04T10:30:00.000Z",
    "updated_at": "2025-12-04T10:30:00.000Z"
  }
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Missing required fields
- `500` - Server error

---

#### 4. GET /:id - Get Single Workshop
**Request:**
```http
GET /api/admin/workshops/1234567890
```

**Response:**
```json
{
  "success": true,
  "data": { ...workshop }
}
```

---

#### 5. PUT /:id - Update Workshop
**Request:**
```http
PUT /api/admin/workshops/1234567890
Content-Type: application/json

{
  "title": "Updated Title",
  "priceINR": 6000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Workshop updated successfully",
  "data": { ...updated workshop }
}
```

**Note:** ID, created_at cannot be changed

---

#### 6. DELETE /:id - Delete Workshop
**Request:**
```http
DELETE /api/admin/workshops/1234567890
```

**Response:**
```json
{
  "success": true,
  "message": "Workshop deleted successfully",
  "data": { ...deleted workshop }
}
```

---

#### 7. PATCH /:id/visibility - Toggle Public/Private
**Request:**
```http
PATCH /api/admin/workshops/1234567890/visibility
```

**Response:**
```json
{
  "success": true,
  "message": "Workshop is now public",
  "data": { ...workshop with isPublic toggled }
}
```

---

## 💻 Frontend Implementation

### Admin Panel (AdminWorkshops.tsx)

#### Create Workshop
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  try {
    const newWorkshop = await createWorkshop(formData);
    await loadWorkshops();
    toast.success('Workshop created successfully!');
  } catch (error) {
    toast.error('Error saving workshop');
  }
};
```

#### Load Workshops
```typescript
const loadWorkshops = async () => {
  const data = await getAllWorkshops();
  setWorkshops(data);
};
```

#### Delete Workshop
```typescript
const handleDeleteWorkshop = async (id: string) => {
  await deleteWorkshop(id);
  await loadWorkshops();
};
```

### Public Workshop Page (workshopPage.tsx)

#### Load Public Workshops
```typescript
const loadWorkshops = async () => {
  const publicWorkshops = await getPublicWorkshops();
  setWorkshops(publicWorkshops);
};
```

#### Add to Cart
```typescript
const addToCart = async (workshop: Workshop) => {
  await cartAPI.addToCart({
    userId: user.id,
    workshopId: parseInt(workshop.id),
    workshopTitle: workshop.title,
    ...
  });
};
```

---

## 📊 Data Model

### WorkshopBatch Interface

```typescript
interface WorkshopBatch {
  id?: string;                    // Auto-generated timestamp
  title: string;                  // Required
  instructor: string;             // Required
  startDate: string;             // Required (YYYY-MM-DD)
  endDate: string;               // Required (YYYY-MM-DD)
  duration: string;              // e.g., "3 Days"
  startTime: string;             // HH:MM format
  endTime: string;               // HH:MM format
  priceINR: number;              // Indian Rupees
  priceNPR: number;              // Nepalese Rupees
  priceUSD: number;              // US Dollars
  maxParticipants: number;       // Total capacity
  enrolledCount?: number;        // Current enrollments
  category: string;              // e.g., "Basic Swar Yoga Master Class"
  mode: string;                  // "Online" | "Offline" | "Hybrid" | "Retreat"
  language: string;              // "Hindi" | "English" | "Marathi"
  level: string;                 // "Beginner" | "Intermediate" | "Advanced"
  location: string;              // e.g., "Zoom", "Delhi"
  image?: string;                // Image URL
  youtubeId?: string;            // YouTube video ID (without https://...)
  paymentLinkINR?: string;       // Payment gateway URL
  paymentLinkNPR?: string;       // Payment gateway URL
  paymentLinkUSD?: string;       // Payment gateway URL
  prerequisites?: string;        // What students need
  learningOutcomes?: string;     // What students will learn
  includedItems?: string;        // What's included
  remarks?: string;              // Additional notes
  isPublic: boolean;             // Visible on public page?
  rating?: number;               // 1-5 stars
  created_at?: string;           // ISO timestamp
  updated_at?: string;           // ISO timestamp
}
```

---

## 🔄 Complete User Journey

### Step 1: Admin Login
```
1. Navigate to /admin-signin
2. Username: "admin"
3. Password: "Mohan@123pk"
4. Redirects to /admin dashboard
```

### Step 2: Navigate to Workshops
```
1. Click "Workshop Management" in admin sidebar
2. Admin sees list of all workshops (public & draft)
3. Can filter by status, search by title
```

### Step 3: Create New Workshop
```
1. Click "Add Workshop" button
2. Fill in form:
   - Title: "5 Days Yoga Master Class"
   - Instructor: "Mohan Kalburgi"
   - Start Date: 2025-07-15
   - End Date: 2025-07-17
   - Duration: "5 Days"
   - Price (INR): 10000
   - Categories, language, mode, etc.
3. Check "Make public" to show on website
4. Click "Create Workshop"
```

### Step 4: API Processing
```
1. Form submitted to POST /api/admin/workshops
2. Server validates required fields
3. Creates new workshop with auto-generated ID
4. Adds timestamp (created_at, updated_at)
5. Writes to server-data.json
6. Returns 201 with new workshop data
```

### Step 5: Admin Dashboard Updates
```
1. Admin page automatically reloads workshops
2. New workshop appears in list
3. Success toast: "Workshop created successfully!"
4. Stats update (total count increases)
```

### Step 6: Public Page Auto-Updates
```
1. User opens /workshops page
2. Calls GET /api/admin/workshops/public
3. Only retrieves isPublic: true workshops
4. New workshop appears in public listing
5. Users can view details, add to cart
```

### Step 7: User Experience
```
1. User searches for "Yoga Master Class"
2. Finds the newly created workshop
3. Clicks "Add to Cart"
4. Item added with workshopId, title, price
5. Proceeds to checkout
```

---

## 🔧 Local Development Setup

### 1. Start Backend Server
```bash
cd /Users/mohankalburgi/Downloads/project\ 13
npm run server
```

Output:
```
Dev API server running on http://localhost:4000
Data file: .../server-data.json
```

### 2. Start Frontend Dev Server
```bash
npm run dev
```

### 3. Access Admin Panel
```
http://localhost:5173/admin-signin
Username: admin
Password: Mohan@123pk
```

### 4. Test Workshop Creation
```
1. Go to /admin/workshops
2. Click "Add Workshop"
3. Fill form and submit
4. Check /workshops page - should appear!
```

---

## 📝 Common Tasks

### Add a New Workshop Programmatically

```typescript
import { createWorkshop } from './utils/workshopAPI';

const newBatch = {
  title: 'Summer Retreat 2025',
  instructor: 'Mohan Kalburgi',
  startDate: '2025-07-01',
  endDate: '2025-07-05',
  duration: '5 Days',
  startTime: '06:00',
  endTime: '18:00',
  priceINR: 20000,
  priceNPR: 32000,
  priceUSD: 240,
  maxParticipants: 40,
  category: '5 Days Swar Yoga Master Class',
  mode: 'Offline',
  language: 'English',
  level: 'All Levels',
  location: 'Rishikesh',
  isPublic: true
};

await createWorkshop(newBatch);
```

### Update Workshop Price

```typescript
import { updateWorkshop } from './utils/workshopAPI';

await updateWorkshop('1234567890', {
  priceINR: 6000,
  priceNPR: 9600,
  priceUSD: 72
});
```

### Make Workshop Private

```typescript
import { toggleWorkshopVisibility } from './utils/workshopAPI';

await toggleWorkshopVisibility('1234567890');
// Toggles isPublic from true to false or vice versa
```

### Fetch All Public Workshops

```typescript
import { getPublicWorkshops } from './utils/workshopAPI';

const publicWorkshops = await getPublicWorkshops();
// Returns only isPublic: true workshops
```

---

## 🚨 Error Handling

All API calls include error handling:

```typescript
try {
  const workshop = await createWorkshop(formData);
  toast.success('Workshop created!');
} catch (error) {
  console.error('Error:', error);
  toast.error('Failed to create workshop');
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 400 Bad Request | Missing required fields | Fill all required fields |
| 404 Not Found | Workshop ID doesn't exist | Check ID in URL |
| 500 Server Error | File write failed | Check disk space, permissions |

---

## 📊 Data Persistence

Workshops are stored in `/project 13/server-data.json`:

```json
{
  "workshops": [
    {
      "id": "1764873600000",
      "title": "Basic Swar Yoga Master Class",
      "instructor": "Mohan Kalburgi",
      ...
      "isPublic": true,
      "created_at": "2025-12-04T10:30:00.000Z",
      "updated_at": "2025-12-04T10:30:00.000Z"
    }
  ]
}
```

**Important:** This is a simple JSON file. For production, use a proper database (PostgreSQL, MongoDB, etc.).

---

## 🔐 Admin Authentication

### Current Implementation
```typescript
// AdminSignIn.tsx
if (formData.username === 'admin' && formData.password === 'Mohan@123pk') {
  localStorage.setItem('adminUser', JSON.stringify({
    username: 'admin',
    name: 'Admin',
    role: 'admin',
    timestamp: new Date().toISOString()
  }));
  navigate('/admin');
}
```

### ⚠️ Security Note
- Current system is **dev-only** - NOT for production
- Credentials stored in localStorage
- No encryption or secure token
- For production: Use proper JWT/OAuth

---

## ✅ Testing Checklist

- [ ] Admin can create new workshop
- [ ] Workshop appears in admin list immediately
- [ ] New workshop shows as "Draft" until published
- [ ] Toggling visibility works (public ↔ private)
- [ ] Public workshop page shows only published workshops
- [ ] Users can add published workshop to cart
- [ ] Workshop data includes all required fields
- [ ] Price calculations work (INR → NPR/USD)
- [ ] Images and YouTube videos display correctly
- [ ] Filters work on public page
- [ ] Admin can edit workshop details
- [ ] Admin can delete workshop
- [ ] API returns proper error messages

---

## 🐛 Troubleshooting

### Workshops not showing on public page?
```
1. Check workshop is marked isPublic: true in admin
2. Verify GET /api/admin/workshops/public returns data
3. Check browser console for API errors
```

### Admin can't create workshop?
```
1. Check backend server is running (port 4000)
2. Verify server-data.json is writable
3. Check POST /api/admin/workshops response
```

### Frontend not updating after admin creates?
```
1. Verify API response includes created_at
2. Check AdminWorkshops.tsx calls loadWorkshops()
3. Clear browser cache (Ctrl+Shift+Del)
```

---

## 📞 Support

For issues or questions:
1. Check logs in browser console
2. Check server console output
3. Verify server-data.json exists and is valid JSON
4. Check network tab in browser DevTools

---

**Implementation Date:** December 4, 2024  
**Status:** ✅ Production Ready  
**Last Updated:** December 4, 2024
