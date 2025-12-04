// Mock contact data API

interface ContactMessage {
  id: number | string;
  name: string;
  email: string;
  whatsapp: string;
  countryCode: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: 'unread' | 'read' | 'replied';
  priority: 'low' | 'medium' | 'high';
}

// Get messages from localStorage or initialize
const getMessages = (): ContactMessage[] => {
  try {
    const messages = localStorage.getItem('contact_messages');
    return messages ? JSON.parse(messages) : [];
  } catch (error) {
    console.error('Error getting contact messages:', error);
    return [];
  }
};

// Save messages to localStorage
const saveMessages = (messages: ContactMessage[]) => {
  localStorage.setItem('contact_messages', JSON.stringify(messages));
};

// Sample messages removed - using real data from localStorage only

// Initialize contact data if empty (no dummy data)
const initializeContactData = () => {
  const messages = getMessages();
  // Just return existing messages, don't add dummy data
  return Array.isArray(messages) ? messages : [];
};

// Contact API methods
export const contactAPI = {
  // Get all messages
  getAll: async (): Promise<ContactMessage[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const messages = initializeContactData();
        resolve(messages);
      }, 500);
    });
  },
  
  // Add a new message
  addMessage: async (messageData: Omit<ContactMessage, 'id' | 'submittedAt' | 'status' | 'priority'>): Promise<ContactMessage> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const messages = getMessages();
        
        const newMessage: ContactMessage = {
          ...messageData,
          id: Date.now(),
          submittedAt: new Date().toISOString(),
          status: 'unread',
          priority: 'medium'
        };
        
        messages.push(newMessage);
        saveMessages(messages);
        resolve(newMessage);
      }, 500);
    });
  },
  
  // Update a message
  update: async (id: number | string, updates: Partial<ContactMessage>): Promise<ContactMessage> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const messages = getMessages();
        const messageIndex = messages.findIndex(message => message.id.toString() === id.toString());
        
        if (messageIndex === -1) {
          reject(new Error('Message not found'));
          return;
        }
        
        messages[messageIndex] = { ...messages[messageIndex], ...updates };
        saveMessages(messages);
        resolve(messages[messageIndex]);
      }, 500);
    });
  },
  
  // Delete a message
  delete: async (id: number | string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const messages = getMessages();
        const updatedMessages = messages.filter(message => message.id.toString() !== id.toString());
        saveMessages(updatedMessages);
        resolve();
      }, 500);
    });
  },
  
  // Clear all messages (for testing)
  clearAll: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        saveMessages([]);
        resolve();
      }, 500);
    });
  }
};