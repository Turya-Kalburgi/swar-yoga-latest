import React, { useState, useEffect, useContext } from 'react';
import { remindersAPI } from '../utils/database';
import { AuthContext } from '../context/AuthContext';
import { Plus, X, Edit, Trash2, Search, Clock, AlertCircle, CheckCircle, Bell, Flag, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

interface Reminder {
  _id?: string;
  id?: string;
  userId?: string;
  title: string;
  description?: string;
  reminderDate: string;
  reminderTime: string;
  priority?: 'Low' | 'Medium' | 'High';
  category: string;
  reminderType?: 'Todo' | 'Task' | 'Goal' | 'Milestone' | 'Custom';
  relatedId?: string;
  relatedTitle?: string;
  status?: 'Active' | 'Snoozed' | 'Dismissed' | 'Completed';
  isCompleted?: boolean;
  completedAt?: string;
  snoozedUntil?: string;
  createdAt?: string;
  updatedAt?: string;
}

const RemindersComponent: React.FC = () => {
  const { user } = useContext(AuthContext) || { user: null };
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Personal', 'Work', 'Health', 'Learning', 'Finance', 'Social'];
  const priorities = ['Low', 'Medium', 'High'];
  const reminderTypes = ['Todo', 'Task', 'Goal', 'Milestone', 'Custom'];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reminderDate: '',
    reminderTime: '09:00',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    category: 'Personal',
    reminderType: 'Custom' as 'Todo' | 'Task' | 'Goal' | 'Milestone' | 'Custom',
    relatedTitle: ''
  });

  useEffect(() => {
    if (user?.id) {
      loadReminders();
    }
  }, [user?.id]);

  const loadReminders = async () => {
    try {
      setLoading(true);
      const allReminders = await remindersAPI.getAll(user?.id);
      setReminders(allReminders || []);
    } catch (error) {
      console.error('❌ Error loading reminders:', error);
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!formData.reminderDate) {
      toast.error('Reminder date is required');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      reminderDate: '',
      reminderTime: '09:00',
      priority: 'Medium',
      category: 'Personal',
      reminderType: 'Custom',
      relatedTitle: ''
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
        reminderDate: formData.reminderDate,
        reminderTime: formData.reminderTime,
        priority: formData.priority,
        category: formData.category,
        reminderType: formData.reminderType,
        relatedTitle: formData.relatedTitle
      };

      if (editingId) {
        await remindersAPI.update(editingId, payload);
        toast.success('Reminder updated!');
      } else {
        await remindersAPI.create(payload);
        toast.success('Reminder created!');
      }

      await loadReminders();
      setShowAddModal(false);
      resetForm();
    } catch (error: any) {
      console.error('❌ Error saving reminder:', error);
      toast.error(error.message || 'Failed to save reminder');
    }
  };

  const handleEdit = (reminder: Reminder) => {
    setFormData({
      title: reminder.title || '',
      description: reminder.description || '',
      reminderDate: reminder.reminderDate || '',
      reminderTime: reminder.reminderTime || '09:00',
      priority: reminder.priority || 'Medium',
      category: reminder.category || 'Personal',
      reminderType: reminder.reminderType || 'Custom',
      relatedTitle: reminder.relatedTitle || ''
    });
    setEditingId(reminder._id || reminder.id || '');
    setShowAddModal(true);
  };

  const handleSnooze = async (id: string, minutes: number) => {
    try {
      await remindersAPI.snooze(id, minutes);
      await loadReminders();
      toast.success(`Reminder snoozed for ${minutes} minutes`);
    } catch (error: any) {
      console.error('❌ Error snoozing reminder:', error);
      toast.error('Failed to snooze reminder');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await remindersAPI.complete(id);
      await loadReminders();
      toast.success('Reminder marked as complete!');
    } catch (error: any) {
      console.error('❌ Error completing reminder:', error);
      toast.error('Failed to complete reminder');
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await remindersAPI.dismiss(id);
      await loadReminders();
      toast.info('Reminder dismissed');
    } catch (error: any) {
      console.error('❌ Error dismissing reminder:', error);
      toast.error('Failed to dismiss reminder');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this reminder?')) return;
    try {
      await remindersAPI.delete(id);
      await loadReminders();
      toast.success('Reminder deleted!');
    } catch (error: any) {
      console.error('❌ Error deleting reminder:', error);
      toast.error('Failed to delete reminder');
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

  const isOverdue = (date: string, time: string): boolean => {
    if (!date || !time) return false;
    const reminderDateTime = new Date(`${date}T${time}`);
    return reminderDateTime < new Date();
  };

  const filteredReminders = reminders.filter(reminder => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && reminder.status === 'Active') ||
      (filter === 'completed' && reminder.isCompleted);

    const matchesSearch =
      reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const groupedReminders = {
    active: filteredReminders.filter(r => r.status !== 'Completed'),
    completed: filteredReminders.filter(r => r.status === 'Completed')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Reminders</h1>
        <p className="text-gray-600">Stay on top of your important tasks</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search reminders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Reminders</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Reminder
          </button>
        </div>
      </div>

      {groupedReminders.active.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-500" />
            Active ({groupedReminders.active.length})
          </h2>
          <div className="grid gap-4">
            {groupedReminders.active.map(reminder => (
              <div
                key={reminder._id || reminder.id}
                className={`${getPriorityBgColor(reminder.priority)} border-l-4 border-purple-500 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 text-lg break-words">
                        {reminder.title}
                      </h3>
                      {isOverdue(reminder.reminderDate, reminder.reminderTime) && (
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                      )}
                    </div>

                    {reminder.description && (
                      <p className="text-gray-600 text-sm mt-1">{reminder.description}</p>
                    )}

                    <div className="flex flex-wrap gap-3 mt-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(reminder.priority)} bg-white border`}>
                        <Flag className="w-3 h-3" />
                        {reminder.priority}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-white border text-gray-600">
                        {reminder.category}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-white border text-gray-600">
                        <Calendar className="w-3 h-3" />
                        {new Date(reminder.reminderDate).toLocaleDateString()}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-white border text-gray-600">
                        <Clock className="w-3 h-3" />
                        {reminder.reminderTime}
                      </span>

                      {reminder.reminderType !== 'Custom' && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-700">
                          {reminder.reminderType}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleSnooze(reminder._id || reminder.id || '', 5)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Snooze 5 min"
                    >
                      <Clock className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleComplete(reminder._id || reminder.id || '')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Complete"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(reminder)}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(reminder._id || reminder.id || '')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {groupedReminders.completed.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Completed ({groupedReminders.completed.length})
          </h2>
          <div className="grid gap-4">
            {groupedReminders.completed.map(reminder => (
              <div
                key={reminder._id || reminder.id}
                className="bg-gray-50 border-l-4 border-gray-300 rounded-lg p-4 shadow-md opacity-75 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-600 line-through">{reminder.title}</h3>
                    {reminder.description && (
                      <p className="text-gray-500 text-sm line-through mt-1">{reminder.description}</p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleDelete(reminder._id || reminder.id || '')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredReminders.length === 0 && !loading && (
        <div className="text-center py-16">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No reminders found. Create one to get started!</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading reminders...</p>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{editingId ? 'Edit Reminder' : 'Add New Reminder'}</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="What do you need to be reminded about?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add details..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Date *</label>
                  <input
                    type="date"
                    value={formData.reminderDate}
                    onChange={(e) => setFormData({ ...formData, reminderDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Time</label>
                  <input
                    type="time"
                    value={formData.reminderTime}
                    onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {priorities.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Type</label>
                <select
                  value={formData.reminderType}
                  onChange={(e) => setFormData({ ...formData, reminderType: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {reminderTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {editingId ? 'Update Reminder' : 'Create Reminder'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
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

export default RemindersComponent;
