// Sadhaka Planner Data Management - All operations with Supabase

import axios from 'axios';

const API_URL = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL 
  ? (import.meta as any).env.VITE_API_URL 
  : 'https://swar-yoga-dec.onrender.com/api';

// ============ TYPE DEFINITIONS ============

export interface Vision {
  id?: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  timelineMonths: number;
  startDate: string;
  targetDate: string;
  status: 'Active' | 'Completed' | 'On Hold';
  createdAt?: string;
  updatedAt?: string;
}

export interface Goal {
  id?: string;
  userId: string;
  visionId: string;
  title: string;
  description: string;
  progress: number; // 0-100
  targetDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'In Progress' | 'Completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface Milestone {
  id?: string;
  userId: string;
  goalId: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id?: string;
  userId: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  startDate: string;
  dueDate: string;
  recurrence: 'Once' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  status: 'Pending' | 'In Progress' | 'Completed';
  isOverdue: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MyWord {
  id?: string;
  userId: string;
  commitment: string;
  committedDate: string;
  completionDeadline: string;
  recurrence: 'Once' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  status: 'Pending' | 'In Progress' | 'Completed';
  isOverdue: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Todo {
  id?: string;
  userId: string;
  text: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Reminder {
  id?: string;
  userId: string;
  title: string;
  description: string;
  reminderDate: string;
  reminderTime: string;
  notificationType: 'Email' | 'In-App' | 'Both';
  status: 'Pending' | 'Sent' | 'Completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface DailyPlan {
  id?: string;
  userId: string;
  date: string;
  routine: string; // JSON string of hourly schedule
  waterIntake: number; // liters
  sadhanaMinutes: number;
  exerciseMinutes: number;
  exerciseType: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HealthTracker {
  id?: string;
  userId: string;
  date: string;
  weight?: number; // kg
  bloodPressure?: string; // "120/80"
  sleepHours?: number;
  mood: 'Great' | 'Good' | 'Okay' | 'Poor'; // 1-4 scale
  energyLevel: number; // 1-10
  hydration: number; // cups of water
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============ API FUNCTIONS ============

// VISION API
export const visionAPI = {
  getAll: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/sadhaka/visions`, {
        headers: { userId }
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching visions:', error);
      return [];
    }
  },

  create: async (data: Vision) => {
    try {
      const response = await axios.post(`${API_URL}/sadhaka/visions`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating vision:', error);
      throw new Error(error.response?.data?.message || 'Failed to create vision');
    }
  },

  update: async (id: string, data: Partial<Vision>) => {
    try {
      const response = await axios.put(`${API_URL}/sadhaka/visions/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating vision:', error);
      throw new Error(error.response?.data?.message || 'Failed to update vision');
    }
  },

  delete: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/sadhaka/visions/${id}`);
      return true;
    } catch (error: any) {
      console.error('Error deleting vision:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete vision');
    }
  }
};

// GOALS API
export const goalAPI = {
  getAll: async (userId: string, visionId?: string) => {
    try {
      const url = visionId 
        ? `${API_URL}/sadhaka/goals?visionId=${visionId}`
        : `${API_URL}/sadhaka/goals`;
      const response = await axios.get(url, { headers: { userId } });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching goals:', error);
      return [];
    }
  },

  create: async (data: Goal) => {
    try {
      const response = await axios.post(`${API_URL}/sadhaka/goals`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating goal:', error);
      throw new Error(error.response?.data?.message || 'Failed to create goal');
    }
  },

  update: async (id: string, data: Partial<Goal>) => {
    try {
      const response = await axios.put(`${API_URL}/sadhaka/goals/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating goal:', error);
      throw new Error(error.response?.data?.message || 'Failed to update goal');
    }
  },

  delete: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/sadhaka/goals/${id}`);
      return true;
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete goal');
    }
  }
};

// MILESTONES API
export const milestoneAPI = {
  getAll: async (userId: string, goalId?: string) => {
    try {
      const url = goalId 
        ? `${API_URL}/sadhaka/milestones?goalId=${goalId}`
        : `${API_URL}/sadhaka/milestones`;
      const response = await axios.get(url, { headers: { userId } });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching milestones:', error);
      return [];
    }
  },

  create: async (data: Milestone) => {
    try {
      const response = await axios.post(`${API_URL}/sadhaka/milestones`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating milestone:', error);
      throw new Error(error.response?.data?.message || 'Failed to create milestone');
    }
  },

  update: async (id: string, data: Partial<Milestone>) => {
    try {
      const response = await axios.put(`${API_URL}/sadhaka/milestones/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating milestone:', error);
      throw new Error(error.response?.data?.message || 'Failed to update milestone');
    }
  },

  delete: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/sadhaka/milestones/${id}`);
      return true;
    } catch (error: any) {
      console.error('Error deleting milestone:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete milestone');
    }
  }
};

// TASKS API
export const taskAPI = {
  getAll: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/sadhaka/tasks`, { headers: { userId } });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  getTodaysTasks: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/sadhaka/tasks/today`, { headers: { userId } });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching today tasks:', error);
      return [];
    }
  },

  getOverdueTasks: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/sadhaka/tasks/overdue`, { headers: { userId } });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching overdue tasks:', error);
      return [];
    }
  },

  create: async (data: Task) => {
    try {
      const response = await axios.post(`${API_URL}/sadhaka/tasks`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating task:', error);
      throw new Error(error.response?.data?.message || 'Failed to create task');
    }
  },

  update: async (id: string, data: Partial<Task>) => {
    try {
      const response = await axios.put(`${API_URL}/sadhaka/tasks/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating task:', error);
      throw new Error(error.response?.data?.message || 'Failed to update task');
    }
  },

  delete: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/sadhaka/tasks/${id}`);
      return true;
    } catch (error: any) {
      console.error('Error deleting task:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete task');
    }
  }
};

// MY WORD API (Commitments)
export const myWordAPI = {
  getAll: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/sadhaka/my-word`, { headers: { userId } });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching commitments:', error);
      return [];
    }
  },

  getOverdueCommitments: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/sadhaka/my-word/overdue`, { headers: { userId } });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching overdue commitments:', error);
      return [];
    }
  },

  create: async (data: MyWord) => {
    try {
      const response = await axios.post(`${API_URL}/sadhaka/my-word`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating commitment:', error);
      throw new Error(error.response?.data?.message || 'Failed to create commitment');
    }
  },

  update: async (id: string, data: Partial<MyWord>) => {
    try {
      const response = await axios.put(`${API_URL}/sadhaka/my-word/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating commitment:', error);
      throw new Error(error.response?.data?.message || 'Failed to update commitment');
    }
  },

  delete: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/sadhaka/my-word/${id}`);
      return true;
    } catch (error: any) {
      console.error('Error deleting commitment:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete commitment');
    }
  }
};

// TODOS API
export const todoAPI = {
  getAll: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/sadhaka/todos`, { headers: { userId } });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching todos:', error);
      return [];
    }
  },

  create: async (data: Todo) => {
    try {
      const response = await axios.post(`${API_URL}/sadhaka/todos`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating todo:', error);
      throw new Error(error.response?.data?.message || 'Failed to create todo');
    }
  },

  update: async (id: string, data: Partial<Todo>) => {
    try {
      const response = await axios.put(`${API_URL}/sadhaka/todos/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating todo:', error);
      throw new Error(error.response?.data?.message || 'Failed to update todo');
    }
  },

  delete: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/sadhaka/todos/${id}`);
      return true;
    } catch (error: any) {
      console.error('Error deleting todo:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete todo');
    }
  }
};

// REMINDERS API
export const reminderAPI = {
  getAll: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/sadhaka/reminders`, { headers: { userId } });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching reminders:', error);
      return [];
    }
  },

  getUpcoming: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/sadhaka/reminders/upcoming`, { headers: { userId } });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching upcoming reminders:', error);
      return [];
    }
  },

  create: async (data: Reminder) => {
    try {
      const response = await axios.post(`${API_URL}/sadhaka/reminders`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating reminder:', error);
      throw new Error(error.response?.data?.message || 'Failed to create reminder');
    }
  },

  update: async (id: string, data: Partial<Reminder>) => {
    try {
      const response = await axios.put(`${API_URL}/sadhaka/reminders/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating reminder:', error);
      throw new Error(error.response?.data?.message || 'Failed to update reminder');
    }
  },

  delete: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/sadhaka/reminders/${id}`);
      return true;
    } catch (error: any) {
      console.error('Error deleting reminder:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete reminder');
    }
  }
};

// DAILY PLAN API
export const dailyPlanAPI = {
  getByDate: async (userId: string, date: string) => {
    try {
      const response = await axios.get(`${API_URL}/sadhaka/daily-plan/${date}`, { headers: { userId } });
      return response.data;
    } catch (error) {
      console.error('Error fetching daily plan:', error);
      return null;
    }
  },

  create: async (data: DailyPlan) => {
    try {
      const response = await axios.post(`${API_URL}/sadhaka/daily-plan`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating daily plan:', error);
      throw new Error(error.response?.data?.message || 'Failed to create daily plan');
    }
  },

  update: async (id: string, data: Partial<DailyPlan>) => {
    try {
      const response = await axios.put(`${API_URL}/sadhaka/daily-plan/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating daily plan:', error);
      throw new Error(error.response?.data?.message || 'Failed to update daily plan');
    }
  }
};

// HEALTH TRACKER API
export const healthTrackerAPI = {
  getByDate: async (userId: string, date: string) => {
    try {
      const response = await axios.get(`${API_URL}/sadhaka/health-tracker/${date}`, { headers: { userId } });
      return response.data;
    } catch (error) {
      console.error('Error fetching health data:', error);
      return null;
    }
  },

  getRange: async (userId: string, startDate: string, endDate: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/sadhaka/health-tracker/range?start=${startDate}&end=${endDate}`,
        { headers: { userId } }
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching health range:', error);
      return [];
    }
  },

  create: async (data: HealthTracker) => {
    try {
      const response = await axios.post(`${API_URL}/sadhaka/health-tracker`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating health record:', error);
      throw new Error(error.response?.data?.message || 'Failed to create health record');
    }
  },

  update: async (id: string, data: Partial<HealthTracker>) => {
    try {
      const response = await axios.put(`${API_URL}/sadhaka/health-tracker/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating health record:', error);
      throw new Error(error.response?.data?.message || 'Failed to update health record');
    }
  }
};

// ============ UTILITY FUNCTIONS ============

export const isOverdue = (dueDate: string): boolean => {
  return new Date(dueDate) < new Date();
};

export const daysUntilDue = (dueDate: string): number => {
  const due = new Date(dueDate);
  const today = new Date();
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
