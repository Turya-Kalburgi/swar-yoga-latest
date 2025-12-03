import React, { useState } from 'react';
import { 
  Calendar, 
  Target, 
  CheckSquare, 
  TrendingUp, 
  Heart, 
  Activity,
  Plus,
  Eye,
  Clock,
  Edit,
  Trash2,
  X,
  Bell,
  AlertCircle,
  Home,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import VisionForm from './VisionForm';
import GoalForm from './GoalForm';
import { visionAPI, goalsAPI } from '../utils/database';

const Dashboard: React.FC = () => {
  const [showVisionModal, setShowVisionModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  
  const [newVision, setNewVision] = useState({
    title: '',
    description: '',
    category: 'Health',
    imageUrl: '',
    estimatedTime: '',
    estimatedMoney: '',
    priority: 'Medium'
  });

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    visionTitle: 'Health',
    startDate: '',
    endDate: '',
    priority: 'Medium',
    amountNeeded: ''
  });

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Stats Data
  const stats = {
    visions: { total: 10, working: 7, pending: 3 },
    goals: { total: 15, working: 9, pending: 6 },
    tasks: { total: 24, working: 16, pending: 8 },
    todos: { total: 12, working: 8, pending: 4 },
    myWord: { total: 5, working: 3, pending: 2 }
  };

  const monthHighlights = [
    { id: 1, text: 'Completed 3 major project milestones', type: 'achievement', icon: Target, color: 'text-green-600' },
    { id: 2, text: 'Maintained 85% workout consistency', type: 'health', icon: Activity, color: 'text-blue-600' },
    { id: 3, text: 'Increased savings by 15%', type: 'finance', icon: TrendingUp, color: 'text-emerald-600' },
    { id: 4, text: 'Read 2 personal development books', type: 'learning', icon: CheckSquare, color: 'text-purple-600' },
    { id: 5, text: 'Built stronger professional network', type: 'career', icon: Heart, color: 'text-pink-600' }
  ];

  const todoItems = [
    { 
      id: 1, 
      text: 'Review monthly budget and expenses', 
      completed: false, 
      priority: 'High', 
      category: 'Finance',
      reminder: true,
      reminderTime: '09:00',
      dueDate: '2024-01-20'
    },
    { 
      id: 2, 
      text: 'Schedule annual health checkup', 
      completed: true, 
      priority: 'Medium', 
      category: 'Health',
      reminder: false,
      dueDate: '2024-01-15'
    },
    { 
      id: 3, 
      text: 'Plan weekend family activities', 
      completed: false, 
      priority: 'Low', 
      category: 'Personal',
      reminder: true,
      reminderTime: '18:00',
      dueDate: '2024-01-18'
    },
    { 
      id: 4, 
      text: 'Update LinkedIn profile', 
      completed: false, 
      priority: 'Medium', 
      category: 'Career',
      reminder: true,
      reminderTime: '14:00',
      dueDate: '2024-01-22'
    },
    { 
      id: 5, 
      text: 'Organize digital photo collection', 
      completed: true, 
      priority: 'Low', 
      category: 'Personal',
      reminder: false,
      dueDate: '2024-01-10'
    },
    { 
      id: 6, 
      text: 'Research investment opportunities', 
      completed: false, 
      priority: 'High', 
      category: 'Finance',
      reminder: true,
      reminderTime: '11:00',
      dueDate: '2024-01-25'
    }
  ];

  const visionCategories = ['Health', 'Wealth', 'Success', 'Respect', 'Pleasure', 'Prosperity', 'Luxurious', 'Habit', 'Spirituality', 'About Life'];

  const handleAddVision = () => {
    if (newVision.title.trim() && newVision.description.trim()) {
      console.log('New vision created:', newVision);
      // Here you would typically save to your state management or API
      setNewVision({
        title: '',
        description: '',
        category: 'Health',
        imageUrl: '',
        estimatedTime: '',
        estimatedMoney: '',
        priority: 'Medium'
      });
      setShowVisionModal(false);
      // Show success message or update UI
      alert('Vision created successfully!');
    }
  };

  const handleAddGoal = () => {
    if (newGoal.title.trim() && newGoal.description.trim()) {
      console.log('New goal created:', newGoal);
      // Here you would typically save to your state management or API
      setNewGoal({
        title: '',
        description: '',
        visionTitle: 'Health',
        startDate: '',
        endDate: '',
        priority: 'Medium',
        amountNeeded: ''
      });
      setShowGoalModal(false);
      // Show success message or update UI
      alert('Goal created successfully!');
    }
  };

  const handleVisionSubmit = async (visionData: any) => {
    try {
      const created = await visionAPI.create({ ...visionData, year: new Date(visionData.date || Date.now()).getFullYear() });
      // TODO: update local state or refresh list if available
      alert('Vision created successfully!');
    } catch (err) {
      console.error('Failed to create vision', err);
      alert('Could not save vision — see console');
    } finally {
      setShowVisionModal(false);
    }
  };

  const handleGoalSubmit = async (goalData: any) => {
    try {
      const created = await goalsAPI.create({ ...goalData, year: new Date(goalData.date || Date.now()).getFullYear() });
      // TODO: update local state or refresh list if available
      alert('Goal created successfully!');
    } catch (err) {
      console.error('Failed to create goal', err);
      alert('Could not save goal — see console');
    } finally {
      setShowGoalModal(false);
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && dueDate !== '';
  };

  const isDueToday = (dueDate: string) => {
    const today = new Date().toDateString();
    return new Date(dueDate).toDateString() === today;
  };

  const StatCard = ({ title, stats, icon: Icon, gradient, bg }: any) => (
    <div className={`${bg} rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-102`}>
      <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
        <div className={`p-1.5 sm:p-2 bg-gradient-to-r ${gradient} rounded-md sm:rounded-lg shadow-md`}>
          <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-gray-800">{title}</h3>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Total</span>
          <span className="text-sm sm:text-base font-bold text-gray-800">{stats.total}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Working</span>
          <span className="text-xs sm:text-sm font-semibold text-blue-600">{stats.working}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Pending</span>
          <span className="text-xs sm:text-sm font-semibold text-orange-600">{stats.pending}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl p-3 sm:p-6 text-white shadow-lg sm:shadow-xl">
          <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">
            Good Morning! 🌅
          </h1>
          <p className="text-xs sm:text-base text-blue-100">
            Today is {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <Link 
          to="/"
          className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-xs sm:text-sm"
        >
          <Home className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Go to Home</span>
        </Link>
        
        <Link 
          to="/swar-calendar"
          className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-xs sm:text-sm"
        >
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Swar Calendar</span>
          <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        </Link>
        
        <button 
          onClick={() => setShowVisionModal(true)}
          className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-xs sm:text-sm"
        >
          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Add Vision</span>
        </button>
        
        <button 
          onClick={() => setShowGoalModal(true)}
          className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-xs sm:text-sm"
        >
          <Target className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <StatCard 
          title="Visions" 
          stats={stats.visions} 
          icon={Eye} 
          gradient="from-purple-500 to-indigo-600" 
          bg="bg-purple-50" 
        />
        <StatCard 
          title="Goals" 
          stats={stats.goals} 
          icon={Target} 
          gradient="from-blue-500 to-cyan-600" 
          bg="bg-blue-50" 
        />
        <StatCard 
          title="Tasks" 
          stats={stats.tasks} 
          icon={CheckSquare} 
          gradient="from-green-500 to-emerald-600" 
          bg="bg-green-50" 
        />
        <StatCard 
          title="To-Do's" 
          stats={stats.todos} 
          icon={CheckSquare} 
          gradient="from-orange-500 to-red-600" 
          bg="bg-orange-50" 
        />
        <StatCard 
          title="My Word" 
          stats={stats.myWord} 
          icon={Heart} 
          gradient="from-red-500 to-pink-600" 
          bg="bg-red-50" 
        />
      </div>

      {/* Running Month Highlights */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">{currentMonth} Highlights</h2>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-md border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
            {monthHighlights.map((highlight) => (
              <div key={highlight.id} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-md sm:rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:scale-102">
                <div className="p-1 sm:p-1.5 bg-white rounded-md shadow-sm">
                  <highlight.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${highlight.color}`} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">{highlight.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* To-Do Section with Reminders */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Quick To-Do's & Reminders</h2>
          <button className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-102 text-xs sm:text-sm">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Add To-Do</span>
          </button>
        </div>
        
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-md border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
            {todoItems.map((todo) => (
              <div key={todo.id} className={`group flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-md sm:rounded-lg border transition-all duration-300 transform hover:scale-102 ${
                isOverdue(todo.dueDate) && !todo.completed
                  ? 'bg-red-50 border-red-200 hover:shadow-md'
                  : isDueToday(todo.dueDate) && !todo.completed
                  ? 'bg-yellow-50 border-yellow-200 hover:shadow-md'
                  : 'bg-gray-50 border-gray-200 hover:shadow-md'
              }`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1 sm:space-x-2 mb-0.5 sm:mb-1">
                    <p className={`text-xs sm:text-sm font-medium truncate ${todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                      {todo.text}
                    </p>
                    {isOverdue(todo.dueDate) && !todo.completed && (
                      <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                    )}
                    {isDueToday(todo.dueDate) && !todo.completed && (
                      <Clock className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                    <span className="text-[10px] sm:text-xs text-blue-600">{todo.category}</span>
                    <span className={`px-1 sm:px-1.5 py-0.5 text-[10px] sm:text-xs rounded-full ${
                      todo.priority === 'High' ? 'bg-red-100 text-red-700' :
                      todo.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {todo.priority}
                    </span>
                    
                    {todo.dueDate && (
                      <span className={`text-[10px] sm:text-xs ${
                        isOverdue(todo.dueDate) && !todo.completed ? 'text-red-600 font-semibold' :
                        isDueToday(todo.dueDate) && !todo.completed ? 'text-yellow-600 font-semibold' :
                        'text-gray-500'
                      }`}>
                        Due: {new Date(todo.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    
                    {todo.reminder && (
                      <div className="flex items-center space-x-0.5 text-[10px] sm:text-xs text-indigo-600">
                        <Bell className="h-2 w-2 sm:h-3 sm:w-3" />
                        <span>{todo.reminderTime}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 flex space-x-1 transition-opacity">
                  <button className="p-1 text-gray-400 hover:text-blue-600 rounded transition-all duration-300 transform hover:scale-105">
                    <Edit className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600 rounded transition-all duration-300 transform hover:scale-105">
                    <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showVisionModal && (
        <VisionForm
          onCancel={() => setShowVisionModal(false)}
          onSubmit={handleVisionSubmit}
        />
      )}

      {showGoalModal && (
        <GoalForm
          onCancel={() => setShowGoalModal(false)}
          onSubmit={handleGoalSubmit}
        />
      )}
    </div>
  );
};

export default Dashboard;