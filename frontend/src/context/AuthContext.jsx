import { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '../services/authService';
import { mockUser } from '../data/user';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(mockUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      setUser(result.user);
      setIsAuthenticated(true);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    setLoading(true);
    try {
      const result = await authService.register(data);
      setUser(result.user);
      setIsAuthenticated(true);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data) => {
    setLoading(true);
    try {
      const result = await authService.updateProfile(data);
      setUser(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
