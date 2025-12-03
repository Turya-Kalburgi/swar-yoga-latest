import React, { useEffect, useState } from 'react';
import { tasksAPI, todosAPI, visionAPI, goalsAPI } from '../utils/database';
import { 
  Calendar, 
  Target, 
  CheckSquare, 
  Heart, 
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const MonthlyPlanner: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedMonth);
    if (direction === 'next') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setSelectedMonth(newDate);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const initialMyVisions: any[] = [];

  const days = getDaysInMonth(selectedMonth);
  const [visions, setVisions] = useState<any[]>(initialMyVisions);
  const [tasks, setTasks] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<'vision' | 'task' | 'todo' | 'goal'>('vision');
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(() => new Date().toISOString().slice(0,10));
  const [newPriority, setNewPriority] = useState('Medium');

  useEffect(() => {
    const load = async () => {
      try {
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth();
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0);

        const [vw, allTasks, allTodos, allGoals] = await Promise.all([
          visionAPI.getAll(year),
          tasksAPI.getAll(),
          todosAPI.getAll(),
          goalsAPI.getAll(year)
        ]);

        if (Array.isArray(vw) && vw.length) setVisions(vw);

        const inRange = (dStr: string) => {
          const d = new Date(dStr);
          return d >= start && d <= end;
        };

        setTasks(Array.isArray(allTasks) ? allTasks.filter((t: any) => t.date ? inRange(t.date) : true) : []);
        setTodos(Array.isArray(allTodos) ? allTodos.filter((t: any) => t.date ? inRange(t.date) : true) : []);
        setGoals(Array.isArray(allGoals) ? allGoals.filter((g: any) => g.date ? inRange(g.date) : true) : []);
      } catch (err) {
        console.warn('Failed to load monthly planner data', err);
      }
    };

    load();
  }, [selectedMonth]);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Simplified VisionCard to avoid complex nested JSX that caused a parser error.
  // This keeps the visual list working while we can revisit and reintroduce
  // richer markup in smaller, testable pieces.
  const VisionCard = ({ vision }: { vision: any }) => {
    return (
      <div className="bg-white rounded-xl shadow p-4 border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-800">{vision.title}</h3>
            <p className="text-xs text-gray-600">{vision.description}</p>
          </div>
          <div className="text-sm text-gray-500">{vision.progress}%</div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">Monthly Planner (simplified)</h1>
      <p className="mt-2 text-sm text-gray-600">Temporarily simplified to avoid a JSX parse error. Full UI will be restored in smaller pieces.</p>
      <div className="mt-4 grid gap-4">
        {visions.map(vision => (
          <VisionCard key={vision.id} vision={vision} />
        ))}
      </div>
    </div>
  );
};

export default MonthlyPlanner;