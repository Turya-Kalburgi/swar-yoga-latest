import axios from 'axios';

const API_BASE_URL = 'https://swar-yoga-dec.onrender.com/api';

// Get current user ID from localStorage
export function getCurrentUserId(): string | null {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.id || null;
    }
  } catch (e) {
    console.warn('Could not retrieve user ID from localStorage', e);
  }
  return null;
}

// Create axios instance with timeout and retry logic
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add userId to all requests
apiClient.interceptors.request.use((config) => {
  const userId = getCurrentUserId();
  if (userId) {
    config.headers['X-User-ID'] = userId;
    // Also add to query params for GET requests
    if (config.method === 'get') {
      config.params = config.params || {};
      config.params.userId = userId;
    } else {
      // Add to body for POST/PUT requests
      if (typeof config.data === 'object' && config.data !== null) {
        config.data.userId = userId;
      }
    }
  }
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ⚠️ NO MOCK DATA - All data is persisted via backend API only
// Components must handle loading states and errors properly

// ===== VISION API =====
export const visionAPI = {
  getAll: async (year?: number) => {
    const params = year ? { year } : {};
    const response = await apiClient.get('/visions', { params });
    return response.data;
  },
  
  create: async (visionData: any) => {
    const response = await apiClient.post('/visions', visionData);
    return response.data;
  },
  
  update: async (id: number, visionData: any) => {
    const response = await apiClient.put(`/visions/${id}`, visionData);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await apiClient.delete(`/visions/${id}`);
    return response.data;
  }
};

// ===== GOALS API =====
export const goalsAPI = {
  getAll: async (year?: number) => {
    const params = year ? { year } : {};
    const response = await apiClient.get('/goals', { params });
    return response.data;
  },
  
  create: async (goalData: any) => {
    const response = await apiClient.post('/goals', goalData);
    return response.data;
  },
  
  update: async (id: number, goalData: any) => {
    const response = await apiClient.put(`/goals/${id}`, goalData);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await apiClient.delete(`/goals/${id}`);
    return response.data;
  }
};

// ===== TASKS API =====
export const tasksAPI = {
  getAll: async (year?: number) => {
    const params = year ? { year } : {};
    const response = await apiClient.get('/tasks', { params });
    return response.data;
  },
  
  create: async (taskData: any) => {
    const response = await apiClient.post('/tasks', taskData);
    return response.data;
  },
  
  update: async (id: number, taskData: any) => {
    const response = await apiClient.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  }
};

// ===== TODOS API =====
export const todosAPI = {
  getAll: async (year?: number) => {
    const params = year ? { year } : {};
    const response = await apiClient.get('/todos', { params });
    return response.data;
  },
  
  create: async (todoData: any) => {
    const response = await apiClient.post('/todos', todoData);
    return response.data;
  },
  
  update: async (id: number, todoData: any) => {
    const response = await apiClient.put(`/todos/${id}`, todoData);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await apiClient.delete(`/todos/${id}`);
    return response.data;
  }
};

// ===== DAILY WORDS API =====
export const dailyWordsAPI = {
  getAll: async (date?: string) => {
    const params = date ? { date } : {};
    const response = await apiClient.get('/daily-words', { params });
    return response.data;
  },
  
  create: async (wordData: any) => {
    const response = await apiClient.post('/daily-words', wordData);
    return response.data;
  },
  
  update: async (id: number, wordData: any) => {
    const response = await apiClient.put(`/daily-words/${id}`, wordData);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await apiClient.delete(`/daily-words/${id}`);
    return response.data;
  }
};

// ===== AFFIRMATIONS API =====
export const affirmationsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/affirmations');
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/affirmations', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await apiClient.put(`/affirmations/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/affirmations/${id}`);
    return response.data;
  }
};

// ===== HEALTH API =====
export const healthAPI = {
  getAll: async (date?: string) => {
    const params = date ? { date } : {};
    const response = await apiClient.get('/health', { params });
    return response.data;
  },

  create: async (healthData: any) => {
    const response = await apiClient.post('/health', healthData);
    return response.data;
  },

  update: async (id: number, healthData: any) => {
    const response = await apiClient.put(`/health/${id}`, healthData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/health/${id}`);
    return response.data;
  }
};

// ===== PEOPLE API (DIAMOND PEOPLE) =====
export const peopleAPI = {
  getAll: async () => {
    const response = await apiClient.get('/people');
    return response.data;
  },

  create: async (personData: any) => {
    const response = await apiClient.post('/people', personData);
    return response.data;
  },

  update: async (id: number, personData: any) => {
    const response = await apiClient.put(`/people/${id}`, personData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/people/${id}`);
    return response.data;
  }
};

// ===== TEST CONNECTION =====
export const testConnection = async () => {
  try {
    const response = await apiClient.get('/health');
    console.log('✅ Backend API available');
    return true;
  } catch (err) {
    console.error('❌ Backend API unavailable:', err?.message);
    return false;
  }
};

// ===== PAGE STATE PERSISTENCE =====
// Save current page/route so on refresh, users return to the same page

export const pageStateAPI = {
  // Save current page state
  savePage: async (pageName: string, pageData?: any) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        console.warn('No userId for page state persistence');
        return null;
      }

      const pageState = {
        userId,
        pageName,
        pageData: pageData || {},
        timestamp: new Date().toISOString(),
        lastVisited: new Date().toISOString(),
      };

      // Save to localStorage first (instant)
      localStorage.setItem(`page-state-${userId}`, JSON.stringify(pageState));

      // Save to server (async, non-blocking)
      try {
        await apiClient.post('/page-state', pageState);
      } catch (err) {
        console.warn('Could not save page state to server:', err?.message);
        // Fallback to localStorage is already done
      }

      return pageState;
    } catch (err) {
      console.error('Error saving page state:', err);
      return null;
    }
  },

  // Get last visited page
  getLastPage: async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        console.warn('No userId for page state retrieval');
        return null;
      }

      // Check localStorage first (instant)
      const localPageState = localStorage.getItem(`page-state-${userId}`);
      if (localPageState) {
        return JSON.parse(localPageState);
      }

      // Fallback to server
      try {
        const response = await apiClient.get('/page-state', {
          params: { userId },
        });
        
        if (response.data && response.data.pageName) {
          // Cache in localStorage
          localStorage.setItem(`page-state-${userId}`, JSON.stringify(response.data));
          return response.data;
        }
      } catch (err) {
        console.warn('Could not get page state from server:', err?.message);
      }

      return null;
    } catch (err) {
      console.error('Error getting page state:', err);
      return null;
    }
  },

  // Clear page state (on logout)
  clearPage: async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) return;

      // Clear localStorage
      localStorage.removeItem(`page-state-${userId}`);

      // Clear from server
      try {
        await apiClient.delete('/page-state', {
          params: { userId },
        });
      } catch (err) {
        console.warn('Could not delete page state from server:', err?.message);
      }
    } catch (err) {
      console.error('Error clearing page state:', err);
    }
  },
};