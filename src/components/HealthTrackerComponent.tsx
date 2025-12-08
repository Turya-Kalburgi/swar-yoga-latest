import React, { useState, useEffect } from 'react';
import {
  Heart, Droplet, Utensils, Moon, Activity, Plus, Edit2, Trash2, Loader,
  Calendar, TrendingUp, Info
} from 'lucide-react';
import { toast } from 'react-toastify';
import { healthAPI } from '../utils/database';

interface HealthEntry {
  _id?: string;
  id?: string;
  userId: string;
  date: string;
  water: number;
  sleep: number;
  exercise: number;
  meals: number;
  steps: number;
  weight?: number;
  calories?: number;
  heartRate?: number;
  bloodPressure?: string;
  mood: 'terrible' | 'bad' | 'neutral' | 'good' | 'great';
  energyLevel: number;
  stressLevel: number;
  meditationMinutes: number;
  yogaMinutes: number;
  notes?: string;
  reminder?: boolean;
  reminderTime?: string;
  createdAt?: string;
}

interface FormData {
  water: number;
  sleep: number;
  exercise: number;
  meals: number;
  steps: number;
  weight: string;
  calories: string;
  heartRate: string;
  bloodPressure: string;
  mood: 'terrible' | 'bad' | 'neutral' | 'good' | 'great';
  energyLevel: number;
  stressLevel: number;
  meditationMinutes: number;
  yogaMinutes: number;
  notes: string;
  reminder: boolean;
  reminderTime: string;
}

