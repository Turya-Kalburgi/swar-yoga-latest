# 🧪 PLANNER TESTING GUIDE

**Version:** 1.0  
**Date:** December 4, 2025  
**Status:** Ready for QA Testing

---

## 📋 Pre-Test Checklist

- [ ] Backend server running on port 4000
- [ ] Frontend running on port 5173
- [ ] No console errors
- [ ] Browser DevTools open (for debugging)
- [ ] Fresh `server-data.json` (or reset if needed)
- [ ] Test data ready (or use "Add" buttons to create)

---

## 🧪 Test Cases

### DailyPlanner Tests

#### Test 1.1: Add New Vision
- [ ] Navigate to Daily Planner
- [ ] Click "Add Vision" button
- [ ] Fill form with test vision data
- [ ] Click "Save"
- [ ] **Expected:** Vision appears in "Today's Visions" section
- [ ] **Expected:** Data persists after page reload

#### Test 1.2: Edit Vision
- [ ] Click Edit button on any vision card
- [ ] Modify vision data (title, description, etc.)
- [ ] Click "Save"
- [ ] **Expected:** Vision updates immediately
- [ ] **Expected:** Change persists after page reload

#### Test 1.3: Delete Vision
- [ ] Click Delete button on any vision card
- [ ] Confirm deletion in dialog
- [ ] **Expected:** Vision removed from display
- [ ] **Expected:** Deletion persists after page reload

#### Test 1.4: Preview Vision
- [ ] Click Eye/Preview button on vision card
- [ ] **Expected:** Modal opens showing full vision details
- [ ] Click Edit or Delete from preview modal
- [ ] **Expected:** Actions work from modal

#### Test 1.5: Add Goal
- [ ] Click "Add Goal" button
- [ ] Fill form with test goal data
- [ ] Click "Save"
- [ ] **Expected:** Goal appears in "Today's Goals" section
- [ ] **Expected:** Data persists

#### Test 1.6: Edit Goal
- [ ] Hover over goal, click Edit
- [ ] Modify goal data
- [ ] Click "Save"
- [ ] **Expected:** Goal updates immediately

#### Test 1.7: Delete Goal
- [ ] Hover over goal, click Delete
- [ ] Confirm deletion
- [ ] **Expected:** Goal removed from display

#### Test 1.8: Add Section Items (Tasks, Todos)
- [ ] Click "+" button in Task List section
- [ ] **Expected:** Form/modal opens
- [ ] Fill and save
- [ ] **Expected:** Item appears in section

#### Test 1.9: Date Navigation
- [ ] Click Previous/Next day buttons
- [ ] **Expected:** Planner shows different date
- [ ] **Expected:** Items change based on date
- [ ] Click "Today" button
- [ ] **Expected:** Planner returns to current date

---

### WeeklyPlanner Tests

#### Test 2.1: Week Navigation
- [ ] Navigate to Weekly Planner
- [ ] Click Previous/Next week buttons
- [ ] **Expected:** Calendar shows different week
- [ ] Click "This Week"
- [ ] **Expected:** Returns to current week

#### Test 2.2: Add Vision
- [ ] Click "Add New Vision" button
- [ ] Fill form
- [ ] **Expected:** Vision added to grid

#### Test 2.3: Edit Vision
- [ ] Click Edit button on vision card
- [ ] Modify and save
- [ ] **Expected:** Changes visible immediately

#### Test 2.4: Delete Vision
- [ ] Click Delete button
- [ ] Confirm
- [ ] **Expected:** Vision removed

#### Test 2.5: Goal Management
- [ ] For each vision card, test:
  - [ ] Add goal (click + button in Goals section)
  - [ ] Edit goal (click edit icon on goal)
  - [ ] Delete goal (click delete icon on goal)

#### Test 2.6: Task Management
- [ ] For each vision card:
  - [ ] Add task
  - [ ] Edit task
  - [ ] Delete task
  - [ ] Check/uncheck task

#### Test 2.7: Todo Management
- [ ] For each vision card:
  - [ ] Add todo
  - [ ] Edit todo
  - [ ] Delete todo
  - [ ] Check/uncheck todo

#### Test 2.8: Week Date Filtering
- [ ] Add items for different dates in the week
- [ ] Verify only week's items display
- [ ] Change to different week
- [ ] **Expected:** Previous week's items not shown

---

### MonthlyPlanner Tests

