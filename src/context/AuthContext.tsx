import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; institution?: string; country?: string }) => Promise<void>;
  logout: () => void;
  toggleBookmark: (conferenceId: string) => Promise<boolean>;
  isBookmarked: (conferenceId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success) {
            setUser(res.data.data);
          }
        } catch (err) {
          console.warn('Session expired or invalid token');
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      const { token: newToken, user: userData } = res.data.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
    }
  };

  const register = async (data: { name: string; email: string; password: string; institution?: string; country?: string }) => {
    const res = await authAPI.register(data);
    if (res.data.success) {
      const { token: newToken, user: userData } = res.data.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const toggleBookmark = async (conferenceId: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await authAPI.toggleBookmark(conferenceId);
      if (res.data.success) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                bookmarkedConferences: res.data.data.bookmarkedConferences,
              }
            : null
        );
        return res.data.data.bookmarked;
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
    return false;
  };

  const isBookmarked = (conferenceId: string): boolean => {
    return !!user?.bookmarkedConferences?.includes(conferenceId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        logout,
        toggleBookmark,
        isBookmarked,
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
