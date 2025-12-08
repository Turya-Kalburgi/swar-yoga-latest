import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface AdminUser {
  username: string;
  name: string;
  role: 'admin' | 'superadmin';
  timestamp?: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  adminLogin: (userData: AdminUser) => void;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  adminUser: null,
  isAdminAuthenticated: false,
  adminLogin: () => {},
  adminLogout: () => {}
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is logged in on mount
    const adminData = localStorage.getItem('adminUser');
    if (adminData) {
      try {
        const parsedAdmin = JSON.parse(adminData);
        setAdminUser(parsedAdmin);
        setIsAdminAuthenticated(true);
        
        console.log(`🔑 Admin loaded from localStorage:`, {
          username: parsedAdmin.username,
          name: parsedAdmin.name,
          role: parsedAdmin.role,
          timestamp: new Date().toLocaleString()
        });
      } catch (error) {
        console.error('❌ Error parsing admin data:', error);
        localStorage.removeItem('adminUser');
      }
    } else {
      console.log('ℹ️ No admin logged in');
    }
  }, []);

  const adminLogin = (userData: AdminUser) => {
    const adminData = {
      ...userData,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('adminUser', JSON.stringify(adminData));
    setAdminUser(adminData);
    setIsAdminAuthenticated(true);
    
    console.log(`✅ Admin logged in successfully:`, {
      username: userData.username,
      name: userData.name,
      role: userData.role,
      timestamp: new Date().toLocaleString()
    });
    toast.success('Admin login successful');
  };

  const adminLogout = () => {
    const loggedOutAdmin = adminUser?.username || 'Unknown';
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminAuth');
    setAdminUser(null);
    setIsAdminAuthenticated(false);
    
    console.log(`🚪 Admin logged out:`, {
      username: loggedOutAdmin,
      timestamp: new Date().toLocaleString()
    });
    toast.info('Admin signed out');
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, isAdminAuthenticated, adminLogin, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;
