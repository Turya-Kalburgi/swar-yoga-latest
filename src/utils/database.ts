import axios from 'axios';

const API_BASE_URL = 'https://swar-yoga-dec.onrender.com/api';

// Get current user ID from localStorage
function getCurrentUserId(): string | null {
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

// Empty mock data for development when API is not available
const mockData = {
  visions: [],
  goals: [],
  tasks: [],
  todos: [],
  people: [],
  affirmations: []
};

// Server availability cache: avoid repeated failing network requests
let serverAvailable: boolean | null = null;
let lastChecked = 0;
const SERVER_CHECK_TTL = 10_000; // ms

async function checkServerAvailable() {
  const now = Date.now();
  if (serverAvailable !== null && now - lastChecked < SERVER_CHECK_TTL) return serverAvailable;
  lastChecked = now;
  try {
    const res = await apiClient.get('/health');
    serverAvailable = !!(res && res.data && res.data.ok);
  } catch (err) {
    serverAvailable = false;
  }
  return serverAvailable;
}

// Generic helper: try server request first, on failure fall back to mockFn
async function tryServer<T>(serverFn: () => Promise<T>, mockFn: () => T | Promise<T>): Promise<T> {
  const available = await checkServerAvailable();
  if (available) {
    try {
      return await serverFn();
    } catch (err) {
      console.warn('Server request failed, falling back to mock:', err?.message || err);
      // allow fallback
    }
  }
  // fallback
  return await mockFn();
}

// Vision API
export const visionAPI = {
  getAll: async (year?: number) => {
    return tryServer(
      async () => {
        const params = year ? { year } : {};
        const response = await apiClient.get('/visions', { params });
        return response.data;
      },
      () => mockData.visions.filter(v => !year || v.year === year)
    );
  },
  
  create: async (visionData: any) => {
    return tryServer(
      async () => {
        const response = await apiClient.post('/visions', visionData);
        return response.data;
      },
      () => {
        console.warn('Using mock vision creation due to API error');
        const newVision = { ...visionData, id: mockData.visions.length + 1 };
        mockData.visions.push(newVision);
        return newVision;
      }
    );
  },
  
  update: async (id: number, visionData: any) => {
    return tryServer(
      async () => {
        const response = await apiClient.put(`/visions/${id}`, visionData);
        return response.data;
      },
      () => {
        console.warn('Using mock vision update due to API error');
        const index = mockData.visions.findIndex(v => v.id === id);
        if (index !== -1) {
          mockData.visions[index] = { ...mockData.visions[index], ...visionData };
          return mockData.visions[index];
        }
        throw new Error('Vision not found');
      }
    );
  },
  
  delete: async (id: number) => {
    return tryServer(
      async () => {
        const response = await apiClient.delete(`/visions/${id}`);
        return response.data;
      },
      () => {
        console.warn('Using mock vision deletion due to API error');
        mockData.visions = mockData.visions.filter(v => v.id !== id);
        return { success: true };
      }
    );
  }
};

// Goals API
export const goalsAPI = {
  getAll: async (year?: number) => {
    return tryServer(
      async () => {
        const params = year ? { year } : {};
        const response = await apiClient.get('/goals', { params });
        return response.data;
      },
      () => mockData.goals.filter(g => !year || g.year === year)
    );
  },
  
  create: async (goalData: any) => {
    return tryServer(
      async () => {
        const response = await apiClient.post('/goals', goalData);
        return response.data;
      },
      () => {
        console.warn('Using mock goal creation due to API error');
        const newGoal = { ...goalData, id: mockData.goals.length + 1 };
        mockData.goals.push(newGoal);
        return newGoal;
      }
    );
  },
  
  update: async (id: number, goalData: any) => {
    return tryServer(
      async () => {
        const response = await apiClient.put(`/goals/${id}`, goalData);
        return response.data;
      },
      () => {
        console.warn('Using mock goal update due to API error');
        const index = mockData.goals.findIndex(g => g.id === id);
        if (index !== -1) {
          mockData.goals[index] = { ...mockData.goals[index], ...goalData };
          return mockData.goals[index];
        }
        throw new Error('Goal not found');
      }
    );
  },
  
  delete: async (id: number) => {
    return tryServer(
      async () => {
        const response = await apiClient.delete(`/goals/${id}`);
        return response.data;
      },
      () => {
        console.warn('Using mock goal deletion due to API error');
        mockData.goals = mockData.goals.filter(g => g.id !== id);
        return { success: true };
      }
    );
  }
};

// Tasks API
export const tasksAPI = {
  getAll: async (year?: number) => {
    return tryServer(
      async () => {
        const params = year ? { year } : {};
        const response = await apiClient.get('/tasks', { params });
        return response.data;
      },
      () => mockData.tasks.filter(t => !year || t.year === year)
    );
  },
  
  create: async (taskData: any) => {
    return tryServer(
      async () => {
        const response = await apiClient.post('/tasks', taskData);
        return response.data;
      },
      () => {
        console.warn('Using mock task creation due to API error');
        const newTask = { ...taskData, id: mockData.tasks.length + 1 };
        mockData.tasks.push(newTask);
        return newTask;
      }
    );
  },
  
  update: async (id: number, taskData: any) => {
    return tryServer(
      async () => {
        const response = await apiClient.put(`/tasks/${id}`, taskData);
        return response.data;
      },
      () => {
        console.warn('Using mock task update due to API error');
        const index = mockData.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
          mockData.tasks[index] = { ...mockData.tasks[index], ...taskData };
          return mockData.tasks[index];
        }
        throw new Error('Task not found');
      }
    );
  },
  
  delete: async (id: number) => {
    return tryServer(
      async () => {
        const response = await apiClient.delete(`/tasks/${id}`);
        return response.data;
      },
      () => {
        console.warn('Using mock task deletion due to API error');
        mockData.tasks = mockData.tasks.filter(t => t.id !== id);
        return { success: true };
      }
    );
  }
};

