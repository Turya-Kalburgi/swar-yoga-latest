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
  X
} from 'lucide-react';
import VisionForm from './VisionForm';
import GoalForm from './GoalForm';

const WeeklyPlanner: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [selectedDayDate, setSelectedDayDate] = useState<Date | null>(null);
  const [editingVision, setEditingVision] = useState<any | null>(null);
  const [editingGoal, setEditingGoal] = useState<any | null>(null);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [editingTodo, setEditingTodo] = useState<any | null>(null);

  const getWeekDates = (date: Date) => {
    const week = [];
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day;
    startDate.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(selectedWeek);
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedWeek(newDate);
  };

  const initialMyVisions: any[] = [];

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const [visions, setVisions] = useState<any[]>(initialMyVisions);
  const [tasks, setTasks] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<'vision' | 'task' | 'todo' | 'goal'>('vision');
  const [showVisionModal, setShowVisionModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [newPriority, setNewPriority] = useState('Medium');

  useEffect(() => {
    const load = async () => {
      try {
        const weekStart = new Date(selectedWeek);
        const start = new Date(weekStart);
        const day = start.getDay();
        const diff = start.getDate() - day;
        start.setDate(diff);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);

        const [vw, allTasks, allTodos, allGoals] = await Promise.all([
          visionAPI.getAll(selectedWeek.getFullYear()),
          tasksAPI.getAll(),
          todosAPI.getAll(),
          goalsAPI.getAll(selectedWeek.getFullYear())
        ]);

        if (Array.isArray(vw) && vw.length) setVisions(vw);

        // filter tasks/todos for the week range if they have a date field
        const dateInRange = (dStr: string) => {
          const d = new Date(dStr);
          return d >= start && d <= end;
        };

        const weekTasks = Array.isArray(allTasks) ? allTasks.filter((t: any) => t.date ? dateInRange(t.date) : true) : [];
        const weekTodos = Array.isArray(allTodos) ? allTodos.filter((t: any) => t.date ? dateInRange(t.date) : true) : [];

        setTasks(weekTasks);
        setTodos(weekTodos);
        const weekGoals = Array.isArray(allGoals) ? allGoals.filter((g: any) => g.date ? dateInRange(g.date) : true) : [];
        setGoals(weekGoals);
      } catch (err) {
        console.warn('Failed to load weekly planner data', err);
      }
    };

    load();
  }, [selectedWeek]);

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

  const VisionCard = ({ vision }: { vision: any }) => (
    <div className={`bg-white rounded-lg sm:rounded-xl shadow-md border ${vision.border} p-4 sm:p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
      {/* Vision Header */}
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className={`p-2 sm:p-3 bg-gradient-to-r ${vision.color} rounded-lg shadow-md`}>
            <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm sm:text-lg font-bold text-gray-800">{vision.title}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">{vision.description}</p>
          </div>
        </div>
        <div className="flex space-x-1 sm:space-x-2">
          <button 
            onClick={() => setEditingVision(vision)}
            className="p-1 sm:p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-110"
            title="Edit Vision"
          >
            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button 
            onClick={() => handleDeleteVision(vision.id)}
            className="p-1 sm:p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-110"
            title="Delete Vision"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      {/* Vision Image */}
      <div className="mb-4 sm:mb-6">
        <img 
          src={vision.image} 
          alt={vision.title}
          className="w-full h-32 sm:h-40 object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between items-center mb-1 sm:mb-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700">Weekly Progress</span>
          <span className="text-xs sm:text-sm font-bold text-gray-800">{vision.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 shadow-inner">
          <div 
            className={`h-2 sm:h-3 rounded-full bg-gradient-to-r ${vision.color} transition-all duration-500 shadow-sm`}
            style={{ width: `${vision.progress}%` }}
          />
        </div>
      </div>

      {/* Goals Section */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
            <h4 className="text-xs sm:text-base font-bold text-gray-800">Weekly Goals</h4>
          </div>
          <button onClick={() => { setShowGoalModal(true); }} className="p-1 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {vision.goals.map((goal: any) => (
            <div key={goal.id} className={`group flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 ${vision.bg} rounded-lg border ${vision.border} hover:shadow-md transition-all duration-300`}>
              <input
                type="checkbox"
                checked={goal.completed}
                className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1 min-w-0">
                <span className={`text-xs sm:text-sm font-medium truncate ${goal.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {goal.text}
                </span>
                <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">Due: {goal.deadline}</div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 flex space-x-1 transition-opacity">
                <button 
                  onClick={() => setEditingGoal(goal)}
                  className="p-1 text-gray-400 hover:text-blue-600 rounded"
                  title="Edit Goal"
                >
                  <Edit className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </button>
                <button 
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded"
                  title="Delete Goal"
                >
                  <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks Section */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            <h4 className="text-xs sm:text-base font-bold text-gray-800">Weekly Tasks</h4>
          </div>
          <button onClick={() => { setAddType('task'); setShowAddModal(true); }} className="p-1 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {vision.tasks.map((task: any) => (
            <div key={task.id} className={`group flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 ${vision.bg} rounded-lg border ${vision.border} hover:shadow-md transition-all duration-300`}>
              <input
                type="checkbox"
                checked={task.completed}
                className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
              />
              <div className="flex-1 min-w-0">
                <span className={`text-xs sm:text-sm font-medium truncate ${task.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {task.text}
                </span>
                <span className={`ml-1 sm:ml-2 px-1.5 py-0.5 text-[10px] sm:text-xs rounded-full ${
                  task.priority === 'High' ? 'bg-red-100 text-red-700' :
                  task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {task.priority}
                </span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 flex space-x-1 transition-opacity">
                <button 
                  onClick={() => setEditingTask(task)}
                  className="p-1 text-gray-400 hover:text-blue-600 rounded"
                  title="Edit Task"
                >
                  <Edit className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </button>
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded"
                  title="Delete Task"
                >
                  <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* To-Do's Section */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-600" />
            <h4 className="text-xs sm:text-base font-bold text-gray-800">Weekly To-Do's</h4>
          </div>
          <button onClick={() => { setAddType('todo'); setShowAddModal(true); }} className="p-1 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {vision.todos.map((todo: any) => (
            <div key={todo.id} className={`group flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 ${vision.bg} rounded-lg border ${vision.border} hover:shadow-md transition-all duration-300`}>
              <input
                type="checkbox"
                checked={todo.completed}
                className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500"
              />
              <span className={`flex-1 text-xs sm:text-sm font-medium truncate ${todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                {todo.text}
              </span>
              <div className="opacity-0 group-hover:opacity-100 flex space-x-1 transition-opacity">
                <button 
                  onClick={() => setEditingTodo(todo)}
                  className="p-1 text-gray-400 hover:text-blue-600 rounded"
                  title="Edit Todo"
                >
                  <Edit className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </button>
                <button 
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded"
                  title="Delete Todo"
                >
                  <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Word Section */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
            <h4 className="text-xs sm:text-base font-bold text-gray-800">My Word</h4>
          </div>
          <button className="p-1 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300">
            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
        <div className={`p-3 sm:p-4 ${vision.bg} rounded-lg border ${vision.border}`}>
          <p className="text-xs sm:text-sm text-gray-700 italic font-medium">"{vision.word}"</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg sm:rounded-xl p-3 sm:p-6 text-white shadow-md sm:shadow-xl">
          <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">Weekly Planner</h1>
          <p className="text-xs sm:text-base text-blue-100">
            {weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 sm:p-3 text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          
          <button
            onClick={() => setSelectedWeek(new Date())}
            className="px-3 py-1.5 sm:px-5 sm:py-2.5 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-medium text-xs sm:text-sm"
          >
            This Week
          </button>
          
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 sm:p-3 text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      {/* Weekly Calendar - 7 Days in a Row */}
  <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-blue-200 p-4 sm:p-6 mb-4 sm:mb-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg shadow-md">
              <Calendar className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
            </div>
            <h3 className="text-sm sm:text-xl font-bold text-gray-800">Weekly Calendar</h3>
          </div>
        </div>
        
        {/* Make calendar horizontally scrollable on small screens to avoid cramped 7-column layout */}
        <div className="overflow-x-auto -mx-2 px-2">
          <div className="min-w-[720px] grid grid-cols-7 gap-2 sm:gap-4">
            {weekDates.map((date, index) => {
            const dayName = dayNames[index];
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                onClick={() => setSelectedDayDate(date)}
                className={`p-2 sm:p-4 rounded-lg text-center transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                  isToday
                    ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md'
                    : 'bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 hover:from-blue-100 hover:to-green-100 hover:shadow-md'
                }`}
              >
                <div className={`text-xs sm:text-sm font-bold mb-1 sm:mb-2 ${isToday ? 'text-blue-100' : 'text-gray-600'}`}>
                  {dayName.substring(0, 3)}
                </div>
                <div className={`text-base sm:text-xl font-bold mb-1 sm:mb-2 ${isToday ? 'text-white' : 'text-gray-800'}`}>
                  {date.getDate()}
                </div>
                <div className={`text-[10px] sm:text-xs ${isToday ? 'text-blue-100' : 'text-gray-500'}`}>
                  {date.toLocaleDateString('en-US', { month: 'short' })}
                </div>
                
                {/* Sample task indicators */}
                <div className="flex justify-center space-x-1 mt-2">
                  {index % 2 === 0 && (
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isToday ? 'bg-white' : 'bg-blue-500'}`}></div>
                  )}
                  {index % 3 === 0 && (
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isToday ? 'bg-blue-200' : 'bg-green-500'}`}></div>
                  )}
                  {index % 5 === 0 && (
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isToday ? 'bg-green-200' : 'bg-cyan-500'}`}></div>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* Add New Vision Button */}
      <div className="mb-4 sm:mb-6">
        <button onClick={() => { setShowVisionModal(true); }} className="flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-xs sm:text-sm">
          <Plus className="h-3 w-3 sm:h-5 sm:w-5" />
          <span className="font-medium">Add New Vision</span>
        </button>
      </div>

      {/* Vision & Goal Modals (use dedicated form components) */}
      {showVisionModal && (
        <VisionForm
          onCancel={() => setShowVisionModal(false)}
          onSubmit={async (visionData: any) => {
            try {
              const created = await visionAPI.create({ ...visionData, year: new Date(visionData.date || Date.now()).getFullYear() });
              setVisions(prev => [created, ...prev]);
            } catch (err) {
              console.error('Failed to create vision', err);
            } finally {
              setShowVisionModal(false);
            }
          }}
        />
      )}

      {showGoalModal && (
        <GoalForm
          onCancel={() => setShowGoalModal(false)}
          onSubmit={async (goalData: any) => {
            try {
              const created = await goalsAPI.create({ ...goalData, year: new Date(goalData.date || Date.now()).getFullYear() });
              setGoals(prev => [created, ...prev]);
            } catch (err) {
              console.error('Failed to create goal', err);
            } finally {
              setShowGoalModal(false);
            }
          }}
        />
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

      {/* Add Modal (fallback for task/todo/other types) */}
      {showAddModal && addType !== 'vision' && addType !== 'goal' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-3">Add {addType.charAt(0).toUpperCase() + addType.slice(1)}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={addType} onChange={e => setAddType(e.target.value as any)} className="w-full p-2 border rounded">
                  <option value="vision">Vision</option>
                  <option value="goal">Goal</option>
                  <option value="task">Task</option>
                  <option value="todo">To-Do</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title / Text</label>
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full p-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full p-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select value={newPriority} onChange={e => setNewPriority(e.target.value)} className="w-full p-2 border rounded">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowAddModal(false)} className="px-3 py-2 border rounded">Cancel</button>
                <button onClick={async () => {
                  // create payload and call appropriate API (fallback modal handles only task/todo)
                  const payload: any = { text: newTitle, title: newTitle, date: newDate, priority: newPriority, year: new Date(newDate).getFullYear() };
                  try {
                    if (addType === 'task') {
                      const created = await tasksAPI.create(payload);
                      setTasks(prev => [created, ...prev]);
                    } else if (addType === 'todo') {
                      const created = await todosAPI.create(payload);
                      setTodos(prev => [created, ...prev]);
                    } else {
                      console.warn('Unsupported add type in fallback modal:', addType);
                    }
                  } catch (err) {
                    console.error('Create failed', err);
                  } finally {
                    setShowAddModal(false);
                    setNewTitle(''); setNewDate(new Date().toISOString().slice(0,10)); setNewPriority('Medium');
                  }
                }} className="px-3 py-2 bg-blue-600 text-white rounded">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Day Details Popup Modal */}
      {selectedDayDate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 sm:p-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold">{selectedDayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
                <p className="text-xs sm:text-sm text-blue-100 mt-1">{selectedDayDate.getFullYear()}</p>
              </div>
              <button onClick={() => setSelectedDayDate(null)} className="p-2 hover:bg-white/20 rounded-lg transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* Goals for this day */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center space-x-2">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  <span>Goals</span>
                </h3>
                {goals.filter(g => g.date && new Date(g.date).toDateString() === selectedDayDate.toDateString()).length > 0 ? (
                  <div className="space-y-2">
                    {goals.filter(g => g.date && new Date(g.date).toDateString() === selectedDayDate.toDateString()).map(goal => (
                      <div key={goal.id} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <input type="checkbox" checked={goal.completed} className="w-4 h-4 text-blue-600" />
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${goal.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>{goal.title || goal.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{goal.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No goals for this day</p>
                )}
              </div>

              {/* Tasks for this day */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center space-x-2">
                  <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  <span>Tasks</span>
                </h3>
                {tasks.filter(t => t.date && new Date(t.date).toDateString() === selectedDayDate.toDateString()).length > 0 ? (
                  <div className="space-y-2">
                    {tasks.filter(t => t.date && new Date(t.date).toDateString() === selectedDayDate.toDateString()).map(task => (
                      <div key={task.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <input type="checkbox" checked={task.completed} className="w-4 h-4 text-green-600" />
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>{task.title || task.text}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              task.priority === 'High' ? 'bg-red-100 text-red-700' :
                              task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>{task.priority}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No tasks for this day</p>
                )}
              </div>

              {/* To-Dos for this day */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center space-x-2">
                  <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600" />
                  <span>To-Dos</span>
                </h3>
                {todos.filter(t => t.date && new Date(t.date).toDateString() === selectedDayDate.toDateString()).length > 0 ? (
                  <div className="space-y-2">
                    {todos.filter(t => t.date && new Date(t.date).toDateString() === selectedDayDate.toDateString()).map(todo => (
                      <div key={todo.id} className="flex items-center space-x-3 p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                        <input type="checkbox" checked={todo.completed} className="w-4 h-4 text-cyan-600" />
                        <p className={`flex-1 text-sm font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>{todo.title || todo.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No to-dos for this day</p>
                )}
              </div>

              {/* My Word for this day */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center space-x-2">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                  <span>My Word</span>
                </h3>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-gray-700 italic">"Your integrity word for this day"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Visions Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {visions.map(vision => (
            <VisionCard key={vision.id} vision={vision} />
          ))}
      </div>
    </div>
  );
};

export default WeeklyPlanner;