# 🚀 ADMIN PAGES - QUICK REFERENCE GUIDE

## 📍 QUICK NAVIGATION

### Login Page
```
Route: /admin
File: src/pages/AdminSignIn.tsx
Credentials: admin / Mohan@123pk
```

### Main Dashboard
```
Route: /admin/dashboard
File: src/pages/admin/AdminDashboard.tsx
Purpose: System overview with 8 stat cards
```

### Workshop Management
```
Route: /admin/workshops
File: src/pages/admin/AdminWorkshops.tsx
Features: CRUD + Auto-sync + Visibility toggle
```

### Cart Analytics
```
Route: /admin/cart-data
File: src/pages/admin/AdminCartData.tsx
Features: Sales analytics + Export + Debug tools
```

### User Management
```
Route: /admin/signup-data
File: src/pages/admin/AdminSignupData.tsx
Features: User CRUD + Bulk upload + Export
```

### Contact Messages
```
Route: /admin/contact-data
File: src/pages/admin/AdminContactData.tsx
Features: Message management + Email/WhatsApp replies
```

### Login Analytics
```
Route: /admin/signin-data
File: src/pages/admin/AdminSigninData.tsx
Features: Login tracking + IP logging + Analytics
```

### Financial Management
```
Route: /admin/accounting
File: src/pages/admin/AdminAccounting.tsx
Features: Income/expense tracking + Category management
```

### Certificate Creator
```
Route: /admin/certificates
File: src/pages/admin/CertificateCreator.tsx
Features: Certificate creation + PDF export
```

---

## 🎯 KEY FEATURES BY PAGE

### 1. Dashboard
| Feature | Details |
|---------|---------|
| Users | Total, Active, Active today |
| Workshops | Total, Public, Enrollments |
| Cart | Items, Value, Conversion rate |
| System | Database, API, Storage, Uptime |
| Performance | Satisfaction, Speed, Conversion, Rating |

### 2. Workshops ⭐ MOST IMPORTANT
| Action | Details |
|--------|---------|
| Create | Modal form, full workshop details |
| Read | Table with search/filter |
| Update | Edit all fields, date validation |
| Delete | Confirmation required |
| **Sync** | **BroadcastChannel + localStorage + polling** |

### 3. Cart Data
| Metric | Calculation |
|--------|-------------|
| Active Carts | Count status='active' |
| Abandoned | Count status='abandoned' |
| Purchased | Count status='purchased' |
| Conversion % | (purchased / total) × 100 |
| Total Value | Sum with currency conversion |

### 4. Signup Data
| Operation | Details |
|-----------|---------|
| Add User | Form validation, email check |
| Edit User | All fields updatable |
| Delete | Confirmation required |
| Bulk Upload | CSV import with template |
| Export | All users to CSV |

### 5. Contact Messages
| Action | Details |
|--------|---------|
| View | Table with all details |
| Mark Read | Change status to 'read' |
| Reply Email | Opens mailto with template |
| Reply WhatsApp | Opens WhatsApp with template |
| Delete | Confirmation required |

### 6. Login Analytics
| Time Period | Filter |
|-------------|--------|
| All Time | No filter |
| Today | Same calendar day |
| This Week | Last 7 days |
| This Month | Last 30 days |

### 7. Accounting
| Type | Details |
|------|---------|
| Income | Add income transactions |
| Expense | Add expense transactions |
| Categories | Income & Expense categories |
| Budget | Per-category budget limits |
| Export | Transaction CSV export |

### 8. Certificates
| Field | Details |
|-------|---------|
| Name | Participant's full name |
| Workshop | Workshop name attended |
| Type | Completion/Participation/Achievement |
| Date | Issue date for certificate |
| Photo | Optional participant photo |
| PDF | Download A4 landscape PDF |

---

## 🔑 ADMIN CREDENTIALS

```
┌─────────────────────────────┐
│ USERNAME:  admin            │
│ PASSWORD:  Mohan@123pk      │
└─────────────────────────────┘
```

### Session Storage
```javascript
localStorage.setItem('admin_session', JSON.stringify({
  username: 'admin',
  name: 'Admin',
  role: 'admin',
  timestamp: Date.now()
}))
```

---

## 🎨 COLOR SCHEME

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Primary Button | Blue | #3B82F6 | Main actions |
| Secondary Button | Gray | #6B7280 | Neutral actions |
| Success | Green | #10B981 | Positive feedback |
| Danger | Red | #EF4444 | Destructive actions |
| Warning | Yellow | #F59E0B | Alerts |
| Info | Indigo | #6366F1 | Information |
| Chart 1 | Purple | #A855F7 | Workshops |
| Chart 2 | Orange | #F97316 | Cart |
| Chart 3 | Pink | #EC4899 | Contact |

---

## 🔄 AUTO-SYNC SYSTEM

### How It Works:
```
┌─────────────────┐
│ Admin Tab 1     │  ← Creates workshop
└────────┬────────┘
         │ BroadcastChannel (instant)
         ↓
┌─────────────────┐
│ Admin Tab 2     │  ← Updates automatically (<1s)
└─────────────────┘

Fallback Chain:
1. BroadcastChannel API (< 1 second)
2. localStorage events (< 5 seconds)
3. Polling interval (10 seconds)
```

