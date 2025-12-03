import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../utils/database';
import { 
  Plus, 
  CheckSquare, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  Flag,
  Filter,
  Search,
  Repeat,
  Bell
} from 'lucide-react';

interface Task {
  id: number;
  particulars: string;
  date: string;
  time: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Complete' | 'Blocked';
  completed: boolean;
  createdAt: string;
  repeat: 'None' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Custom';
  customRepeatDays?: number;
  reminder: boolean;
  reminderTime?: string;
}

const MyTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await tasksAPI.getAll();
        if (mounted) setTasks(data || []);
      } catch (err) {
        console.error('Failed to load tasks', err);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newTask, setNewTask] = useState({
    particulars: '',
    date: '',
    time: '',
    priority: 'Medium' as Task['priority'],
    status: 'Pending' as Task['status'],
    completed: false,
    repeat: 'None' as Task['repeat'],
    customRepeatDays: 1,
    reminder: false,
    reminderTime: ''
  });

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' && task.completed) ||
      (filter === 'pending' && !task.completed) ||
      (filter === 'high' && task.priority === 'High') ||
      (filter === 'recurring' && task.repeat !== 'None') ||
      (filter === 'reminders' && task.reminder);
    
    const matchesSearch = task.particulars.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleAddTask = () => {
    if (newTask.particulars.trim()) {
      const task: Task = {
        id: Date.now(),
        particulars: newTask.particulars,
        date: newTask.date,
        time: newTask.time,
        priority: newTask.priority,
        status: newTask.status,
        completed: newTask.completed,
        createdAt: new Date().toISOString(),
        repeat: newTask.repeat,
        customRepeatDays: newTask.repeat === 'Custom' ? newTask.customRepeatDays : undefined,
        reminder: newTask.reminder,
        reminderTime: newTask.reminder ? newTask.reminderTime : undefined
      };
      // persist to API then update state
      tasksAPI.create(task).then(created => setTasks(prev => [...prev, created])).catch(err => {
        console.error('Failed to create task', err);
        setTasks(prev => [...prev, task]);
      });
      setNewTask({
        particulars: '',
        date: '',
        time: '',
        priority: 'Medium',
        status: 'Pending',
        completed: false,
        repeat: 'None',
        customRepeatDays: 1,
        reminder: false,
        reminderTime: ''
      });
      setShowAddModal(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      particulars: task.particulars,
      date: task.date,
      time: task.time,
      priority: task.priority,
      status: task.status,
      completed: task.completed,
      repeat: task.repeat,
      customRepeatDays: task.customRepeatDays || 1,
      reminder: task.reminder,
      reminderTime: task.reminderTime || ''
    });
    setShowAddModal(true);
  };

  const handleUpdateTask = () => {
    if (editingTask && newTask.particulars.trim()) {
      const updated: Task = {
        ...editingTask,
        particulars: newTask.particulars,
        date: newTask.date,
        time: newTask.time,
        priority: newTask.priority,
        status: newTask.status,
        completed: newTask.completed,
        repeat: newTask.repeat,
        customRepeatDays: newTask.repeat === 'Custom' ? newTask.customRepeatDays : undefined,
        reminder: newTask.reminder,
        reminderTime: newTask.reminder ? newTask.reminderTime : undefined
      };
      tasksAPI.update(Number(editingTask.id), updated).then(res => {
        setTasks(prev => prev.map(t => (t.id === res.id ? res : t)));
      }).catch(err => {
        console.error('Failed to update task', err);
        setTasks(prev => prev.map(t => (t.id === editingTask.id ? updated : t)));
      });
      setEditingTask(null);
      setNewTask({
        particulars: '',
        date: '',
        time: '',
        priority: 'Medium',
        status: 'Pending',
        completed: false,
        repeat: 'None',
        customRepeatDays: 1,
        reminder: false,
        reminderTime: ''
      });
      setShowAddModal(false);
    }
  };

  const handleDeleteTask = (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      tasksAPI.delete(Number(id)).then(() => {
        setTasks(prev => prev.filter(task => task.id !== id));
      }).catch(err => {
        console.error('Failed to delete task', err);
        setTasks(prev => prev.filter(task => task.id !== id));
      });
    }
  };

  const toggleTaskCompletion = (id: number) => {
      const task = tasks.find(t => t.id === id);
    if (!task) return;
    const updated: Task = { ...task, completed: !task.completed, status: !task.completed ? 'Complete' : 'Pending' };
    tasksAPI.update(Number(id), updated).then(res => {
      setTasks(prev => prev.map(t => (t.id === res.id ? res : t)));
    }).catch(err => {
      console.error('Failed to toggle task', err);
      setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'from-green-400 to-green-600';
      case 'In Progress': return 'from-blue-400 to-blue-600';
      case 'Pending': return 'from-yellow-400 to-yellow-600';
      case 'Blocked': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRepeatIcon = (repeat: string) => {
    if (repeat === 'None') return null;
    return <Repeat className="h-4 w-4 text-purple-600" />;
  };

  const getRepeatText = (task: Task) => {
    switch (task.repeat) {
      case 'Daily': return 'Daily';
      case 'Weekly': return 'Weekly';
      case 'Monthly': return 'Monthly';
      case 'Yearly': return 'Yearly';
      case 'Custom': return `Every ${task.customRepeatDays} days`;
      default: return '';
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'High' && !task.completed).length;
  const recurringTasks = tasks.filter(task => task.repeat !== 'None').length;
  const tasksWithReminders = tasks.filter(task => task.reminder).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
          <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
          <p className="text-green-100">Manage and track all your tasks with details</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="text-xl font-bold text-blue-600 mb-1">{totalTasks}</div>
          <div className="text-gray-600 text-xs font-medium">Total Tasks</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="text-xl font-bold text-green-600 mb-1">{completedTasks}</div>
          <div className="text-gray-600 text-xs font-medium">Completed</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-yellow-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="text-xl font-bold text-yellow-600 mb-1">{pendingTasks}</div>
          <div className="text-gray-600 text-xs font-medium">Pending</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="text-xl font-bold text-red-600 mb-1">{highPriorityTasks}</div>
          <div className="text-gray-600 text-xs font-medium">High Priority</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="text-xl font-bold text-purple-600 mb-1">{recurringTasks}</div>
          <div className="text-gray-600 text-xs font-medium">Recurring</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-indigo-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="text-xl font-bold text-indigo-600 mb-1">{tasksWithReminders}</div>
          <div className="text-gray-600 text-xs font-medium">With Reminders</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Tasks', gradient: 'from-gray-500 to-gray-600' },
                { id: 'completed', label: 'Completed', gradient: 'from-green-500 to-green-600' },
                { id: 'pending', label: 'Pending', gradient: 'from-yellow-500 to-yellow-600' },
                { id: 'high', label: 'High Priority', gradient: 'from-red-500 to-red-600' },
                { id: 'recurring', label: 'Recurring', gradient: 'from-purple-500 to-purple-600' },
                { id: 'reminders', label: 'With Reminders', gradient: 'from-indigo-500 to-indigo-600' }
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 transform hover:scale-105 ${
                    filter === filterOption.id
                      ? `bg-gradient-to-r ${filterOption.gradient} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-64 text-sm shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div key={task.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-102">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                    className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                  />
                  
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {task.particulars}
                    </h3>
                    
                    <div className="flex items-center flex-wrap gap-2 mt-2 text-sm text-gray-600">
                      {task.date && (
                        <div className="flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-lg">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(task.date).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {task.time && (
                        <div className="flex items-center space-x-1 bg-purple-50 px-3 py-1 rounded-lg">
                          <Clock className="h-4 w-4" />
                          <span>{task.time}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-1 bg-orange-50 px-3 py-1 rounded-lg">
                        <Flag className={`h-4 w-4 ${getPriorityColor(task.priority)}`} />
                        <span className={getPriorityColor(task.priority)}>{task.priority}</span>
                      </div>
                      
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium text-white bg-gradient-to-r ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>

                      {task.repeat !== 'None' && (
                        <div className="flex items-center space-x-1 bg-purple-50 px-3 py-1 rounded-lg">
                          {getRepeatIcon(task.repeat)}
                          <span className="text-purple-600">{getRepeatText(task)}</span>
                        </div>
                      )}

                      {task.reminder && (
                        <div className="flex items-center space-x-1 bg-indigo-50 px-3 py-1 rounded-lg">
                          <Bell className="h-4 w-4 text-indigo-600" />
                          <span className="text-indigo-600">
                            {task.reminderTime ? `Reminder at ${task.reminderTime}` : 'Reminder set'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditTask(task)}
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-110"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all duration-300 transform hover:scale-110"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600">Add your first task to get started.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingTask(null);
                  setNewTask({
                    particulars: '',
                    date: '',
                    time: '',
                    priority: 'Medium',
                    status: 'Pending',
                    completed: false,
                    repeat: 'None',
                    customRepeatDays: 1,
                    reminder: false,
                    reminderTime: ''
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Particulars *
                </label>
                <input
                  type="text"
                  value={newTask.particulars}
                  onChange={(e) => setNewTask(prev => ({ ...prev, particulars: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  placeholder="Enter task details..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newTask.date}
                    onChange={(e) => setNewTask(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newTask.time}
                    onChange={(e) => setNewTask(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Complete">Complete</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>

              {/* Repeat Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repeat
                </label>
                <select
                  value={newTask.repeat}
                  onChange={(e) => setNewTask(prev => ({ ...prev, repeat: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                >
                  <option value="None">No Repeat</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              {newTask.repeat === 'Custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repeat every (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={newTask.customRepeatDays}
                    onChange={(e) => setNewTask(prev => ({ ...prev, customRepeatDays: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                    placeholder="Enter number of days"
                  />
                </div>
              )}

              {/* Reminder Section */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="reminder"
                    checked={newTask.reminder}
                    onChange={(e) => setNewTask(prev => ({ ...prev, reminder: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="reminder" className="text-sm font-medium text-gray-700">
                    Set reminder
                  </label>
                </div>

                {newTask.reminder && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reminder time
                    </label>
                    <input
                      type="time"
                      value={newTask.reminderTime}
                      onChange={(e) => setNewTask(prev => ({ ...prev, reminderTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="completed"
                  checked={newTask.completed}
                  onChange={(e) => setNewTask(prev => ({ 
                    ...prev, 
                    completed: e.target.checked,
                    status: e.target.checked ? 'Complete' : 'Pending'
                  }))}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="completed" className="text-sm font-medium text-gray-700">
                  Mark as completed
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTask(null);
                    setNewTask({
                      particulars: '',
                      date: '',
                      time: '',
                      priority: 'Medium',
                      status: 'Pending',
                      completed: false,
                      repeat: 'None',
                      customRepeatDays: 1,
                      reminder: false,
                      reminderTime: ''
                    });
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingTask ? handleUpdateTask : handleAddTask}
                  className="flex-1 px-4 py-2 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg transform hover:scale-105"
                >
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;