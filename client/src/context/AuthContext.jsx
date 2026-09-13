import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('life_rpg_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync active theme to document root
  useEffect(() => {
    if (user?.character?.equippedTheme) {
      document.documentElement.setAttribute('data-theme', user.character.equippedTheme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [user?.character?.equippedTheme]);

  // Fetch current user if token exists
  const fetchCurrentUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get('/auth/me');
      if (res.data?.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.warn('Session check failed:', err.response?.data?.message || err.message);
      setToken(null);
      setUser(null);
      localStorage.removeItem('life_rpg_token');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCurrentUser();

    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [fetchCurrentUser]);

  // Login
  const login = async (loginIdentifier, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { loginIdentifier, password });
      if (res.data?.success) {
        const { token: newToken, user: userData } = res.data;
        localStorage.setItem('life_rpg_token', newToken);
        setToken(newToken);
        setUser(userData);
        return { success: true, user: userData };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Check your credentials.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Register
  const register = async (registerData) => {
    setError(null);
    try {
      const res = await api.post('/auth/register', registerData);
      if (res.data?.success) {
        const { token: newToken, user: userData } = res.data;
        localStorage.setItem('life_rpg_token', newToken);
        setToken(newToken);
        setUser(userData);
        return { success: true, user: userData };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('life_rpg_token');
    setToken(null);
    setUser(null);
  };

  // Update local character state optimistically
  const updateCharacter = (newCharacterData) => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        character: {
          ...prev.character,
          ...newCharacterData,
        },
      };
    });
  };

  // Update streak state
  const updateStreak = (newStreak) => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        streak: {
          ...prev.streak,
          ...newStreak,
        },
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        updateCharacter,
        updateStreak,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
