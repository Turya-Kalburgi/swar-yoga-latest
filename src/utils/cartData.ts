// Mock cart data API

export interface CartItem {
  id: number;
  userId: string | number;
  userName: string;
  userEmail: string;
  workshopId: number;
  workshopTitle: string;
  instructor: string;
  startDate: string;
  endDate: string;
  duration: string;
  startTime: string;
  endTime: string;
  mode: string;
  location: string;
  image: string;
  priceINR: number;
  priceNPR: number;
  priceUSD: number;
  quantity: number;
  currency: string;
  addedAt: string;
  status: 'active' | 'abandoned' | 'purchased';
  paymentLinkINR?: string;
  paymentLinkNPR?: string;
  paymentLinkUSD?: string;
  whatsappGroupLink?: string;
}

// Get cart items from localStorage or initialize
const getCartItems = (): CartItem[] => {
  try {
    const items = localStorage.getItem('cart_items');
    return items ? (JSON.parse(items) as CartItem[]) : [];
  } catch (error) {
    console.error('Error getting cart items:', error);
    return [];
  }
};

// Save cart items to localStorage
const saveCartItems = (items: CartItem[]) => {
  localStorage.setItem('cart_items', JSON.stringify(items));
};

// Generate sample cart items for demo
const generateSampleCartItems = (): CartItem[] => {
  return []; // No sample data - only real user data
};

// Initialize cart data if empty
const initializeCartData = () => {
  const items = getCartItems();
  if (items.length === 0) {
    const sampleItems = generateSampleCartItems();
    saveCartItems(sampleItems);
    return sampleItems;
  }
  return items;
};

// Cart API methods
export const cartAPI = {
  // Get all cart items (for admin)
  getAllItems: async (): Promise<CartItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = initializeCartData();
        resolve(items);
      }, 500);
    });
  },
  
  // Get user's cart items
  getUserCart: async (userId: string | number): Promise<CartItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = initializeCartData();
        const userItems = items.filter(item => 
          item.userId === userId && item.status === 'active'
        );
        resolve(userItems);
      }, 500);
    });
  },
  
  // Add item to cart
  addToCart: async (item: Omit<CartItem, 'id' | 'addedAt' | 'status'>): Promise<CartItem> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = getCartItems();
        
        // Check if item already exists
        const existingItemIndex = items.findIndex(i => 
          i.userId === item.userId && 
          i.workshopId === item.workshopId &&
          i.currency === item.currency &&
          i.status === 'active'
        );
        
        if (existingItemIndex !== -1) {
          // Update quantity
          items[existingItemIndex].quantity += item.quantity;
          saveCartItems(items);
          resolve(items[existingItemIndex]);
        } else {
          // Add new item
          const newItem: CartItem = {
            ...item,
            id: Date.now(),
            addedAt: new Date().toISOString(),
            status: 'active'
          };
          
          items.push(newItem);
          saveCartItems(items);
          resolve(newItem);
        }
      }, 500);
    });
  },
  
  // Update cart item
  updateItem: async (id: number, updates: Partial<CartItem>): Promise<CartItem> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const items = getCartItems();
        const itemIndex = items.findIndex(item => item.id === id);
        
        if (itemIndex === -1) {
          reject(new Error('Item not found'));
          return;
        }
        
        items[itemIndex] = { ...items[itemIndex], ...updates };
        saveCartItems(items);
        resolve(items[itemIndex]);
      }, 500);
    });
  },
  
  // Remove item from cart
  removeItem: async (id: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = getCartItems();
  const updatedItems = items.filter(item => item.id !== id);
  saveCartItems(updatedItems as CartItem[]);
        resolve();
      }, 500);
    });
  },
  
  // Mark all user's cart items as purchased
  completePurchase: async (userId: string | number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = getCartItems();
        const updatedItems = items.map(item => {
          if (item.userId === userId && item.status === 'active') {
            return { ...item, status: 'purchased' };
          }
          return item;
        });
        saveCartItems(updatedItems as CartItem[]);
        resolve();
      }, 500);
    });
  },
  
  // Clear all cart data (for testing)
  clearAllCartData: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        saveCartItems([]);
        resolve();
      }, 500);
    });
  }
};