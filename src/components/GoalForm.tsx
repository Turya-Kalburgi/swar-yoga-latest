import React, { useState } from 'react';
import { Plus, Trash2, CheckSquare, Heart, Calendar, DollarSign, FileText, X } from 'lucide-react';

interface GoalFormProps {
  onSubmit: (goalData: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const GoalForm: React.FC<GoalFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [goal, setGoal] = useState<any>({
    title: initialData?.title || initialData?.name || '',
    description: initialData?.description || '',
    visionTitle: initialData?.visionTitle || '',
    visionId: initialData?.visionId || null,
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    startTime: initialData?.startTime || '',
    endTime: initialData?.endTime || '',
    budget: initialData?.budget || '',
    priority: initialData?.priority || 'Medium',
    status: initialData?.status || 'In Progress',
    progress: initialData?.progress || 0,
    note: initialData?.note || '',
    tasks: initialData?.tasks || [],
    todos: initialData?.todos || [],
    milestones: initialData?.milestones || [],
    myWord: initialData?.myWord || { text: '', dateTime: '', completed: false }
  });

  const addTask = () => {
    setGoal((g: any) => ({
      ...g,
      tasks: [
        ...g.tasks,
        { name: '', date: '', time: '', note: '', budget: '', priority: 'Medium', completed: false }
      ]
    }));
  };

  const removeTask = (index: number) => {
    const updated = { ...goal };
    updated.tasks.splice(index, 1);
    setGoal(updated);
  };

  const addTodo = () => {
    setGoal((g: any) => ({
      ...g,
      todos: [ ...g.todos, { text: '', dueDate: '', priority: 'Medium', completed: false } ]
    }));
  };

  const removeTodo = (index: number) => {
    const updated = { ...goal };
    updated.todos.splice(index, 1);
    setGoal(updated);
  };

  // Milestones for this goal (optional nested)
  const addMilestone = () => {
    setGoal((g: any) => ({
      ...g,
      milestones: [
        ...(g.milestones || []),
        { name: '', startDate: '', endDate: '', budget: '', note: '' }
      ]
    }));
  };

  const removeMilestone = (index: number) => {
    const updated = { ...goal };
    (updated.milestones || []).splice(index, 1);
    setGoal(updated);
  };

  const updateMilestoneField = (mIndex: number, field: string, value: any) => {
    const updated = { ...goal } as any;
    updated.milestones[mIndex][field] = value;
    setGoal(updated);
  };

  const updateField = (field: string, value: any) => setGoal((g: any) => ({ ...g, [field]: value }));

  const updateTaskField = (tIndex: number, field: string, value: any) => {
    const updated = { ...goal };
    updated.tasks[tIndex][field] = value;
    setGoal(updated);
  };

  const updateTodoField = (i: number, field: string, value: any) => {
    const updated = { ...goal };
    updated.todos[i][field] = value;
    setGoal(updated);
  };

  const updateMyWord = (field: string, value: any) => {
    setGoal((g: any) => ({ ...g, myWord: { ...g.myWord, [field]: value } }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(goal);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold flex items-center space-x-2"><span>Goal</span></h3>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Goal Title *</label>
              <input required value={goal.title} onChange={e => updateField('title', e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <input value={goal.description} onChange={e => updateField('description', e.target.value)} placeholder="Goal description" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="text-sm font-medium"><Calendar className="inline h-4 w-4 mr-1"/> Start Date</label>
              <input type="date" value={goal.startDate} onChange={e => updateField('startDate', e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="text-sm font-medium"><Calendar className="inline h-4 w-4 mr-1"/> End Date</label>
              <input type="date" value={goal.endDate} onChange={e => updateField('endDate', e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="text-sm font-medium"><DollarSign className="inline h-4 w-4 mr-1"/> Budget</label>
              <input type="number" value={goal.budget} onChange={e => updateField('budget', e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="text-sm font-medium">Start Time</label>
              <input type="time" value={goal.startTime} onChange={e => updateField('startTime', e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="text-sm font-medium">End Time</label>
              <input type="time" value={goal.endTime} onChange={e => updateField('endTime', e.target.value)} className="w-full p-2 border rounded" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium"><FileText className="inline h-4 w-4 mr-1"/> Notes</label>
            <textarea value={goal.note} onChange={e => updateField('note', e.target.value)} rows={3} className="w-full p-2 border rounded" />
          </div>

          {/* Milestones Section (optional nested milestones under goal) */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-semibold">Milestones ({(goal.milestones || []).length})</h5>
              <button type="button" onClick={addMilestone} className="inline-flex items-center space-x-2 bg-blue-600 text-white px-3 py-1 rounded text-sm"><Plus className="h-4 w-4"/><span>Add Milestone</span></button>
            </div>

            <div className="space-y-2">
              {(goal.milestones || []).map((m: any, mi: number) => (
                <div key={mi} className="p-2 border rounded bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Milestone {mi + 1}</div>
                    <button type="button" onClick={() => removeMilestone(mi)} className="text-red-600 p-1 rounded"><Trash2 className="h-4 w-4"/></button>
                  </div>
                  <input value={m.name} onChange={e => updateMilestoneField(mi, 'name', e.target.value)} placeholder="Milestone name" className="w-full p-2 border rounded mb-2" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input type="date" value={m.startDate} onChange={e => updateMilestoneField(mi, 'startDate', e.target.value)} className="p-2 border rounded" />
                    <input type="date" value={m.endDate} onChange={e => updateMilestoneField(mi, 'endDate', e.target.value)} className="p-2 border rounded" />
                    <input type="number" value={m.budget} onChange={e => updateMilestoneField(mi, 'budget', e.target.value)} className="p-2 border rounded" placeholder="Budget" />
                  </div>
                  <textarea value={m.note} onChange={e => updateMilestoneField(mi, 'note', e.target.value)} rows={2} className="w-full p-2 border rounded mt-2" placeholder="Milestone notes" />
                </div>
              ))}
            </div>
          </div>

          {/* My Word */}
          <div className="bg-red-50 p-3 rounded border">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-semibold">My Word</h5>
              <div className="text-sm text-gray-600">Integrity / Commitment</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input value={goal.myWord?.text || ''} onChange={e => updateMyWord('text', e.target.value)} className="p-2 border rounded" placeholder="Word / commit" />
              <input type="datetime-local" value={goal.myWord?.dateTime || ''} onChange={e => updateMyWord('dateTime', e.target.value)} className="p-2 border rounded" />
            </div>
            <label className="mt-2 flex items-center space-x-2"><input type="checkbox" checked={!!goal.myWord?.completed} onChange={e => updateMyWord('completed', e.target.checked)} /> <span className="text-sm">Completed</span></label>
          </div>

          {/* Tasks list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-semibold">Tasks ({goal.tasks?.length || 0})</h5>
              <button type="button" onClick={addTask} className="inline-flex items-center space-x-2 bg-purple-600 text-white px-3 py-1 rounded text-sm"><Plus className="h-4 w-4"/><span>Add Task</span></button>
            </div>
            <div className="space-y-2">
              {(goal.tasks || []).map((t: any, i: number) => (
                <div key={i} className="p-2 border rounded bg-purple-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Task {i + 1}</div>
                    <button type="button" onClick={() => removeTask(i)} className="text-red-600 p-1 rounded"><Trash2 className="h-4 w-4"/></button>
                  </div>
                  <input value={t.name} onChange={e => updateTaskField(i, 'name', e.target.value)} placeholder="Task name" className="w-full p-2 border rounded mb-2" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input type="date" value={t.date} onChange={e => updateTaskField(i, 'date', e.target.value)} className="p-2 border rounded" />
                    <input type="time" value={t.time} onChange={e => updateTaskField(i, 'time', e.target.value)} className="p-2 border rounded" />
                    <input type="number" value={t.budget} onChange={e => updateTaskField(i, 'budget', e.target.value)} className="p-2 border rounded" placeholder="Budget" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* To-dos list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-semibold">To-Dos ({goal.todos?.length || 0})</h5>
              <button type="button" onClick={addTodo} className="inline-flex items-center space-x-2 bg-orange-600 text-white px-3 py-1 rounded text-sm"><Plus className="h-4 w-4"/><span>Add To-do</span></button>
            </div>
            <div className="space-y-2">
              {(goal.todos || []).map((td: any, i: number) => (
                <div key={i} className="p-2 border rounded bg-orange-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">To-do {i + 1}</div>
                    <button type="button" onClick={() => removeTodo(i)} className="text-red-600 p-1 rounded"><Trash2 className="h-4 w-4"/></button>
                  </div>
                  <input value={td.text} onChange={e => updateTodoField(i, 'text', e.target.value)} placeholder="To-do text" className="w-full p-2 border rounded mb-2" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input type="date" value={td.dueDate} onChange={e => updateTodoField(i, 'dueDate', e.target.value)} className="p-2 border rounded" />
                    <select value={td.priority} onChange={e => updateTodoField(i, 'priority', e.target.value)} className="p-2 border rounded">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">{initialData ? 'Update Goal' : 'Create Goal'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;
