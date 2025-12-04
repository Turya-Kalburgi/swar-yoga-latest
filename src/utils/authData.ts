// Mock authentication data API

interface SignUpData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  country: string;
  state: string;
  gender: string;
  age: number;
  profession: string;
  source: 'signup' | 'signin' | 'manual' | 'csv_upload';
}

interface SignInData {
  email: string;
  name?: string;
  success: boolean;
  ipAddress: string;
  userAgent: string;
}

// Get signup data from localStorage or initialize
const getSignUpData = (): any[] => {
  try {
    const data = localStorage.getItem('signup_data');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting signup data:', error);
    return [];
  }
};

// Save signup data to localStorage
const saveSignUpData = (data: any[]) => {
  localStorage.setItem('signup_data', JSON.stringify(data));
};

// Get signin data from localStorage or initialize
const getSignInData = (): any[] => {
  try {
    const data = localStorage.getItem('signin_data');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting signin data:', error);
    return [];
  }
};

// Save signin data to localStorage
const saveSignInData = (data: any[]) => {
  localStorage.setItem('signin_data', JSON.stringify(data));
};

// Sample data removed - using real data from localStorage only

// Initialize auth data if empty (no dummy data)
const initializeAuthData = () => {
  // Just ensure data exists in localStorage, don't add dummy data
  const signupData = getSignUpData();
  if (!Array.isArray(signupData)) {
    saveSignUpData([]);
  }
  
  const signinData = getSignInData();
  if (!Array.isArray(signinData)) {
    saveSignInData([]);
  }
};

// Auth API methods
export const authAPI = {
  // Get signup data
  getSignUpData: async (): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        initializeAuthData();
        const data = getSignUpData();
        resolve(data);
      }, 500);
    });
  },
  
  // Get signin data
  getSignInData: async (): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        initializeAuthData();
        const data = getSignInData();
        resolve(data);
      }, 500);
    });
  },
  
  // Record a new signup
  recordSignUp: async (userData: SignUpData): Promise<any> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getSignUpData();
        
        const newUser = {
          id: Date.now(),
          ...userData,
          registrationDate: new Date().toISOString(),
          status: 'active'
        };
        
        data.push(newUser);
        saveSignUpData(data);
        resolve(newUser);
      }, 500);
    });
  },
  
  // Record a new signin
  recordSignIn: async (signinData: SignInData): Promise<any> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getSignInData();
        
        const newSignin = {
          id: Date.now(),
          email: signinData.email,
          timestamp: new Date().toISOString(),
          ip: signinData.ipAddress,
          device: signinData.userAgent,
          status: signinData.success ? 'success' : 'failed'
        };
        
        data.push(newSignin);
        saveSignInData(data);
        resolve(newSignin);
      }, 500);
    });
  },
  
  // Add user manually (for admin)
  addUserManually: async (userData: Omit<SignUpData, 'source'>): Promise<any> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getSignUpData();
        
        const newUser = {
          id: Date.now(),
          ...userData,
          registrationDate: new Date().toISOString(),
          status: 'active',
          source: 'manual'
        };
        
        data.push(newUser);
        saveSignUpData(data);
        resolve(newUser);
      }, 500);
    });
  },
  
  // Clear signup data (for testing)
  clearSignUpData: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        saveSignUpData([]);
        resolve();
      }, 500);
    });
  },
  
  // Clear signin data (for testing)
  clearSignInData: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        saveSignInData([]);
        resolve();
      }, 500);
    });
  }
};