// Todos API
export const todosAPI = {
  getAll: async (year?: number) => {
    return tryServer(
      async () => {
        const params = year ? { year } : {};
        const response = await apiClient.get('/todos', { params });
        return response.data;
      },
      () => mockData.todos.filter(t => !year || t.year === year)
    );
  },
  
  create: async (todoData: any) => {
    return tryServer(
      async () => {
        const response = await apiClient.post('/todos', todoData);
        return response.data;
      },
      () => {
        console.warn('Using mock todo creation due to API error');
        const newTodo = { ...todoData, id: mockData.todos.length + 1 };
        mockData.todos.push(newTodo);
        return newTodo;
      }
    );
  },
  
  update: async (id: number, todoData: any) => {
    return tryServer(
      async () => {
        const response = await apiClient.put(`/todos/${id}`, todoData);
        return response.data;
      },
      () => {
        console.warn('Using mock todo update due to API error');
        const index = mockData.todos.findIndex(t => t.id === id);
        if (index !== -1) {
          mockData.todos[index] = { ...mockData.todos[index], ...todoData };
          return mockData.todos[index];
        }
        throw new Error('Todo not found');
      }
    );
  },
  
  delete: async (id: number) => {
    return tryServer(
      async () => {
        const response = await apiClient.delete(`/todos/${id}`);
        return response.data;
      },
      () => {
        console.warn('Using mock todo deletion due to API error');
        mockData.todos = mockData.todos.filter(t => t.id !== id);
        return { success: true };
      }
    );
  }
};

