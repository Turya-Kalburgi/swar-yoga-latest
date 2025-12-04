# 🔧 PLANNER PAGES ENHANCEMENT - IMPLEMENTATION ROADMAP

**Status:** Ready to Implement  
**Priority:** Daily → Weekly → Monthly → Yearly

---

## 📋 WHAT NEEDS TO BE DONE

### Tier 1: Wire Up All Action Buttons (Critical)

#### ALL Planners (Daily, Weekly, Monthly, Yearly):
```typescript
// EDIT BUTTON
onClick={() => setEditingItem(item); setShowEditForm(true);}
// Then open appropriate form (VisionForm, GoalForm, etc.)

// DELETE BUTTON
onClick={async () => {
  if (confirm('Delete this item?')) {
    const api = getApiForItemType(item.type); // visionAPI, goalsAPI, etc.
    await api.delete(item.id);
    // Refresh data
  }
}}

// ADD BUTTON  
onClick={() => setShowAddForm(true)}
// Then open appropriate form

// PREVIEW BUTTON
onClick={() => setPreviewingItem(item); setShowPreviewModal(true)}
// Show modal with full details
```

---

### Tier 2: Data Display Enhancement

#### DailyPlanner:
- ✅ Currently loads: Visions, Tasks, Todos, Health, Daily Words, Goals
- 🔄 Needs: Display all in organized sections
- 🔄 Needs: Filter to selected date properly
- ❌ Missing: Affirmations display

#### WeeklyPlanner:
- ✅ Currently loads: Visions, Tasks, Todos, Goals (by week date range)
- ❌ Missing: Visual display of tasks/todos by day
- ❌ Missing: Daily words display
- ❌ Missing: Affirmations

#### MonthlyPlanner:
- 🔴 BROKEN: Currently simplified, missing calendar grid
- Needs: Full calendar view (Sun-Sat, days 1-31)
- Needs: Items displayed under each day
- Needs: All buttons working

#### YearlyPlanner:
- ✅ Currently loads visions/goals/tasks/todos for year
- 🟡 Needs: Better organization (by month/season)
- ❌ Missing: Affirmations
- ❌ Missing: Daily words summary

---

### Tier 3: Complete Features

- [ ] Edit modal with form pre-populated
- [ ] Delete confirmation dialog
- [ ] Preview modal with full details
- [ ] Add new item modals
- [ ] Date/time selection for items
- [ ] Filtering by item type/priority
- [ ] Search functionality

---

## 🚀 QUICK START FIXES

### Fix 1: Add Edit/Delete/Preview Handlers to DailyPlanner

**Changes needed:**
1. Add state for editing:
   ```typescript
   const [editingVision, setEditingVision] = useState<any>(null);
   const [editingGoal, setEditingGoal] = useState<any>(null);
   const [previewingVision, setPreviewingVision] = useState<any>(null);
   ```

2. Wire Edit buttons:
   ```typescript
   <button onClick={() => setEditingVision(vision)} title="Edit">
     <Edit className="h-4 w-4" />
   </button>
   ```

3. Wire Delete buttons:
   ```typescript
   <button 
     onClick={async () => {
       if (confirm(`Delete "${vision.title}"?`)) {
         try {
           await visionAPI.delete(vision.id);
           setVisions(prev => prev.filter(v => v.id !== vision.id));
         } catch (err) {
           console.error('Delete failed:', err);
           alert('Failed to delete');
         }
       }
     }}
     title="Delete"
   >
     <Trash2 className="h-4 w-4" />
   </button>
   ```

4. Wire Preview buttons:
   ```typescript
   <button onClick={() => setPreviewingVision(vision)} title="Preview">
     <Eye className="h-4 w-4" />
   </button>
   ```

---

### Fix 2: Add Edit Modal Handler

Show VisionForm when editing:
```typescript
{editingVision && (
  <VisionForm
    initialData={editingVision}
    onSubmit={async (data) => {
      const updated = await visionAPI.update(editingVision.id, data);
      setVisions(prev => prev.map(v => v.id === editingVision.id ? updated : v));
      setEditingVision(null);
    }}
    onCancel={() => setEditingVision(null)}
  />
)}
```

---

### Fix 3: Display All Sections Properly

**DailyPlanner sections:**
1. Today's Visions (Vision cards with Add button)
2. Today's Goals (Goal cards with Add button)
3. Task List (Tasks for today with Add button)
4. My To-Dos (Todos for today with Add button)
5. My Word (Daily words with Add button)
6. Affirmations (Affirmations with Add button)
7. Health Tracker (Health entries with Add button)

Each section should show:
- ✅ Add button
- ✅ List of items with checkboxes
- ✅ Edit button on hover
- ✅ Delete button on hover
- ✅ Preview button

---

## 📊 Implementation Sequence

**Phase 1 (Today):**
1. ✅ Document current state
2. ⏳ Wire Edit/Delete/Preview buttons for DailyPlanner
3. ⏳ Test button functionality
4. ⏳ Add Edit modals

**Phase 2 (Soon):**
5. ⏳ Fix WeeklyPlanner buttons and display
6. ⏳ Restore MonthlyPlanner calendar
7. ⏳ Fix YearlyPlanner buttons

**Phase 3 (Polish):**
8. ⏳ Add filtering/search
9. ⏳ Add date/time selection
10. ⏳ Full testing

---

## 💡 Key Insights

### Current State:
- Buttons exist in UI but are "dummy" (no onClick handlers)
- Forms exist (VisionForm, GoalForm) but aren't used for editing
- Data loads from API but isn't fully displayed

### What's Needed:
- Add onClick handlers to all buttons
- Connect Edit to form pre-population
- Connect Delete to API call with confirmation
- Connect Add to form in create mode
- Connect Preview to show full details modal

### API Pattern:
```typescript
// All APIs follow this pattern:
await visionAPI.create(data)      // Returns: created item
await visionAPI.getAll(year)      // Returns: array of items
await visionAPI.update(id, data)  // Returns: updated item
await visionAPI.delete(id)        // Returns: success message
```

---

## ✅ Success Criteria

After implementation:
- [ ] All Add buttons create new items via forms
- [ ] All Edit buttons open forms with item data pre-filled
- [ ] All Delete buttons remove items with confirmation
- [ ] All Preview buttons show full item details
- [ ] All changes persist to backend (server-data.json)
- [ ] All planners display correct items for their time period
- [ ] No console errors
- [ ] Responsive on mobile

---

## 📝 Notes

- VisionForm and GoalForm already exist and work
- Need to check if TaskForm, TodoForm, WordForm exist
- If not, create them or use simple modal inputs
- All APIs already configured and tested
- Data already loads, just needs wiring

---

**Ready to implement: YES ✅**
**Estimated time: 2-3 hours for full implementation**
**Most critical: DailyPlanner button wiring (high impact)**
