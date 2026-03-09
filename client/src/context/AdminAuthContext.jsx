import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    if (token && userData) {
      // Verify token and get user info
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/api/auth/admin/login', credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(user));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};