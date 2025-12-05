import React, { useState, useEffect } from 'react';
import { todosAPI, tasksAPI } from '../utils/database';
import { 
  Plus, 
  CheckSquare, 
  Edit, 
  Trash2, 
  Filter,
  Search,
  Calendar,
  CheckCircle,
  Bell,
  Flag,
  Clock,
  AlertCircle
} from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  category: string;
  createdAt: string;
  dueDate?: string;
  dueTime?: string;
  priority?: 'Low' | 'Medium' | 'High';
  reminder?: boolean;
  reminderTime?: string;
  linkedTaskId?: number;
  linkedTaskTitle?: string;
}

const MyTodos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await todosAPI.getAll();
        if (mounted) setTodos(data || []);
      } catch (err) {
        console.error('Failed to load todos', err);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadTasks = async () => {
      try {
        const data = await tasksAPI.getAll();
        if (mounted) setTasks(data || []);
      } catch (err) {
        console.error('Failed to load tasks', err);
      }
    };
    loadTasks();
    return () => { mounted = false };
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newTodo, setNewTodo] = useState({
    text: '',
    category: 'Personal',
    dueDate: '',
    dueTime: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    reminder: false,
    reminderTime: '',
    linkedTaskId: 0
  });

  const categories = ['Personal', 'Work', 'Health', 'Learning', 'Home', 'Finance', 'Social'];

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' && todo.completed) ||
      (filter === 'pending' && !todo.completed) ||
      (filter === todo.category.toLowerCase());
    
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleAddTodo = () => {
    if (newTodo.text.trim()) {
      const todo: Todo = {
        id: Date.now(),
        text: newTodo.text,
        completed: false,
        category: newTodo.category,
        createdAt: new Date().toISOString(),
        dueDate: newTodo.dueDate || undefined,
        dueTime: newTodo.dueTime || undefined,
        priority: newTodo.priority,
        reminder: newTodo.reminder,
        reminderTime: newTodo.reminder ? newTodo.reminderTime : undefined,
        linkedTaskId: newTodo.linkedTaskId || undefined,
        linkedTaskTitle: newTodo.linkedTaskId ? tasks.find(t => t.id === newTodo.linkedTaskId)?.particulars : undefined
      };
      todosAPI.create(todo).then(created => setTodos(prev => [...prev, created])).catch(err => {
        console.error('Failed to create todo', err);
        setTodos(prev => [...prev, todo]);
      });
      setNewTodo({
        text: '',
        category: 'Personal',
        dueDate: '',
        dueTime: '',
        priority: 'Medium',
        reminder: false,
        reminderTime: '',
        linkedTaskId: 0
      });
      setShowAddModal(false);
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTodo({
      text: todo.text,
      category: todo.category,
      dueDate: todo.dueDate || '',
      dueTime: todo.dueTime || '',
      priority: todo.priority || 'Medium',
      reminder: todo.reminder || false,
      reminderTime: todo.reminderTime || '',
      linkedTaskId: todo.linkedTaskId || 0
    });
    setShowAddModal(true);
  };

  const handleUpdateTodo = () => {
    if (editingTodo && newTodo.text.trim()) {
      const updated: Todo = {
        ...editingTodo,
        text: newTodo.text,
        category: newTodo.category,
        dueDate: newTodo.dueDate || undefined,
        dueTime: newTodo.dueTime || undefined,
        priority: newTodo.priority,
        reminder: newTodo.reminder,
        reminderTime: newTodo.reminder ? newTodo.reminderTime : undefined,
        linkedTaskId: newTodo.linkedTaskId || undefined,
        linkedTaskTitle: newTodo.linkedTaskId ? tasks.find(t => t.id === newTodo.linkedTaskId)?.particulars : undefined
      };
      todosAPI.update(Number(editingTodo.id), updated).then(res => setTodos(prev => prev.map(t => (t.id === res.id ? res : t)))).catch(err => {
        console.error('Failed to update todo', err);
        setTodos(prev => prev.map(t => (t.id === editingTodo.id ? updated : t)));
      });
      setEditingTodo(null);
      setNewTodo({
        text: '',
        category: 'Personal',
        dueDate: '',
        dueTime: '',
        priority: 'Medium',
        reminder: false,
        reminderTime: '',
        linkedTaskId: 0
      });
      setShowAddModal(false);
    }
  };

  const handleDeleteTodo = (id: number) => {
    if (confirm('Are you sure you want to delete this to-do?')) {
      todosAPI.delete(Number(id)).then(() => setTodos(prev => prev.filter(todo => todo.id !== id))).catch(err => {
        console.error('Failed to delete todo', err);
        setTodos(prev => prev.filter(todo => todo.id !== id));
      });
    }
  };

  const toggleTodoCompletion = (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    const updated: Todo = { ...todo, completed: !todo.completed };
    todosAPI.update(Number(id), updated).then(res => setTodos(prev => prev.map(t => (t.id === res.id ? res : t)))).catch(err => {
      console.error('Failed to toggle todo', err);
      setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Personal': 'bg-blue-100 text-blue-800',
      'Work': 'bg-purple-100 text-purple-800',
      'Health': 'bg-green-100 text-green-800',
      'Learning': 'bg-yellow-100 text-yellow-800',
      'Home': 'bg-orange-100 text-orange-800',
      'Finance': 'bg-emerald-100 text-emerald-800',
      'Social': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityIconColor = (priority?: string) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const completedTodos = todos.filter(todo => todo.completed).length;
  const totalTodos = todos.length;
  const pendingTodos = todos.filter(todo => !todo.completed).length;
  const overdueTodos = todos.filter(todo => 
    !todo.completed && 
    todo.dueDate && 
    new Date(todo.dueDate) < new Date()
  ).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My To-Do's</h1>
          <p className="text-gray-600">Organize and track your daily to-do items</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add To-Do</span>
        </button>
      </div>

      {/* Todo Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-purple-600 mb-1">{totalTodos}</div>
          <div className="text-gray-600 text-sm">Total To-Do's</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600 mb-1">{completedTodos}</div>
          <div className="text-gray-600 text-sm">Completed</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600 mb-1">{pendingTodos}</div>
          <div className="text-gray-600 text-sm">Pending</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600 mb-1">{overdueTodos}</div>
          <div className="text-gray-600 text-sm">Overdue</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'completed', label: 'Completed' },
                { id: 'pending', label: 'Pending' },
                ...categories.map(cat => ({ id: cat.toLowerCase(), label: cat }))
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption.id
                      ? 'bg-purple-600 text-white'
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
              placeholder="Search to-do's..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Todos List */}
      <div className="space-y-4">
        {filteredTodos.length > 0 ? (
          filteredTodos.map(todo => (
            <div key={todo.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodoCompletion(todo.id)}
                    className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                  />
                  
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {todo.text}
                    </h3>
                    
                    <div className="flex items-center space-x-4 mt-2 flex-wrap gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(todo.category)}`}>
                        {todo.category}
                      </span>

                      {todo.priority && (
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
                          <Flag className={`h-3 w-3 ${getPriorityIconColor(todo.priority)}`} />
                          <span>{todo.priority} Priority</span>
                        </div>
                      )}
                      
                      {todo.dueDate && (
                        <div className={`flex items-center space-x-1 text-xs ${new Date(todo.dueDate) < new Date() && !todo.completed ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                          <Calendar className="h-4 w-4" />
                          <span>
                            Due: {new Date(todo.dueDate).toLocaleDateString()}
                            {todo.dueTime && ` @ ${todo.dueTime}`}
                          </span>
                          {new Date(todo.dueDate) < new Date() && !todo.completed && (
                            <AlertCircle className="h-4 w-4 text-red-600 ml-1" />
                          )}
                        </div>
                      )}

                      {todo.reminder && (
                        <div className="flex items-center space-x-1 bg-indigo-50 px-2 py-1 rounded text-xs text-indigo-700 border border-indigo-200">
                          <Bell className="h-3 w-3" />
                          <span>
                            Reminder {todo.reminderTime ? `@ ${todo.reminderTime}` : 'set'}
                          </span>
                        </div>
                      )}

                      {todo.linkedTaskId && (
                        <div className="flex items-center space-x-1 bg-cyan-50 px-2 py-1 rounded text-xs text-cyan-700 border border-cyan-200">
                          <CheckCircle className="h-3 w-3" />
                          <span>Task: {todo.linkedTaskTitle || 'Linked'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditTodo(todo)}
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No to-do's found</h3>
            <p className="text-gray-600">Add your first to-do to get started.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Todo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {editingTodo ? 'Edit To-Do' : 'Add New To-Do'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingTodo(null);
                  setNewTodo({
                    text: '',
                    category: 'Personal',
                    dueDate: '',
                    dueTime: '',
                    priority: 'Medium',
                    reminder: false,
                    reminderTime: '',
                    linkedTaskId: 0
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To-Do Text *
                </label>
                <input
                  type="text"
                  value={newTodo.text}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, text: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  placeholder="Enter your to-do..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newTodo.category}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={newTodo.priority}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={newTodo.dueDate}
                    onChange={(e) => setNewTodo(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={newTodo.dueTime}
                    onChange={(e) => setNewTodo(prev => ({ ...prev, dueTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="reminder"
                    checked={newTodo.reminder}
                    onChange={(e) => setNewTodo(prev => ({ ...prev, reminder: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="reminder" className="text-sm font-medium text-gray-700">
                    Set reminder
                  </label>
                </div>

                {newTodo.reminder && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reminder time
                    </label>
                    <input
                      type="time"
                      value={newTodo.reminderTime}
                      onChange={(e) => setNewTodo(prev => ({ ...prev, reminderTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link to Task (Optional)
                </label>
                <select
                  value={newTodo.linkedTaskId}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, linkedTaskId: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                >
                  <option value={0}>Select a task...</option>
                  {tasks.length > 0 ? (
                    tasks.map(task => (
                      <option key={task.id} value={task.id}>
                        {task.particulars} ({task.status})
                      </option>
                    ))
                  ) : (
                    <option disabled>No tasks available</option>
                  )}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTodo(null);
                    setNewTodo({
                      text: '',
                      category: 'Personal',
                      dueDate: '',
                      dueTime: '',
                      priority: 'Medium',
                      reminder: false,
                      reminderTime: '',
                      linkedTaskId: 0
                    });
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingTodo ? handleUpdateTodo : handleAddTodo}
                  className="flex-1 px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {editingTodo ? 'Update To-Do' : 'Add To-Do'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTodos;