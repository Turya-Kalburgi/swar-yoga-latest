import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';

// Types
interface AdminUser {
  id: string;
  username: string;
  role: string;
}

interface SignupData {
  id: string;
  name: string;
  email: string;
  whatsappNumber?: string;
  countryCode?: string;
  date: string;
}

interface SigninData {
  id: string;
  email: string;
  status: 'success' | 'failed';
  date: string;
}

interface CartData {
  id: string;
  userEmail: string;
  items: any[];
  total: number;
  status: 'active' | 'purchased' | 'abandoned';
  date: string;
}

interface ContactData {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'read' | 'unread';
  date: string;
}

interface AdminContextType {
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  signupData: SignupData[];
  signinData: SigninData[];
  cartData: CartData[];
  contactData: ContactData[];
  adminLogin: (username: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
  updateContactStatus: (id: string, status: 'read' | 'unread') => Promise<void>;
  refreshData: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [signupData, setSignupData] = useState<SignupData[]>([]);
  const [signinData, setSigninData] = useState<SigninData[]>([]);
  const [cartData, setCartData] = useState<CartData[]>([]);
  const [contactData, setContactData] = useState<ContactData[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    loadData();
    
    // Check if admin is already authenticated
    const savedAdminAuth = localStorage.getItem('adminUser');
    if (savedAdminAuth) {
      try {
        const adminData = JSON.parse(savedAdminAuth);
        setIsAdminAuthenticated(true);
        setAdminUser(adminData);
      } catch (error) {
        console.error('Error loading admin auth:', error);
        localStorage.removeItem('adminUser');
      }
    }
  }, []);

  const loadData = () => {
    try {
      // Load signup data
      const savedSignupData = localStorage.getItem('signup_data');
      if (savedSignupData) {
        setSignupData(JSON.parse(savedSignupData));
      }

      // Load signin data
      const savedSigninData = localStorage.getItem('signin_data');
      if (savedSigninData) {
        setSigninData(JSON.parse(savedSigninData));
      }

      // Load cart data
      const savedCartData = localStorage.getItem('cart_items');
      if (savedCartData) {
        setCartData(JSON.parse(savedCartData));
      }

      // Load contact data
      const savedContactData = localStorage.getItem('contact_messages');
      if (savedContactData) {
        setContactData(JSON.parse(savedContactData));
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    // Simple authentication - in production, this would be server-side
    if (username === 'admin' && password === 'Mohan@123pk') {
      const adminData: AdminUser = {
        id: '1',
        username: 'admin',
        role: 'administrator'
      };
      
      setIsAdminAuthenticated(true);
      setAdminUser(adminData);
      
      // Save to localStorage
      localStorage.setItem('adminUser', JSON.stringify(adminData));
      
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('adminUser');
  };

  const updateContactStatus = async (id: string, status: 'read' | 'unread'): Promise<void> => {
    try {
      const updatedContacts = contactData.map(contact =>
        contact.id === id ? { ...contact, status } : contact
      );
      
      setContactData(updatedContacts);
      localStorage.setItem('contact_messages', JSON.stringify(updatedContacts));
    } catch (error) {
      throw new Error('Failed to update contact status');
    }
  };

  const refreshData = () => {
    loadData();
    toast.success('Data refreshed successfully');
  };

  const value: AdminContextType = {
    isAdminAuthenticated,
    adminUser,
    signupData,
    signinData,
    cartData,
    contactData,
    adminLogin,
    adminLogout,
    updateContactStatus,
    refreshData
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};