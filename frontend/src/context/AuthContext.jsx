import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('documind_token'));
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('documind_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user profile whenever token changes
  const fetchProfile = useCallback(async () => {
    const storedToken = localStorage.getItem('documind_token');
    if (!storedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await authAPI.getProfile();
      if (data && data.user) {
        setUser(data.user);
        localStorage.setItem('documind_user', JSON.stringify(data.user));
      }
    } catch (err) {
      // If token expired or invalid, clear state
      if (err.status === 401) {
        localStorage.removeItem('documind_token');
        localStorage.removeItem('documind_user');
        setToken(null);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authAPI.login({ email, password });
      const accessToken = data.access_token;
      localStorage.setItem('documind_token', accessToken);
      setToken(accessToken);

      // Fetch user profile immediately after login
      try {
        const profileData = await authAPI.getProfile();
        if (profileData?.user) {
          setUser(profileData.user);
          localStorage.setItem('documind_user', JSON.stringify(profileData.user));
        }
      } catch (profileErr) {
        // Fallback user object if profile fails
        const fallbackUser = { email, name: email.split('@')[0] };
        setUser(fallbackUser);
        localStorage.setItem('documind_user', JSON.stringify(fallbackUser));
      }

      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    return await authAPI.register({ name, email, password });
  };

  const logout = useCallback(() => {
    localStorage.removeItem('documind_token');
    localStorage.removeItem('documind_user');
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    isLoading,
    login,
    register,
    logout,
    refreshProfile: fetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
