import React, { useState, useEffect } from 'react';
import { Clock, Plus, Edit2, Trash2, Calendar, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { dailyPlansAPI } from '../utils/database';

interface DailyPlan {
  _id?: string;
  id?: string;
  userId: string;
  date: string;
  time: string;
  activity: string;
  description?: string;
  category?: 'work' | 'health' | 'personal' | 'learning' | 'spiritual' | 'other';
  priority?: 'Low' | 'Medium' | 'High';
  duration?: number;
  reminder?: boolean;
  reminderTime?: string;
  completed: boolean;
  completedAt?: string;
  createdAt?: string;
}

interface FormData {
  time: string;
  activity: string;
  description: string;
  category: 'work' | 'health' | 'personal' | 'learning' | 'spiritual' | 'other';
  duration: number;
  priority: 'Low' | 'Medium' | 'High';
  reminder: boolean;
  reminderTime: string;
}

const DailyPlanComponent: React.FC = () => {
  const [plans, setPlans] = useState<DailyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [formData, setFormData] = useState<FormData>({
    time: '',
    activity: '',
    description: '',
    category: 'personal',
    duration: 30,
    priority: 'Medium',
    reminder: false,
    reminderTime: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.id) {
      loadPlans();
    }
  }, [user.id, selectedDate]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const allPlans = await dailyPlansAPI.getAll(user.id);

      // Filter by selected date and sort by time
      const plansForDate = allPlans
        .filter((p: DailyPlan) => p.date === selectedDate)
        .sort((a: DailyPlan, b: DailyPlan) => a.time.localeCompare(b.time));

      setPlans(plansForDate);
    } catch (error) {
      console.error('❌ Error loading daily plans:', error);
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.activity) newErrors.activity = 'Activity is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      const payload = {
        userId: user.id,
        date: selectedDate,
        ...formData,
      };

      if (editingId) {
        await dailyPlansAPI.update(editingId, payload);
        toast.success('Plan updated!');
      } else {
        await dailyPlansAPI.create(payload);
        toast.success('Plan created!');
      }

      await loadPlans();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('❌ Error saving plan:', error);
      toast.error('Failed to save plan');
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      await dailyPlansAPI.update(id, { completed: !completed });
      await loadPlans();
      toast.success('Plan updated');
    } catch (error) {
      console.error('❌ Error toggling plan:', error);
      toast.error('Failed to toggle plan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this plan?')) return;

    try {
      await dailyPlansAPI.delete(id);
      await loadPlans();
      toast.success('Plan deleted!');
    } catch (error) {
      console.error('❌ Error deleting plan:', error);
      toast.error('Failed to delete plan');
    }
  };

  const resetForm = () => {
    setFormData({
      time: '',
      activity: '',
      description: '',
      category: 'personal',
      duration: 30,
      priority: 'Medium',
      reminder: false,
      reminderTime: '',
    });
    setErrors({});
    setEditingId(null);
  };

  const getPriorityColor = (priority?: 'Low' | 'Medium' | 'High') => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      work: 'bg-blue-100 text-blue-800',
      health: 'bg-green-100 text-green-800',
      personal: 'bg-purple-100 text-purple-800',
      learning: 'bg-orange-100 text-orange-800',
      spiritual: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category || 'other'] || colors.other;
  };

  const completedCount = plans.filter(p => p.completed).length;
  const totalCount = plans.length;

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
          <Clock className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Daily Plan</h2>
            <p className="text-sm text-gray-600">
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add Activity
        </button>
      </div>

      {/* Date Selector */}
      <div className="flex gap-2 items-center">
        <Calendar className="w-5 h-5 text-gray-600" />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Today
        </button>
      </div>

      {/* Progress */}
      {totalCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-bold text-blue-600">{completedCount}/{totalCount} completed</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Plans List */}
      <div className="space-y-3">
        {plans.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No plans for this day. Create one to get started!</p>
          </div>
        ) : (
          plans.map(plan => (
            <div
              key={plan._id || plan.id}
              className={`flex items-start gap-4 p-4 rounded-lg border transition ${
                plan.completed
                  ? 'bg-gray-50 border-gray-200 opacity-75'
                  : 'bg-white border-gray-300 hover:shadow-md'
              }`}
            >
              <button
                onClick={() => handleToggle(plan._id || plan.id || '', plan.completed)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition mt-1 ${
                  plan.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                {plan.completed && <span className="text-white text-sm">✓</span>}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-lg text-gray-800 min-w-fit">
                    {plan.time}
                  </span>
                  <h3 className={`text-lg ${plan.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {plan.activity}
                  </h3>
                </div>

                {plan.description && (
                  <p className={`text-sm ${plan.completed ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    {plan.description}
                  </p>
                )}

                <div className="flex gap-2 flex-wrap">
                  {plan.category && (
                    <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(plan.category)}`}>
                      {plan.category}
                    </span>
                  )}
                  {plan.priority && (
                    <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(plan.priority)}`}>
                      {plan.priority}
                    </span>
                  )}
                  {plan.duration && (
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">
                      {plan.duration}min
                    </span>
                  )}
                </div>

                {plan.reminder && plan.reminderTime && (
                  <div className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Reminder at {plan.reminderTime}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFormData({
                      time: plan.time,
                      activity: plan.activity,
                      description: plan.description || '',
                      category: (plan.category || 'personal') as any,
                      duration: plan.duration || 30,
                      priority: plan.priority || 'Medium',
                      reminder: plan.reminder || false,
                      reminderTime: plan.reminderTime || '',
                    });
                    setEditingId(plan._id || plan.id || '');
                    setShowAddModal(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(plan._id || plan.id || '')}
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
              {editingId ? 'Edit Activity' : 'Add Activity'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time *
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.time ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.time && <p className="text-red-600 text-sm mt-1">{errors.time}</p>}
              </div>

              {/* Activity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity *
                </label>
                <input
                  type="text"
                  value={formData.activity}
                  onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                  placeholder="What's your activity?"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.activity ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.activity && <p className="text-red-600 text-sm mt-1">{errors.activity}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add notes..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="work">Work</option>
                  <option value="health">Health</option>
                  <option value="personal">Personal</option>
                  <option value="learning">Learning</option>
                  <option value="spiritual">Spiritual</option>
                  <option value="other">Other</option>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="480"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Reminder */}
              <div className="border-t pt-4">
                <label className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={formData.reminder}
                    onChange={(e) => setFormData({ ...formData, reminder: e.target.checked, reminderTime: e.target.checked ? '09:00' : '' })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Set Reminder</span>
                </label>
                {formData.reminder && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reminder Time
                    </label>
                    <input
                      type="time"
                      value={formData.reminderTime}
                      onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
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

export default DailyPlanComponent;
