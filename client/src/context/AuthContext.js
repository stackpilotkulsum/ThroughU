import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(localStorage.getItem('cly_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else       delete axios.defaults.headers.common['Authorization'];
  }, [token]);

  useEffect(() => {
    const init = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await axios.get('/api/auth/me');
        setUser(data.user);
      } catch { logout(); }
      finally   { setLoading(false); }
    };
    init();
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('cly_token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.name.split(' ')[0]}! 👋`);
    return data;
  };

  const register = async (formData) => {
    const { data } = await axios.post('/api/auth/register', formData);
    localStorage.setItem('cly_token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data.user);
    toast.success('🎉 Welcome to ThroughU!');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('cly_token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    toast('Signed out successfully');
  };

  const googleLogin = async (credential) => {
    const { data } = await axios.post('/api/auth/google', { credential });
    localStorage.setItem('cly_token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
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
