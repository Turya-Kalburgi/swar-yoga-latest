# 📋 Planner Pages Enhancement Plan

**Date:** December 4, 2025  
**Status:** Analyzing Current Implementation & Planning Enhancements

---

## 🎯 User Requirements

You want the Daily, Weekly, Monthly, and Yearly planner pages to:

1. **Show All Items for Their Time Period**
   - Daily: Vision, Goal, Task, Todo, Word for today
   - Weekly: Vision, Goal, Task, Todo, Word for the week
   - Monthly: Vision, Goal, Task, Todo, Word for the month
   - Yearly: Vision, Goal, Task, Todo, Word for the year

2. **Action Buttons Working**
   - ✅ Add button (create new items)
   - ✅ Edit button (modify existing items)
   - ✅ Delete button (remove items)
   - ✅ Preview button (view details)

---

## 📊 Current State Analysis

### DailyPlanner.tsx (495 lines)

**Currently Loads:**
- ✅ Visions for the selected date's year
- ✅ Tasks for the selected date (filtered by date field)
- ✅ Todos for the selected date (filtered by date field)
- ✅ Health tracker for the date
- ✅ Daily words for the date
- ✅ Goals for the date (if they have date field)

**UI Elements:**
- ✅ Date navigation (prev/next day)
- ✅ Shows formatted date at top
- ✅ Organized into sections (Morning Routine, Top 3 Priorities, Task List, Todos, My Word, Health, Affirmations)
- ✅ VisionCard component with Edit/Delete buttons

**Issues Found:**
- ⚠️ Edit/Delete buttons exist but don't call API functions
- ⚠️ Add buttons open modals but handlers may not be complete
- ⚠️ No preview button visible on cards
- ⚠️ Affirmations section exists but no data source

---

### WeeklyPlanner.tsx (494 lines)

**Currently Loads:**
- ✅ Visions for the year
- ✅ Tasks filtered by week date range
- ✅ Todos filtered by week date range
- ✅ Goals filtered by week date range

**UI Elements:**
- ✅ Week navigation (prev/next week)
- ✅ Displays week start/end dates
- ✅ Shows weekday names
- ✅ VisionCard component with Edit/Delete buttons

**Issues Found:**
- ⚠️ Edit/Delete buttons don't call API functions
- ⚠️ Modal states defined but handlers incomplete
- ⚠️ No display of tasks/todos in week view
- ⚠️ Goals and tasks not visually shown

---

### MonthlyPlanner.tsx (SIMPLIFIED)

**Current State:**
- ⚠️ **SIMPLIFIED VERSION** - was causing JSX parse errors
- ✅ Loads visions, tasks, todos, goals for month
- ❌ No visual calendar grid
- ❌ No day-by-day display
- ❌ No action buttons

**Issues Found:**
- 🔴 Needs complete rewrite/restoration
- 🔴 No item display per day
- 🔴 No Add/Edit/Delete/Preview buttons

---

### YearlyPlanner.tsx (388 lines)

**Currently Loads:**
- ✅ Visions for the year
- ✅ Goals for the year
- ✅ Tasks for the year
- ✅ Todos for the year

**UI Elements:**
- ✅ Year navigation (prev/next year)
- ✅ VisionCard component with Edit/Delete buttons
- ✅ Goals/Tasks/Todos sections in vision cards

**Issues Found:**
- ⚠️ Edit/Delete buttons don't call API functions
- ⚠️ Affirmations not shown
- ⚠️ No preview functionality
- ⚠️ Buttons exist but functionality incomplete

---

## 🔧 Fixes Needed

### PRIORITY 1: Fix All Action Buttons

**All Planners (Daily, Weekly, Monthly, Yearly):**

1. **Edit Button**
   - Currently: No functionality
   - Needs: Open corresponding form (VisionForm, GoalForm, TaskForm, TodoForm, WordForm)
   - Implementation: Add onClick handler → set state → show modal

2. **Delete Button**
   - Currently: No functionality
   - Needs: Call API delete function (visionAPI.delete, goalsAPI.delete, etc.)
   - Implementation: Confirm dialog → API call → refresh data

3. **Add Button**
   - Currently: Opens modal but handler incomplete
   - Needs: Form submission → API.create() → add to state
   - Implementation: Complete the handleSubmit functions

