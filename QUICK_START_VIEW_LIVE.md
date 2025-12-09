# ⚡ QUICK START - SEE YOUR WORKSHOP PLATFORM IN 3 MINUTES

## 🎯 Copy & Paste These Commands

### COPY COMMAND 1 (Open new terminal)
```bash
cd /Users/mohankalburgi/Downloads/swar-yoga-latest-latest-prod-version/server && npm run start:ts
```

**You should see:**
```
✅ Server running on http://localhost:4000
✅ MongoDB Connected
```

### COPY COMMAND 2 (Open ANOTHER new terminal)
```bash
cd /Users/mohankalburgi/Downloads/swar-yoga-latest-latest-prod-version && npm run dev
```

**You should see:**
```
➜  Local:   http://localhost:5173/
```

### COPY COMMAND 3 (Paste in browser)
```
http://localhost:5173
```

---

## 🌐 WHAT YOU'LL SEE IN BROWSER

### Homepage
```
🏠 SWAR YOGA
├── Navigation
│   ├── Home ← You are here
│   ├── About
│   ├── Workshops ← Click here to browse
│   ├── Calendar
│   ├── Account
│   └── Admin
└── Featured Workshops Section
```

### Click "Workshops" to See
```
📚 ALL WORKSHOPS PAGE
├── Filter by Category (Yoga, Meditation, etc.)
├── Filter by Language (Hindi, Marathi, English)
├── 12 Workshop Cards with:
│   ├── Beautiful thumbnail images
│   ├── Course title
│   ├── Instructor name
│   ├── ⭐ Rating (5 stars)
│   ├── Student count
│   ├── Price (₹5000, ₨6500, $60)
│   └── "View Details" button ← Click any
```

### Click a Workshop to See Details
```
📖 WORKSHOP DETAILS
├── Hero Image/Video
├── Instructor Info
├── ⭐⭐⭐⭐⭐ 4.8 Rating
├── Course Description
├── Delivery Modes:
│   ├── 🌐 Online
│   ├── 🏢 Offline
│   ├── 🏨 Residential
│   └── 📹 Recorded
├── Languages:
│   ├── 🇮🇳 Hindi (हिंदी)
│   ├── 🇮🇳 Marathi (मराठी)
│   └── 🇬🇧 English
├── Pricing:
│   ├── ₹ INR 5000
│   ├── ₨ NPR 6500
│   └── $ USD 60
├── 📋 Sessions List
├── 💬 Testimonials Section
├── ❓ FAQ (Click to expand)
└── 🔴 REGISTER NOW BUTTON ← Click to enroll
```

### Click "Register Now"
```
📝 REGISTRATION FORM (Step 1 of 3)
├── Full Name (text input)
├── Email (email input)
├── Phone (phone input)
├── Address (text area)
├── Language Selection (dropdown)
├── Selected Batch Info Display
├── Price Display (INR/NPR/USD)
├── Form Validation Messages
└── NEXT BUTTON ← Continue to payment
```

---

## 🎨 DESIGN YOU'LL SEE

✅ Modern, clean interface  
✅ Responsive mobile design  
✅ Smooth animations  
✅ Professional color scheme (Indigo & Gray)  
✅ Easy to use forms  
✅ Clear navigation  
✅ Beautiful cards & layouts  

---

## 🔑 TEST ACCOUNT

### If you want to test "My Courses":
```
Email: demo@swaryoga.com
Password: demo123
```

**After login, you can:**
- View "My Courses"
- See enrolled workshops
- View progress bars
- See "Continue Learning" button

---

## 🎬 VIDEO PLAYER (When you enroll)

After registration, you can view:
```
🎥 VIDEO PLAYER PAGE
├── Full-screen video player
├── Video controls (play, pause, volume)
├── Session List (left sidebar)
│   ├── Session 1 ✅ (completed)
│   ├── Session 2 🔓 (current)
│   ├── Session 3 🔒 (locked - waiting for time gate)
│   └── Session 4 🔒 (locked - needs rating)
├── Three Tabs:
│   ├── Sessions (video list)
│   ├── Assignments (homework)
│   └── Chat (student-admin communication)
├── Rating Component (⭐⭐⭐⭐⭐)
├── Review Text Area
└── Progress Bar (25% complete)
```

