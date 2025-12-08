import axios from 'axios';

interface ContactMessage {
  id?: string;
  contactId?: string;
  _id?: string;
  name: string;
  email: string;
  whatsapp?: string;
  countryCode?: string;
  subject: string;
  message: string;
  submittedAt?: string;
  status?: 'unread' | 'read' | 'replied' | 'closed';
  priority?: 'low' | 'medium' | 'high';
  replyMessage?: string;
  assignedTo?: string;
  ipAddress?: string;
  userAgent?: string;
  repliedAt?: string;
  metadata?: {
    device?: string;
    browser?: string;
    location?: string;
    tags?: string[];
  };
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Contact API methods
export const contactAPI = {
  // Get all messages (with filtering and pagination)
  getAll: async (status?: string, priority?: string, limit = 100, skip = 0): Promise<ContactMessage[]> => {
    try {
      const params: any = { limit, skip };
      if (status) params.status = status;
      if (priority) params.priority = priority;

      const response = await axiosInstance.get('/contact/messages', { params });
      
      if (response.data.success) {
        return response.data.data || [];
      }
      return [];
    } catch (error) {
      console.error('❌ Error fetching contact messages:', error);
      // Fallback to localStorage
      return getLocalMessages();
    }
  },

  // Get a single message
  getOne: async (id: string): Promise<ContactMessage | null> => {
    try {
      const response = await axiosInstance.get(`/contact/messages/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('❌ Error fetching message:', error);
      return null;
    }
  },

  // Add a new message
  addMessage: async (messageData: Omit<ContactMessage, 'id' | 'contactId' | '_id' | 'submittedAt' | 'status' | 'priority'>): Promise<ContactMessage | null> => {
    try {
      const response = await axiosInstance.post('/contact/messages', messageData);
      
      if (response.data.success) {
        // Also save to localStorage for fallback
        const message: ContactMessage = {
          ...messageData,
          id: response.data.data.contactId,
          contactId: response.data.data.contactId,
          submittedAt: response.data.data.submittedAt,
          status: 'unread',
          priority: 'medium'
        };
        saveLocalMessage(message);
        return message;
      }
      return null;
    } catch (error) {
      console.error('❌ Error sending contact message:', error);
      // Save to localStorage as fallback
      const message: ContactMessage = {
        ...messageData,
        id: Date.now().toString(),
        submittedAt: new Date().toISOString(),
        status: 'unread',
        priority: 'medium'
      };
      saveLocalMessage(message);
      return message;
    }
  },

  // Update a message
  update: async (id: string, updates: Partial<ContactMessage>): Promise<ContactMessage | null> => {
    try {
      const response = await axiosInstance.put(`/contact/messages/${id}`, updates);
      
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('❌ Error updating contact message:', error);
      return null;
    }
  },

  // Delete a message
  delete: async (id: string): Promise<boolean> => {
    try {
      const response = await axiosInstance.delete(`/contact/messages/${id}`);
      
      if (response.data.success) {
        deleteLocalMessage(id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error deleting contact message:', error);
      return false;
    }
  },

  // Get statistics
  getStats: async () => {
    try {
      const response = await axiosInstance.get('/contact/stats/overview');
      
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('❌ Error fetching contact statistics:', error);
      return null;
    }
  }
};

// ===== LOCAL STORAGE FALLBACK =====
const getLocalMessages = (): ContactMessage[] => {
  try {
    const messages = localStorage.getItem('contact_messages');
    return messages ? JSON.parse(messages) : [];
  } catch (error) {
    console.error('Error getting local contact messages:', error);
    return [];
  }
};

const saveLocalMessage = (message: ContactMessage) => {
  try {
    const messages = getLocalMessages();
    messages.push(message);
    localStorage.setItem('contact_messages', JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving local contact message:', error);
  }
};

const deleteLocalMessage = (id: string) => {
  try {
    const messages = getLocalMessages();
    const filtered = messages.filter(m => m.id?.toString() !== id && m.contactId?.toString() !== id);
    localStorage.setItem('contact_messages', JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting local contact message:', error);
  }
};

export default contactAPI;
