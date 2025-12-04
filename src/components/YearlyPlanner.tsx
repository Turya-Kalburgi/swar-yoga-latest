import React, { useEffect, useState } from 'react';
import { visionAPI, goalsAPI, tasksAPI, todosAPI } from '../utils/database';
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
  ChevronRight
} from 'lucide-react';
import VisionForm from './VisionForm';
import GoalForm from './GoalForm';

const YearlyPlanner: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingVision, setEditingVision] = useState<any | null>(null);
  const [editingGoal, setEditingGoal] = useState<any | null>(null);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [editingTodo, setEditingTodo] = useState<any | null>(null);

  const navigateYear = (direction: 'prev' | 'next') => {
    setSelectedYear(prev => prev + (direction === 'next' ? 1 : -1));
  };

  const initialMyVisions: any[] = [];

  const [visions, setVisions] = useState<any[]>(initialMyVisions);
  const [goals, setGoals] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<'vision' | 'task' | 'todo' | 'goal'>('vision');
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(() => new Date().toISOString().slice(0,10));
  const [newPriority, setNewPriority] = useState('Medium');
  const [showVisionModal, setShowVisionModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [vw, gs, ts, td] = await Promise.all([
          visionAPI.getAll(selectedYear),
          goalsAPI.getAll(selectedYear),
          tasksAPI.getAll(selectedYear),
          todosAPI.getAll(selectedYear)
        ]);

        if (Array.isArray(vw) && vw.length) setVisions(vw);
        if (Array.isArray(gs)) setGoals(gs);
        if (Array.isArray(ts)) setTasks(ts);
        if (Array.isArray(td)) setTodos(td);
      } catch (err) {
        console.warn('Failed to load yearly planner data', err);
      }
    };

    load();
  }, [selectedYear]);

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
    <div className={`bg-white rounded-xl sm:rounded-2xl shadow-lg border ${vision.border} p-4 sm:p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
      {/* Vision Header */}
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className={`p-2 sm:p-3 bg-gradient-to-r ${vision.color} rounded-lg sm:rounded-xl shadow-lg`}>
            <Eye className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg sm:text-2xl font-bold text-gray-800">{vision.title}</h3>
            <p className="text-xs sm:text-base text-gray-600 mt-0.5 sm:mt-1">{vision.description}</p>
          </div>
        </div>
        <div className="flex space-x-1 sm:space-x-2">
          <button 
            onClick={() => setEditingVision(vision)}
            className="p-1 sm:p-2 text-gray-400 hover:text-blue-600 rounded-lg sm:rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-110"
            title="Edit Vision"
          >
            <Edit className="h-3 w-3 sm:h-5 sm:w-5" />
          </button>
          <button 
            onClick={() => handleDeleteVision(vision.id)}
            className="p-1 sm:p-2 text-gray-400 hover:text-red-600 rounded-lg sm:rounded-xl hover:bg-red-50 transition-all duration-300 transform hover:scale-110"
            title="Delete Vision"
          >
            <Trash2 className="h-3 w-3 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      {/* Vision Image */}
      <div className="mb-4 sm:mb-6">
        <img 
          src={vision.image} 
          alt={vision.title}
          className="w-full h-32 sm:h-48 object-cover rounded-lg sm:rounded-xl shadow-md"
        />
      </div>

      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between items-center mb-1 sm:mb-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700">Overall Progress</span>
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
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <h4 className="text-sm sm:text-lg font-bold text-gray-800">Goals</h4>
          </div>
          <button onClick={() => setShowGoalModal(true)} className="p-1 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {vision.goals.map((goal: any) => (
            <div key={goal.id} className={`group flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 ${vision.bg} rounded-lg sm:rounded-xl border ${vision.border} hover:shadow-md transition-all duration-300`}>
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
                  <Edit className="h-2 w-2 sm:h-3 sm:w-3" />
                </button>
                <button 
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded"
                  title="Delete Goal"
                >
                  <Trash2 className="h-2 w-2 sm:h-3 sm:w-3" />
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
            <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            <h4 className="text-sm sm:text-lg font-bold text-gray-800">Tasks</h4>
          </div>
          <button className="p-1 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {vision.tasks.map((task: any) => (
            <div key={task.id} className={`group flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 ${vision.bg} rounded-lg sm:rounded-xl border ${vision.border} hover:shadow-md transition-all duration-300`}>
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
                  <Edit className="h-2 w-2 sm:h-3 sm:w-3" />
                </button>
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded"
                  title="Delete Task"
                >
                  <Trash2 className="h-2 w-2 sm:h-3 sm:w-3" />
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
            <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            <h4 className="text-sm sm:text-lg font-bold text-gray-800">To-Do's</h4>
          </div>
          <button className="p-1 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {vision.todos.map((todo: any) => (
            <div key={todo.id} className={`group flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 ${vision.bg} rounded-lg sm:rounded-xl border ${vision.border} hover:shadow-md transition-all duration-300`}>
              <input
                type="checkbox"
                checked={todo.completed}
                className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
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
                  <Edit className="h-2 w-2 sm:h-3 sm:w-3" />
                </button>
                <button 
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded"
                  title="Delete Todo"
                >
                  <Trash2 className="h-2 w-2 sm:h-3 sm:w-3" />
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
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            <h4 className="text-sm sm:text-lg font-bold text-gray-800">My Word</h4>
          </div>
          <button className="p-1 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300">
            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
        <div className={`p-3 sm:p-4 ${vision.bg} rounded-lg sm:rounded-xl border ${vision.border}`}>
          <p className="text-xs sm:text-sm text-gray-700 italic font-medium">"{vision.word}"</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-xl">
          <h1 className="text-xl sm:text-4xl font-bold mb-1 sm:mb-2">Yearly Planner</h1>
          <p className="text-sm sm:text-lg text-indigo-100">{selectedYear} - My Visions</p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={() => navigateYear('prev')}
            className="p-2 sm:p-3 text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-lg sm:rounded-xl transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          
          <button
            onClick={() => setSelectedYear(new Date().getFullYear())}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl transform hover:scale-105 font-medium text-sm sm:text-base"
          >
            This Year
          </button>
          
          <button
            onClick={() => navigateYear('next')}
            className="p-2 sm:p-3 text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-lg sm:rounded-xl transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>

      {/* Add New Vision Button */}
      <div className="mb-6 sm:mb-8">
        <button onClick={() => setShowVisionModal(true)} className="flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base">
          <Plus className="h-4 w-4 sm:h-6 sm:w-6" />
          <span className="font-medium sm:font-semibold">Add New Vision</span>
        </button>
      </div>

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
                }} className="px-3 py-2 bg-indigo-600 text-white rounded">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Visions Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {visions.map(vision => (
          <VisionCard key={vision.id} vision={vision} />
        ))}
      </div>
    </div>
  );
};

export default YearlyPlanner;