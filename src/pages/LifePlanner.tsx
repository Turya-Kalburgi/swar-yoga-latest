import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot as Lotus, ArrowLeft, Brain, Sparkles, Target, CheckSquare, Users, FileText, Menu, X, LogOut, User, Heart, Calendar, Clock, Dumbbell, MessageSquare, Smile, Trash2, Edit, Home } from 'lucide-react';
import DatabaseStatus from '../components/DatabaseStatus';
import Dashboard from '../components/Dashboard';
import MyVision from '../components/MyVision';
import MyGoals from '../components/MyGoals';
import MyTasks from '../components/MyTasks';
import DiamondPeople from '../components/DiamondPeople';
import PDFExport from '../components/PDFExport';
import DailyPlanner from '../components/DailyPlanner';
import WeeklyPlanner from '../components/WeeklyPlanner';
import MonthlyPlanner from '../components/MonthlyPlanner';
import YearlyPlanner from '../components/YearlyPlanner';
import DailyRoutine from '../components/DailyRoutine';
import HealthTracker from '../components/HealthTracker';
import MyWord from '../components/MyWord';
import { testConnection } from '../utils/database';

interface UserData {
  id: string;
  name: string;
  email: string;
}

const LifePlanner = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activePlanner, setActivePlanner] = useState('daily');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser as UserData);
      
      // Check if this is a new user (just signed up)
      if (parsedUser.isNewUser) {
        setShowWelcomeModal(true);
        // Remove the isNewUser flag after showing welcome
        const updatedUser = { ...parsedUser, isNewUser: false };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser as UserData);
      }
    } else {
      setShowLoginModal(true);
    }
    
    // Test database connection on component mount
    testConnection();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - in real app, validate against sign-in data
    if (loginData.email && loginData.password) {
      const mockUser = {
        email: loginData.email,
        name: loginData.email.split('@')[0],
        id: Date.now().toString()
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setShowLoginModal(false);
      setLoginData({ email: '', password: '' });
    } else {
      alert('Please enter both email and password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Brain, color: 'purple' },
    { id: 'vision', name: 'My Vision', icon: Sparkles, color: 'purple' },
    { id: 'goals', name: 'My Goals', icon: Target, color: 'purple' },
    { id: 'tasks', name: 'My Tasks', icon: CheckSquare, color: 'purple' },
    { id: 'todos', name: 'My To-Dos', icon: CheckSquare, color: 'purple' },
    { id: 'routine', name: 'My Routine', icon: Clock, color: 'purple' },
    { id: 'health', name: 'Health Tracker', icon: Heart, color: 'purple' },
    { id: 'word', name: 'My Word', icon: MessageSquare, color: 'purple' },
    { id: 'affirmations', name: 'Affirmations', icon: Smile, color: 'purple' },
    { id: 'people', name: 'Diamond People', icon: Users, color: 'purple' },
    { id: 'export', name: 'PDF Export', icon: FileText, color: 'purple' }
  ];

  const plannerTabs = [
    { id: 'daily', name: 'Daily' },
    { id: 'weekly', name: 'Weekly' },
    { id: 'monthly', name: 'Monthly' },
    { id: 'yearly', name: 'Yearly' }
  ];

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  const renderMainContent = () => {
    if (activeSection === 'dashboard') {
      switch (activePlanner) {
        case 'daily':
          return <DailyPlanner />;
        case 'weekly':
          return <WeeklyPlanner />;
        case 'monthly':
          return <MonthlyPlanner />;
        case 'yearly':
          return <YearlyPlanner />;
        default:
          return <Dashboard />;
      }
    }

    switch (activeSection) {
      case 'vision':
        return <MyVision />;
      case 'goals':
        return <MyGoals />;
      case 'tasks':
        return <MyTasks />;
      case 'todos':
        return <DailyPlanner />;
      case 'routine':
        return <DailyRoutine />;
      case 'health':
        return <HealthTracker />;
      case 'word':
        return <MyWord />;
      case 'affirmations':
        return <PositiveAffirmations />;
      case 'people':
        return <DiamondPeople />;
      case 'export':
        return <PDFExport />;
      default:
        return <Dashboard />;
    }
  };

  const getColorClasses = (color: string, isActive: boolean) => {
    return isActive ? 'bg-purple-600 text-white' : 'text-purple-600 hover:bg-purple-50';
  };

  // Welcome Modal for new users
  if (showWelcomeModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <div className="h-8 w-8 sm:h-10 sm:w-10 text-white">🎉</div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
            Welcome to SwarYoga, {user?.name}! 🎉
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
            Congratulations on creating your account! You're now ready to start your transformation journey with our comprehensive Life Planner.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <h3 className="font-semibold text-green-800 mb-2">What's Next?</h3>
            <ul className="text-xs sm:text-sm text-green-700 space-y-1 text-left">
              <li>• Create your life visions and goals</li>
              <li>• Plan your daily, weekly, and monthly activities</li>
              <li>• Track your progress and celebrate achievements</li>
              <li>• Connect with your diamond people network</li>
            </ul>
          </div>
          <button
            onClick={()=> setShowWelcomeModal(false)}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl font-medium"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  // Login Modal
  if (showLoginModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Lotus className="h-12 w-12 sm:h-16 sm:w-16 text-purple-600 mx-auto mb-3 sm:mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Life Planner Login</h1>
            <p className="text-sm sm:text-base text-gray-600">Enter your credentials to access your life planner</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 sm:py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              Access Life Planner
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-purple-600 hover:text-purple-700 font-medium">
                Sign up here
              </Link>
            </p>
            <Link 
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors mt-4 text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Back button and Logo */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/" className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline text-sm">Go to Home</span>
              </Link>
              <div className="flex items-center space-x-1 sm:space-x-3">
                <Lotus className="h-5 w-5 sm:h-8 sm:w-8 text-purple-600" />
                <span className="text-base sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Life Planner
                </span>
              </div>
            </div>

            {/* Center - Planner Tabs (Desktop only) */}
            {activeSection === 'dashboard' && (
              <nav className="hidden lg:flex space-x-1 bg-gray-100 rounded-lg p-1">
                {plannerTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActivePlanner(tab.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      activePlanner === tab.id
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            )}

            {/* Right side - User info and Mobile menu button */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* User Info */}
              {user && (
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}

              <div className="hidden sm:block">
                <DatabaseStatus />
              </div>
              
              {/* Swar Calendar Link - Highlighted */}
              <Link 
                to="/swar-calendar"
                className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all animate-pulse"
              >
                <span className="text-sm font-medium">Swar Calendar</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">New!</span>
              </Link>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Planner Tabs */}
          {activeSection === 'dashboard' && (
            <div className="lg:hidden mt-3">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
                {plannerTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActivePlanner(tab.id)}
                    className={`flex-shrink-0 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                      activePlanner === tab.id
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mobile Database Status */}
          <div className="sm:hidden mt-3 flex items-center justify-between">
            <DatabaseStatus />
            
            {/* Mobile Swar Calendar Link */}
            <Link 
              to="/swar-calendar"
              className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-lg shadow-md text-xs"
            >
              <span>Swar Calendar</span>
              <span className="bg-white/20 px-1 rounded text-[10px]">New!</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white/80 backdrop-blur-sm shadow-lg min-h-screen sticky top-16 self-start">
          <div className="p-6">
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSectionChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${getColorClasses(item.color, isActive)} hover:shadow-md hover:transform hover:scale-[1.02]`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
              <div className="p-6 pt-20">
                {/* Mobile User Info */}
                {user && (
                  <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors text-sm"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}

                <nav className="space-y-2">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSectionChange(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${getColorClasses(item.color, isActive)}`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-6 overflow-x-auto">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

// Positive Affirmations Component
const PositiveAffirmations = () => {
  const [affirmations, setAffirmations] = useState([
    {
      id: 1,
      text: "I am capable of achieving my goals and dreams.",
      category: "Success",
      image: "https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 2,
      text: "I am worthy of love, happiness, and fulfillment.",
      category: "Self-Worth",
      image: "https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 3,
      text: "My body is healthy, strong, and full of energy.",
      category: "Health",
      image: "https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 4,
      text: "I attract abundance and prosperity into my life.",
      category: "Abundance",
      image: "https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 5,
      text: "I am at peace with my past and excited for my future.",
      category: "Peace",
      image: "https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 6,
      text: "I am constantly growing and evolving into my best self.",
      category: "Growth",
      image: "https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAffirmation, setEditingAffirmation] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    text: '',
    category: 'Success',
    image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=600'
  });
  
  // Load affirmations from localStorage on component mount
  useEffect(() => {
    const savedAffirmations = localStorage.getItem('my_affirmations');
    if (savedAffirmations) {
      try {
        setAffirmations(JSON.parse(savedAffirmations));
      } catch (error) {
        console.error('Error loading affirmations:', error);
      }
    }
  }, []);
  
  // Save to localStorage whenever affirmations change
  useEffect(() => {
    localStorage.setItem('my_affirmations', JSON.stringify(affirmations));
  }, [affirmations]);
  
  const handleAddAffirmation = () => {
    if (!formData.text) {
      alert('Please enter an affirmation text');
      return;
    }
    
    const newAffirmation = {
      id: Date.now(),
      text: formData.text,
      category: formData.category,
      image: formData.image
    };
    
    setAffirmations([...affirmations, newAffirmation]);
    resetForm();
    setShowAddModal(false);
  };
  
  const handleEditAffirmation = () => {
    if (!editingAffirmation) return;
    
    const updatedAffirmations = affirmations.map(affirmation => 
      affirmation.id === editingAffirmation.id 
        ? { ...affirmation, text: formData.text, category: formData.category, image: formData.image }
        : affirmation
    );
    
    setAffirmations(updatedAffirmations);
    resetForm();
    setEditingAffirmation(null);
    setShowEditModal(false);
  };
  
  const handleDeleteAffirmation = (id: number) => {
    if (confirm('Are you sure you want to delete this affirmation?')) {
      setAffirmations(affirmations.filter(affirmation => affirmation.id !== id));
    }
  };
  
  const startEdit = (affirmation: any) => {
    setEditingAffirmation(affirmation);
    setFormData({
      text: affirmation.text,
      category: affirmation.category,
      image: affirmation.image
    });
    setShowEditModal(true);
  };
  
  const resetForm = () => {
    setFormData({
      text: '',
      category: 'Success',
      image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=600'
    });
  };
  
  const addToMyAffirmations = (affirmation: any) => {
    // This function would typically add the affirmation to a user's personal list
    // For now, we'll just show an alert
    alert(`"${affirmation.text}" added to your personal affirmations!`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Positive Affirmations</h1>
          <p className="text-sm sm:text-base text-gray-600">Daily affirmations to uplift your mind and spirit</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105 text-sm sm:text-base"
        >
          Create Affirmation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {affirmations.map((affirmation, index) => (
          <div 
            key={affirmation.id} 
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group transform hover:scale-[1.02]"
          >
            <div className="h-36 sm:h-48 overflow-hidden">
              <img 
                src={affirmation.image} 
                alt={affirmation.category} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 sm:p-6 bg-gradient-to-br from-white to-purple-50">
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                {affirmation.category}
              </span>
              <h3 className="text-base sm:text-xl font-bold text-gray-800 mt-3 mb-2">
                {affirmation.text}
              </h3>
              <div className="flex space-x-2 mt-3 sm:mt-4">
                <button 
                  onClick={() => addToMyAffirmations(affirmation)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 sm:py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-md hover:shadow-lg text-xs sm:text-sm"
                >
                  Add to My Affirmations
                </button>
                <button
                  onClick={() => startEdit(affirmation)}
                  className="p-2 sm:p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hover:shadow-md"
                >
                  <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={() => handleDeleteAffirmation(affirmation.id)}
                  className="p-2 sm:p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors hover:shadow-md"
                >
                  <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 bg-gradient-to-br from-white to-purple-50">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Create Your Own Affirmation</h2>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Affirmation Text
            </label>
            <textarea
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm text-sm sm:text-base"
              rows={3}
              placeholder="Write your positive affirmation here..."
              value={formData.text}
              onChange={(e) => setFormData({...formData, text: e.target.value})}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Category
            </label>
            <select 
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm text-sm sm:text-base"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Success">Success</option>
              <option value="Self-Worth">Self-Worth</option>
              <option value="Health">Health</option>
              <option value="Abundance">Abundance</option>
              <option value="Peace">Peace</option>
              <option value="Growth">Growth</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Image URL (Optional)
            </label>
            <input
              type="url"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm text-sm sm:text-base"
              placeholder="Enter image URL"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
            />
          </div>
          <button 
            onClick={handleAddAffirmation}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 sm:py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-md hover:shadow-lg transform hover:scale-[1.02] text-sm sm:text-base"
          >
            Save Affirmation
          </button>
        </div>
      </div>
      
      {/* Edit Modal */}
      {showEditModal && editingAffirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Edit Affirmation</h3>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setEditingAffirmation(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Affirmation Text
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({...formData, text: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Write your positive affirmation here..."
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Success">Success</option>
                  <option value="Self-Worth">Self-Worth</option>
                  <option value="Health">Health</option>
                  <option value="Abundance">Abundance</option>
                  <option value="Peace">Peace</option>
                  <option value="Growth">Growth</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter image URL"
                />
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleEditAffirmation}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingAffirmation(null);
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

export default LifePlanner;