#### Test 3.1: Calendar Display
- [ ] Navigate to Monthly Planner
- [ ] **Expected:** Calendar grid visible with 7 columns
- [ ] **Expected:** Day headers show (Sun, Mon, Tue, etc.)
- [ ] **Expected:** Days 1-31 properly positioned
- [ ] **Expected:** Today is highlighted

#### Test 3.2: Month Navigation
- [ ] Click Previous/Next month buttons
- [ ] **Expected:** Calendar shows different month
- [ ] Click "This Month"
- [ ] **Expected:** Returns to current month

#### Test 3.3: Item Count Badges
- [ ] Add multiple items to a single day
- [ ] **Expected:** Count badges appear (V:1, G:2, T:3, D:1)
- [ ] **Expected:** Vision title shows below badges

#### Test 3.4: Add Item from Calendar
- [ ] Click "+" button on a day cell
- [ ] **Expected:** Menu appears with options (Add Vision, Goal, Task, Todo)
- [ ] Click each option
- [ ] **Expected:** Appropriate form opens
- [ ] Fill form for selected date
- [ ] **Expected:** Item added for that date

#### Test 3.5: Vision Edit/Delete in Month Overview
- [ ] Scroll to "Month's Visions" section
- [ ] Click Edit button on vision card
- [ ] Modify and save
- [ ] **Expected:** Changes visible
- [ ] Click Delete button
- [ ] Confirm
- [ ] **Expected:** Vision removed

#### Test 3.6: Date Filtering
- [ ] Add items to various days
- [ ] Check that count badges only show items from that day
- [ ] Navigate months
- [ ] **Expected:** Items only show for correct month

#### Test 3.7: Responsive Layout
- [ ] Resize browser window
- [ ] On mobile: Calendar should scroll horizontally if needed
- [ ] On tablet: Spacing should adjust
- [ ] On desktop: Full 7-column layout visible

---

### YearlyPlanner Tests

#### Test 4.1: Year Navigation
- [ ] Navigate to Yearly Planner
- [ ] Click Previous/Next year buttons
- [ ] **Expected:** Year in header changes
- [ ] Click "This Year"
- [ ] **Expected:** Returns to current year

#### Test 4.2: Add Vision
- [ ] Click "Add New Vision"
- [ ] Fill form
- [ ] **Expected:** Vision added to grid

#### Test 4.3: Edit Vision
- [ ] Click Edit button on vision card
- [ ] Modify and save
- [ ] **Expected:** Changes visible

#### Test 4.4: Delete Vision
- [ ] Click Delete button
- [ ] Confirm
- [ ] **Expected:** Vision removed

#### Test 4.5: Goal Management
- [ ] Inside vision card, test:
  - [ ] Add goal (+ button)
  - [ ] Edit goal (edit icon)
  - [ ] Delete goal (delete icon)

#### Test 4.6: Task Management
- [ ] Inside vision card:
  - [ ] Add task
  - [ ] Edit task
  - [ ] Delete task

#### Test 4.7: Todo Management
- [ ] Inside vision card:
  - [ ] Add todo
  - [ ] Edit todo
  - [ ] Delete todo

#### Test 4.8: Year Filtering
- [ ] Verify items only show for selected year
- [ ] Navigate to different year
- [ ] **Expected:** Different items or empty grid

---

## 🔄 Cross-Planner Tests

#### Test 5.1: Same Item Visibility
- [ ] Create item with date: Jan 15, 2025
- [ ] **Daily Planner:** Navigate to Jan 15
  - [ ] **Expected:** Item visible
- [ ] **Weekly Planner:** Navigate to week containing Jan 15
  - [ ] **Expected:** Item visible
- [ ] **Monthly Planner:** Navigate to January
  - [ ] **Expected:** Badge shows on day 15
- [ ] **Yearly Planner:** Stay in 2025
  - [ ] **Expected:** Item visible in vision card

#### Test 5.2: Edit in One, See in Others
- [ ] Edit item in Daily Planner
- [ ] Navigate to Weekly Planner
- [ ] **Expected:** Change is visible
- [ ] Edit same item in Weekly Planner
- [ ] Navigate to Daily Planner
- [ ] **Expected:** Latest change is visible

#### Test 5.3: Delete in One, Gone from Others
- [ ] Delete item from Daily Planner
- [ ] Reload page
- [ ] Go to Weekly Planner
- [ ] **Expected:** Item is gone
- [ ] Go to Monthly Planner
- [ ] **Expected:** Badge count decreased
- [ ] Go to Yearly Planner
- [ ] **Expected:** Item is gone

