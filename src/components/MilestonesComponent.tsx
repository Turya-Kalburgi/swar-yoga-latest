import React, { useState, useEffect } from 'react';
import { Flag, Plus, Edit, Trash2, Calendar, Target, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

interface Milestone {
  id: string;
  userId: string;
  goalId: string;
  goalTitle?: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  progress?: number;
  createdAt?: string;
}

interface Goal {
  id: string;
  title: string;
}

const MilestonesComponent: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  const [formData, setFormData] = useState({
    goalId: '',
    title: '',
    description: '',
    dueDate: '',
    status: 'Pending' as 'Pending' | 'In Progress' | 'Completed'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load goals first
      const goalsData = await loadGoals();
      setGoals(goalsData);

      // Load milestones
      const milestonesData = await loadMilestones();
      
      // Enrich milestones with goal titles
      const enrichedMilestones = milestonesData.map(m => ({
        ...m,
        goalTitle: goalsData.find(g => g.id === m.goalId)?.title || 'Unknown Goal'
      }));
      
      setMilestones(enrichedMilestones);
    } catch (error) {
      console.error('❌ Error loading milestones:', error);
      toast.error('Failed to load milestones');
    } finally {
      setLoading(false);
    }
  };

  const loadGoals = async () => {
    try {
      const storageKey = `sadhaka_goals_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Error loading goals:', error);
      return [];
    }
  };

  const loadMilestones = async () => {
    try {
      const storageKey = `sadhaka_milestones_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Error loading milestones:', error);
      return [];
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.goalId) {
      newErrors.goalId = 'Please select a goal';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Milestone title is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
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
      const storageKey = `sadhaka_milestones_${user.id}`;
      const existingMilestones = JSON.parse(localStorage.getItem(storageKey) || '[]');

      if (editingId) {
        // Update
        const index = existingMilestones.findIndex((m: Milestone) => m.id === editingId);
        if (index !== -1) {
          existingMilestones[index] = {
            ...existingMilestones[index],
            ...formData,
            updatedAt: new Date().toISOString()
          };
        }
        console.log(`✅ Milestone updated: ${formData.title}`);
      } else {
        // Create
        const newMilestone: Milestone = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.id,
          ...formData,
          createdAt: new Date().toISOString()
        };
        existingMilestones.push(newMilestone);
        console.log(`✅ Milestone created: ${formData.title}`);
      }

      localStorage.setItem(storageKey, JSON.stringify(existingMilestones));
      await loadData();
      
      toast.success(editingId ? 'Milestone updated!' : 'Milestone created!');
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('❌ Error saving milestone:', error);
      toast.error('Failed to save milestone');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this milestone?')) return;

    try {
      const storageKey = `sadhaka_milestones_${user.id}`;
      const milestonesData = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const filtered = milestonesData.filter((m: Milestone) => m.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(filtered));
      
      console.log(`✅ Milestone deleted`);
      await loadData();
      toast.success('Milestone deleted!');
    } catch (error) {
      console.error('❌ Error deleting milestone:', error);
      toast.error('Failed to delete milestone');
    }
  };

  const resetForm = () => {
    setFormData({
      goalId: '',
      title: '',
      description: '',
      dueDate: '',
      status: 'Pending' as 'Pending' | 'In Progress' | 'Completed'
    });
    setErrors({});
    setEditingId(null);
  };

  const filteredMilestones = milestones.filter(m => 
    filter === 'all' || m.status.toLowerCase() === filter.toLowerCase().replace('-', ' ')
  );

  const statusColor = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-green-100 text-green-800'
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
          <Flag className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-800">Milestones</h2>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add Milestone
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'in-progress', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === f
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {filteredMilestones.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Flag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No milestones yet. Create one to get started!</p>
          </div>
        ) : (
          filteredMilestones.map(milestone => (
            <div
              key={milestone.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{milestone.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Goal: <span className="font-semibold">{milestone.goalTitle}</span>
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor[milestone.status]}`}>
                  {milestone.status}
                </span>
              </div>

              {milestone.description && (
                <p className="text-gray-700 mb-4">{milestone.description}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Due: {new Date(milestone.dueDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setFormData({
                        goalId: milestone.goalId,
                        title: milestone.title,
                        description: milestone.description,
                        dueDate: milestone.dueDate,
                        status: milestone.status
                      });
                      setEditingId(milestone.id);
                      setShowAddModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(milestone.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
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
              {editingId ? 'Edit Milestone' : 'Add Milestone'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Goal Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Goal *
                </label>
                <select
                  value={formData.goalId}
                  onChange={(e) => setFormData({ ...formData, goalId: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    errors.goalId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Choose a goal...</option>
                  {goals.map(goal => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </select>
                {errors.goalId && <p className="text-red-600 text-sm mt-1">{errors.goalId}</p>}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Milestone title"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
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
                  placeholder="Milestone description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    errors.dueDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dueDate && <p className="text-red-600 text-sm mt-1">{errors.dueDate}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
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

export default MilestonesComponent;
