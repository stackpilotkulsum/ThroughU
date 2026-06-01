import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(localStorage.getItem('cly_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await API.get('/auth/me');
        setUser(data.user);
      } catch { logout(); }
      finally   { setLoading(false); }
    };
    init();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('cly_token', data.token);
    setToken(data.token);
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.name.split(' ')[0]}! 👋`);
    return data;
  };

  const register = async (formData) => {
    const { data } = await API.post('/auth/register', formData);
    localStorage.setItem('cly_token', data.token);
    setToken(data.token);
    setUser(data.user);
    toast.success('🎉 Welcome to ThroughU!');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('cly_token');
    setToken(null);
    setUser(null);
    toast('Signed out successfully');
  };

  const googleLogin = async (credential) => {
    const { data } = await API.post('/auth/google', { credential });
    localStorage.setItem('cly_token', data.token);
    setToken(data.token);
    setUser(data.user);
    toast.success(`Welcome, ${data.user.name.split(' ')[0]}! 👋`);
    return data;
  };

  const updateUser = (updates) => setUser(prev => ({ ...prev, ...updates }));

  return (
    <AuthContext.Provider value={{ user, token, loading, login, googleLogin, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
