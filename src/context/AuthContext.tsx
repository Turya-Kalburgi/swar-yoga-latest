import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // Log user info for debugging
        console.log(`👤 User loaded from localStorage:`, {
          email: parsedUser.email,
          name: parsedUser.name,
          userId: parsedUser.id,
          timestamp: new Date().toLocaleString()
        });
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    } else {
      console.log('ℹ️ No user logged in - localStorage is empty');
    }
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    
    console.log(`✅ User logged in successfully:`, {
      email: userData.email,
      name: userData.name,
      userId: userData.id,
      storageKey: 'user',
      timestamp: new Date().toLocaleString()
    });
    toast.success('Signed in successfully!');
  };

  const logout = () => {
    const loggedOutUser = user?.email || 'Unknown';
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    
    console.log(`🚪 User logged out:`, {
      email: loggedOutUser,
      timestamp: new Date().toLocaleString()
    });
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };