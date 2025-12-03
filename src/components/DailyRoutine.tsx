import { useState, useEffect } from 'react';
import { Clock, Plus, Edit, Trash2, Save, X, Sun, Moon, Calendar } from 'lucide-react';

interface RoutineItem {
  id: number;
  time: string;
  activity: string;
  duration: string;
  type: 'morning' | 'afternoon' | 'evening';
  days: string[];
}

const DailyRoutine = () => {
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<RoutineItem | null>(null);
  const [activeTab, setActiveTab] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  
  const [formData, setFormData] = useState({
    time: '',
    activity: '',
    duration: '30',
    type: 'morning',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  });

  // Load routine items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('daily_routine');
    if (savedItems) {
      try {
        setRoutineItems(JSON.parse(savedItems));
      } catch (error) {
        console.error('Error loading routine items:', error);
      }
    }
  }, []);

  // Save to localStorage whenever routine items change
  useEffect(() => {
    localStorage.setItem('daily_routine', JSON.stringify(routineItems));
  }, [routineItems]);

  const handleAddItem = () => {
    if (!formData.time || !formData.activity || formData.days.length === 0) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newItem: RoutineItem = {
      id: Date.now(),
      time: formData.time,
      activity: formData.activity,
      duration: formData.duration,
      type: formData.type as 'morning' | 'afternoon' | 'evening',
      days: formData.days
    };
    
    setRoutineItems(prev => [...prev, newItem]);
    resetForm();
    setShowAddModal(false);
  };

  const handleEditItem = () => {
    if (!editingItem) return;
    
    setRoutineItems(prev => 
      prev.map(item => 
        item.id === editingItem.id ? { 
          ...item, 
          time: formData.time,
          activity: formData.activity,
          duration: formData.duration,
          type: formData.type as 'morning' | 'afternoon' | 'evening',
          days: formData.days
        } : item
      )
    );
    
    resetForm();
    setEditingItem(null);
    setShowAddModal(false);
  };

  const handleDeleteItem = (id: number) => {
    if (confirm('Are you sure you want to delete this routine item?')) {
      setRoutineItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const startEdit = (item: RoutineItem) => {
    setEditingItem(item);
    setFormData({
      time: item.time,
      activity: item.activity,
      duration: item.duration,
      type: item.type,
      days: item.days
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      time: '',
      activity: '',
      duration: '30',
      type: 'morning',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    });
  };

  const handleDayToggle = (day: string) => {
    if (formData.days.includes(day)) {
      setFormData({...formData, days: formData.days.filter(d => d !== day)});
    } else {
      setFormData({...formData, days: [...formData.days, day]});
    }
  };

  const formatDays = (days: string[]) => {
    if (days.length === 7) return 'Every day';
    if (days.length === 5 && 
        days.includes('monday') && 
        days.includes('tuesday') && 
        days.includes('wednesday') && 
        days.includes('thursday') && 
        days.includes('friday')) return 'Weekdays';
    if (days.length === 2 && 
        days.includes('saturday') && 
        days.includes('sunday')) return 'Weekends';
    
    return days.map(day => day.charAt(0).toUpperCase() + day.slice(1, 3)).join(', ');
  };

  const dayOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const filteredItems = routineItems.filter(item => item.type === activeTab);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Daily Routine</h1>
        <button
          onClick={() => {
            setFormData(prev => ({ ...prev, type: activeTab }));
            setShowAddModal(true);
          }}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Routine</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 bg-white rounded-lg shadow-md p-1">
        <button
          onClick={() => setActiveTab('morning')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg transition-colors ${
            activeTab === 'morning' 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Sun className="h-5 w-5" />
          <span>Morning</span>
        </button>
        <button
          onClick={() => setActiveTab('afternoon')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg transition-colors ${
            activeTab === 'afternoon' 
              ? 'bg-orange-100 text-orange-800' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Sun className="h-5 w-5" />
          <span>Afternoon</span>
        </button>
        <button
          onClick={() => setActiveTab('evening')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg transition-colors ${
            activeTab === 'evening' 
              ? 'bg-indigo-100 text-indigo-800' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Moon className="h-5 w-5" />
          <span>Evening</span>
        </button>
      </div>

      {/* Routine Items */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Routine Items</h2>
            <p className="text-gray-600 mb-6">
              Add your first routine item to start building your daily schedule.
            </p>
            <button
              onClick={() => {
                setFormData(prev => ({ ...prev, type: activeTab }));
                setShowAddModal(true);
              }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Routine Item</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems
              .sort((a, b) => a.time.localeCompare(b.time))
              .map(item => (
                <div key={item.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="text-lg font-semibold text-gray-800">
                        {item.time}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.duration} min
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{item.activity}</h3>
                      <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDays(item.days)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => startEdit(item)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingItem ? 'Edit Routine Item' : 'Add Routine Item'}
              </h3>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
                <input
                  type="text"
                  value={formData.activity}
                  onChange={(e) => setFormData({...formData, activity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="What's the activity?"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="5">5 minutes</option>
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'morning'})}
                    className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded-lg transition-colors ${
                      formData.type === 'morning' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Sun className="h-4 w-4" />
                    <span>Morning</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'afternoon'})}
                    className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded-lg transition-colors ${
                      formData.type === 'afternoon' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Sun className="h-4 w-4" />
                    <span>Afternoon</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'evening'})}
                    className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded-lg transition-colors ${
                      formData.type === 'evening' 
                        ? 'bg-indigo-100 text-indigo-800' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Moon className="h-4 w-4" />
                    <span>Evening</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
                <div className="flex flex-wrap gap-2">
                  {dayOptions.map(day => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => handleDayToggle(day.value)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        formData.days.includes(day.value)
                          ? 'bg-yellow-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day.label.substring(0, 3)}
                    </button>
                  ))}
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, days: dayOptions.map(d => d.value)})}
                    className="text-xs text-yellow-600 hover:text-yellow-700"
                  >
                    Select All
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={editingItem ? handleEditItem : handleAddItem}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {editingItem ? (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Add to Routine</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                    resetForm();
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

export default DailyRoutine;