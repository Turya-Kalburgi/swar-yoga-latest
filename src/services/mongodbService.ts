import axios from 'axios';

// Using window location as fallback for development
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ==================== VISION SERVICE ====================
export const visionService = {
  getAll: (userId) => axiosInstance.get(`/visions/${userId}`),
  getOne: (id) => axiosInstance.get(`/visions/single/${id}`),
  create: (data) => axiosInstance.post('/visions', data),
  update: (id, data) => axiosInstance.put(`/visions/${id}`, data),
  delete: (id) => axiosInstance.delete(`/visions/${id}`)
};

// ==================== GOAL SERVICE ====================
export const goalService = {
  getAll: (userId) => axiosInstance.get(`/goals/${userId}`),
  getOne: (id) => axiosInstance.get(`/goals/single/${id}`),
  create: (data) => axiosInstance.post('/goals', data),
  update: (id, data) => axiosInstance.put(`/goals/${id}`, data),
  delete: (id) => axiosInstance.delete(`/goals/${id}`)
};

// ==================== TASK SERVICE ====================
export const taskService = {
  getAll: (userId) => axiosInstance.get(`/tasks/${userId}`),
  getOne: (id) => axiosInstance.get(`/tasks/single/${id}`),
  create: (data) => axiosInstance.post('/tasks', data),
  update: (id, data) => axiosInstance.put(`/tasks/${id}`, data),
  delete: (id) => axiosInstance.delete(`/tasks/${id}`)
};

// ==================== TODO SERVICE ====================
export const todoService = {
  getAll: (userId) => axiosInstance.get(`/todos/${userId}`),
  getOne: (id) => axiosInstance.get(`/todos/single/${id}`),
  create: (data) => axiosInstance.post('/todos', data),
  update: (id, data) => axiosInstance.put(`/todos/${id}`, data),
  delete: (id) => axiosInstance.delete(`/todos/${id}`)
};

// ==================== MYWORD SERVICE ====================
export const mywordService = {
  getAll: (userId) => axiosInstance.get(`/mywords/${userId}`),
  getOne: (id) => axiosInstance.get(`/mywords/single/${id}`),
  create: (data) => axiosInstance.post('/mywords', data),
  update: (id, data) => axiosInstance.put(`/mywords/${id}`, data),
  delete: (id) => axiosInstance.delete(`/mywords/${id}`)
};

// ==================== HEALTH TRACKER SERVICE ====================
export const healthService = {
  getByDate: (userId, date) => axiosInstance.get(`/health/${userId}/${date}`),
  getAll: (userId) => axiosInstance.get(`/health/${userId}`),
  create: (data) => axiosInstance.post('/health', data),
  update: (id, data) => axiosInstance.put(`/health/${id}`, data),
  delete: (id) => axiosInstance.delete(`/health/${id}`)
};

// ==================== BATCH OPERATIONS ====================
export const batchService = {
  getAllData: async (userId) => {
    try {
      const responses = await Promise.allSettled([
        visionService.getAll(userId),
        goalService.getAll(userId),
        taskService.getAll(userId),
        todoService.getAll(userId),
        mywordService.getAll(userId),
        healthService.getAll(userId)
      ]);

      return {
        visions: responses[0].status === 'fulfilled' ? responses[0].value.data : [],
        goals: responses[1].status === 'fulfilled' ? responses[1].value.data : [],
        tasks: responses[2].status === 'fulfilled' ? responses[2].value.data : [],
        todos: responses[3].status === 'fulfilled' ? responses[3].value.data : [],
        mywords: responses[4].status === 'fulfilled' ? responses[4].value.data : [],
        health: responses[5].status === 'fulfilled' ? responses[5].value.data : []
      };
    } catch (error) {
      console.error('Error fetching batch data:', error);
      throw error;
    }
  }
};

export default {
  visionService,
  goalService,
  taskService,
  todoService,
  mywordService,
  healthService,
  batchService
};
