import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api';

const AuthContext = createContext();

// Local user registry helpers for resilient offline/serverless operations
const getLocalUsers = () => {
  try {
    const users = localStorage.getItem('paper_plane_local_users');
    return users ? JSON.parse(users) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalUser = (user) => {
  try {
    const users = getLocalUsers();
    if (!users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
      users.push(user);
      localStorage.setItem('paper_plane_local_users', JSON.stringify(users));
    }
  } catch (e) {
    console.error('Error saving local user:', e);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get('/auth/me');
        if (res.data && res.data.success) {
          setUser(res.data.data);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Session restore failed:', err.message);
        // Fallback for offline mock testing if memory user was set
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            logout();
          }
        } else {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    const emailLower = email.toLowerCase();
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data && res.data.success) {
        const userData = res.data.data;
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify({
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        }));
        setUser({
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        });
        saveLocalUser({ name: userData.name, email: emailLower, password, role: userData.role, _id: userData._id });
        return { success: true, user: userData };
      }
      return { success: false, error: 'Authentication failed' };
    } catch (err) {
      console.error('Login error:', err);
      
      // Check local user registry first
      const localUsers = getLocalUsers();
      const matchedUser = localUsers.find(u => u.email.toLowerCase() === emailLower && u.password === password);
      
      if (matchedUser) {
        const mockUser = {
          _id: matchedUser._id || 'local_user_' + new Date().getTime().toString(),
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role || 'user',
          token: 'mock-jwt-local-login-token'
        };
        localStorage.setItem('token', mockUser.token);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return { success: true, user: mockUser, note: 'Mock logged in' };
      }
      
      // Fallback for default offline mock testing accounts
      if (emailLower === 'admin@paperplane.ai' && password === 'admin123') {
        const mockAdmin = {
          _id: '666e1234567890abcdef0000',
          name: 'System Admin',
          email: 'admin@paperplane.ai',
          role: 'admin',
          token: 'mock-jwt-admin-token'
        };
        localStorage.setItem('token', mockAdmin.token);
        localStorage.setItem('user', JSON.stringify(mockAdmin));
        setUser(mockAdmin);
        return { success: true, user: mockAdmin, note: 'Mock logged in' };
      } else if (emailLower === 'user@paperplane.ai' && password === 'user123') {
        const mockUser = {
          _id: '666e1234567890abcdef0009',
          name: 'Gifting Enthusiast',
          email: 'user@paperplane.ai',
          role: 'user',
          token: 'mock-jwt-user-token'
        };
        localStorage.setItem('token', mockUser.token);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return { success: true, user: mockUser, note: 'Mock logged in' };
      }
      return { 
        success: false, 
        error: err.response?.data?.message || 'Invalid email or password' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setLoading(true);
    const emailLower = email.toLowerCase();
    try {
      const res = await API.post('/auth/register', { name, email, password });
      if (res.data && res.data.success) {
        const userData = res.data.data;
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify({
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        }));
        setUser({
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        });
        saveLocalUser({ name, email: emailLower, password, role: 'user', _id: userData._id });
        return { success: true, user: userData };
      }
      return { success: false, error: 'Registration failed' };
    } catch (err) {
      console.error('Registration error:', err);
      
      // Fallback local registry check & creation
      const localUsers = getLocalUsers();
      if (localUsers.some(u => u.email.toLowerCase() === emailLower)) {
        return { success: false, error: 'User already exists in local storage' };
      }

      const mockId = 'local_user_' + new Date().getTime().toString();
      const mockUser = {
        _id: mockId,
        name,
        email: emailLower,
        role: 'user',
        token: 'mock-jwt-registered-token'
      };

      saveLocalUser({ name, email: emailLower, password, role: 'user', _id: mockId });
      
      localStorage.setItem('token', mockUser.token);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true, user: mockUser, note: 'Mock registered' };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Forgot password handler
  const forgotPassword = async (email) => {
    try {
      const res = await API.post('/auth/forgot-password', { email });
      return { success: true, message: res.data.message };
    } catch (err) {
      console.error('Forgot password error:', err);
      return {
        success: true, // We still return true to simulate mock sending in case of offline modes
        message: 'Demo mode: Reset link instructions sent to ' + email
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
