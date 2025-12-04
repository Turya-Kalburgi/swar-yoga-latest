# Frontend Page Audit & Fix Plan

**Date:** December 4, 2025  
**Status:** IN PROGRESS

## Pages to Audit & Fix

### 1. **Front Pages** (Public)
- [ ] `HomePage.tsx` – Check for dummy data, ensure API connections
- [ ] `AboutPage.tsx` – Static content
- [ ] `Blog.tsx` – Check for dummy data
- [ ] `ContactPage.tsx` – Ensure form connects to contactAPI
- [ ] `PrivacyPage.tsx` – Static
- [ ] `TermsPage.tsx` – Static
- [ ] `RefundPage.tsx` – Static

### 2. **Auth Pages**
- [ ] `SignUpPage.tsx` – Ensure uses auth API
- [ ] `SignInPage.tsx` – Ensure uses auth API

### 3. **E-Commerce Pages**
- [ ] `CartPage.tsx` – Check cartAPI connection
- [ ] `CheckoutPage.tsx` – Verify checkout flow
- [ ] `OrderHistory.tsx` – Verify orderAPI
- [ ] `ThankYouPage.tsx` – Post-checkout confirmation

### 4. **Workshops & Events**
- [ ] `workshopPage.tsx` – Check dummy workshop data, wire to API

### 5. **Life Planner Pages** (Core)
- [ ] `LifePlanner.tsx` – **ISSUE: Uses hardcoded affirmations + localStorage instead of affirmationsAPI**
- [ ] `SwarCalendar.tsx` – Check dummy data

### 6. **Admin Pages** (Protected)
- [ ] `AdminDashboard.tsx` – Review admin data
- [ ] `AdminAccounting.tsx` – Check accounting data flow
- [ ] `AdminSigninData.tsx` – Display signin data from API
- [ ] `AdminSignupData.tsx` – Display signup data from API
- [ ] `AdminCartData.tsx` – Display cart data
- [ ] `AdminContactData.tsx` – Display contact submissions
- [ ] `AdminWorkshops.tsx` – Display workshops
- [ ] `CertificateCreator.tsx` – Certificate generation logic

---

## Issues Found

### **Critical Issues (Blocking)**

1. **LifePlanner.tsx - Positive Affirmations**
   - **Issue:** Uses hardcoded `affirmations` state with default data
   - **Impact:** Data not persisted to server, always shows dummy data
   - **Fix:** Replace with `affirmationsAPI` from `src/utils/database.ts`
   - **Action:**
     ```typescript
     // BEFORE (WRONG):
     const [affirmations, setAffirmations] = useState([{id: 1, text: "...", ...}, ...])
     
     // AFTER (CORRECT):
     useEffect(() => {
       affirmationsAPI.getAll().then(setAffirmations);
     }, []);
     
     // On add/edit/delete:
     await affirmationsAPI.create(newAffirmation);
     ```

2. **LifePlanner.tsx - Mock Auth**
   - **Issue:** Login uses mock validation, doesn't call `authAPI`
   - **Impact:** No real authentication flow
   - **Fix:** Call `/api/auth/login` endpoint
   - **Action:**
     ```typescript
     const handleLogin = async (e: React.FormEvent) => {
       try {
         const response = await apiClient.post('/auth/login', loginData);
         localStorage.setItem('user', JSON.stringify(response.data));
         setUser(response.data);
       } catch (error) {
         alert('Login failed: ' + error.message);
       }
     };
     ```

3. **HomePage.tsx - Static Content**
   - **Issue:** Hardcoded membership details
   - **Status:** Acceptable for marketing page (no fix needed unless dynamic)

---

## Database API Functions Available

From `src/utils/database.ts`, use these:

```typescript
visionAPI.getAll(), .create(), .update(), .delete()
goalsAPI.getAll(), .create(), .update(), .delete()
tasksAPI.getAll(), .create(), .update(), .delete()
todosAPI.getAll(), .create(), .update(), .delete()
dailyWordsAPI.getAll(), .create(), .update(), .delete()
affirmationsAPI.getAll(), .create(), .update(), .delete()
healthAPI.getAll(), .create(), .update(), .delete()
peopleAPI.getAll(), .create(), .update(), .delete()
```

---

## Fixes to Implement (Priority Order)

### **Phase 1: Fix LifePlanner (Core Functionality)**
- [ ] Replace affirmations hardcoded state with `affirmationsAPI.getAll()`
- [ ] Wire add/edit/delete affirmation buttons to API endpoints
- [ ] Remove localStorage usage for affirmations
- [ ] Fix mock auth to use real `/api/auth/login` endpoint

### **Phase 2: Fix Admin Pages**
- [ ] Verify AdminDashboard loads real data
- [ ] Verify AdminAccounting displays accounting data
- [ ] Verify AdminSignupData, AdminSigninData display user lists
- [ ] Verify AdminCartData, AdminContactData show real submissions

### **Phase 3: Fix Workshop/Event Pages**
- [ ] Remove dummy workshop data
- [ ] Wire `workshopPage.tsx` to workshop API (if available)

### **Phase 4: Verify Other Pages**
- [ ] Test all routes load without errors
- [ ] Confirm forms submit to correct endpoints
- [ ] Verify all API calls use `visionAPI`, `goalsAPI`, etc., not mock data

---

## Testing Checklist

- [ ] `npm run dev` starts without errors
- [ ] `tsc --noEmit` passes with no warnings
- [ ] Life Planner dashboard loads
- [ ] Add Vision/Goal/Task/Todo/Affirmation works
- [ ] Data persists after refresh
- [ ] Admin pages show real data
- [ ] No console errors in DevTools

---

## Dummy Data Removal

**Files likely containing hardcoded/dummy data:**
- `LifePlanner.tsx` – affirmations array
- `workshopPage.tsx` – workshop cards
- `HomePage.tsx` – membership details (acceptable for static content)
- Admin pages – check if using mock data providers

**Action:** Search for `useState([{...}, {...}])` patterns and replace with API calls.

---

## Notes

- Backend API running on http://localhost:4000
- Frontend proxies `/api/*` to backend via Vite config
- `src/utils/database.ts` provides server-first + mock fallback
- All API calls should go through database.ts functions, not direct axios

