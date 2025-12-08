import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';

// Types
interface AdminData {
  workshops: any[];
  users: any[];
  orders: any[];
  contacts: any[];
}

interface AdminDataContextType {
  data: AdminData;
  refreshData: () => Promise<void>;
  isLoading: boolean;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (context === undefined) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};

interface AdminDataProviderProps {
  children: ReactNode;
}

export const AdminDataProvider: React.FC<AdminDataProviderProps> = ({ children }) => {
  const [data, setData] = useState<AdminData>({
    workshops: [],
    users: [],
    orders: [],
    contacts: []
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load data on mount
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // In a real app, these would be API calls
      // For now, we'll just load from localStorage
      const workshops = JSON.parse(localStorage.getItem('swaryoga_workshops') || '[]');
      const users = JSON.parse(localStorage.getItem('signup_data') || '[]');
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const contacts = JSON.parse(localStorage.getItem('contact_messages') || '[]');
      
      setData({
        workshops,
        users,
        orders,
        contacts
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminDataContext.Provider value={{
      data,
      refreshData,
      isLoading
    }}>
      {children}
    </AdminDataContext.Provider>
  );
};