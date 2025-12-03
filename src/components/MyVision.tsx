import React, { useState, useEffect } from 'react';
import { visionAPI, goalsAPI, tasksAPI, todosAPI, dailyWordsAPI } from '../utils/database';
import { Plus, Eye, Edit, Trash2, Target, Calendar, DollarSign, Clock } from 'lucide-react';
import VisionForm from './VisionForm';
import GoalForm from './GoalForm';

const MyVision: React.FC = () => {
  const [visions, setVisions] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [isSaving, setIsSaving] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalParentVisionId, setGoalParentVisionId] = useState<number | null>(null);
  // Nested add options
  const [createGoal, setCreateGoal] = useState(false);
  const [goalText, setGoalText] = useState('');
  const [createTask, setCreateTask] = useState(false);
  const [taskText, setTaskText] = useState('');
  const [createTodo, setCreateTodo] = useState(false);
  const [todoText, setTodoText] = useState('');
  const [createWord, setCreateWord] = useState(false);
  const [wordText, setWordText] = useState('');
  const [createReminder, setCreateReminder] = useState(false);
  const [reminderAt, setReminderAt] = useState('');
  // Date/time and estimates (old data fields)
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0,10));
  const [endDate, setEndDate] = useState(() => new Date(Date.now() + 30*24*60*60*1000).toISOString().slice(0,10));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [estimatedTime, setEstimatedTime] = useState('1h');
  const [estimatedMoney, setEstimatedMoney] = useState('0');
  const [guidelinesInput, setGuidelinesInput] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await visionAPI.getAll();
        if (mounted) setVisions(data || []);
      } catch (err) {
        console.error('Failed to load visions', err);
      }
    };
    load();
    return () => { mounted = false };
  }, []);
  

  const visionTemplates = [
    { title: 'Health', color: 'bg-red-500', image: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'Wealth', color: 'bg-green-500', image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'Success', color: 'bg-yellow-500', image: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'Respect', color: 'bg-purple-500', image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'Pleasure', color: 'bg-pink-500', image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'Prosperity', color: 'bg-indigo-500', image: 'https://images.pexels.com/photos/1181772/pexels-photo-1181772.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'Luxurious', color: 'bg-orange-500', image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'Habit', color: 'bg-gray-500', image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'Spirituality', color: 'bg-purple-600', image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'About Life', color: 'bg-blue-500', image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Vision Board</h1>
          <p className="text-gray-600">Create and manage your 10 core life visions</p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span>Add Vision</span>
          </button>
          <button
            onClick={() => { setGoalParentVisionId(null); setShowGoalModal(true); }}
            className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:shadow-sm"
          >
            <Plus className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-700">Add Goal</span>
          </button>
        </div>
      </div>

      {/* Vision Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-1">{visions.length}</div>
          <div className="text-gray-600 text-sm">Total Visions</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">
            {visions.filter(v => v.status === 'Completed').length}
          </div>
          <div className="text-gray-600 text-sm">Completed</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {visions.filter(v => v.status === 'In Progress').length}
          </div>
          <div className="text-gray-600 text-sm">In Progress</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <div className="text-3xl font-bold text-indigo-600 mb-1">
            {visions.length > 0 ? Math.round(visions.reduce((acc, v) => acc + v.progress, 0) / visions.length) : 0}%
          </div>
          <div className="text-gray-600 text-sm">Average Progress</div>
        </div>
      </div>

      {/* Vision Templates */}
      {visions.length === 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8 mb-8 border border-purple-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Start with Core 10 Life Categories</h2>
            <p className="text-gray-600">Choose from the fundamental life areas to begin your vision journey</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {visionTemplates.map((template, index) => (
              <button
                key={index}
                className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 text-center group"
                onClick={async () => {
                  // Quick-create from template, include old-data fields
                  const payload = {
                    title: template.title,
                    description: `${template.title} vision`,
                    image: template.image,
                    progress: 0,
                    priority: 'Medium',
                    date: new Date().toISOString().slice(0,10),
                    year: new Date().getFullYear(),
                    startDate,
                    endDate,
                    startTime,
                    endTime,
                    estimatedTime,
                    estimatedMoney,
                    guidelines: guidelinesInput ? guidelinesInput.split(',').map(s => s.trim()).filter(Boolean) : []
                  };
                  try {
                    const created = await visionAPI.create(payload);
                    setVisions(prev => [created, ...prev]);
                    setShowAddModal(false);
                  } catch (err) {
                    console.error('Failed to create vision from template', err);
                  }
                }}
              >
                <div className={`w-12 h-12 ${template.color} rounded-xl mx-auto mb-3 flex items-center justify-center`}>
                  <span className="text-white font-bold">{template.title.charAt(0)}</span>
                </div>
                <div className="font-semibold text-gray-800 text-sm">{template.title}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add Vision Modal - uses VisionForm component */}
      {showAddModal && (
        <VisionForm
          onCancel={() => setShowAddModal(false)}
          onSubmit={async (visionData: any) => {
            setIsSaving(true);
            try {
              const created = await visionAPI.create(visionData);
              // nested: milestones -> goals -> tasks/todos/words
              if (visionData.milestones && Array.isArray(visionData.milestones)) {
                for (const ms of visionData.milestones) {
                  if (ms.goals && Array.isArray(ms.goals)) {
                    for (const g of ms.goals) {
                      try {
                        const goalPayload = { ...g, visionId: created.id };
                        const createdGoal = await goalsAPI.create(goalPayload);
                        if (g.tasks && Array.isArray(g.tasks)) {
                          for (const t of g.tasks) {
                            await tasksAPI.create({ ...t, goalId: createdGoal.id, visionId: created.id });
                          }
                        }
                        if (g.todos && Array.isArray(g.todos)) {
                          for (const td of g.todos) {
                            await todosAPI.create({ ...td, goalId: createdGoal.id, visionId: created.id });
                          }
                        }
                        if (g.myWord && g.myWord.text) {
                          await dailyWordsAPI.create({ word: g.myWord.text, date: g.myWord.dateTime ? g.myWord.dateTime.split('T')[0] : undefined });
                        }
                      } catch (err) {
                        console.error('Failed nested goal create', err);
                      }
                    }
                  }
                }
              }
              const data = await visionAPI.getAll();
              setVisions(data || []);
              setShowAddModal(false);
            } catch (err) {
              console.error('Failed to create vision', err);
            } finally {
              setIsSaving(false);
            }
          }}
        />
      )}

      {/* Add Goal Modal */}
      {showGoalModal && (
        <GoalForm
          initialData={undefined}
          onCancel={() => { setShowGoalModal(false); setGoalParentVisionId(null); }}
          onSubmit={async (goalData: any) => {
            try {
              if (goalParentVisionId) goalData.visionId = goalParentVisionId;
              await goalsAPI.create(goalData);
              const data = await visionAPI.getAll();
              setVisions(data || []);
            } catch (err) {
              console.error('Failed to create goal', err);
            } finally {
              setShowGoalModal(false);
              setGoalParentVisionId(null);
            }
          }}
        />
      )}

      {/* Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {visions.map(vision => (
          <div key={vision.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
            {/* Vision Image */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={vision.image} 
                alt={vision.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vision.status)}`}>
                  {vision.status}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(vision.priority)}`}>
                  {vision.priority}
                </span>
              </div>
            </div>

            {/* Vision Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800">{vision.title}</h3>
                <div className="flex space-x-1">
                  <button className="p-1 text-gray-400 hover:text-blue-600 rounded">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-blue-600 rounded">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-green-600 rounded" title="Add Goal" onClick={() => { setGoalParentVisionId(vision.id); setShowGoalModal(true); }}>
                    <Plus className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600 rounded">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{vision.description}</p>

              {/* Guidelines Preview */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Guidelines:</h4>
                <ul className="space-y-1">
                  {(vision.guidelines || []).slice(0, 2).map((guideline, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-center space-x-2">
                      <Target className="h-3 w-3 text-gray-400" />
                      <span>{guideline}</span>
                    </li>
                  ))}
                  {(vision.guidelines || []).length > 2 && (
                    <li className="text-xs text-gray-500">+{(vision.guidelines || []).length - 2} more...</li>
                  )}
                </ul>
              </div>

              {/* Vision Details */}
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(vision.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{vision.estimatedTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(vision.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-3 w-3" />
                  <span>{vision.estimatedMoney}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-semibold text-gray-800">{vision.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-indigo-600 transition-all duration-300"
                    style={{ width: `${vision.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyVision;