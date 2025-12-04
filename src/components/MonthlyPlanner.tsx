import React, { useEffect, useState } from 'react';
import { tasksAPI, todosAPI, visionAPI, goalsAPI } from '../utils/database';
import { 
  Calendar, 
  Target, 
  CheckSquare, 
  Heart, 
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import VisionForm from './VisionForm';
import GoalForm from './GoalForm';

const MonthlyPlanner: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [editingVision, setEditingVision] = useState<any | null>(null);
  const [editingGoal, setEditingGoal] = useState<any | null>(null);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [editingTodo, setEditingTodo] = useState<any | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedMonth);
    if (direction === 'next') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setSelectedMonth(newDate);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const initialMyVisions: any[] = [];

  const days = getDaysInMonth(selectedMonth);
  const [visions, setVisions] = useState<any[]>(initialMyVisions);
  const [tasks, setTasks] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth();
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0);

        const [vw, allTasks, allTodos, allGoals] = await Promise.all([
          visionAPI.getAll(year),
          tasksAPI.getAll(),
          todosAPI.getAll(),
          goalsAPI.getAll(year)
        ]);

        if (Array.isArray(vw) && vw.length) setVisions(vw);

        const inRange = (dStr: string) => {
          const d = new Date(dStr);
          return d >= start && d <= end;
        };

        setTasks(Array.isArray(allTasks) ? allTasks.filter((t: any) => t.date ? inRange(t.date) : true) : []);
        setTodos(Array.isArray(allTodos) ? allTodos.filter((t: any) => t.date ? inRange(t.date) : true) : []);
        setGoals(Array.isArray(allGoals) ? allGoals.filter((g: any) => g.date ? inRange(g.date) : true) : []);
      } catch (err) {
        console.warn('Failed to load monthly planner data', err);
      }
    };

    load();
  }, [selectedMonth]);

  // Delete handlers
  const handleDeleteVision = async (visionId: number) => {
    if (!confirm('Delete this vision? This action cannot be undone.')) return;
    try {
      await visionAPI.delete(visionId);
      setVisions(prev => prev.filter(v => v.id !== visionId));
    } catch (err) {
      console.error('Failed to delete vision', err);
      alert('Could not delete vision — see console');
    }
  };

  const handleDeleteGoal = async (goalId: number) => {
    if (!confirm('Delete this goal? This action cannot be undone.')) return;
    try {
      await goalsAPI.delete(goalId);
      setGoals(prev => prev.filter(g => g.id !== goalId));
    } catch (err) {
      console.error('Failed to delete goal', err);
      alert('Could not delete goal — see console');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Delete this task? This action cannot be undone.')) return;
    try {
      await tasksAPI.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task', err);
      alert('Could not delete task — see console');
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    if (!confirm('Delete this todo? This action cannot be undone.')) return;
    try {
      await todosAPI.delete(todoId);
      setTodos(prev => prev.filter(t => t.id !== todoId));
    } catch (err) {
      console.error('Failed to delete todo', err);
      alert('Could not delete todo — see console');
    }
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get items for a specific date
  const getItemsForDate = (dayNum: number | null) => {
    if (!dayNum) return { visions: [], goals: [], tasks: [], todos: [] };
    
    const dateStr = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), dayNum).toISOString().slice(0, 10);
    
    return {
      visions: visions.filter(v => v.date === dateStr || !v.date),
      goals: goals.filter(g => g.date === dateStr || !g.date),
      tasks: tasks.filter(t => t.date === dateStr),
      todos: todos.filter(t => t.date === dateStr)
    };
  };

  const CalendarDay = ({ dayNum, isOtherMonth }: { dayNum: number | null; isOtherMonth: boolean }) => {
    if (!dayNum) {
      return <div className="bg-gray-50 min-h-24"></div>;
    }

    const isToday = dayNum === new Date().getDate() && 
                    selectedMonth.getMonth() === new Date().getMonth() &&
                    selectedMonth.getFullYear() === new Date().getFullYear();

    const items = getItemsForDate(dayNum);
    const dateStr = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), dayNum).toISOString().slice(0, 10);
    const hasItems = items.visions.length > 0 || items.goals.length > 0 || items.tasks.length > 0 || items.todos.length > 0;

    return (
      <div className={`min-h-24 p-2 border ${isToday ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'} hover:bg-gray-50 transition-colors`}>
        <div className="flex items-center justify-between mb-1">
          <span className={`text-sm font-bold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
            {dayNum}
          </span>
          <button 
            onClick={() => {
              setSelectedDate(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), dayNum));
              setShowAddModal(true);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-all duration-300 opacity-0 hover:opacity-100"
            title="Add item"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        {/* Show item count badges */}
        <div className="flex flex-wrap gap-1 text-[10px]">
          {items.visions.length > 0 && <span className="bg-purple-100 text-purple-700 px-1.5 rounded">V:{items.visions.length}</span>}
          {items.goals.length > 0 && <span className="bg-blue-100 text-blue-700 px-1.5 rounded">G:{items.goals.length}</span>}
          {items.tasks.length > 0 && <span className="bg-green-100 text-green-700 px-1.5 rounded">T:{items.tasks.length}</span>}
          {items.todos.length > 0 && <span className="bg-cyan-100 text-cyan-700 px-1.5 rounded">D:{items.todos.length}</span>}
        </div>

        {/* Show first vision title if exists */}
        {items.visions.length > 0 && (
          <div className="text-[10px] text-purple-600 font-medium truncate mt-1">
            {items.visions[0].title}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg sm:rounded-xl p-3 sm:p-6 text-white shadow-md sm:shadow-xl">
          <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">Monthly Planner</h1>
          <p className="text-xs sm:text-base text-orange-100">{formatMonth(selectedMonth)}</p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 sm:p-3 text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          
          <button
            onClick={() => setSelectedMonth(new Date())}
            className="px-3 py-1.5 sm:px-5 sm:py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-medium text-xs sm:text-sm"
          >
            This Month
          </button>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 sm:p-3 text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-orange-200 p-2 sm:p-4 mb-6">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center font-bold text-gray-700 text-xs sm:text-sm p-2 bg-gradient-to-r from-orange-50 to-red-50 rounded">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((dayNum, index) => (
            <CalendarDay key={index} dayNum={dayNum} isOtherMonth={false} />
          ))}
        </div>
      </div>

      {/* Info section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-900 font-medium">Click a date to view or add items for that day</p>
          <p className="text-xs text-blue-700 mt-1">Legend: V=Visions, G=Goals, T=Tasks, D=Daily Todo's</p>
        </div>
      </div>

      {/* Add New Vision Button */}
      <div className="mb-6">
        <button 
          onClick={() => {
            setSelectedDate(null);
            setShowAddModal(true);
          }}
          className="flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-xs sm:text-sm"
        >
          <Plus className="h-3 w-3 sm:h-5 sm:w-5" />
          <span className="font-medium">Add New Vision</span>
        </button>
      </div>

      {/* Visions Grid for Month Overview */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Month's Visions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visions.map(vision => (
            <div key={vision.id} className="bg-white rounded-lg shadow border border-purple-200 p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{vision.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{vision.description}</p>
                </div>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => setEditingVision(vision)}
                    className="p-1 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-all duration-300"
                    title="Edit"
                  >
                    <Edit className="h-3 w-3" />
                  </button>
                  <button 
                    onClick={() => handleDeleteVision(vision.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-all duration-300"
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 transition-all duration-500"
                  style={{ width: `${vision.progress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-2">{vision.progress}% complete</div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modals */}
      {showAddModal && selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Add Item for {selectedDate.toLocaleDateString()}</h3>
            <div className="space-y-4">
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedDate(null);
                }}
                className="w-full flex items-center space-x-3 p-3 border border-purple-200 rounded-lg hover:bg-purple-50 transition-all"
              >
                <Eye className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-gray-700">Add Vision</span>
              </button>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedDate(null);
                }}
                className="w-full flex items-center space-x-3 p-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all"
              >
                <Target className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-700">Add Goal</span>
              </button>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedDate(null);
                }}
                className="w-full flex items-center space-x-3 p-3 border border-green-200 rounded-lg hover:bg-green-50 transition-all"
              >
                <CheckSquare className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-700">Add Task</span>
              </button>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedDate(null);
                }}
                className="w-full flex items-center space-x-3 p-3 border border-cyan-200 rounded-lg hover:bg-cyan-50 transition-all"
              >
                <CheckSquare className="h-5 w-5 text-cyan-600" />
                <span className="font-medium text-gray-700">Add Todo</span>
              </button>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedDate(null);
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vision Modal */}
      {editingVision && (
        <VisionForm
          initialData={editingVision}
          onCancel={() => setEditingVision(null)}
          onSubmit={async (visionData) => {
            try {
              const updated = await visionAPI.update(editingVision.id, visionData);
              setVisions(prev => prev.map(v => v.id === editingVision.id ? updated : v));
              setEditingVision(null);
            } catch (err) {
              console.error('Failed to update vision', err);
              alert('Could not update vision — see console');
            }
          }}
        />
      )}

      {/* Edit Goal Modal */}
      {editingGoal && (
        <GoalForm
          initialData={editingGoal}
          onCancel={() => setEditingGoal(null)}
          onSubmit={async (goalData) => {
            try {
              const updated = await goalsAPI.update(editingGoal.id, goalData);
              setGoals(prev => prev.map(g => g.id === editingGoal.id ? updated : g));
              setEditingGoal(null);
            } catch (err) {
              console.error('Failed to update goal', err);
              alert('Could not update goal — see console');
            }
          }}
        />
      )}
    </div>
  );
};

export default MonthlyPlanner;