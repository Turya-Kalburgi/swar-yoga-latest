// Mock user data API

// Get user data from localStorage or initialize
const getUserData = (): any[] => {
  try {
    const data = localStorage.getItem('signup_data');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting user data:', error);
    return [];
  }
};

// User API methods
export const userAPI = {
  // Get user stats
  getUserStats: async (): Promise<{ totalUsers: number; activeUsers: number; recentUsers: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getUserData();
        
        const stats = {
          totalUsers: users.length,
          activeUsers: users.filter((u: any) => u.status === 'active').length,
          recentUsers: users.filter((u: any) => {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return new Date(u.registrationDate) >= thirtyDaysAgo;
          }).length
        };
        
        resolve(stats);
      }, 500);
    });
  },
  
  // Get user by ID
  getUserById: async (id: number | string): Promise<any | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getUserData();
        const user = users.find((u: any) => u.id.toString() === id.toString()) || null;
        resolve(user);
      }, 500);
    });
  },
  
  // Get user by email
  getUserByEmail: async (email: string): Promise<any | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getUserData();
        const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase()) || null;
        resolve(user);
      }, 500);
    });
  }
};