---

## 💾 Data Persistence Tests

#### Test 6.1: Server-Data.json Updates
- [ ] Add item in planner
- [ ] Check `server/server-data.json`
- [ ] **Expected:** New item appears in file
- [ ] Edit item
- [ ] **Expected:** Changes reflected in file
- [ ] Delete item
- [ ] **Expected:** Item removed from file

#### Test 6.2: Page Reload
- [ ] Add 3-5 test items
- [ ] Reload page (F5 or Cmd+R)
- [ ] **Expected:** Items still visible
- [ ] Edit an item
- [ ] Reload page
- [ ] **Expected:** Edit persists

#### Test 6.3: Date String Format
- [ ] Add items on different dates
- [ ] Check server-data.json
- [ ] **Expected:** All dates in "YYYY-MM-DD" format
- [ ] **Expected:** Items filter correctly by this format

---

## 🎨 UI/UX Tests

#### Test 7.1: Button Hover States
- [ ] Hover over Edit button
- [ ] **Expected:** Color changes, icon emphasized
- [ ] Hover over Delete button
- [ ] **Expected:** Different color (red tint)
- [ ] Hover over Add button
- [ ] **Expected:** Button scales slightly

#### Test 7.2: Responsive Buttons
- [ ] **Desktop:** All buttons visible
- [ ] **Tablet:** Buttons scale down, still clickable
- [ ] **Mobile:** Buttons still accessible, no overflow

#### Test 7.3: Modal Display
- [ ] Open any edit/add modal
- [ ] **Expected:** Background darkens
- [ ] **Expected:** Modal centered on screen
- [ ] **Expected:** Can scroll content if needed
- [ ] Click X or Cancel
- [ ] **Expected:** Modal closes, background returns to normal

#### Test 7.4: Confirmation Dialogs
- [ ] Try to delete an item
- [ ] **Expected:** Browser confirm dialog appears
- [ ] Click Cancel
- [ ] **Expected:** Item not deleted
- [ ] Try delete again, click OK
- [ ] **Expected:** Item deleted

---

## 🚨 Error Handling Tests

#### Test 8.1: Network Error Handling
- [ ] Stop backend server
- [ ] Try to add item in planner
- [ ] **Expected:** Error message shown
- [ ] **Expected:** Item not added
- [ ] Restart backend server
- [ ] Try add again
- [ ] **Expected:** Works normally

#### Test 8.2: Invalid Form Data
- [ ] Open Add/Edit form
- [ ] Try to submit with empty required fields
- [ ] **Expected:** Form validation error or warning
- [ ] Fill all fields correctly
- [ ] **Expected:** Form submits

#### Test 8.3: Concurrent Operations
- [ ] Open edit modal for item A
- [ ] In another tab, delete item A
- [ ] Try to save in first tab
- [ ] **Expected:** Graceful error or automatic refresh

---

## ✅ Test Completion Checklist

- [ ] All DailyPlanner tests passed
- [ ] All WeeklyPlanner tests passed
- [ ] All MonthlyPlanner tests passed
- [ ] All YearlyPlanner tests passed
- [ ] All Cross-Planner tests passed
- [ ] All Data Persistence tests passed
- [ ] All UI/UX tests passed
- [ ] All Error Handling tests passed
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Responsive on all screen sizes
- [ ] Performance acceptable (no lag)

---

## 📝 Bug Reporting Template

If issues found during testing:

```
ISSUE: [Brief description]
PLANNER: [Daily/Weekly/Monthly/Yearly]
SEVERITY: [Critical/High/Medium/Low]
STEPS TO REPRODUCE:
1. [Step 1]
2. [Step 2]
3. [Step 3]
EXPECTED: [What should happen]
ACTUAL: [What actually happened]
SCREENSHOTS: [Attached if visual]
CONSOLE ERRORS: [If any]
```

---

## 🎯 Success Criteria

✅ All tests pass  
✅ No TypeScript errors  
✅ No console errors  
✅ Data persists correctly  
✅ All buttons responsive  
✅ No performance issues  
✅ Responsive on all devices  
✅ Error handling works  

**Status:** Ready for QA Testing

---

**Prepared:** December 4, 2025  
**Estimated Testing Time:** 2-3 hours  
**Difficulty:** Low-Medium
