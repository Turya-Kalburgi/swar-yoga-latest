import React, { useState, useEffect } from 'react';
import { healthAPI } from '../utils/database';
import { 
  Heart, 
  Droplet, 
  Utensils, 
  Moon, 
  Activity, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X 
} from 'lucide-react';

interface HealthMetric {
  id: number;
  date: string;
  water: number; // in glasses
  sleep: number; // in hours
  exercise: number; // in minutes
  meals: number; // healthy meals count
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  notes: string;
}

const HealthTracker = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMetric, setEditingMetric] = useState<HealthMetric | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  
  type FormData = {
    date: string;
    water: number;
    sleep: number;
    exercise: number;
    meals: number;
    mood: HealthMetric['mood'];
    notes: string;
  };

  const [formData, setFormData] = useState<FormData>({
    date: currentDate,
    water: 0,
    sleep: 0,
    exercise: 0,
    meals: 0,
    mood: 'neutral',
    notes: ''
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await healthAPI.getAll();
        if (mounted) setMetrics(data || []);
      } catch (err) {
        console.error('Failed to load health metrics', err);
        // fallback to localStorage
        const savedMetrics = localStorage.getItem('health_metrics');
        if (savedMetrics) {
          try { setMetrics(JSON.parse(savedMetrics)); } catch (e) { console.error(e) }
        }
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  // Save to server/localStorage whenever metrics change
  useEffect(() => {
    // attempt to persist locally (server persistence happens on each action)
    try {
      localStorage.setItem('health_metrics', JSON.stringify(metrics));
    } catch (e) {
      console.error('Failed to save health metrics locally', e);
    }
  }, [metrics]);

  const handleAddMetric = () => {
    // Check if a metric for this date already exists
    const existingIndex = metrics.findIndex(m => m.date === formData.date);
    
    if (existingIndex >= 0) {
      // Update existing metric (persist to server)
      const metric = metrics[existingIndex];
      const updated = { ...metric, ...formData };
      healthAPI.update(Number(metric.id), updated).then(res => {
        setMetrics(prev => prev.map(m => (m.id === res.id ? res : m)));
      }).catch(err => {
        console.error('Failed to update metric on server', err);
        setMetrics(prev => prev.map((m, i) => i === existingIndex ? { ...m, ...formData } : m));
      });
    } else {
      // Add new metric (persist to server)
      const newMetric: HealthMetric = { ...formData, id: Date.now() };
      healthAPI.create(newMetric).then(created => {
        setMetrics(prev => [...prev, created]);
      }).catch(err => {
        console.error('Failed to create metric on server', err);
        setMetrics(prev => [...prev, newMetric]);
      });
    }
    
    resetForm();
    setShowAddModal(false);
  };

  const handleEditMetric = () => {
    if (!editingMetric) return;
    
    const updated = { ...editingMetric, ...formData } as HealthMetric;
    healthAPI.update(Number(editingMetric.id), updated).then(res => {
      setMetrics(prev => prev.map(m => (m.id === res.id ? res : m)));
    }).catch(err => {
      console.error('Failed to update metric on server', err);
      setMetrics(prev => prev.map(m => (m.id === editingMetric.id ? updated : m)));
    });
    
    resetForm();
    setEditingMetric(null);
  };

  const handleDeleteMetric = (id: number) => {
    healthAPI.delete(Number(id)).then(() => {
      setMetrics(prev => prev.filter(metric => metric.id !== id));
    }).catch(err => {
      console.error('Failed to delete metric on server', err);
      setMetrics(prev => prev.filter(metric => metric.id !== id));
    });
  };

  const startEdit = (metric: HealthMetric) => {
    setEditingMetric(metric);
    setFormData({
      date: metric.date,
      water: metric.water,
      sleep: metric.sleep,
      exercise: metric.exercise,
      meals: metric.meals,
      mood: metric.mood,
      notes: metric.notes
    });
  };

  const resetForm = () => {
    setFormData({
      date: currentDate,
      water: 0,
      sleep: 0,
      exercise: 0,
      meals: 0,
      mood: 'neutral',
      notes: ''
    });
  };

  const cancelEdit = () => {
    resetForm();
    setEditingMetric(null);
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'great': return '😁';
      case 'good': return '🙂';
      case 'neutral': return '😐';
      case 'bad': return '🙁';
      case 'terrible': return '😞';
      default: return '😐';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'great': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      case 'bad': return 'bg-orange-100 text-orange-800';
      case 'terrible': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get today's metric if it exists
  const todayMetric = metrics.find(m => m.date === currentDate);

  // Sort metrics by date (most recent first)
  const sortedMetrics = [...metrics].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Health Tracker</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Today's Summary */}
      {todayMetric ? (
        <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">Today's Health</h3>
            <div className="flex space-x-1">
              <button
                onClick={() => startEdit(todayMetric)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-2 mb-3">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
                <Droplet className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-sm font-medium text-gray-800">{todayMetric.water}</div>
              <div className="text-xs text-gray-500">glasses</div>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1">
                <Moon className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-sm font-medium text-gray-800">{todayMetric.sleep}</div>
              <div className="text-xs text-gray-500">hours</div>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-1">
                <Activity className="h-4 w-4 text-orange-600" />
              </div>
              <div className="text-sm font-medium text-gray-800">{todayMetric.exercise}</div>
              <div className="text-xs text-gray-500">mins</div>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
                <Utensils className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-sm font-medium text-gray-800">{todayMetric.meals}</div>
              <div className="text-xs text-gray-500">meals</div>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-1">
                <Heart className="h-4 w-4 text-pink-600" />
              </div>
              <div className="text-sm font-medium text-gray-800">{getMoodEmoji(todayMetric.mood)}</div>
              <div className="text-xs text-gray-500">mood</div>
            </div>
          </div>
          
          {todayMetric.notes && (
            <div className="text-sm text-gray-600 italic">
              "{todayMetric.notes}"
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200 text-center">
          <p className="text-gray-600 mb-2">No health data for today</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            + Track today's health
          </button>
        </div>
      )}

      {/* Recent History */}
      <h3 className="font-semibold text-gray-800 mb-3">Recent History</h3>
      {sortedMetrics.length > 0 ? (
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {sortedMetrics.map(metric => (
            <div 
              key={metric.id} 
              className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-800 mb-1">
                    {new Date(metric.date).toLocaleDateString(undefined, { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="flex space-x-3 text-sm text-gray-600">
                    <span>{metric.water} 💧</span>
                    <span>{metric.sleep} 😴</span>
                    <span>{metric.exercise}' 🏃</span>
                    <span>{metric.meals} 🍎</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getMoodColor(metric.mood)}`}>
                      {getMoodEmoji(metric.mood)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => startEdit(metric)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMetric(metric.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          <p>No health data recorded yet</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingMetric) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingMetric ? 'Edit Health Data' : 'Add Health Data'}
              </h3>
              <button 
                onClick={() => {
                  if (editingMetric) {
                    cancelEdit();
                  } else {
                    setShowAddModal(false);
                    resetForm();
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
                    onChange={(e) => setFormData({...formData, water: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Moon className="h-4 w-4 inline mr-1 text-purple-600" />
                    Sleep (hours)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={formData.sleep}
                    onChange={(e) => setFormData({...formData, sleep: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Activity className="h-4 w-4 inline mr-1 text-orange-600" />
                    Exercise (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={formData.exercise}
                    onChange={(e) => setFormData({...formData, exercise: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
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
                    onChange={(e) => setFormData({...formData, meals: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Heart className="h-4 w-4 inline mr-1 text-pink-600" />
                  Mood
                </label>
                <div className="flex justify-between bg-gray-100 p-2 rounded-lg">
                  {['terrible', 'bad', 'neutral', 'good', 'great'].map(mood => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => setFormData({...formData, mood: mood as any})}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                        formData.mood === mood 
                          ? 'bg-white shadow-md transform scale-110' 
                          : 'hover:bg-white/50'
                      }`}
                    >
                      {getMoodEmoji(mood)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Any health notes for today..."
                />
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={editingMetric ? handleEditMetric : handleAddMetric}
                  className={`flex-1 ${
                    editingMetric 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white py-2 rounded-lg transition-colors`}
                >
                  {editingMetric ? (
                    <>
                      <Save className="h-4 w-4 inline mr-2" />
                      Save Changes
                    </>
                  ) : (
                    'Add Health Data'
                  )}
                </button>
                <button
                  onClick={() => {
                    if (editingMetric) {
                      cancelEdit();
                    } else {
                      setShowAddModal(false);
                      resetForm();
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthTracker;