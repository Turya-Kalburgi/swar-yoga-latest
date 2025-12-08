// Accounting data API

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
}

interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  budget?: number;
}

// Get transactions from localStorage or initialize
const getTransactions = (): Transaction[] => {
  try {
    const transactions = localStorage.getItem('accounting_transactions');
    return transactions ? JSON.parse(transactions) : [];
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};

// Save transactions to localStorage
const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem('accounting_transactions', JSON.stringify(transactions));
};

// Get categories from localStorage or initialize
const getCategories = (): Category[] => {
  try {
    const categories = localStorage.getItem('accounting_categories');
    return categories ? JSON.parse(categories) : [];
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

// Save categories to localStorage
const saveCategories = (categories: Category[]) => {
  localStorage.setItem('accounting_categories', JSON.stringify(categories));
};

// Generate sample transactions for demo
const generateSampleTransactions = (): Transaction[] => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  return [
    {
      id: 1,
      date: today.toISOString().split('T')[0],
      description: 'Workshop registration fees',
      amount: 15000,
      type: 'income',
      category: 'Workshop Income',
      paymentMethod: 'bank_transfer',
      status: 'completed'
    },
    {
      id: 2,
      date: yesterday.toISOString().split('T')[0],
      description: 'Office rent payment',
      amount: 25000,
      type: 'expense',
      category: 'Rent',
      paymentMethod: 'bank_transfer',
      status: 'completed'
    },
    {
      id: 3,
      date: lastWeek.toISOString().split('T')[0],
      description: 'Yoga equipment purchase',
      amount: 8500,
      type: 'expense',
      category: 'Equipment',
      paymentMethod: 'credit_card',
      status: 'completed'
    },
    {
      id: 4,
      date: lastWeek.toISOString().split('T')[0],
      description: 'Private yoga session',
      amount: 3000,
      type: 'income',
      category: 'Private Sessions',
      paymentMethod: 'cash',
      status: 'completed'
    },
    {
      id: 5,
      date: lastMonth.toISOString().split('T')[0],
      description: 'Resort booking payment',
      amount: 45000,
      type: 'income',
      category: 'Resort Income',
      paymentMethod: 'bank_transfer',
      status: 'completed'
    }
  ];
};

// Generate sample categories for demo
const generateSampleCategories = (): Category[] => {
  return [
    {
      id: 1,
      name: 'Workshop Income',
      type: 'income'
    },
    {
      id: 2,
      name: 'Private Sessions',
      type: 'income'
    },
    {
      id: 3,
      name: 'Resort Income',
      type: 'income'
    },
    {
      id: 4,
      name: 'Rent',
      type: 'expense',
      budget: 30000
    },
    {
      id: 5,
      name: 'Equipment',
      type: 'expense',
      budget: 10000
    },
    {
      id: 6,
      name: 'Utilities',
      type: 'expense',
      budget: 5000
    }
  ];
};

// Initialize accounting data if empty
const initializeAccountingData = () => {
  const transactions = getTransactions();
  if (transactions.length === 0) {
    const sampleTransactions = generateSampleTransactions();
    saveTransactions(sampleTransactions);
  }
  
  const categories = getCategories();
  if (categories.length === 0) {
    const sampleCategories = generateSampleCategories();
    saveCategories(sampleCategories);
  }
};

// Accounting API methods
export const accountingAPI = {
  // Get all transactions
  getTransactions: async (): Promise<Transaction[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        initializeAccountingData();
        const transactions = getTransactions();
        resolve(transactions);
      }, 500);
    });
  },
  
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        initializeAccountingData();
        const categories = getCategories();
        resolve(categories);
      }, 500);
    });
  },
  
  // Add a new transaction
  addTransaction: async (transactionData: Omit<Transaction, 'id'>): Promise<Transaction> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transactions = getTransactions();
        
        const newTransaction: Transaction = {
          ...transactionData,
          id: Date.now()
        };
        
        transactions.push(newTransaction);
        saveTransactions(transactions);
        resolve(newTransaction);
      }, 500);
    });
  },
  
  // Update a transaction
  updateTransaction: async (id: number, updates: Partial<Omit<Transaction, 'id'>>): Promise<Transaction> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const transactions = getTransactions();
        const transactionIndex = transactions.findIndex(t => t.id === id);
        
        if (transactionIndex === -1) {
          reject(new Error('Transaction not found'));
          return;
        }
        
        transactions[transactionIndex] = { ...transactions[transactionIndex], ...updates };
        saveTransactions(transactions);
        resolve(transactions[transactionIndex]);
      }, 500);
    });
  },
  
  // Delete a transaction
  deleteTransaction: async (id: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transactions = getTransactions();
        const updatedTransactions = transactions.filter(t => t.id !== id);
        saveTransactions(updatedTransactions);
        resolve();
      }, 500);
    });
  },
  
  // Add a new category
  addCategory: async (categoryData: Omit<Category, 'id'>): Promise<Category> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categories = getCategories();
        
        const newCategory: Category = {
          ...categoryData,
          id: Date.now()
        };
        
        categories.push(newCategory);
        saveCategories(categories);
        resolve(newCategory);
      }, 500);
    });
  },
  
  // Update a category
  updateCategory: async (id: number, updates: Partial<Omit<Category, 'id'>>): Promise<Category> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const categories = getCategories();
        const categoryIndex = categories.findIndex(c => c.id === id);
        
        if (categoryIndex === -1) {
          reject(new Error('Category not found'));
          return;
        }
        
        categories[categoryIndex] = { ...categories[categoryIndex], ...updates };
        saveCategories(categories);
        resolve(categories[categoryIndex]);
      }, 500);
    });
  },
  
  // Delete a category
  deleteCategory: async (id: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categories = getCategories();
        const updatedCategories = categories.filter(c => c.id !== id);
        saveCategories(updatedCategories);
        resolve();
      }, 500);
    });
  },
  
  // Generate sample data (for testing)
  generateSampleData: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sampleTransactions = generateSampleTransactions();
        const sampleCategories = generateSampleCategories();
        
        saveTransactions(sampleTransactions);
        saveCategories(sampleCategories);
        
        resolve();
      }, 500);
    });
  },
  
  // Clear all data (for testing)
  clearAllData: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        saveTransactions([]);
        saveCategories([]);
        resolve();
      }, 500);
    });
  }
};