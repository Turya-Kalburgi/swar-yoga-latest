import React, { useState, useEffect } from 'react';
import { CheckCircle2, Plus, Edit, Trash2, Calendar, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { todoAPI, Todo, formatDate } from '../utils/sadhakaPlannerData';
import { useAuth } from '../context/AuthContext';

const TodosComponent: React.FC = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    status: 'Pending' as 'Pending' | 'Completed'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.id) {
      loadTodos();
    }
  }, [user?.id]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await todoAPI.getAll(user?.id || '');
      setTodos(data);
    } catch (error) {
      console.error('❌ Error loading todos:', error);
      toast.error('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Todo title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors');
      return;
    }

    try {
      const todoData: Todo = {
        userId: user?.id || '',
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        priority: formData.priority,
        status: formData.status,
        completed: formData.status === 'Completed'
      };

      if (editingId) {
        todoData.id = editingId;
        await todoAPI.update(editingId, todoData);
        toast.success('Todo updated!');
      } else {
        await todoAPI.create(todoData);
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

  const handleToggle = async (todo: Todo) => {
    try {
      const newStatus = todo.status === 'Completed' ? 'Pending' : 'Completed';
      await todoAPI.update(todo.id || '', {
        ...todo,
        status: newStatus,
        completed: newStatus === 'Completed'
      });
      await loadTodos();
    } catch (error: any) {
      console.error('❌ Error toggling todo:', error);
      toast.error('Failed to update todo');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this todo?')) return;

    try {
      await todoAPI.delete(id, user?.id || '');
      await loadTodos();
      toast.success('Todo deleted!');
    } catch (error: any) {
      console.error('❌ Error deleting todo:', error);
      toast.error('Failed to delete todo');
    }
  };

  const handleEdit = (todo: Todo) => {
    setFormData({
      title: todo.title,
      description: todo.description || '',
      dueDate: todo.dueDate || '',
      priority: todo.priority || 'Medium',
      status: todo.status || 'Pending'
    });
    setEditingId(todo.id || null);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      status: 'Pending'
    });
    setErrors({});
    setEditingId(null);
  };

  const filteredTodos = todos.filter(t =>
    filter === 'all' || (filter === 'completed' ? t.status === 'Completed' : t.status !== 'Completed')
  );

  const priorityColor = {
    'Low': 'bg-blue-100 text-blue-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'High': 'bg-red-100 text-red-800'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Todos</h2>
            <p className="text-sm text-gray-600">Total: {todos.length} | Completed: {todos.filter(t => t.status === 'Completed').length}</p>
          </div>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add Todo
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === f
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Todos List */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No todos yet. Create one to get started!</p>
          </div>
        ) : (
          filteredTodos.map(todo => {
            const todoKey = todo.id || todo._id || `todo-${Math.random()}`;
            return (
            <div
              key={todoKey}
              className={`flex items-center gap-4 p-4 rounded-lg border transition ${
                todo.status === 'Completed'
                  ? 'bg-gray-50 border-gray-200 opacity-75'
                  : 'bg-white border-gray-300 hover:shadow-md'
              }`}
            >
              <button
                onClick={() => handleToggle(todo)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                  todo.status === 'Completed'
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 hover:border-green-500'
                }`}
              >
                {todo.status === 'Completed' && <CheckCircle2 className="w-5 h-5 text-white" />}
              </button>

              <div className="flex-1">
                <p className={`${todo.status === 'Completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {todo.title}
                </p>
                {todo.description && (
                  <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
                )}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {todo.priority && (
                    <span className={`text-xs px-2 py-1 rounded ${priorityColor[todo.priority]}`}>
                      {todo.priority}
                    </span>
                  )}
                  {todo.dueDate && (
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {formatDate(todo.dueDate)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(todo)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(todo.id || '')}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId ? 'Edit Todo' : 'Add Todo'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Todo Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="What do you need to do?"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add any details..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
                >
                  {editingId ? 'Update Todo' : 'Create Todo'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                >
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

export default TodosComponent;
