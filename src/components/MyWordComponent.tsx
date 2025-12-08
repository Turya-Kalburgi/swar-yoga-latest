import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Heart, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { myWordAPI, MyWord, isOverdue, formatDate, daysUntilDue } from '../utils/sadhakaPlannerData';

interface MyWordComponentProps {
  onMyWordsUpdate?: (myWords: MyWord[]) => void;
}

const MyWordComponent: React.FC<MyWordComponentProps> = ({ onMyWordsUpdate }) => {
  const { user } = useAuth();
  const [myWords, setMyWords] = useState<MyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [formData, setFormData] = useState({
    commitment: '',
    committedDate: new Date().toISOString().split('T')[0],
    completionDeadline: new Date().toISOString().split('T')[0],
    recurrence: 'Once' as 'Once' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly',
    status: 'Pending' as 'Pending' | 'In Progress' | 'Completed'
  });

  useEffect(() => {
    loadMyWords();
  }, [user?.id]);

  const loadMyWords = async () => {
    try {
      setLoading(true);
      const data = await myWordAPI.getAll(user?.id || '');
      setMyWords(data);
      onMyWordsUpdate?.(data);
    } catch (error) {
      console.error('Error loading my words:', error);
      toast.error('Failed to load commitments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.commitment.trim()) {
      toast.error('Commitment text is required');
      return;
    }

    if (new Date(formData.completionDeadline) < new Date(formData.committedDate)) {
      toast.error('Completion deadline must be after commitment date');
      return;
    }

    try {
      const wordData: MyWord = {
        ...formData,
        userId: user?.id || '',
        isOverdue: isOverdue(formData.completionDeadline)
      };

      if (editingId) {
        wordData.id = editingId;
        await myWordAPI.update(editingId, wordData);
        toast.success('Commitment updated successfully');
      } else {
        await myWordAPI.create(wordData);
        toast.success('Commitment created successfully');
      }

      resetForm();
      setShowModal(false);
      loadMyWords();
    } catch (error: any) {
      console.error('Error saving commitment:', error);
      toast.error(error.message || 'Failed to save commitment');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this commitment?')) return;

    try {
      await myWordAPI.delete(id, user?.id || '');
      toast.success('Commitment deleted successfully');
      loadMyWords();
    } catch (error: any) {
      console.error('Error deleting commitment:', error);
      toast.error(error.message || 'Failed to delete commitment');
    }
  };

  const handleEdit = (word: MyWord) => {
    setFormData({
      commitment: word.commitment,
      committedDate: word.committedDate,
      completionDeadline: word.completionDeadline,
      recurrence: word.recurrence,
      status: word.status
    });
    setEditingId(word.id || null);
    setShowModal(true);
  };

  const handleStatusToggle = async (word: MyWord) => {
    try {
      const newStatus = word.status === 'Completed' ? 'Pending' : 'Completed';
      await myWordAPI.update(word.id || '', { ...word, status: newStatus });
      loadMyWords();
    } catch (error: any) {
      toast.error('Failed to update commitment status');
    }
  };

  const resetForm = () => {
    setFormData({
      commitment: '',
      committedDate: new Date().toISOString().split('T')[0],
      completionDeadline: new Date().toISOString().split('T')[0],
      recurrence: 'Once',
      status: 'Pending'
    });
    setEditingId(null);
  };

  const filteredWords = myWords.filter(word => {
    const matchStatus = filterStatus === 'all' || word.status === filterStatus;
    return matchStatus;
  });

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
          <h2 className="text-2xl font-bold text-gray-800">💬 My Word - My Commitments</h2>
          <p className="text-sm text-gray-600 mt-1">
            Total: {myWords.length} | Active: {myWords.filter(w => w.status !== 'Completed').length} | Completed: {myWords.filter(w => w.status === 'Completed').length}
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Commitment
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* My Words List */}
      <div className="space-y-3">
        {filteredWords.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No commitments yet. Make your first commitment!</p>
          </div>
        ) : (
          filteredWords.map(word => (
            <div
              key={word.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                word.status === 'Completed'
                  ? 'bg-gray-50 border-gray-200'
                  : isOverdue(word.completionDeadline)
                  ? 'bg-red-50 border-red-300'
                  : 'bg-purple-50 border-purple-300'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Status Button */}
                <button
                  onClick={() => handleStatusToggle(word)}
                  className={`mt-1 flex-shrink-0 transition-colors ${
                    word.status === 'Completed' ? 'text-green-600' : 'text-red-500 hover:text-red-700'
                  }`}
                >
                  {word.status === 'Completed' ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <Heart className="h-6 w-6 fill-current" />
                  )}
                </button>

                {/* Commitment Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p
                        className={`font-semibold text-lg ${
                          word.status === 'Completed'
                            ? 'text-gray-500 line-through'
                            : 'text-gray-800'
                        }`}
                      >
                        {word.commitment}
                      </p>
                    </div>
                  </div>

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {/* Status Badge */}
                    <span className={`text-xs font-medium px-2 py-1 rounded ${statusColor(word.status)}`}>
                      {word.status}
                    </span>

                    {/* Recurrence Badge */}
                    <span className="text-xs font-medium px-2 py-1 rounded bg-purple-100 text-purple-800">
                      {word.recurrence}
                    </span>

                    {/* Overdue Warning */}
                    {isOverdue(word.completionDeadline) && word.status !== 'Completed' && (
                      <span className="text-xs font-medium px-2 py-1 rounded bg-red-200 text-red-800 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Pending - Overdue
                      </span>
                    )}

                    {/* Days Until Due */}
                    {!isOverdue(word.completionDeadline) && word.status !== 'Completed' && (
                      <span className="text-xs text-gray-600">
                        {daysUntilDue(word.completionDeadline) === 0
                          ? '🔥 Due Today'
                          : daysUntilDue(word.completionDeadline) === 1
                          ? '⏰ Due Tomorrow'
                          : `📅 ${daysUntilDue(word.completionDeadline)} days left`}
                      </span>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="text-xs text-gray-600 mt-2">
                    Committed: {formatDate(word.committedDate)} | Deadline: {formatDate(word.completionDeadline)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(word)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(word.id || '')}
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
                {editingId ? 'Edit Commitment' : 'Make New Commitment'}
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
              {/* Commitment Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  My Commitment <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.commitment}
                  onChange={(e) => setFormData({ ...formData, commitment: e.target.value })}
                  placeholder="What are you committing to? Write your commitment clearly..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Committed Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Committed Date</label>
                <input
                  type="date"
                  value={formData.committedDate}
                  onChange={(e) => setFormData({ ...formData, committedDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Completion Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Completion Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.completionDeadline}
                  onChange={(e) => setFormData({ ...formData, completionDeadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Recurrence */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recurrence Type</label>
                <select
                  value={formData.recurrence}
                  onChange={(e) => setFormData({ ...formData, recurrence: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="Once">Once (One-time commitment)</option>
                  <option value="Daily">Daily (Every day)</option>
                  <option value="Weekly">Weekly (Every week)</option>
                  <option value="Monthly">Monthly (Every month)</option>
                  <option value="Yearly">Yearly (Every year)</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="Pending">Pending</option>
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
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {editingId ? 'Update Commitment' : 'Make Commitment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWordComponent;
