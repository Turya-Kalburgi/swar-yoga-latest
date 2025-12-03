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

// Generate sample messages for demo
const generateSampleMessages = (): ContactMessage[] => {
  return [
    {
      id: 1,
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      whatsapp: '9876543210',
      countryCode: '+91',
      subject: 'Workshop Inquiry',
      message: 'I am interested in the upcoming Swar Yoga Master Class. Could you please provide more details about the curriculum and prerequisites?',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      status: 'unread',
      priority: 'medium'
    },
    {
      id: 2,
      name: 'Rahul Verma',
      email: 'rahul.verma@outlook.com',
      whatsapp: '8765432109',
      countryCode: '+91',
      subject: 'Resort Booking',
      message: 'I would like to book accommodation at your resort for a family of 4 from June 15-20, 2025. Do you have availability during this period?',
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      status: 'read',
      priority: 'high'
    },
    {
      id: 3,
      name: 'Ananya Patel',
      email: 'ananya.patel@yahoo.com',
      whatsapp: '7654321098',
      countryCode: '+91',
      subject: 'Feedback',
      message: 'I recently attended your 90 Days Weight Loss Program and wanted to share my positive experience. The program was well-structured and the instructors were very knowledgeable.',
      submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      status: 'replied',
      priority: 'low'
    }
  ];
};

// Initialize contact data if empty
const initializeContactData = () => {
  const messages = getMessages();
  if (messages.length === 0) {
    const sampleMessages = generateSampleMessages();
    saveMessages(sampleMessages);
    return sampleMessages;
  }
  return messages;
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