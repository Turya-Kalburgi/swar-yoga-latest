import React from 'react';
import { 
  Calendar,
  Eye,
  Target,
  CheckSquare,
  Heart,
  Sparkles,
  Users
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const sidebarItems = [
    { icon: Eye, label: 'My Vision', key: 'vision', gradient: 'from-purple-500 to-indigo-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    { icon: Target, label: 'My Goals', key: 'goals', gradient: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { icon: CheckSquare, label: 'My Tasks', key: 'tasks', gradient: 'from-green-500 to-emerald-600', bg: 'bg-green-50', border: 'border-green-200' },
    { icon: CheckSquare, label: 'My To-Do\'s', key: 'todos', gradient: 'from-orange-500 to-red-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    { icon: Heart, label: 'My Word', key: 'word', gradient: 'from-red-500 to-pink-600', bg: 'bg-red-50', border: 'border-red-200' },
    { icon: Sparkles, label: 'My Affirmations', key: 'affirmations', gradient: 'from-pink-500 to-rose-600', bg: 'bg-pink-50', border: 'border-pink-200' },
    { icon: Users, label: 'My Diamond Peoples', key: 'diamond-peoples', gradient: 'from-indigo-500 to-purple-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-white">Swar Yoga</h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6">
        <nav className="space-y-2 px-4">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              onClick={() => onViewChange(item.key)}
              className={`w-full group flex items-center px-4 py-4 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                activeView === item.key
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg scale-105`
                  : `${item.bg} text-gray-700 hover:${item.bg} hover:text-gray-900 border ${item.border} hover:border-opacity-50`
              }`}
            >
              <div className={`mr-3 p-2 rounded-lg transition-all duration-300 ${
                activeView === item.key 
                  ? 'bg-white bg-opacity-20' 
                  : 'bg-white shadow-sm group-hover:shadow-md'
              }`}>
                <item.icon className={`h-5 w-5 ${
                  activeView === item.key ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                }`} />
              </div>
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
            <span className="text-white text-lg font-bold">🧘</span>
          </div>
          <p className="text-sm font-semibold text-gray-700">Swar Yoga v1.0</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">Transform • Grow • Thrive</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;