// Daily Words API
export const dailyWordsAPI = {
  getAll: async (date?: string) => {
    try {
      const params = date ? { date } : {};
      const response = await apiClient.get('/daily-words', { params });
      return response.data;
    } catch (error) {
      console.warn('Using mock daily words data due to API error');
      return [];
    }
  },
  
  create: async (wordData: any) => {
    try {
      const response = await apiClient.post('/daily-words', wordData);
      return response.data;
    } catch (error) {
      console.warn('Using mock daily word creation due to API error');
      return { ...wordData, id: Date.now() };
    }
  },
  
  update: async (id: number, wordData: any) => {
    try {
      const response = await apiClient.put(`/daily-words/${id}`, wordData);
      return response.data;
    } catch (error) {
      console.warn('Using mock daily word update due to API error');
      return { ...wordData, id };
    }
  },
  
  delete: async (id: number) => {
    try {
      const response = await apiClient.delete(`/daily-words/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Using mock daily word deletion due to API error');
      return { success: true };
    }
  }
};

// Affirmations API
export const affirmationsAPI = {
  getAll: async () => {
    return tryServer(
      async () => {
        const response = await apiClient.get('/affirmations');
        return response.data;
      },
      () => mockData.affirmations
    );
  },

  create: async (data: any) => {
    return tryServer(
      async () => {
        const response = await apiClient.post('/affirmations', data);
        return response.data;
      },
      () => {
        console.warn('Using mock affirmation create due to API error');
        const created = { ...data, id: Date.now() };
        mockData.affirmations.push(created);
        return created;
      }
    );
  },

  update: async (id: number, data: any) => {
    return tryServer(
      async () => {
        const response = await apiClient.put(`/affirmations/${id}`, data);
        return response.data;
      },
      () => {
        console.warn('Using mock affirmation update due to API error');
        const idx = mockData.affirmations.findIndex(a => a.id === id);
        if (idx !== -1) {
          mockData.affirmations[idx] = { ...mockData.affirmations[idx], ...data };
          return mockData.affirmations[idx];
        }
        throw new Error('Affirmation not found');
      }
    );
  },

  delete: async (id: number) => {
    return tryServer(
      async () => {
        const response = await apiClient.delete(`/affirmations/${id}`);
        return response.data;
      },
      () => {
        console.warn('Using mock affirmation delete due to API error');
        mockData.affirmations = mockData.affirmations.filter(a => a.id !== id);
        return { success: true };
      }
    );
  }
};

// Health API
export const healthAPI = {
  getAll: async (date?: string) => {
    try {
      const params = date ? { date } : {};
      const response = await apiClient.get('/health', { params });
      return response.data;
    } catch (error) {
      console.warn('Using mock health data due to API error');
      return [];
    }
  },

  create: async (healthData: any) => {
    try {
      const response = await apiClient.post('/health', healthData);
      return response.data;
    } catch (error) {
      console.warn('Using mock health creation due to API error');
      return { ...healthData, id: Date.now() };
    }
  },

  update: async (id: number, healthData: any) => {
    try {
      const response = await apiClient.put(`/health/${id}`, healthData);
      return response.data;
    } catch (error) {
      console.warn('Using mock health update due to API error');
      return { ...healthData, id };
    }
  },

  delete: async (id: number) => {
    try {
      const response = await apiClient.delete(`/health/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Using mock health deletion due to API error');
      return { success: true };
    }
  }
};

// People API
export const peopleAPI = {
  getAll: async () => {
    return tryServer(
      async () => {
        const response = await apiClient.get('/people');
        return response.data;
      },
      () => mockData.people
    );
  },

  create: async (personData: any) => {
    return tryServer(
      async () => {
        const response = await apiClient.post('/people', personData);
        return response.data;
      },
      () => {
        console.warn('Using mock people creation due to API error');
        const newPerson = { ...personData, id: Date.now() };
        mockData.people.push(newPerson);
        return newPerson;
      }
    );
  },

  update: async (id: number, personData: any) => {
    return tryServer(
      async () => {
        const response = await apiClient.put(`/people/${id}`, personData);
        return response.data;
      },
      () => {
        console.warn('Using mock people update due to API error');
        const index = mockData.people.findIndex(p => p.id === id);
        if (index !== -1) {
          mockData.people[index] = { ...mockData.people[index], ...personData };
          return mockData.people[index];
        }
        throw new Error('Person not found');
      }
    );
  },

  delete: async (id: number) => {
    return tryServer(
      async () => {
        const response = await apiClient.delete(`/people/${id}`);
        return response.data;
      },
      () => {
        console.warn('Using mock people deletion due to API error');
        mockData.people = mockData.people.filter(p => p.id !== id);
        return { success: true };
      }
    );
  }
};

// Test connection function
export const testConnection = async () => {
  try {
    const ok = await checkServerAvailable();
    if (ok) {
      console.log('✅ Server API available');
      return true;
    }
    console.log('⚠️ Server not available, falling back to mock data');
    return false;
  } catch (err) {
    console.error('❌ Database connection check failed:', err);
    return false;
  }
};

// Get connection status
export const getConnectionStatus = async () => {
  return await testConnection();
};