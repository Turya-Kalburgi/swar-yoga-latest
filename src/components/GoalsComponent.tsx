import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, CheckSquare, X, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { goalAPI, visionAPI, Goal, Vision, formatDate } from '../utils/sadhakaPlannerData';

interface GoalsComponentProps {
  onGoalsUpdate?: (goals: Goal[]) => void;
}

const GoalsComponent: React.FC<GoalsComponentProps> = ({ onGoalsUpdate }) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [visions, setVisions] = useState<Vision[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const [formData, setFormData] = useState({
    visionId: '',
    title: '',
    description: '',
    progress: 0,
    targetDate: new Date().toISOString().split('T')[0],
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    status: 'Not Started' as 'Not Started' | 'In Progress' | 'Completed'
  });

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [goalsData, visionsData] = await Promise.all([
        goalAPI.getAll(user?.id || ''),
        visionAPI.getAll(user?.id || '')
      ]);
      setGoals(goalsData);
      setVisions(visionsData);
      onGoalsUpdate?.(goalsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Goal title is required');
      return;
    }

    try {
      const goalData: Goal = {
        ...formData,
        userId: user?.id || ''
      };

      if (editingId) {
        goalData.id = editingId;
        await goalAPI.update(editingId, goalData);
        toast.success('Goal updated successfully');
      } else {
        await goalAPI.create(goalData);
        toast.success('Goal created successfully');
      }

      resetForm();
      setShowModal(false);
      loadData();
    } catch (error: any) {
      console.error('Error saving goal:', error);
      toast.error(error.message || 'Failed to save goal');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;

    try {
      await goalAPI.delete(id, user?.id || '');
      toast.success('Goal deleted successfully');
      loadData();
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast.error(error.message || 'Failed to delete goal');
    }
  };

  const handleEdit = (goal: Goal) => {
    setFormData({
      visionId: goal.visionId,
      title: goal.title,
      description: goal.description,
      progress: goal.progress,
      targetDate: goal.targetDate,
      priority: goal.priority,
      status: goal.status
    });
    setEditingId(goal.id || null);
    setShowModal(true);
  };

  const incrementProgress = async (goal: Goal) => {
    const newProgress = Math.min(goal.progress + 10, 100);
    try {
      await goalAPI.update(goal.id || '', { ...goal, progress: newProgress });
      loadData();
    } catch (error: any) {
      toast.error('Failed to update progress');
    }
  };

  const decrementProgress = async (goal: Goal) => {
    const newProgress = Math.max(goal.progress - 10, 0);
    try {
      await goalAPI.update(goal.id || '', { ...goal, progress: newProgress });
      loadData();
    } catch (error: any) {
      toast.error('Failed to update progress');
    }
  };

  const resetForm = () => {
    setFormData({
      visionId: '',
      title: '',
      description: '',
      progress: 0,
      targetDate: new Date().toISOString().split('T')[0],
      priority: 'Medium',
      status: 'Not Started'
    });
    setEditingId(null);
  };

  const filteredGoals = goals.filter(goal => {
    const matchStatus = filterStatus === 'all' || goal.status === filterStatus;
    const matchPriority = filterPriority === 'all' || goal.priority === filterPriority;
    return matchStatus && matchPriority;
  });

  const getVisionTitle = (visionId: string) => {
    return visions.find(v => v.id === visionId)?.title || 'No Vision Linked';
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 bg-red-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'Low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">✓ My Goals</h2>
          <p className="text-sm text-gray-600 mt-1">
            Total: {goals.length} | Active: {goals.filter(g => g.status !== 'Completed').length} | Completed: {goals.filter(g => g.status === 'Completed').length}
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Goal
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Priority</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Award className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No goals yet. Create your first goal!</p>
          </div>
        ) : (
          filteredGoals.map(goal => (
            <div
              key={goal.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                goal.status === 'Completed'
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-white border-purple-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Vision Link */}
                <div className="mt-1 flex-shrink-0">
                  <div className="w-2 h-10 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
                </div>

                {/* Goal Content */}
                <div className="flex-1 min-w-0">
                  {/* Title & Status */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <p
                        className={`font-semibold text-lg ${
                          goal.status === 'Completed'
                            ? 'text-gray-500 line-through'
                            : 'text-gray-800'
                        }`}
                      >
                        {goal.title}
                      </p>
                      <p className="text-xs text-purple-600 font-medium">📍 {getVisionTitle(goal.visionId)}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${statusColor(goal.status)}`}>
                      {goal.status}
                    </span>
                  </div>

                  {/* Description */}
                  {goal.description && (
                    <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                  )}

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600 font-medium">Progress</span>
                      <span className="text-xs font-bold text-purple-600">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {/* Priority Badge */}
                    <span className={`text-xs font-medium px-2 py-1 rounded ${priorityColor(goal.priority)}`}>
                      {goal.priority} Priority
                    </span>

                    {/* Target Date */}
                    <span className="text-xs text-gray-600">
                      🎯 Target: {formatDate(goal.targetDate)}
                    </span>
                  </div>

                  {/* Progress Controls */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => decrementProgress(goal)}
                      disabled={goal.progress === 0}
                      className="px-3 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ➖ -10%
                    </button>
                    <button
                      onClick={() => incrementProgress(goal)}
                      disabled={goal.progress === 100}
                      className="px-3 py-1 text-xs font-medium bg-purple-200 text-purple-700 rounded hover:bg-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ➕ +10%
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(goal)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id || '')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingId ? 'Edit Goal' : 'Create New Goal'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Vision */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link to Vision (Optional)
                </label>
                <select
                  value={formData.visionId}
                  onChange={(e) => setFormData({ ...formData, visionId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">-- No Vision --</option>
                  {visions.map(vision => (
                    <option key={vision.id} value={vision.id}>
                      {vision.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="What is your goal?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your goal in detail..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="High">🔴 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>
              </div>

              {/* Target Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Progress */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Progress: {formData.progress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {editingId ? 'Update Goal' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsComponent;
