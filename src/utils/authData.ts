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

// Generate sample signup data for demo
const generateSampleSignUpData = (): any[] => {
  return [
    {
      id: 1,
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      phone: '9876543210',
      countryCode: '+91',
      country: 'India',
      state: 'Maharashtra',
      gender: 'female',
      age: 32,
      profession: 'Software Engineer',
      registrationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      status: 'active',
      source: 'signup'
    },
    {
      id: 2,
      name: 'Rahul Verma',
      email: 'rahul.verma@outlook.com',
      phone: '8765432109',
      countryCode: '+91',
      country: 'India',
      state: 'Delhi',
      gender: 'male',
      age: 28,
      profession: 'Marketing Manager',
      registrationDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      status: 'active',
      source: 'signup'
    },
    {
      id: 3,
      name: 'Ananya Patel',
      email: 'ananya.patel@yahoo.com',
      phone: '7654321098',
      countryCode: '+91',
      country: 'India',
      state: 'Gujarat',
      gender: 'female',
      age: 35,
      profession: 'Yoga Instructor',
      registrationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      status: 'active',
      source: 'signup'
    }
  ];
};

// Generate sample signin data for demo
const generateSampleSignInData = (): any[] => {
  return [
    {
      id: 1,
      email: 'priya.sharma@gmail.com',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      ip: '192.168.1.1',
      device: 'Chrome on Windows',
      status: 'success'
    },
    {
      id: 2,
      email: 'rahul.verma@outlook.com',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      ip: '192.168.1.2',
      device: 'Safari on macOS',
      status: 'success'
    },
    {
      id: 3,
      email: 'ananya.patel@yahoo.com',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      ip: '192.168.1.3',
      device: 'Firefox on Linux',
      status: 'success'
    }
  ];
};

// Initialize auth data if empty
const initializeAuthData = () => {
  const signupData = getSignUpData();
  if (signupData.length === 0) {
    const sampleSignupData = generateSampleSignUpData();
    saveSignUpData(sampleSignupData);
  }
  
  const signinData = getSignInData();
  if (signinData.length === 0) {
    const sampleSigninData = generateSampleSignInData();
    saveSignInData(sampleSigninData);
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