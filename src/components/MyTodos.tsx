import React, { useState, useEffect, useContext } from 'react';
import { todosAPI, tasksAPI } from '../utils/database';
import { AuthContext } from '../context/AuthContext';
import { Plus, X, Edit, Trash2, Search, CheckCircle, Circle, Flag, AlertCircle, Calendar, Clock, Bell } from 'lucide-react';
import { toast } from 'react-toastify';

interface Todo {
  _id?: string;
  id?: string;
  userId?: string;
  title: string;
  description?: string;
  completed: boolean;
  category: string;
  createdAt?: string;
  dueDate?: string;
  dueTime?: string;
  priority?: 'Low' | 'Medium' | 'High';
  reminder?: boolean;
  reminderTime?: string;
  linkedTaskId?: string;
  linkedTaskTitle?: string;
  status?: string;
  completedAt?: string;
}

const MyTodos: React.FC = () => {
  const { user } = useContext(AuthContext) || { user: null };
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Personal', 'Work', 'Health', 'Learning', 'Home', 'Finance', 'Social'];
  const priorities = ['Low', 'Medium', 'High'];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Personal',
    dueDate: '',
    dueTime: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    reminder: false,
    reminderTime: '',
    linkedTaskId: '',
    linkedTaskTitle: ''
  });

  useEffect(() => {
    if (user?.id) {
      loadTodos();
      loadTasks();
    }
  }, [user?.id]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const allTodos = await todosAPI.getAll(user?.id);
      setTodos(allTodos || []);
    } catch (error) {
      console.error('❌ Error loading todos:', error);
      toast.error('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const allTasks = await tasksAPI.getAll(user?.id);
      setTasks(allTasks || []);
    } catch (error) {
      console.error('❌ Error loading tasks:', error);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (formData.reminder && !formData.reminderTime) {
      toast.error('Please set reminder time');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Personal',
      dueDate: '',
      dueTime: '',
      priority: 'Medium',
      reminder: false,
      reminderTime: '',
      linkedTaskId: '',
      linkedTaskTitle: ''
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user?.id) return;

    try {
      const payload = {
        userId: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        dueDate: formData.dueDate,
        dueTime: formData.dueTime,
        priority: formData.priority,
        reminder: formData.reminder,
        reminderTime: formData.reminderTime,
        linkedTaskId: formData.linkedTaskId,
        linkedTaskTitle: formData.linkedTaskTitle,
        completed: false
      };

      if (editingId) {
        await todosAPI.update(editingId, payload);
        toast.success('Todo updated!');
      } else {
        await todosAPI.create(payload);
        toast.success('Todo created!');
      }

      await loadTodos();
      setShowAddModal(false);
      resetForm();
    } catch (error: any) {
      console.error('❌ Error saving todo:', error);
      toast.error(error.message || 'Failed to save todo');
    }
  };

  const handleEdit = (todo: Todo) => {
    setFormData({
      title: todo.title || '',
      description: todo.description || '',
      category: todo.category || 'Personal',
      dueDate: todo.dueDate || '',
      dueTime: todo.dueTime || '',
      priority: todo.priority || 'Medium',
      reminder: todo.reminder || false,
      reminderTime: todo.reminderTime || '',
      linkedTaskId: todo.linkedTaskId || '',
      linkedTaskTitle: todo.linkedTaskTitle || ''
    });
    setEditingId(todo._id || todo.id || '');
    setShowAddModal(true);
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      await todosAPI.update(id, { completed: !completed });
      await loadTodos();
      toast.success(completed ? 'Todo marked pending' : 'Todo completed!');
    } catch (error) {
      console.error('❌ Error toggling todo:', error);
      toast.error('Failed to update todo');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this todo?')) return;
    try {
      await todosAPI.delete(id);
      await loadTodos();
      toast.success('Todo deleted!');
    } catch (error) {
      console.error('❌ Error deleting todo:', error);
      toast.error('Failed to delete todo');
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getPriorityBgColor = (priority?: string) => {
    switch (priority) {
      case 'High': return 'bg-red-50';
      case 'Medium': return 'bg-yellow-50';
      case 'Low': return 'bg-blue-50';
      default: return 'bg-gray-50';
    }
  };

  const isOverdue = (dueDate: string): boolean => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = filter === 'all' || (filter === 'completed' && todo.completed) || (filter === 'pending' && !todo.completed) || (filter === todo.category.toLowerCase());
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) || todo.description?.toLowerCase().includes(searchTerm.toLowerCase()) || todo.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const groupedTodos = {
    pending: filteredTodos.filter(t => !t.completed),
    completed: filteredTodos.filter(t => t.completed)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Todos</h1>
        <p className="text-gray-600">Organize your tasks and stay productive</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search todos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="all">All Todos</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            {categories.map(cat => (<option key={cat} value={cat.toLowerCase()}>{cat}</option>))}
          </select>

          <button onClick={() => { resetForm(); setShowAddModal(true); }} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-5 h-5" /> New Todo
          </button>
        </div>
      </div>

      {groupedTodos.pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Circle className="w-5 h-5 text-blue-500" /> Pending ({groupedTodos.pending.length})
          </h2>
          <div className="grid gap-4">
            {groupedTodos.pending.map(todo => (
              <div key={todo._id || todo.id} className={`${getPriorityBgColor(todo.priority)} border-l-4 border-indigo-500 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow`}>
                <div className="flex items-start gap-4">
                  <button onClick={() => handleToggle(todo._id || todo.id || '', todo.completed)} className="mt-1 text-gray-400 hover:text-indigo-600 transition-colors">
                    <Circle className="w-6 h-6" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 text-lg break-words">{todo.title}</h3>
                      {isOverdue(todo.dueDate || '') && <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />}
                    </div>

                    {todo.description && <p className="text-gray-600 text-sm mt-1">{todo.description}</p>}

                    <div className="flex flex-wrap gap-3 mt-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(todo.priority)} bg-white border`}>
                        <Flag className="w-3 h-3" /> {todo.priority}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-white border text-gray-600">{todo.category}</span>
                      {todo.dueDate && <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-white border text-gray-600"><Calendar className="w-3 h-3" /> {new Date(todo.dueDate).toLocaleDateString()}</span>}
                      {todo.dueTime && <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-white border text-gray-600"><Clock className="w-3 h-3" /> {todo.dueTime}</span>}
                      {todo.reminder && <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-700"><Bell className="w-3 h-3" /> {todo.reminderTime}</span>}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleEdit(todo)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(todo._id || todo.id || '')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {groupedTodos.completed.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" /> Completed ({groupedTodos.completed.length})
          </h2>
          <div className="grid gap-4">
            {groupedTodos.completed.map(todo => (
              <div key={todo._id || todo.id} className="bg-gray-50 border-l-4 border-gray-300 rounded-lg p-4 shadow-md opacity-75 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <button onClick={() => handleToggle(todo._id || todo.id || '', todo.completed)} className="mt-1 text-green-500 hover:text-green-600 transition-colors">
                    <CheckCircle className="w-6 h-6" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-600 line-through">{todo.title}</h3>
                    {todo.description && <p className="text-gray-500 text-sm line-through mt-1">{todo.description}</p>}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleDelete(todo._id || todo.id || '')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredTodos.length === 0 && !loading && (
        <div className="text-center py-16">
          <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No todos found. Create one to get started!</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading todos...</p>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{editingId ? 'Edit Todo' : 'Add New Todo'}</h2>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="What do you need to do?" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Add details..." rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {priorities.map(p => (<option key={p} value={p}>{p}</option>))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Time</label>
                  <input type="time" value={formData.dueTime} onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={formData.reminder} onChange={(e) => setFormData({ ...formData, reminder: e.target.checked })} className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500" />
                  <span className="text-sm font-medium text-gray-700">Set Reminder</span>
                </label>

                {formData.reminder && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Time</label>
                    <input type="time" value={formData.reminderTime} onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                  {editingId ? 'Update Todo' : 'Create Todo'}
                </button>
                <button type="button" onClick={() => { setShowAddModal(false); resetForm(); }} className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTodos;
