import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import apiClient from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  userRoles: string[];
  username: string | null;
  login: (roles: string[], username: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await apiClient.get('/auth/me'); // Endpoint to check auth status
        if (response.data && response.data.authenticated) {
          setIsAuthenticated(true);
          setUserRoles(response.data.roles || []);
          setUsername(response.data.username || null);
        } else {
          setIsAuthenticated(false);
          setUserRoles([]);
          setUsername(null);
        }
      } catch (error) {
        console.error('Failed to check auth status:', error);
        setIsAuthenticated(false);
        setUserRoles([]);
        setUsername(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (roles: string[], newUsername: string) => {
    setIsAuthenticated(true);
    setUserRoles(roles);
    setUsername(newUsername);
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout'); // Endpoint to log out
      setIsAuthenticated(false);
      setUserRoles([]);
      setUsername(null);
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRoles, username, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
