import React, { useState, useEffect } from 'react';
import { CheckCircle2, Plus, Edit, Trash2, Calendar, Link as LinkIcon, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'react-toastify';

interface Todo {
  id: string;
  userId: string;
  taskId?: string;
  taskTitle?: string;
  text: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'Low' | 'Medium' | 'High';
  createdAt?: string;
}

interface Task {
  id: string;
  title: string;
}

const TodosComponent: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const [formData, setFormData] = useState({
    text: '',
    taskId: '',
    dueDate: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    completed: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load tasks first
      const tasksData = await loadTasks();
      setTasks(tasksData);

      // Load todos
      const todosData = await loadTodos();

      // Enrich todos with task titles
      const enrichedTodos = todosData.map(t => ({
        ...t,
        taskTitle: tasksData.find(task => task.id === t.taskId)?.title || 'Unlinked'
      }));

      setTodos(enrichedTodos);
    } catch (error) {
      console.error('❌ Error loading todos:', error);
      toast.error('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const storageKey = `sadhaka_tasks_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Error loading tasks:', error);
      return [];
    }
  };

  const loadTodos = async () => {
    try {
      const storageKey = `sadhaka_todos_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Error loading todos:', error);
      return [];
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.text.trim()) {
      newErrors.text = 'Todo text is required';
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
      const storageKey = `sadhaka_todos_${user.id}`;
      const existingTodos = JSON.parse(localStorage.getItem(storageKey) || '[]');

      if (editingId) {
        // Update
        const index = existingTodos.findIndex((t: Todo) => t.id === editingId);
        if (index !== -1) {
          existingTodos[index] = {
            ...existingTodos[index],
            text: formData.text,
            taskId: formData.taskId,
            dueDate: formData.dueDate,
            priority: formData.priority,
            completed: formData.completed
          };
        }
        console.log(`✅ Todo updated: ${formData.text}`);
      } else {
        // Create
        const newTodo: Todo = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.id,
          text: formData.text,
          taskId: formData.taskId,
          dueDate: formData.dueDate,
          priority: formData.priority,
          completed: false,
          createdAt: new Date().toISOString()
        };
        existingTodos.push(newTodo);
        console.log(`✅ Todo created: ${formData.text}`);
      }

      localStorage.setItem(storageKey, JSON.stringify(existingTodos));
      await loadData();

      toast.success(editingId ? 'Todo updated!' : 'Todo created!');
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('❌ Error saving todo:', error);
      toast.error('Failed to save todo');
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      const storageKey = `sadhaka_todos_${user.id}`;
      const todosData = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const index = todosData.findIndex((t: Todo) => t.id === id);
      if (index !== -1) {
        todosData[index].completed = !completed;
      }
      localStorage.setItem(storageKey, JSON.stringify(todosData));
      await loadData();
      console.log(`✅ Todo toggled`);
    } catch (error) {
      console.error('❌ Error toggling todo:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this todo?')) return;

    try {
      const storageKey = `sadhaka_todos_${user.id}`;
      const todosData = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const filtered = todosData.filter((t: Todo) => t.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(filtered));

      console.log(`✅ Todo deleted`);
      await loadData();
      toast.success('Todo deleted!');
    } catch (error) {
      console.error('❌ Error deleting todo:', error);
      toast.error('Failed to delete todo');
    }
  };

  const resetForm = () => {
    setFormData({
      text: '',
      taskId: '',
      dueDate: '',
      priority: 'Medium',
      completed: false
    });
    setErrors({});
    setEditingId(null);
  };

  const filteredTodos = todos.filter(t =>
    filter === 'all' || (filter === 'completed' ? t.completed : !t.completed)
  );

  const priorityColor = {
    'Low': 'bg-blue-100 text-blue-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'High': 'bg-red-100 text-red-800'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
          <h2 className="text-3xl font-bold text-gray-800">My Todos</h2>
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
          filteredTodos.map(todo => (
            <div
              key={todo.id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition ${
                todo.completed
                  ? 'bg-gray-50 border-gray-200 opacity-75'
                  : 'bg-white border-gray-300 hover:shadow-md'
              }`}
            >
              <button
                onClick={() => handleToggle(todo.id, todo.completed)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                  todo.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 hover:border-green-500'
                }`}
              >
                {todo.completed && <CheckCircle2 className="w-5 h-5 text-white" />}
              </button>

              <div className="flex-1">
                <p className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {todo.text}
                </p>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {todo.taskId && (
                    <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      <LinkIcon className="w-3 h-3" />
                      {todo.taskTitle}
                    </span>
                  )}
                  {todo.priority && (
                    <span className={`text-xs px-2 py-1 rounded ${priorityColor[todo.priority]}`}>
                      {todo.priority}
                    </span>
                  )}
                  {todo.dueDate && (
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {new Date(todo.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFormData({
                      text: todo.text,
                      taskId: todo.taskId || '',
                      dueDate: todo.dueDate || '',
                      priority: todo.priority || 'Medium',
                      completed: todo.completed
                    });
                    setEditingId(todo.id);
                    setShowAddModal(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
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
              {/* Todo Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Todo Text *
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="What do you need to do?"
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    errors.text ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.text && <p className="text-red-600 text-sm mt-1">{errors.text}</p>}
              </div>

              {/* Task Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link to Task (Optional)
                </label>
                <select
                  value={formData.taskId}
                  onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">No task link</option>
                  {tasks.map(task => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  ))}
                </select>
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
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  {editingId ? 'Update' : 'Create'}
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
