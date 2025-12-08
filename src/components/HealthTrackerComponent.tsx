import React, { useState, useEffect } from 'react';
import {
  Heart, Droplet, Moon, Activity, Plus, Edit2, Trash2, Loader,
  Calendar, TrendingUp, Info
} from 'lucide-react';
import { toast } from 'react-toastify';
import { healthTrackerAPI, HealthTracker, formatDate } from '../utils/sadhakaPlannerData';
import { useAuth } from '../context/AuthContext';

interface FormData {
  water: number;
  sleep: number;
  exercise: number;
  steps: number;
  weight: string;
  mood: 'terrible' | 'bad' | 'neutral' | 'good' | 'great';
  energyLevel: number;
  notes: string;
}

const HealthTrackerComponent: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<HealthTracker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [formData, setFormData] = useState<FormData>({
    water: 0,
    sleep: 0,
    exercise: 0,
    steps: 0,
    weight: '',
    mood: 'neutral',
    energyLevel: 5,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.id) {
      loadHealthData();
    }
  }, [user?.id, selectedDate]);

  const loadHealthData = async () => {
    try {
      setLoading(true);
      const data = await healthTrackerAPI.getAll(user?.id || '');
      setEntries(data || []);
    } catch (error) {
      console.error('❌ Error loading health data:', error);
      toast.error('Failed to load health data');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedDate) {
      newErrors.date = 'Date is required';
    }

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
      const payload: HealthTracker = {
        userId: user?.id || '',
        date: selectedDate,
        water: formData.water,
        sleep: formData.sleep,
        exercise: formData.exercise,
        steps: formData.steps,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        mood: formData.mood,
        energyLevel: formData.energyLevel,
        notes: formData.notes || undefined,
      };

      if (editingId) {
        payload.id = editingId;
        await healthTrackerAPI.update(editingId, payload);
        toast.success('Health data updated!');
      } else {
        await healthTrackerAPI.create(payload);
        toast.success('Health data logged!');
      }

      await loadHealthData();
      setShowAddModal(false);
      resetForm();
    } catch (error: any) {
      console.error('❌ Error saving health data:', error);
      toast.error(error.message || 'Failed to save health data');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this health entry?')) return;

    try {
      await healthTrackerAPI.delete(id, user?.id || '');
      await loadHealthData();
      toast.success('Entry deleted!');
    } catch (error: any) {
      console.error('❌ Error deleting entry:', error);
      toast.error('Failed to delete entry');
    }
  };

  const handleEdit = (entry: HealthTracker) => {
    setSelectedDate(entry.date);
    setFormData({
      water: entry.water || 0,
      sleep: entry.sleep || 0,
      exercise: entry.exercise || 0,
      steps: entry.steps || 0,
      weight: entry.weight ? entry.weight.toString() : '',
      mood: (entry.mood || 'neutral') as 'terrible' | 'bad' | 'neutral' | 'good' | 'great',
      energyLevel: entry.energyLevel || 5,
      notes: entry.notes || '',
    });
    setEditingId(entry.id || entry._id || null);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      water: 0,
      sleep: 0,
      exercise: 0,
      steps: 0,
      weight: '',
      mood: 'neutral',
      energyLevel: 5,
      notes: '',
    });
    setErrors({});
    setEditingId(null);
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'terrible': return '😢';
      case 'bad': return '😟';
      case 'neutral': return '😐';
      case 'good': return '😊';
      case 'great': return '😄';
      default: return '😐';
    }
  };

  const getTodaysEntry = () => {
    return entries.find(e => e.date === selectedDate);
  };

  const todaysEntry = getTodaysEntry();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-600" />
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Health Tracker</h2>
            <p className="text-sm text-gray-600">Track your daily health metrics</p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedDate(new Date().toISOString().split('T')[0]);
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          <Plus className="w-5 h-5" />
          Log Health
        </button>
      </div>

      {/* Date Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Today's Summary */}
      {todaysEntry && (
        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-lg border border-red-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Today's Summary</h3>
            <span className="text-2xl">{getMoodEmoji(todaysEntry.mood)}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="bg-white/60 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Water</p>
              <p className="text-lg font-bold text-blue-600">{todaysEntry.water}L</p>
            </div>
            <div className="bg-white/60 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Sleep</p>
              <p className="text-lg font-bold text-purple-600">{todaysEntry.sleep}h</p>
            </div>
            <div className="bg-white/60 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Exercise</p>
              <p className="text-lg font-bold text-green-600">{todaysEntry.exercise}m</p>
            </div>
            <div className="bg-white/60 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Steps</p>
              <p className="text-lg font-bold text-orange-600">{todaysEntry.steps}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleEdit(todaysEntry)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => handleDelete(todaysEntry.id || todaysEntry._id || '')}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* All Entries */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-4">All Entries ({entries.length})</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No health entries yet. Start tracking!</p>
            </div>
          ) : (
            entries.map(entry => (
              <div
                key={entry.id || entry._id}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{formatDate(entry.date)}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <p className="text-gray-600"><span className="font-semibold">Water:</span> {entry.water}L</p>
                      <p className="text-gray-600"><span className="font-semibold">Sleep:</span> {entry.sleep}h</p>
                      <p className="text-gray-600"><span className="font-semibold">Exercise:</span> {entry.exercise}m</p>
                      <p className="text-gray-600"><span className="font-semibold">Steps:</span> {entry.steps}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id || entry._id || '')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-96 overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId ? 'Edit Health Entry' : 'Log Health Data'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Water Intake */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-blue-600" />
                  Water Intake (Liters)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.water}
                  onChange={(e) => setFormData({ ...formData, water: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Sleep */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Moon className="w-4 h-4 text-purple-600" />
                  Sleep (Hours)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.sleep}
                  onChange={(e) => setFormData({ ...formData, sleep: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Exercise */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  Exercise (Minutes)
                </label>
                <input
                  type="number"
                  value={formData.exercise}
                  onChange={(e) => setFormData({ ...formData, exercise: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Steps */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Steps
                </label>
                <input
                  type="number"
                  value={formData.steps}
                  onChange={(e) => setFormData({ ...formData, steps: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Mood */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mood
                </label>
                <select
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="terrible">😢 Terrible</option>
                  <option value="bad">😟 Bad</option>
                  <option value="neutral">😐 Neutral</option>
                  <option value="good">😊 Good</option>
                  <option value="great">😄 Great</option>
                </select>
              </div>

              {/* Energy Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Energy Level (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.energyLevel}
                  onChange={(e) => setFormData({ ...formData, energyLevel: parseInt(e.target.value) })}
                  className="w-full"
                />
                <p className="text-center text-sm text-gray-600 mt-1">{formData.energyLevel}/10</p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any notes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium"
                >
                  {editingId ? 'Update Entry' : 'Log Health'}
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

export default HealthTrackerComponent;
