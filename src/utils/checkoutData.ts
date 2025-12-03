// Mock checkout data API

interface OrderItem {
  workshopId: number;
  workshopTitle: string;
  quantity: number;
  price: number;
  currency: string;
}

interface BillingAddress {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  billingAddress: BillingAddress;
  orderDate: string;
}

// Get orders from localStorage or initialize
const getOrders = (): Order[] => {
  try {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
};

// Save orders to localStorage
const saveOrders = (orders: Order[]) => {
  localStorage.setItem('orders', JSON.stringify(orders));
};

// Checkout API methods
export const checkoutAPI = {
  // Create a new order
  createOrder: async (orderData: Omit<Order, 'id' | 'orderDate'>): Promise<Order> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orders = getOrders();
        
        const newOrder: Order = {
          ...orderData,
          id: `ORD-${Date.now()}`,
          orderDate: new Date().toISOString()
        };
        
        orders.push(newOrder);
        saveOrders(orders);
        resolve(newOrder);
      }, 500);
    });
  },
  
  // Get user's orders
  getUserOrders: async (userId: string): Promise<Order[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orders = getOrders();
        const userOrders = orders.filter(order => order.userId === userId);
        resolve(userOrders);
      }, 500);
    });
  },
  
  // Get order by ID
  getOrderById: async (orderId: string): Promise<Order | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orders = getOrders();
        const order = orders.find(order => order.id === orderId) || null;
        resolve(order);
      }, 500);
    });
  },
  
  // Update order status
  updateOrderStatus: async (orderId: string, status: 'pending' | 'completed' | 'failed'): Promise<Order> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const orders = getOrders();
        const orderIndex = orders.findIndex(order => order.id === orderId);
        
        if (orderIndex === -1) {
          reject(new Error('Order not found'));
          return;
        }
        
        orders[orderIndex].paymentStatus = status;
        saveOrders(orders);
        resolve(orders[orderIndex]);
      }, 500);
    });
  },
  
  // Clear all orders (for testing)
  clearAllOrders: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        saveOrders([]);
        resolve();
      }, 500);
    });
  }
};