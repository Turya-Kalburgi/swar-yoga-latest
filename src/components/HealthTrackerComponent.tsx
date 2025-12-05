import React, { useState, useEffect } from 'react';
import { Heart, Plus, Edit, Trash2, Calendar, TrendingUp, Loader, LineChart } from 'lucide-react';
import { toast } from 'react-toastify';

interface HealthData {
  id: string;
  userId: string;
  date: string;
  metricType: 'steps' | 'weight' | 'calories' | 'sleep' | 'heart_rate' | 'blood_pressure' | 'water' | 'exercise';
  value: number;
  unit: string;
  notes?: string;
  createdAt?: string;
}

const HealthTrackerComponent: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    metricType: 'steps' as 'steps' | 'weight' | 'calories' | 'sleep' | 'heart_rate' | 'blood_pressure' | 'water' | 'exercise',
    value: '',
    unit: 'steps',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const metricTypes = {
    'steps': { label: 'Steps', unit: 'steps', icon: '👣' },
    'weight': { label: 'Weight', unit: 'kg', icon: '⚖️' },
    'calories': { label: 'Calories', unit: 'kcal', icon: '🔥' },
    'sleep': { label: 'Sleep', unit: 'hours', icon: '😴' },
    'heart_rate': { label: 'Heart Rate', unit: 'bpm', icon: '❤️' },
    'blood_pressure': { label: 'Blood Pressure', unit: 'mmHg', icon: '💉' },
    'water': { label: 'Water', unit: 'liters', icon: '💧' },
    'exercise': { label: 'Exercise', unit: 'minutes', icon: '🏋️' }
  };

  useEffect(() => {
    loadHealthData();
  }, [user.id]);

  const loadHealthData = async () => {
    try {
      setLoading(true);
      const storageKey = `sadhaka_health_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      const data = stored ? JSON.parse(stored) : [];

      // Sort by date descending
      data.sort((a: HealthData, b: HealthData) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setHealthData(data);
    } catch (error) {
      console.error('❌ Error loading health data:', error);
      toast.error('Failed to load health data');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.value || isNaN(Number(formData.value))) {
      newErrors.value = 'Valid value is required';
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
      const storageKey = `sadhaka_health_${user.id}`;
      const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');

      if (editingId) {
        const index = existingData.findIndex((h: HealthData) => h.id === editingId);
        if (index !== -1) {
          existingData[index] = {
            ...existingData[index],
            date: formData.date,
            metricType: formData.metricType,
            value: parseFloat(formData.value),
            notes: formData.notes
          };
        }
        console.log(`✅ Health data updated`);
      } else {
        const newData: HealthData = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.id,
          date: formData.date,
          metricType: formData.metricType,
          value: parseFloat(formData.value),
          unit: metricTypes[formData.metricType].unit,
          notes: formData.notes,
          createdAt: new Date().toISOString()
        };
        existingData.push(newData);
        console.log(`✅ Health data created`);
      }

      localStorage.setItem(storageKey, JSON.stringify(existingData));
      await loadHealthData();

      toast.success(editingId ? 'Health data updated!' : 'Health data logged!');
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('❌ Error saving health data:', error);
      toast.error('Failed to save health data');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this entry?')) return;

    try {
      const storageKey = `sadhaka_health_${user.id}`;
      const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const filtered = data.filter((h: HealthData) => h.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(filtered));

      console.log(`✅ Health data deleted`);
      await loadHealthData();
      toast.success('Entry deleted!');
    } catch (error) {
      console.error('❌ Error deleting health data:', error);
      toast.error('Failed to delete entry');
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      metricType: 'steps',
      value: '',
      unit: 'steps',
      notes: ''
    });
    setErrors({});
    setEditingId(null);
  };

  const getFilteredData = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return healthData.filter(item => {
      const itemDate = new Date(item.date);

      if (filter === 'today') {
        return itemDate.toDateString() === today.toDateString();
      } else if (filter === 'week') {
        return itemDate >= weekAgo;
      } else if (filter === 'month') {
        return itemDate >= monthAgo;
      }
      return true;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  const filteredData = getFilteredData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-600" />
          <h2 className="text-3xl font-bold text-gray-800">Health Tracker</h2>
        </div>
        <button
          onClick={() => {
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
      <div className="flex gap-2">
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

      {/* Health Data List */}
      <div className="space-y-3">
        {filteredData.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No health data logged yet. Start tracking!</p>
          </div>
        ) : (
          filteredData.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg hover:shadow-md transition"
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="text-3xl">{metricTypes[item.metricType].icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {metricTypes[item.metricType].label}
                  </h3>
                  <p className="text-2xl font-bold text-red-600">
                    {item.value} <span className="text-sm text-gray-600">{item.unit}</span>
                  </p>
                  {item.notes && <p className="text-sm text-gray-600 mt-1">{item.notes}</p>}
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-sm text-gray-600">
                  {new Date(item.date).toLocaleDateString()}
                </span>
                <button
                  onClick={() => {
                    setFormData({
                      date: item.date,
                      metricType: item.metricType as 'steps' | 'weight' | 'calories' | 'sleep' | 'heart_rate' | 'blood_pressure' | 'water' | 'exercise',
                      value: item.value.toString(),
                      unit: item.unit,
                      notes: item.notes || ''
                    });
                    setEditingId(item.id);
                    setShowAddModal(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
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
              {editingId ? 'Edit Health Entry' : 'Log Health Data'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Metric Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Metric Type *
                </label>
                <select
                  value={formData.metricType}
                  onChange={(e) => {
                    const type = e.target.value as any;
                    setFormData({
                      ...formData,
                      metricType: type,
                      unit: metricTypes[type].unit
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  {Object.entries(metricTypes).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
              </div>

              {/* Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value * ({metricTypes[formData.metricType].unit})
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="Enter value"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                    errors.value ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.value && <p className="text-red-600 text-sm mt-1">{errors.value}</p>}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any notes..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  {editingId ? 'Update' : 'Log'}
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