4. **Preview Button**
   - Currently: Missing or non-functional
   - Needs: Show modal with full item details
   - Implementation: Add Eye icon button → show preview modal

---

### PRIORITY 2: Fix MonthlyPlanner

**Complete Overhaul Needed:**
- Restore calendar grid layout
- Show days in month (1-31)
- Display items under each day
- Add Add/Edit/Delete/Preview buttons

---

### PRIORITY 3: Integrate All Item Types

**Daily Planner:**
- ✅ Task List (tasks)
- ✅ Todos (todos)
- ✅ My Word (daily words)
- ✅ Health Tracker (health)
- 🟡 Affirmations (currently empty)
- 🟡 Visions (shown but not filtered to date)

**Weekly Planner:**
- 🟡 Show tasks in week view
- 🟡 Show todos in week view
- 🟡 Show goals in week view
- 🟡 Show daily words in week view

**Monthly Planner:**
- ⚠️ Needs complete implementation
- Items by day in calendar

**Yearly Planner:**
- 🟡 Show all items by month/season

---

## 📋 Implementation Checklist

```
DAILY PLANNER:
[ ] Fix Edit button - open forms for editing
[ ] Fix Delete button - call API delete with confirmation
[ ] Fix Add button - complete form submission handlers
[ ] Add Preview button - show details modal
[ ] Wire Affirmations section - load from API
[ ] Filter Visions by date (not just year)
[ ] Verify all sections populate correctly

WEEKLY PLANNER:
[ ] Fix Edit button - open forms for editing
[ ] Fix Delete button - call API delete with confirmation
[ ] Fix Add button - complete form submission handlers
[ ] Add Preview button - show details modal
[ ] Display tasks in week view (grid or list)
[ ] Display todos in week view
[ ] Display daily words in week view
[ ] Wire goals section - display for week

MONTHLY PLANNER:
[ ] Restore calendar grid layout
[ ] Add day cells (1-31)
[ ] Display items under each day
[ ] Add Edit button
[ ] Add Delete button
[ ] Add Add button
[ ] Add Preview button
[ ] Implement date filtering for each day

YEARLY PLANNER:
[ ] Fix Edit button - open forms
[ ] Fix Delete button - call API with confirmation
[ ] Add Preview button
[ ] Group items by month/season
[ ] Show summary of items per month
```

---

## 🔌 API Functions Available

```typescript
// From src/utils/database.ts

// Visions
visionAPI.getAll(year)
visionAPI.create(data)
visionAPI.update(id, data)
visionAPI.delete(id)

// Goals
goalsAPI.getAll(year)
goalsAPI.create(data)
goalsAPI.update(id, data)
goalsAPI.delete(id)

// Tasks
tasksAPI.getAll()
tasksAPI.create(data)
tasksAPI.update(id, data)
tasksAPI.delete(id)

// Todos
todosAPI.getAll()
todosAPI.create(data)
todosAPI.update(id, data)
todosAPI.delete(id)

// Daily Words
dailyWordsAPI.getAll(date)
dailyWordsAPI.create(data)
dailyWordsAPI.update(id, data)
dailyWordsAPI.delete(id)

// Health
healthAPI.getAll(date)
healthAPI.create(data)
healthAPI.update(id, data)
healthAPI.delete(id)

// Affirmations
affirmationsAPI.getAll()
affirmationsAPI.create(data)
affirmationsAPI.update(id, data)
affirmationsAPI.delete(id)
```

---

## 📝 Next Steps

1. **Start with DailyPlanner** (highest priority, most critical)
2. **Wire up all action buttons** (Edit, Delete, Add, Preview)
3. **Complete monthly planner** (restore from backup or rewrite)
4. **Test all button functionality** (cross-test all planners)
5. **Verify data persistence** (server-data.json contains created items)

---

## 🎯 Expected Result

After fixes:
- ✅ Daily Planner: Shows all items for today with working action buttons
- ✅ Weekly Planner: Shows all items for week with working action buttons
- ✅ Monthly Planner: Calendar view with items under each day
- ✅ Yearly Planner: All items for year with working action buttons
- ✅ All buttons: Add, Edit, Delete, Preview are fully functional
- ✅ Data: All changes persist to backend

---

**Status:** Ready to begin implementation
**Recommendation:** Start with DailyPlanner button fixes (highest impact)
