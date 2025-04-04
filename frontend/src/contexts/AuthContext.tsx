import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      
      if (isAuth) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };
    
    checkAuth();
    
    // Listen for storage events (login/logout in other tabs)
    window.addEventListener('storage', (event) => {
      if (event.key === 'auth_token' || event.key === 'auth_user') {
        checkAuth();
      }
    });
    
    return () => {
      window.removeEventListener('storage', () => {});
    };
  }, []);
  
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    logout,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 