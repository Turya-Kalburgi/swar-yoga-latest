import React from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  Settings,
  Calendar,
  CalendarDays,
  CalendarRange,
  CalendarCheck,
  Sun,
  Moon,
  LayoutDashboard
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface TopNavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onNewTask: () => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ activeView, onViewChange, onNewTask }) => {
  const { theme, setTheme, isDark } = useTheme();

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const navigationItems = [
    { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard', gradient: 'from-blue-500 to-purple-600', bg: 'bg-blue-50' },
    { icon: CalendarDays, label: 'Daily', key: 'daily', gradient: 'from-green-500 to-emerald-600', bg: 'bg-green-50' },
    { icon: CalendarRange, label: 'Weekly', key: 'weekly', gradient: 'from-orange-500 to-red-600', bg: 'bg-orange-50' },
    { icon: CalendarCheck, label: 'Monthly', key: 'monthly', gradient: 'from-purple-500 to-pink-600', bg: 'bg-purple-50' },
    { icon: Calendar, label: 'Yearly', key: 'yearly', gradient: 'from-indigo-500 to-blue-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Left Section - Navigation */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="pl-12 pr-6 py-3 w-80 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 shadow-inner transition-all duration-300 hover:shadow-md"
            />
          </div>

          {/* Header Navigation */}
          <nav className="flex items-center space-x-2">
            {navigationItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onViewChange(item.key)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  activeView === item.key
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg scale-105`
                    : `${item.bg} text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-opacity-50`
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* New Task Button */}
          <button 
            onClick={onNewTask}
            className="flex items-center space-x-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            <span>New Task</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 rounded-xl transition-all duration-300 hover:shadow-md transform hover:scale-105"
          >
            {isDark ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-300 hover:shadow-md transform hover:scale-105">
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">3</span>
            </span>
          </button>

          {/* Settings */}
          <button className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-xl transition-all duration-300 hover:shadow-md transform hover:scale-105">
            <Settings className="h-6 w-6" />
          </button>

          {/* Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <span className="text-white text-sm font-bold">U</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;