### What Syncs:
- ✅ Workshop additions
- ✅ Workshop updates
- ✅ Workshop deletions
- ✅ Visibility toggles
- ✅ All CRUD operations

---

## 🧪 DEBUG TOOLS

### Available in Each Page:

#### Workshops
- No specific debug section (uses production API)

#### Cart Data
```javascript
// Clear all cart data
await cartAPI.clearAllCartData()

// Refresh data
loadCartData()
```

#### Signup Data
```javascript
// Add Mohan Kalburgi
addMohanKalburgi()

// Clear all data
clearAllData()

// Refresh
loadUsers()
```

#### Contact Data
```javascript
// Clear all messages
clearAllMessages()

// Refresh
loadContactMessages()
```

#### Signin Data
```javascript
// Add signin record
addMohanSignin()

// Clear all data
clearAllData()

// Refresh
loadSignInData()
```

#### Accounting
```javascript
// Generate sample data
generateSampleData()

// Clear all data
clearAllData()

// Refresh
loadData()
```

#### Certificates
```javascript
// Delete certificate
handleDelete(id)

// Download PDF
handleDownload()

// Clear all
localStorage.removeItem('swaryoga_certificates')
```

---

## 📊 DATA STRUCTURE

### Workshop Object
```typescript
{
  id: number
  title: string
  instructor: string
  startDate: string
  endDate: string
  duration: string
  startTime: string
  endTime: string
  priceINR: number
  priceNPR: number
  priceUSD: number
  maxParticipants: number
  category: string
  mode: string ('Online'|'Offline'|'Hybrid')
  language: string
  level: string ('Beginner'|'Intermediate'|'Advanced')
  location: string
  image: string (URL)
  youtubeId: string
  paymentLinkINR: string (URL)
  paymentLinkNPR: string (URL)
  paymentLinkUSD: string (URL)
  prerequisites: string
  learningOutcomes: string
  includedItems: string
  remarks: string
  isPublic: boolean
  createdAt: string (ISO date)
  updatedAt: string (ISO date)
}
```

### User Object
```typescript
{
  id: number
  name: string
  email: string
  phone: string
  countryCode: string
  country: string
  state: string
  gender: string
  age: number
  profession: string
  registrationDate: string
  status: 'active'|'inactive'
  source: 'signup'|'signin'|'manual'|'csv_upload'
}
```

### Cart Item Object
```typescript
{
  id: number
  userId: number
  userName: string
  userEmail: string
  workshopId: number
  workshopTitle: string
  instructor: string
  price: number
  currency: string ('INR'|'USD'|'NPR')
  quantity: number
  addedAt: string
  status: 'active'|'abandoned'|'purchased'
}
```

### Contact Message Object
```typescript
{
  id: number|string
  name: string
  email: string
  whatsapp: string
  countryCode: string
  subject: string
  message: string
  submittedAt: string
  status: 'unread'|'read'|'replied'
  priority: 'low'|'medium'|'high'
}
```

### Transaction Object
```typescript
{
  id: number
  date: string
  description: string
  amount: number
  type: 'income'|'expense'
  category: string
  paymentMethod: string
  status: 'completed'|'pending'|'failed'
}
```

---

## 🚨 COMMON ISSUES & SOLUTIONS

### Issue: Workshop not appearing in list
**Solution:** Click "Refresh Data" button in debug tools

### Issue: Auto-sync not working
**Solution:** Check browser console → Ensure BroadcastChannel enabled

### Issue: PDF download fails
**Solution:** Check browser console → Ensure html2canvas loaded

### Issue: Search not working
**Solution:** Clear cache → Reload page

### Issue: Form validation error
**Solution:** Check all required fields have values

---

## 📈 PERFORMANCE TIPS

1. **Limit Search Results:** Search after 3 characters
2. **Use Filters:** Filter before viewing large datasets
3. **Export Large Data:** Use CSV export for > 1000 records
4. **Close Extra Tabs:** Reduce BroadcastChannel overhead
5. **Regular Data Cleanup:** Archive old records

---

## 🔐 SECURITY REMINDERS

1. ✅ Always logout when done
2. ✅ Never share admin password
3. ✅ Use strong device password
4. ✅ Clear browser cache regularly
5. ✅ Enable browser security features

---

## 📱 KEYBOARD SHORTCUTS

| Shortcut | Action |
|----------|--------|
| `Esc` | Close modal |
| `Enter` | Submit form |
| `Ctrl+F` | Open search |
| `Ctrl+P` | Print/PDF |

---

## 🆘 SUPPORT & HELP

### Report Issues:
1. Take screenshot
2. Note exact steps to reproduce
3. Check browser console for errors
4. Contact development team

### Debug Information:
- Browser: Chrome/Firefox/Safari
- Screen size: Width × Height
- Admin page: Exact URL
- Error message: Full error text

---

## 📚 RELATED DOCUMENTATION

- `ADMIN_PAGES_COMPREHENSIVE_AUDIT.md` - Full audit report
- `AUTO_UPDATE_FEATURE.md` - Auto-sync system details
- `API_ENDPOINTS_QUICK_REFERENCE.md` - Backend API docs
- `COMPLETE_VERIFICATION_REPORT.md` - System verification

---

**Last Updated:** December 4, 2025  
**Version:** 1.0  
**Status:** ✅ Production Ready