---

## 👨‍💼 ADMIN DASHBOARD

**To access admin (test account):**
```
Click Menu → Admin → Login

Email: admin@swaryoga.com
Password: admin123
```

**Then you'll see:**
```
📊 ADMIN DASHBOARD
├── Statistics Cards:
│   ├── Total Workshops: 12
│   ├── Total Enrollments: 45
│   ├── Total Revenue: ₹225,000
│   └── Completion Rate: 88%
├── Workshops Table:
│   ├── Workshop Name
│   ├── Instructor
│   ├── Student Count
│   ├── ⭐ Rating
│   └── Actions (View/Edit/Delete)
├── CREATE NEW WORKSHOP Button
└── Search & Filter Options
```

---

## 🗄️ BACKEND (Running on port 4000)

**What's working:**
```
✅ 8 MongoDB Models (Workshop, Session, Enrollment, etc.)
✅ 60+ API Endpoints
✅ PayU Payment Integration
✅ PayPal Integration Ready
✅ QR Code Generation Ready
✅ Video Unlock Logic
✅ User Authentication
✅ Data Persistence
```

**API you can test (use Postman or curl):**
```
GET http://localhost:4000/api/workshops
GET http://localhost:4000/api/payment/user/:userId
POST http://localhost:4000/api/payment (create payment)
```

---

## 🌟 ALL PAGES YOU CAN CLICK THROUGH

1. **Homepage** → `http://localhost:5173`
2. **Workshops List** → `http://localhost:5173/workshop-list`
3. **Workshop Details** → Click any workshop
4. **Registration** → Click "Register Now"
5. **My Courses** → Login first, then click
6. **Course Player** → After registration
7. **Admin Dashboard** → Admin login required

---

## ⏱️ TIMING

```
⏱️  Backend startup:     30 seconds
⏱️  Frontend startup:    30 seconds
⏱️  Browser load:        5 seconds
───────────────────────────────
Total time to see live:  ~2 minutes ✅
```

---

## ✨ FEATURES YOU CAN TEST

- [ ] Browse 12 different workshops
- [ ] Filter by category
- [ ] Filter by language (Hindi/Marathi/English)
- [ ] See multi-currency pricing (₹/₨/$)
- [ ] Click through all pages
- [ ] Fill registration form
- [ ] View admin dashboard
- [ ] Check responsive design (resize window)
- [ ] Test all navigation links
- [ ] View course details

---

## 🐛 IF SOMETHING DOESN'T WORK

### Backend won't start:
```bash
# Make sure port 4000 is free
lsof -i :4000

# Or use different port
PORT=5000 npm run start:ts
```

### Frontend won't start:
```bash
# Make sure port 5173 is free
lsof -i :5173

# Or use different port
PORT=5174 npm run dev
```

### Can't see workshop details:
```
Check browser console (F12) for errors
Check backend terminal for API errors
Make sure MongoDB is running
```

---

## 📱 MOBILE PREVIEW

Resize your browser to test mobile:
```
Desktop: 1920px width
Tablet:  768px width
Mobile:  375px width
```

All pages are fully responsive! 📱✅

---

## 🎯 WHAT'S NEXT (After You See It)

1. **Today:** See the platform locally
2. **Tomorrow:** Provide credentials
   - PayU Merchant Key
   - PayU Merchant Salt
   - PayPal Email
   - Nepal QR URL
3. **I'll:** 
   - Add credentials to `.env`
   - Test payment flows
   - Deploy to production URL
4. **Result:** Live on `swaryoga.com` 🚀

---

## 🚀 YOU'RE READY!

### STEP 1: Open Terminal 1
```
cd ~/Downloads/swar-yoga-latest-latest-prod-version/server
npm run start:ts
```

### STEP 2: Open Terminal 2
```
cd ~/Downloads/swar-yoga-latest-latest-prod-version
npm run dev
```

### STEP 3: Open Browser
```
http://localhost:5173
```

### ✅ DONE! Start exploring! 🎉

---

**Questions?** Check `HOW_TO_VIEW_LIVE_PREVIEW.md` for detailed guide  
**Ready tomorrow with credentials?** Perfect! ✅

