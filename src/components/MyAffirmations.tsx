import React, { useState } from 'react';
import { 
  Plus, 
  Sparkles, 
  Edit, 
  Trash2, 
  Image,
  Filter,
  Search,
  Eye
} from 'lucide-react';

interface Affirmation {
  id: number;
  text: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  timesViewed: number;
}

const MyAffirmations: React.FC = () => {
  const [affirmations, setAffirmations] = useState<Affirmation[]>([]);
  
  // Load affirmations from backend on mount
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await (await import('../utils/database')).affirmationsAPI.getAll();
        if (mounted) setAffirmations(data || []);
      } catch (err) {
        if (mounted) setAffirmations([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAffirmation, setEditingAffirmation] = useState<Affirmation | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newAffirmation, setNewAffirmation] = useState({
    text: '',
    imageUrl: '',
    category: 'Success'
  });

  const categories = ['Success', 'Health', 'Wealth', 'Growth', 'Relationships', 'Spirituality', 'Confidence', 'Peace'];

  const filteredAffirmations = affirmations.filter(affirmation => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && affirmation.isActive) ||
      (filter === 'inactive' && !affirmation.isActive) ||
      (filter === affirmation.category.toLowerCase());
    
    const matchesSearch = affirmation.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affirmation.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleAddAffirmation = () => {
    (async () => {
      if (!newAffirmation.text.trim()) return;
      const payload = {
        text: newAffirmation.text,
        imageUrl: newAffirmation.imageUrl || 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: newAffirmation.category,
        isActive: true,
        createdAt: new Date().toISOString(),
        timesViewed: 0
      };
      try {
        const api = (await import('../utils/database')).affirmationsAPI;
        const created = await api.create(payload);
        setAffirmations(prev => [...prev, created]);
      } catch (err) {
        // optimistic fallback
        const fallback = { ...payload, id: Date.now() } as Affirmation;
        setAffirmations(prev => [...prev, fallback]);
      } finally {
        setNewAffirmation({ text: '', imageUrl: '', category: 'Success' });
        setShowAddModal(false);
      }
    })();
  };

  const handleEditAffirmation = (affirmation: Affirmation) => {
    setEditingAffirmation(affirmation);
    setNewAffirmation({
      text: affirmation.text,
      imageUrl: affirmation.imageUrl,
      category: affirmation.category
    });
    setShowAddModal(true);
  };

  const handleUpdateAffirmation = () => {
    (async () => {
      if (!editingAffirmation || !newAffirmation.text.trim()) return;
      const updates = {
        text: newAffirmation.text,
        imageUrl: newAffirmation.imageUrl || editingAffirmation.imageUrl,
        category: newAffirmation.category
      };
      try {
        const api = (await import('../utils/database')).affirmationsAPI;
        const updated = await api.update(editingAffirmation.id, updates);
        setAffirmations(prev => prev.map(a => a.id === editingAffirmation.id ? updated : a));
      } catch (err) {
        setAffirmations(prev => prev.map(a => a.id === editingAffirmation.id ? { ...a, ...updates } : a));
      } finally {
        setEditingAffirmation(null);
        setNewAffirmation({ text: '', imageUrl: '', category: 'Success' });
        setShowAddModal(false);
      }
    })();
  };

  const handleDeleteAffirmation = (id: number) => {
    if (!confirm('Are you sure you want to delete this affirmation?')) return;
    (async () => {
      try {
        const api = (await import('../utils/database')).affirmationsAPI;
        await api.delete(id);
        setAffirmations(prev => prev.filter(affirmation => affirmation.id !== id));
      } catch (err) {
        setAffirmations(prev => prev.filter(affirmation => affirmation.id !== id));
      }
    })();
  };

  const toggleActive = (id: number) => {
    (async () => {
      try {
        const api = (await import('../utils/database')).affirmationsAPI;
        const affirmation = affirmations.find(a => a.id === id);
        if (!affirmation) return;
        const updated = await api.update(id, { isActive: !affirmation.isActive });
        setAffirmations(prev => prev.map(a => a.id === id ? updated : a));
      } catch (err) {
        setAffirmations(prev => prev.map(affirmation => 
          affirmation.id === id 
            ? { ...affirmation, isActive: !affirmation.isActive }
            : affirmation
        ));
      }
    })();
  };

  const incrementViews = (id: number) => {
    (async () => {
      try {
        const api = (await import('../utils/database')).affirmationsAPI;
        const affirmation = affirmations.find(a => a.id === id);
        if (!affirmation) return;
        const updated = await api.update(id, { timesViewed: (affirmation.timesViewed || 0) + 1 });
        setAffirmations(prev => prev.map(a => a.id === id ? updated : a));
      } catch (err) {
        setAffirmations(prev => prev.map(affirmation => 
          affirmation.id === id 
            ? { ...affirmation, timesViewed: affirmation.timesViewed + 1 }
            : affirmation
        ));
      }
    })();
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Success': 'bg-yellow-100 text-yellow-800',
      'Health': 'bg-green-100 text-green-800',
      'Wealth': 'bg-emerald-100 text-emerald-800',
      'Growth': 'bg-blue-100 text-blue-800',
      'Relationships': 'bg-pink-100 text-pink-800',
      'Spirituality': 'bg-purple-100 text-purple-800',
      'Confidence': 'bg-orange-100 text-orange-800',
      'Peace': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const totalAffirmations = affirmations.length;
  const activeAffirmations = affirmations.filter(a => a.isActive).length;
  const totalViews = affirmations.reduce((sum, a) => sum + a.timesViewed, 0);
  const avgViews = totalAffirmations > 0 ? Math.round(totalViews / totalAffirmations) : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Affirmations</h1>
          <p className="text-gray-600">Create positive affirmations with inspiring images</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add Affirmation</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-pink-600 mb-1">{totalAffirmations}</div>
          <div className="text-gray-600 text-sm">Total Affirmations</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600 mb-1">{activeAffirmations}</div>
          <div className="text-gray-600 text-sm">Active</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600 mb-1">{totalViews}</div>
          <div className="text-gray-600 text-sm">Total Views</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-purple-600 mb-1">{avgViews}</div>
          <div className="text-gray-600 text-sm">Avg Views</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'active', label: 'Active' },
                { id: 'inactive', label: 'Inactive' },
                ...categories.map(cat => ({ id: cat.toLowerCase(), label: cat }))
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption.id
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search affirmations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent w-full sm:w-64 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Affirmations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAffirmations.length > 0 ? (
          filteredAffirmations.map(affirmation => (
            <div key={affirmation.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={affirmation.imageUrl} 
                  alt="Affirmation"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                  <p className="text-white text-center font-semibold text-lg leading-relaxed">
                    "{affirmation.text}"
                  </p>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(affirmation.category)}`}>
                    {affirmation.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    affirmation.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {affirmation.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Eye className="h-4 w-4" />
                    <span>{affirmation.timesViewed} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => incrementViews(affirmation.id)}
                      className="p-1 text-gray-400 hover:text-blue-600 rounded"
                      title="View Affirmation"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditAffirmation(affirmation)}
                      className="p-1 text-gray-400 hover:text-blue-600 rounded"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAffirmation(affirmation.id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Created: {new Date(affirmation.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => toggleActive(affirmation.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      affirmation.isActive
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {affirmation.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No affirmations found</h3>
            <p className="text-gray-600">Create your first positive affirmation to get started.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {editingAffirmation ? 'Edit Affirmation' : 'Add New Affirmation'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingAffirmation(null);
                  setNewAffirmation({
                    text: '',
                    imageUrl: '',
                    category: 'Success'
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Affirmation Text *
                </label>
                <textarea
                  value={newAffirmation.text}
                  onChange={(e) => setNewAffirmation(prev => ({ ...prev, text: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 resize-none"
                  placeholder="Enter your positive affirmation..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={newAffirmation.imageUrl}
                    onChange={(e) => setNewAffirmation(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-pink-600 border border-gray-300 rounded-lg"
                  >
                    <Image className="h-5 w-5" />
                  </button>
                </div>
                {newAffirmation.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={newAffirmation.imageUrl} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newAffirmation.category}
                  onChange={(e) => setNewAffirmation(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingAffirmation(null);
                    setNewAffirmation({
                      text: '',
                      imageUrl: '',
                      category: 'Success'
                    });
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingAffirmation ? handleUpdateAffirmation : handleAddAffirmation}
                  className="flex-1 px-4 py-2 text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  {editingAffirmation ? 'Update Affirmation' : 'Add Affirmation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAffirmations;