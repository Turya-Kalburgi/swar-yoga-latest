import React, { useEffect, useState } from 'react';
import { dailyWordsAPI, tasksAPI, todosAPI, visionAPI, healthAPI, goalsAPI, affirmationsAPI } from '../utils/database';
import { Clock, Target, CheckSquare, Heart, Activity, Sparkles, Edit, Trash2, Plus, ChevronLeft, ChevronRight, Sun, Dumbbell, Coffee, Book, Radiation as Meditation, ShowerHead as Shower, Eye } from 'lucide-react';
import VisionForm from './VisionForm';
import GoalForm from './GoalForm';

const DailyPlanner: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showVisionPreview, setShowVisionPreview] = useState<number | null>(null);
  const [editingVision, setEditingVision] = useState<any | null>(null);
  const [editingGoal, setEditingGoal] = useState<any | null>(null);
  const [affirmations, setAffirmations] = useState<any[]>([]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  // start with empty arrays — actual data is loaded from the API
  const initialTodaysVisions: any[] = [];

  const initialTodaysGoals: any[] = [];

  // keep section templates but with empty items — no dummy data
  const sections = [
    { title: 'Morning Routine', icon: Sun, color: 'from-orange-400 to-yellow-500', bg: 'bg-orange-50', border: 'border-orange-200', items: [] },
    { title: 'Top 3 Priorities', icon: Target, color: 'from-blue-400 to-cyan-500', bg: 'bg-blue-50', border: 'border-blue-200', items: [] },
    { title: 'Task List', icon: CheckSquare, color: 'from-green-400 to-emerald-500', bg: 'bg-green-50', border: 'border-green-200', items: [] },
    { title: "My To-Do's for Today", icon: CheckSquare, color: 'from-purple-400 to-pink-500', bg: 'bg-purple-50', border: 'border-purple-200', items: [] },
    { title: 'My Word (Integrity)', icon: Heart, color: 'from-red-400 to-pink-500', bg: 'bg-red-50', border: 'border-red-200', items: [] },
    { title: 'Health Tracker', icon: Activity, color: 'from-green-500 to-teal-500', bg: 'bg-green-50', border: 'border-green-200', items: [] },
    { title: 'Affirmations', icon: Sparkles, color: 'from-pink-400 to-rose-500', bg: 'bg-pink-50', border: 'border-pink-200', items: [] }
  ];

  const [visions, setVisions] = useState<any[]>(initialTodaysVisions);
  const [goals, setGoals] = useState<any[]>(initialTodaysGoals);
  const [sectionsState, setSectionsState] = useState<any[]>(sections);
  const [dailyWords, setDailyWords] = useState<any[]>([]);

  // UI state for add/create modals
  const [showAddVisionModal, setShowAddVisionModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      const dateStr = selectedDate.toISOString().slice(0, 10);
      try {
        const [vw, allTasks, allTodos, health, allGoals, allAffirmations] = await Promise.all([
          visionAPI.getAll(selectedDate.getFullYear()),
          tasksAPI.getAll(),
          todosAPI.getAll(),
          healthAPI.getAll(dateStr),
          goalsAPI.getAll(selectedDate.getFullYear()),
          affirmationsAPI.getAll()
        ]);

        // visions may be general; keep them if returned
        if (Array.isArray(vw) && vw.length) setVisions(vw);

        // filter tasks/todos by date if they include a date field
        const tasksForDate = Array.isArray(allTasks)
          ? allTasks.filter((t: any) => t.date === dateStr || !t.date && true)
          : [];
        const todosForDate = Array.isArray(allTodos)
          ? allTodos.filter((t: any) => t.date === dateStr || !t.date && true)
          : [];

        // Map tasks/todos into sections where appropriate
        setGoals(tasksForDate.length ? tasksForDate : initialTodaysGoals);

        const newSections = sections.map(section => {
          if (section.title === 'Task List') return { ...section, items: tasksForDate.length ? tasksForDate : section.items };
          if (section.title === "My To-Do's for Today") return { ...section, items: todosForDate.length ? todosForDate : section.items };
          if (section.title === 'Health Tracker') return { ...section, items: health && health.length ? health : section.items };
          if (section.title === 'Affirmations') return { ...section, items: Array.isArray(allAffirmations) ? allAffirmations : section.items };
          return section;
        });
        setSectionsState(newSections);

        const dw = await dailyWordsAPI.getAll(dateStr);
        if (Array.isArray(dw) && dw.length) setDailyWords(dw);
        
        if (Array.isArray(allAffirmations)) {
          setAffirmations(allAffirmations);
        }
        
        // prefer goals that match the date if present
        const goalsForDate = Array.isArray(allGoals) ? allGoals.filter((g: any) => g.date === dateStr || !g.date) : [];
        if (goalsForDate.length) setGoals(goalsForDate);
      } catch (err) {
        // keep initial sample data on error
        console.warn('Failed to load daily planner data, using local samples', err);
      }
    };

    load();
  }, [selectedDate]);

  // Vision/Goal submission handlers (used by VisionForm / GoalForm)
  const handleVisionSubmit = async (visionData: any) => {
    try {
      const dateStr = selectedDate.toISOString().slice(0, 10);
      const payload = { ...visionData, date: visionData.date || dateStr, year: visionData.year || selectedDate.getFullYear() };
      const created = await visionAPI.create(payload);
      setVisions(prev => [created, ...prev]);
    } catch (err) {
      console.error('Failed to create vision', err);
      alert('Could not save vision — see console');
    } finally {
      setShowAddVisionModal(false);
    }
  };

  const handleGoalSubmit = async (goalData: any) => {
    try {
      const dateStr = selectedDate.toISOString().slice(0, 10);
      const payload = { ...goalData, date: goalData.date || dateStr, year: goalData.year || selectedDate.getFullYear() };
      const created = await goalsAPI.create(payload);
      setGoals(prev => [created, ...prev]);
    } catch (err) {
      console.error('Failed to create goal', err);
      alert('Could not save goal — see console');
    } finally {
      setShowAddGoalModal(false);
    }
  };

  const handleDeleteVision = async (visionId: number) => {
    if (!confirm('Delete this vision? This action cannot be undone.')) return;
    try {
      await visionAPI.delete(visionId);
      setVisions(prev => prev.filter(v => v.id !== visionId));
      setShowVisionPreview(null);
    } catch (err) {
      console.error('Failed to delete vision', err);
      alert('Could not delete vision — see console');
    }
  };

  const handleDeleteGoal = async (goalId: number) => {
    if (!confirm('Delete this goal? This action cannot be undone.')) return;
    try {
      await goalsAPI.delete(goalId);
      setGoals(prev => prev.filter(g => g.id !== goalId));
    } catch (err) {
      console.error('Failed to delete goal', err);
      alert('Could not delete goal — see console');
    }
  };

  const handleDeleteSectionItem = async (itemType: string, itemId: number) => {
    if (!confirm('Delete this item? This action cannot be undone.')) return;
    try {
      if (itemType === 'task') {
        await tasksAPI.delete(itemId);
      } else if (itemType === 'todo') {
        await todosAPI.delete(itemId);
      } else if (itemType === 'word') {
        await dailyWordsAPI.delete(itemId);
      } else if (itemType === 'health') {
        await healthAPI.delete(itemId);
      } else if (itemType === 'affirmation') {
        await affirmationsAPI.delete(itemId);
      }
      
      // Reload the section data
      const dateStr = selectedDate.toISOString().slice(0, 10);
      const [allTasks, allTodos, health, dw, allAffirmations] = await Promise.all([
        tasksAPI.getAll(),
        todosAPI.getAll(),
        healthAPI.getAll(dateStr),
        dailyWordsAPI.getAll(dateStr),
        affirmationsAPI.getAll()
      ]);
      
      const tasksForDate = Array.isArray(allTasks)
        ? allTasks.filter((t: any) => t.date === dateStr || !t.date)
        : [];
      const todosForDate = Array.isArray(allTodos)
        ? allTodos.filter((t: any) => t.date === dateStr || !t.date)
        : [];

      const newSections = sections.map(section => {
        if (section.title === 'Task List') return { ...section, items: tasksForDate };
        if (section.title === "My To-Do's for Today") return { ...section, items: todosForDate };
        if (section.title === 'Health Tracker') return { ...section, items: health || [] };
        if (section.title === 'Affirmations') return { ...section, items: allAffirmations || [] };
        return section;
      });
      setSectionsState(newSections);
      if (Array.isArray(dw) && dw.length) setDailyWords(dw);
    } catch (err) {
      console.error('Failed to delete item', err);
      alert('Could not delete item — see console');
    }
  };

  const VisionCard = ({ vision }: { vision: any }) => (
    <div className={`bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md sm:shadow-lg border ${vision.border} p-4 sm:p-5 lg:p-6 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 transform hover:scale-102`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className={`p-2 sm:p-2.5 lg:p-3 bg-gradient-to-r ${vision.color} rounded-lg sm:rounded-lg lg:rounded-xl shadow-md sm:shadow-lg`}>
            <Eye className="h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 truncate">{vision.title}</h3>
            <p className="text-xs sm:text-xs lg:text-sm text-gray-600 line-clamp-2">{vision.description}</p>
          </div>
        </div>
        <div className="flex space-x-0.5 sm:space-x-1 flex-shrink-0">
          <button 
            onClick={() => setShowVisionPreview(vision.id)}
            className="p-1.5 sm:p-1.5 lg:p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-105"
            title="Preview Vision"
          >
            <Eye className="h-3 w-3 sm:h-3 sm:w-3 lg:h-4 lg:w-4" />
          </button>
          <button 
            onClick={() => setEditingVision(vision)}
            className="p-1.5 sm:p-1.5 lg:p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
            title="Edit Vision"
          >
            <Edit className="h-3 w-3 sm:h-3 sm:w-3 lg:h-3 lg:w-3" />
          </button>
          <button 
            onClick={() => handleDeleteVision(vision.id)}
            className="p-1.5 sm:p-1.5 lg:p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
            title="Delete Vision"
          >
            <Trash2 className="h-3 w-3 sm:h-3 sm:w-3 lg:h-3 lg:w-3" />
          </button>
        </div>
      </div>
      
      <div className="mb-2 sm:mb-3 lg:mb-3">
        <div className="flex justify-between items-center mb-1 sm:mb-2">
          <span className="text-xs sm:text-xs lg:text-sm font-medium text-gray-700">Progress</span>
          <span className="text-xs sm:text-xs lg:text-sm font-bold text-gray-800">{vision.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 shadow-inner">
          <div 
            className={`h-1.5 sm:h-2 rounded-full bg-gradient-to-r ${vision.color} transition-all duration-500 shadow-sm`}
            style={{ width: `${vision.progress}%` }}
          />
        </div>
      </div>
    </div>
  );

  const GoalCard = ({ goal }: { goal: any }) => (
    <div className="group flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:scale-102">
      <input
        type="checkbox"
        checked={goal.completed}
        className="w-4 h-4 sm:w-4 sm:h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
      />
      
      <div className="flex-1 min-w-0">
        <p className={`text-xs sm:text-sm font-medium truncate ${goal.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
          {goal.text || goal.title}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-0.5">
          <span className="text-xs text-gray-500">{goal.deadline || goal.date}</span>
          <span className="text-xs text-blue-600">{goal.category}</span>
          <span className={`px-2 py-0.5 text-xs rounded-full ${
            goal.priority === 'High' ? 'bg-red-100 text-red-700' :
            goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {goal.priority}
          </span>
        </div>
      </div>
      
      <div className="opacity-0 group-hover:opacity-100 flex space-x-0.5 sm:space-x-1 transition-opacity flex-shrink-0">
        <button 
          onClick={() => setEditingGoal(goal)}
          className="p-1.5 sm:p-1.5 text-gray-400 hover:text-blue-600 rounded transition-all duration-300 transform hover:scale-105"
          title="Edit Goal"
        >
          <Edit className="h-3 w-3 sm:h-3 sm:w-3" />
        </button>
        <button 
          onClick={() => handleDeleteGoal(goal.id)}
          className="p-1.5 sm:p-1.5 text-gray-400 hover:text-red-600 rounded transition-all duration-300 transform hover:scale-105"
          title="Delete Goal"
        >
          <Trash2 className="h-3 w-3 sm:h-3 sm:w-3" />
        </button>
      </div>
    </div>
  );

  const SectionCard = ({ section }: { section: any }) => (
    <div className={`bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md sm:shadow-lg border ${section.border} p-4 sm:p-5 lg:p-6 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 transform hover:scale-102`}>
      <div className="flex items-center justify-between mb-4 sm:mb-5 lg:mb-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className={`p-2 sm:p-2.5 lg:p-3 bg-gradient-to-r ${section.color} rounded-lg sm:rounded-lg lg:rounded-xl shadow-md sm:shadow-lg`}>
            <section.icon className="h-5 w-5 sm:h-5 lg:h-6 lg:w-6 text-white" />
          </div>
          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">{section.title}</h3>
        </div>
        <button className="p-1.5 sm:p-2 lg:p-2.5 text-gray-400 hover:text-blue-600 rounded-lg sm:rounded-lg lg:rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5" />
        </button>
      </div>

      <div className="space-y-2 sm:space-y-3 lg:space-y-3">
        {section.items.map((item: any) => {
          const itemType = section.title === 'Task List' ? 'task' : 
                           section.title === "My To-Do's for Today" ? 'todo' :
                           section.title === 'My Word (Integrity)' ? 'word' :
                           section.title === 'Health Tracker' ? 'health' :
                           section.title === 'Affirmations' ? 'affirmation' : 'item';
          
          return (
            <div key={item.id} className={`group flex items-center space-x-2 sm:space-x-3 lg:space-x-4 p-2 sm:p-3 lg:p-4 ${section.bg} rounded-lg sm:rounded-lg lg:rounded-xl ${section.border} border hover:shadow-sm sm:hover:shadow-md transition-all duration-300 transform hover:scale-102`}>
              <input
                type="checkbox"
                checked={item.completed || false}
                className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-blue-500 shadow-sm flex-shrink-0"
              />
              
              <div className={`p-1.5 sm:p-2 lg:p-2 bg-white rounded-lg shadow-sm ${item.iconColor} flex-shrink-0`}>
                <item.icon className="h-4 w-4 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-xs sm:text-sm lg:text-sm font-medium truncate ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {item.text || item.title}
                </p>
                {item.time && (
                  <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 font-medium">{item.time}</p>
                )}
                {item.current && (
                  <p className="text-xs text-blue-600 mt-0.5 sm:mt-1 font-semibold">{item.current}</p>
                )}
                {item.priority && (
                  <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-xs rounded-full mt-1 sm:mt-2 font-medium ${
                    item.priority === 'High' ? 'bg-red-100 text-red-700' :
                    item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {item.priority}
                  </span>
                )}
              </div>
              <div className="opacity-0 group-hover:opacity-100 flex space-x-0.5 sm:space-x-1 transition-opacity flex-shrink-0">
                <button 
                  onClick={() => {
                    if (itemType === 'task') setEditingGoal(item);
                    // For other types, we'd need similar edit handlers
                  }}
                  className="p-1.5 sm:p-1.5 lg:p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                  title="Edit"
                >
                  <Edit className="h-3 w-3 sm:h-3 sm:w-3 lg:h-4 lg:w-4" />
                </button>
                <button 
                  onClick={() => handleDeleteSectionItem(itemType, item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const selectedVision = visions.find(v => v.id === showVisionPreview);

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header with Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg sm:shadow-xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Daily Planner</h1>
          <p className="text-xs sm:text-base lg:text-lg text-blue-100">{formatDate(selectedDate)}</p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 sm:p-3 text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-lg sm:rounded-xl transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl transform hover:scale-102"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          
          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl transform hover:scale-102 font-semibold text-xs sm:text-sm lg:text-base"
          >
            Today
          </button>
          
          <button
            onClick={() => navigateDate('next')}
            className="p-2 sm:p-3 text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-lg sm:rounded-xl transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl transform hover:scale-102"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>

      {/* Today's Visions */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Today's Visions</h2>
          <button onClick={() => setShowAddVisionModal(true)} className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl transform hover:scale-102 text-xs sm:text-sm">
            <Plus className="h-4 w-4" />
            <span>Add Vision</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {visions.map(vision => (
            <VisionCard key={vision.id} vision={vision} />
          ))}
        </div>
      </div>

      {/* Today's Goals */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Today's Goals</h2>
          <button onClick={() => setShowAddGoalModal(true)} className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl transform hover:scale-102 text-xs sm:text-sm">
            <Plus className="h-4 w-4" />
            <span>Add Goal</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {goals.map(goal => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6 mb-8">
        {sectionsState.map((section, index) => (
          <SectionCard key={index} section={section} />
        ))}
      </div>

      {/* Notes/Reflection Section */}
      <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md sm:shadow-lg border border-indigo-200 p-4 sm:p-6 lg:p-8 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg sm:rounded-lg lg:rounded-xl shadow-md sm:shadow-lg">
              <Book className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">Notes & Reflection</h3>
          </div>
          <button className="p-1.5 sm:p-2 lg:p-2 text-gray-400 hover:text-blue-600 rounded-lg sm:rounded-lg lg:rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 self-start sm:self-center">
            <Edit className="h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5" />
          </button>
        </div>
        <textarea
          placeholder="Write your thoughts, reflections, or notes for today..."
          className="w-full h-24 sm:h-28 lg:h-32 p-3 sm:p-4 border border-gray-200 rounded-lg sm:rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-indigo-50 text-xs sm:text-sm lg:text-base text-gray-900 placeholder-gray-500 shadow-inner"
        />
      </div>

      {/* Vision Preview Modal */}
      {/* Add Vision Modal (VisionForm) */}
      {showAddVisionModal && (
        <VisionForm
          onCancel={() => setShowAddVisionModal(false)}
          onSubmit={handleVisionSubmit}
        />
      )}

      {/* Edit Vision Modal (VisionForm) */}
      {editingVision && (
        <VisionForm
          initialData={editingVision}
          onCancel={() => {
            setEditingVision(null);
            setShowVisionPreview(null);
          }}
          onSubmit={async (visionData) => {
            try {
              const updated = await visionAPI.update(editingVision.id, visionData);
              setVisions(prev => prev.map(v => v.id === editingVision.id ? updated : v));
              setEditingVision(null);
              setShowVisionPreview(null);
            } catch (err) {
              console.error('Failed to update vision', err);
              alert('Could not update vision — see console');
            }
          }}
        />
      )}

      {/* Add Goal Modal (GoalForm) */}
      {showAddGoalModal && (
        <GoalForm
          onCancel={() => setShowAddGoalModal(false)}
          onSubmit={handleGoalSubmit}
        />
      )}

      {/* Edit Goal Modal (GoalForm) */}
      {editingGoal && (
        <GoalForm
          initialData={editingGoal}
          onCancel={() => setEditingGoal(null)}
          onSubmit={async (goalData) => {
            try {
              const updated = await goalsAPI.update(editingGoal.id, goalData);
              setGoals(prev => prev.map(g => g.id === editingGoal.id ? updated : g));
              setEditingGoal(null);
            } catch (err) {
              console.error('Failed to update goal', err);
              alert('Could not update goal — see console');
            }
          }}
        />
      )}
      {showVisionPreview && selectedVision && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className={`p-3 bg-gradient-to-r ${selectedVision.color} rounded-xl shadow-lg`}>
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedVision.title}</h2>
                  <p className="text-gray-600 mt-1">{selectedVision.headline}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setEditingVision(selectedVision)}
                  className="p-2 text-gray-400 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-110"
                  title="Edit Vision"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleDeleteVision(selectedVision.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all duration-300 transform hover:scale-110"
                  title="Delete Vision"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowVisionPreview(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Vision Image */}
              <div className="mb-6">
                <img 
                  src={selectedVision.image} 
                  alt={selectedVision.title}
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-semibold text-gray-700">Overall Progress</span>
                  <span className="text-2xl font-bold text-gray-800">{selectedVision.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                  <div 
                    className={`h-4 rounded-full bg-gradient-to-r ${selectedVision.color} transition-all duration-500 shadow-sm`}
                    style={{ width: `${selectedVision.progress}%` }}
                  />
                </div>
              </div>

              {/* Vision Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Description */}
                <div className={`p-6 ${selectedVision.bg} rounded-xl border ${selectedVision.border}`}>
                  <h4 className="text-lg font-bold text-gray-800 mb-3">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedVision.fullDescription}</p>
                </div>

                {/* Vision Details */}
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-gray-800">Estimated Time</span>
                    </div>
                    <p className="text-gray-700">{selectedVision.estimatedTime}</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-gray-800">Investment</span>
                    </div>
                    <p className="text-gray-700">{selectedVision.estimatedMoney}</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5 text-red-600" />
                      <span className="font-semibold text-gray-800">Priority</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedVision.priority === 'High' ? 'bg-red-100 text-red-700' :
                      selectedVision.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {selectedVision.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Guidelines */}
              <div className={`p-6 ${selectedVision.bg} rounded-xl border ${selectedVision.border}`}>
                <h4 className="text-lg font-bold text-gray-800 mb-4">Guidelines & Action Steps</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedVision.guidelines.map((guideline: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                      <div className={`p-2 bg-gradient-to-r ${selectedVision.color} rounded-lg`}>
                        <CheckSquare className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{guideline}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyPlanner;