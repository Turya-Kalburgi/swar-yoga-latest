import React, { useState, useEffect } from 'react';
import { Bell, Plus, Edit, Trash2, Clock, Repeat2, Loader, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

interface Reminder {
  id: string;
  userId: string;
  title: string;
  description?: string;
  reminderTime: string;
  reminderDate: string;
  entityType?: 'task' | 'todo' | 'activity' | 'event';
  entityId?: string;
  entityName?: string;
  recurring: 'none' | 'daily' | 'weekly' | 'monthly';
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt?: string;
}

const RemindersComponent: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'overdue' | 'completed'>('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reminderTime: '09:00',
    reminderDate: new Date().toISOString().split('T')[0],
    entityType: '' as 'task' | 'todo' | 'activity' | 'event' | '',
    entityName: '',
    recurring: 'none' as 'none' | 'daily' | 'weekly' | 'monthly',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const entityTypes = {
    task: { label: 'Task', icon: '✅' },
    todo: { label: 'Todo', icon: '📋' },
    activity: { label: 'Activity', icon: '🎯' },
    event: { label: 'Event', icon: '📅' }
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800 border-blue-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-red-100 text-red-800 border-red-300'
  };

  useEffect(() => {
    loadReminders();
  }, [user.id]);

  const loadReminders = async () => {
    try {
      setLoading(true);
      const storageKey = `sadhaka_reminders_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      const data = stored ? JSON.parse(stored) : [];

      // Sort by date and time
      data.sort((a: Reminder, b: Reminder) => {
        const aDateTime = new Date(`${a.reminderDate}T${a.reminderTime}`);
        const bDateTime = new Date(`${b.reminderDate}T${b.reminderTime}`);
        return aDateTime.getTime() - bDateTime.getTime();
      });

      setReminders(data);
    } catch (error) {
      console.error('❌ Error loading reminders:', error);
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.reminderDate) {
      newErrors.reminderDate = 'Date is required';
    }

    if (!formData.reminderTime) {
      newErrors.reminderTime = 'Time is required';
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
      const storageKey = `sadhaka_reminders_${user.id}`;
      const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');

      if (editingId) {
        const index = existingData.findIndex((r: Reminder) => r.id === editingId);
        if (index !== -1) {
          existingData[index] = {
            ...existingData[index],
            title: formData.title,
            description: formData.description,
            reminderTime: formData.reminderTime,
            reminderDate: formData.reminderDate,
            entityType: formData.entityType || undefined,
            entityName: formData.entityName || undefined,
            recurring: formData.recurring,
            priority: formData.priority
          };
        }
        console.log(`✅ Reminder updated: ${formData.title}`);
      } else {
        const newReminder: Reminder = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.id,
          title: formData.title,
          description: formData.description,
          reminderTime: formData.reminderTime,
          reminderDate: formData.reminderDate,
          entityType: (formData.entityType as any) || undefined,
          entityName: formData.entityName || undefined,
          recurring: formData.recurring,
          isCompleted: false,
          priority: formData.priority,
          createdAt: new Date().toISOString()
        };
        existingData.push(newReminder);
        console.log(`✅ Reminder created: ${formData.title}`);
      }

      localStorage.setItem(storageKey, JSON.stringify(existingData));
      await loadReminders();

      toast.success(editingId ? 'Reminder updated!' : 'Reminder set!');
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('❌ Error saving reminder:', error);
      toast.error('Failed to save reminder');
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const storageKey = `sadhaka_reminders_${user.id}`;
      const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const reminder = data.find((r: Reminder) => r.id === id);

      if (reminder) {
        reminder.isCompleted = !reminder.isCompleted;
        localStorage.setItem(storageKey, JSON.stringify(data));
        await loadReminders();
        console.log(`✅ Reminder marked as ${reminder.isCompleted ? 'completed' : 'pending'}`);
        toast.success(reminder.isCompleted ? 'Reminder completed!' : 'Reminder reopened!');
      }
    } catch (error) {
      console.error('❌ Error updating reminder:', error);
      toast.error('Failed to update reminder');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this reminder?')) return;

    try {
      const storageKey = `sadhaka_reminders_${user.id}`;
      const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const filtered = data.filter((r: Reminder) => r.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(filtered));

      console.log(`✅ Reminder deleted`);
      await loadReminders();
      toast.success('Reminder deleted!');
    } catch (error) {
      console.error('❌ Error deleting reminder:', error);
      toast.error('Failed to delete reminder');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      reminderTime: '09:00',
      reminderDate: new Date().toISOString().split('T')[0],
      entityType: '',
      entityName: '',
      recurring: 'none',
      priority: 'medium'
    });
    setErrors({});
    setEditingId(null);
  };

  const getFilteredReminders = () => {
    const now = new Date();

    return reminders.filter(reminder => {
      const reminderDateTime = new Date(`${reminder.reminderDate}T${reminder.reminderTime}`);

      if (filter === 'completed') {
        return reminder.isCompleted;
      } else if (filter === 'upcoming') {
        return !reminder.isCompleted && reminderDateTime > now;
      } else if (filter === 'overdue') {
        return !reminder.isCompleted && reminderDateTime <= now;
      }
      return true;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const filteredReminders = getFilteredReminders();
  const upcomingCount = reminders.filter(
    r => !r.isCompleted && new Date(`${r.reminderDate}T${r.reminderTime}`) > new Date()
  ).length;
  const overdueCount = reminders.filter(
    r => !r.isCompleted && new Date(`${r.reminderDate}T${r.reminderTime}`) <= new Date()
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">Reminders</h2>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Set Reminder
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">Upcoming</p>
          <p className="text-2xl font-bold text-blue-900">{upcomingCount}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-700 font-medium">Overdue</p>
          <p className="text-2xl font-bold text-red-900">{overdueCount}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-700 font-medium">Completed</p>
          <p className="text-2xl font-bold text-green-900">
            {reminders.filter(r => r.isCompleted).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'upcoming', 'overdue', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No reminders in this category</p>
          </div>
        ) : (
          filteredReminders.map(reminder => {
            const reminderDateTime = new Date(`${reminder.reminderDate}T${reminder.reminderTime}`);
            const isOverdue = reminderDateTime < new Date() && !reminder.isCompleted;

            return (
              <div
                key={reminder.id}
                className={`p-4 border rounded-lg transition ${
                  reminder.isCompleted
                    ? 'bg-gray-50 border-gray-300'
                    : isOverdue
                    ? 'bg-red-50 border-red-300'
                    : 'bg-white border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left Side */}
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => handleToggleComplete(reminder.id)}
                      className={`mt-1 flex-shrink-0 transition ${
                        reminder.isCompleted ? 'text-green-600' : 'text-gray-400 hover:text-green-600'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold ${reminder.isCompleted ? 'line-through text-gray-600' : 'text-gray-800'}`}>
                          {reminder.title}
                        </h3>
                        {isOverdue && (
                          <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                            Overdue
                          </span>
                        )}
                      </div>

                      {reminder.description && (
                        <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                      )}

                      {/* Meta Info */}
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {reminderDateTime.toLocaleString()}
                        </div>

                        {reminder.recurring !== 'none' && (
                          <div className="flex items-center gap-1">
                            <Repeat2 className="w-4 h-4" />
                            {reminder.recurring.charAt(0).toUpperCase() + reminder.recurring.slice(1)}
                          </div>
                        )}

                        {reminder.entityType && (
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                            {entityTypes[reminder.entityType].label}
                            {reminder.entityName && `: ${reminder.entityName}`}
                          </span>
                        )}

                        <span
                          className={`text-xs px-2 py-1 rounded border ${
                            priorityColors[reminder.priority]
                          }`}
                        >
                          {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setFormData({
                          title: reminder.title,
                          description: reminder.description || '',
                          reminderTime: reminder.reminderTime,
                          reminderDate: reminder.reminderDate,
                          entityType: (reminder.entityType as any) || '',
                          entityName: reminder.entityName || '',
                          recurring: reminder.recurring,
                          priority: reminder.priority
                        });
                        setEditingId(reminder.id);
                        setShowAddModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(reminder.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId ? 'Edit Reminder' : 'Set Reminder'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="E.g., Call dentist"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add details..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.reminderDate}
                  onChange={(e) => setFormData({ ...formData, reminderDate: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.reminderDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.reminderDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.reminderDate}</p>
                )}
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time *
                </label>
                <input
                  type="time"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.reminderTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.reminderTime && (
                  <p className="text-red-600 text-sm mt-1">{errors.reminderTime}</p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Recurring */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recurring
                </label>
                <select
                  value={formData.recurring}
                  onChange={(e) => setFormData({ ...formData, recurring: e.target.value as 'none' | 'daily' | 'weekly' | 'monthly' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">None</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {/* Entity Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link to (Optional)
                </label>
                <select
                  value={formData.entityType}
                  onChange={(e) => setFormData({ ...formData, entityType: e.target.value as 'task' | 'todo' | 'activity' | 'event' | '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None</option>
                  {Object.entries(entityTypes).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Entity Name */}
              {formData.entityType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {entityTypes[formData.entityType as any].label} Name
                  </label>
                  <input
                    type="text"
                    value={formData.entityName}
                    onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                    placeholder={`E.g., ${entityTypes[formData.entityType as any].label} name`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingId ? 'Update' : 'Set'}
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

export default RemindersComponent;