const HealthTrackerComponent: React.FC = () => {
  const [entries, setEntries] = useState<HealthEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const [formData, setFormData] = useState<FormData>({
    water: 0,
    sleep: 0,
    exercise: 0,
    meals: 0,
    steps: 0,
    weight: '',
    calories: '',
    heartRate: '',
    bloodPressure: '',
    mood: 'neutral',
    energyLevel: 5,
    stressLevel: 5,
    meditationMinutes: 0,
    yogaMinutes: 0,
    notes: '',
    reminder: false,
    reminderTime: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.id) {
      loadHealthData();
    }
  }, [user.id]);

  const loadHealthData = async () => {
    try {
      setLoading(true);
      const data = await healthAPI.getAll(user.id);
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
      const payload = {
        userId: user.id,
        date: selectedDate,
        water: formData.water,
        sleep: formData.sleep,
        exercise: formData.exercise,
        meals: formData.meals,
        steps: formData.steps,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        calories: formData.calories ? parseInt(formData.calories) : undefined,
        heartRate: formData.heartRate ? parseInt(formData.heartRate) : undefined,
        bloodPressure: formData.bloodPressure || undefined,
        mood: formData.mood,
        energyLevel: formData.energyLevel,
        stressLevel: formData.stressLevel,
        meditationMinutes: formData.meditationMinutes,
        yogaMinutes: formData.yogaMinutes,
        notes: formData.notes || undefined,
        reminder: formData.reminder,
        reminderTime: formData.reminderTime || undefined,
      };

      if (editingId) {
        await healthAPI.update(editingId, payload);
        toast.success('Health data updated!');
      } else {
        await healthAPI.create(payload);
        toast.success('Health data logged!');
      }

      await loadHealthData();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('❌ Error saving health data:', error);
      toast.error('Failed to save health data');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this health entry?')) return;

    try {
      await healthAPI.delete(id);
      await loadHealthData();
      toast.success('Entry deleted!');
    } catch (error) {
      console.error('❌ Error deleting entry:', error);
      toast.error('Failed to delete entry');
    }
  };

  const resetForm = () => {
    setFormData({
      water: 0,
      sleep: 0,
      exercise: 0,
      meals: 0,
      steps: 0,
      weight: '',
      calories: '',
      heartRate: '',
      bloodPressure: '',
      mood: 'neutral',
      energyLevel: 5,
      stressLevel: 5,
      meditationMinutes: 0,
      yogaMinutes: 0,
      notes: '',
      reminder: false,
      reminderTime: '',
    });
    setErrors({});
    setEditingId(null);
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'terrible': return '😭';
      case 'bad': return '😞';
      case 'neutral': return '😐';
      case 'good': return '😊';
      case 'great': return '😄';
      default: return '😐';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'terrible': return 'bg-red-100 text-red-800';
      case 'bad': return 'bg-orange-100 text-orange-800';
      case 'neutral': return 'bg-yellow-100 text-yellow-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'great': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilteredData = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return entries.filter(item => {
      const itemDate = new Date(item.date);

      if (filter === 'today') {
        return itemDate.toDateString() === today.toDateString();
      } else if (filter === 'week') {
        return itemDate >= weekAgo;
      } else if (filter === 'month') {
        return itemDate >= monthAgo;
      }
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  const todayEntry = entries.find(e => e.date === new Date().toISOString().split('T')[0]);
  const filteredData = getFilteredData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-600" />
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Health Tracker</h2>
            <p className="text-sm text-gray-600">Monitor your daily health metrics</p>
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

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'today', 'week', 'month'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === f
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Today's Summary */}
      {todayEntry && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Today's Health Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Droplet className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{todayEntry.water}</div>
              <div className="text-xs text-gray-600">glasses</div>
            </div>
            <div className="text-center">
              <Moon className="h-6 w-6 text-indigo-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{todayEntry.sleep}</div>
              <div className="text-xs text-gray-600">hours</div>
            </div>
            <div className="text-center">
              <Activity className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{todayEntry.exercise}</div>
              <div className="text-xs text-gray-600">minutes</div>
            </div>
            <div className="text-center">
              <Utensils className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{todayEntry.meals}</div>
              <div className="text-xs text-gray-600">meals</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-green-200">
            <div className="text-sm">
              <span className={`inline-block px-3 py-1 rounded-full ${getMoodColor(todayEntry.mood)}`}>
                Mood: {getMoodEmoji(todayEntry.mood)} {todayEntry.mood.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Health Entries */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Health History
        </h3>

        {filteredData.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No health data logged yet. Start tracking!</p>
          </div>
        ) : (
          filteredData.map(entry => (
            <div
              key={entry._id || entry.id}
              className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-gray-800">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <span className={`text-xs inline-block mt-1 px-2 py-1 rounded-full ${getMoodColor(entry.mood)}`}>
                    {getMoodEmoji(entry.mood)} {entry.mood.toUpperCase()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setFormData({
                        water: entry.water,
                        sleep: entry.sleep,
                        exercise: entry.exercise,
                        meals: entry.meals,
                        steps: entry.steps,
                        weight: entry.weight?.toString() || '',
                        calories: entry.calories?.toString() || '',
                        heartRate: entry.heartRate?.toString() || '',
                        bloodPressure: entry.bloodPressure || '',
                        mood: entry.mood,
                        energyLevel: entry.energyLevel,
                        stressLevel: entry.stressLevel,
                        meditationMinutes: entry.meditationMinutes,
                        yogaMinutes: entry.yogaMinutes,
                        notes: entry.notes || '',
                        reminder: entry.reminder || false,
                        reminderTime: entry.reminderTime || '',
                      });
                      setSelectedDate(entry.date);
                      setEditingId(entry._id || entry.id || '');
                      setShowAddModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry._id || entry.id || '')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-700">{entry.water} glasses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-indigo-500" />
                  <span className="text-gray-700">{entry.sleep}h sleep</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-orange-500" />
                  <span className="text-gray-700">{entry.exercise}min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">{entry.meals} meals</span>
                </div>
              </div>

              {(entry.weight || entry.calories || entry.heartRate || entry.bloodPressure) && (
                <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
                  <div className="flex flex-wrap gap-3">
                    {entry.weight && <span className="text-gray-700">⚖️ {entry.weight}kg</span>}
                    {entry.calories && <span className="text-gray-700">🔥 {entry.calories}kcal</span>}
                    {entry.heartRate && <span className="text-gray-700">❤️ {entry.heartRate}bpm</span>}
                    {entry.bloodPressure && <span className="text-gray-700">💉 {entry.bloodPressure}</span>}
                  </div>
                </div>
              )}

              {entry.notes && (
                <p className="mt-2 text-sm text-gray-600 italic">
                  📝 {entry.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 my-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId ? 'Edit Health Entry' : 'Log Health Data'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6 max-h-96 overflow-y-auto">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Water */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Droplet className="h-4 w-4 inline mr-1 text-blue-600" />
                    Water (glasses)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={formData.water}
                    onChange={(e) => setFormData({ ...formData, water: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Sleep */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Moon className="h-4 w-4 inline mr-1 text-indigo-600" />
                    Sleep (hours)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={formData.sleep}
                    onChange={(e) => setFormData({ ...formData, sleep: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Exercise */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Activity className="h-4 w-4 inline mr-1 text-orange-600" />
                    Exercise (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="480"
                    value={formData.exercise}
                    onChange={(e) => setFormData({ ...formData, exercise: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Meals */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Utensils className="h-4 w-4 inline mr-1 text-green-600" />
                    Healthy Meals
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.meals}
                    onChange={(e) => setFormData({ ...formData, meals: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Steps */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    👣 Steps
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.steps}
                    onChange={(e) => setFormData({ ...formData, steps: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ⚖️ Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Calories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    🔥 Calories
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Heart Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ❤️ Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.heartRate}
                    onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Blood Pressure */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    💉 Blood Pressure
                  </label>
                  <input
                    type="text"
                    placeholder="120/80"
                    value={formData.bloodPressure}
                    onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Energy Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ⚡ Energy (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.energyLevel}
                    onChange={(e) => setFormData({ ...formData, energyLevel: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600">{formData.energyLevel}/10</span>
                </div>

                {/* Stress Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    😰 Stress (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.stressLevel}
                    onChange={(e) => setFormData({ ...formData, stressLevel: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600">{formData.stressLevel}/10</span>
                </div>
              </div>

              {/* Mood */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  😊 Mood
                </label>
                <div className="flex justify-between gap-2">
                  {['terrible', 'bad', 'neutral', 'good', 'great'].map(mood => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => setFormData({ ...formData, mood: mood as any })}
                      className={`flex-1 py-2 rounded-lg transition ${
                        formData.mood === mood
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {getMoodEmoji(mood)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meditation & Yoga */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    🧘 Meditation (min)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={formData.meditationMinutes}
                    onChange={(e) => setFormData({ ...formData, meditationMinutes: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    🧗 Yoga (min)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={formData.yogaMinutes}
                    onChange={(e) => setFormData({ ...formData, yogaMinutes: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  📝 Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any health notes for today..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Reminder */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.reminder}
                    onChange={(e) => setFormData({ ...formData, reminder: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Set Reminder</span>
                </label>
                {formData.reminder && (
                  <input
                    type="time"
                    value={formData.reminderTime}
                    onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium"
                >
                  {editingId ? 'Update' : 'Log Health'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
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
