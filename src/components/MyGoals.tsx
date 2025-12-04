import React, { useState, useEffect } from 'react';
import { Plus, Target, Calendar, CheckCircle, Clock, Edit, Trash2, Filter, Search } from 'lucide-react';
import { goalsAPI } from '../utils/database';
import GoalForm from './GoalForm';

const MyGoals: React.FC = () => {
  const [goals, setGoals] = useState<any[]>([]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [viewingGoal, setViewingGoal] = useState<any>(null);

  const handleGoalSubmit = async (goalData: any) => {
    try {
      const payload: any = { ...goalData, progress: goalData.progress ?? 0, status: goalData.status ?? 'In Progress' };
      const created = await goalsAPI.create(payload);
      setGoals(prev => [created, ...prev]);
    } catch (err) {
      console.error('Failed to create goal', err);
      alert('Could not save goal — see console');
    } finally {
      setShowAddGoal(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await goalsAPI.getAll();
        if (mounted) setGoals(data || []);
      } catch (err) {
        // keep empty state on error (mock fallback is handled in API)
        if (mounted) setGoals([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filteredGoals = goals.filter(goal => {
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' && goal.status === 'Completed') ||
      (filter === 'pending' && goal.status !== 'Completed') ||
      (filter === 'high' && goal.priority === 'High');
    
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.visionTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'border-red-500';
      case 'Medium': return 'border-yellow-500';
      case 'Low': return 'border-green-500';
      default: return 'border-gray-300';
    }
  };

  const completedGoals = goals.filter(goal => goal.status === 'Completed').length;
  const totalGoals = goals.length;
  const inProgressGoals = goals.filter(goal => goal.status === 'In Progress').length;
  const averageProgress = totalGoals > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / totalGoals) : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Goals</h1>
          <p className="text-gray-600">Track your progress towards achieving your vision goals</p>
        </div>
        <button 
          onClick={() => setShowAddGoal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Goals Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600 mb-1">{totalGoals}</div>
          <div className="text-gray-600 text-sm">Total Goals</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600 mb-1">{completedGoals}</div>
          <div className="text-gray-600 text-sm">Completed</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-orange-600 mb-1">{inProgressGoals}</div>
          <div className="text-gray-600 text-sm">In Progress</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-purple-600 mb-1">{averageProgress}%</div>
          <div className="text-gray-600 text-sm">Average Progress</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Goals' },
                { id: 'completed', label: 'Completed' },
                { id: 'pending', label: 'Pending' },
                { id: 'high', label: 'High Priority' }
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption.id
                      ? 'bg-blue-600 text-white'
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
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-6">
        {filteredGoals.length > 0 ? (
          filteredGoals.map(goal => (
            <div key={goal.id} className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${getPriorityColor(goal.priority)} hover:shadow-md transition-shadow`}>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                    <button className="self-start sm:self-center">
                      {goal.status === 'Completed' ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <Target className="h-6 w-6 text-blue-600" />
                      )}
                    </button>
                    <h3 className="text-xl font-bold text-gray-800">{goal.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)} self-start sm:self-center`}>
                      {goal.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{goal.description}</p>
                  
                  {/* Display image if available */}
                  {goal.imageUrl && (
                    <div className="mb-3">
                      <img 
                        src={goal.imageUrl} 
                        alt={goal.title} 
                        className="h-32 w-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{goal.startTime} - {goal.endTime}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>{goal.completedTasks}/{goal.tasks} tasks</span>
                    </span>
                    <span className="text-green-600 font-medium">{goal.amountNeeded}</span>
                  </div>
                </div>
                <div className="text-center lg:text-right">
                  <div className="text-2xl font-bold text-gray-800 mb-1">{goal.progress}%</div>
                  <div className="text-sm text-gray-600">Complete</div>
                </div>
              </div>

              <div className="mb-4 mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">Vision: {goal.visionTitle}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setViewingGoal(goal)}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                  >
                    View Tasks
                  </button>
                  <button 
                    onClick={() => setEditingGoal(goal)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <Edit className="h-4 w-4 inline mr-1" />
                    Edit Goal
                  </button>
                </div>
                <div className="flex items-center justify-between sm:justify-end space-x-2">
                  <div className="text-sm text-gray-500">
                    Priority: <span className={`font-medium ${
                      goal.priority === 'High' ? 'text-red-600' :
                      goal.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>{goal.priority}</span>
                  </div>
                  <button 
                    onClick={async () => {
                      if (confirm('Are you sure you want to delete this goal?')) {
                        try {
                          await goalsAPI.delete(goal.id);
                          setGoals(prev => prev.filter(g => g.id !== goal.id));
                        } catch (err) {
                          console.error('Failed to delete goal', err);
                          alert('Could not delete goal — see console');
                        }
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete Goal"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No goals found</h3>
            <p className="text-gray-600">Add your first goal to get started.</p>
          </div>
        )}
      </div>
      {/* Add Goal Modal (GoalForm) */}
      {showAddGoal && (
        <GoalForm
          onCancel={() => setShowAddGoal(false)}
          onSubmit={handleGoalSubmit}
        />
      )}

      {/* View Goal Modal */}
      {viewingGoal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{viewingGoal.title}</h2>
                <button 
                  onClick={() => setViewingGoal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              {viewingGoal.imageUrl && (
                <img 
                  src={viewingGoal.imageUrl} 
                  alt={viewingGoal.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              
              <p className="text-gray-600 mb-4">{viewingGoal.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Status:</span>
                  <span className="ml-2">{viewingGoal.status}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Priority:</span>
                  <span className="ml-2">{viewingGoal.priority}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Progress:</span>
                  <span className="ml-2">{viewingGoal.progress}%</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Vision:</span>
                  <span className="ml-2">{viewingGoal.visionTitle}</span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Task Progress:</h3>
                <p className="text-gray-600">{viewingGoal.completedTasks} of {viewingGoal.tasks} tasks completed</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${viewingGoal.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => { setViewingGoal(null); setEditingGoal(viewingGoal); }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => setViewingGoal(null)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {editingGoal && (
        <GoalForm
          initialData={editingGoal}
          onCancel={() => setEditingGoal(null)}
          onSubmit={async (goalData: any) => {
            try {
              await goalsAPI.update(editingGoal.id, goalData);
              const data = await goalsAPI.getAll();
              setGoals(data || []);
              setEditingGoal(null);
            } catch (err) {
              console.error('Failed to update goal', err);
              alert('Could not update goal — see console');
            }
          }}
        />
      )}
    </div>
  );
};

export default MyGoals;