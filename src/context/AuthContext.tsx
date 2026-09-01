import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authAPI } from '../services/api';
import {
  signInWithGoogle,
  loginWithEmail as firebaseLoginEmail,
  registerWithEmail as firebaseRegisterEmail,
  logoutFromFirebase,
  updateFirebaseProfileData,
  onAuthStateChanged,
  auth as firebaseAuth,
} from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginGoogle: () => Promise<User>;
  loginFirebase: (email: string, password: string) => Promise<User>;
  registerFirebase: (data: { name: string; email: string; password: string; institution?: string; country?: string }) => Promise<User>;
  register: (data: { name: string; email: string; password: string; institution?: string; country?: string }) => Promise<void>;
  updateProfileData: (data: Partial<User>) => Promise<void>;
  logout: () => void;
  toggleBookmark: (conferenceId: string) => Promise<boolean>;
  isBookmarked: (conferenceId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_PROFILE_KEY = 'nitin_academic_user_profile_2026';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  // Restore saved local profile if present
  const loadLocalProfile = (): User | null => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const saveLocalProfile = (userData: User | null) => {
    if (userData) {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
    }
  };

  useEffect(() => {
    let unsubFirebase: (() => void) | null = null;

    const initAuth = async () => {
      // Check stored custom JWT token
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.data?.success) {
            const fetchedUser: User = res.data.data;
            const merged = { ...loadLocalProfile(), ...fetchedUser };
            setUser(merged);
            saveLocalProfile(merged);
            setLoading(false);
            return;
          }
        } catch {
          console.warn('Backend session expired or token invalid');
        }
      }

      // Check local saved profile
      const cached = loadLocalProfile();
      if (cached) {
        setUser(cached);
      }

      // Listen for Firebase Auth changes
      unsubFirebase = onAuthStateChanged(firebaseAuth, (fbUser) => {
        if (fbUser) {
          setUser((prev) => {
            const updated: User = {
              id: fbUser.uid || prev?.id || 'user-fb-1',
              name: fbUser.displayName || prev?.name || fbUser.email?.split('@')[0] || 'Academic Scholar',
              email: fbUser.email || prev?.email || 'scholar@university.edu',
              role: prev?.role || (fbUser.email?.includes('admin') ? 'admin' : 'user'),
              photoURL: fbUser.photoURL || prev?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              institution: prev?.institution || 'MIT - Massachusetts Institute of Technology',
              country: prev?.country || 'United States',
              bio: prev?.bio || 'Senior AI Researcher studying deep learning architectures for academic alerting.',
              fieldOfInterest: prev?.fieldOfInterest || 'Engineering & Tech',
              authProvider: prev?.authProvider || (fbUser.providerData[0]?.providerId === 'google.com' ? 'firebase-google' : 'firebase-email'),
              createdAt: prev?.createdAt || new Date().toISOString(),
              bookmarkedConferences: prev?.bookmarkedConferences || ['6659f1a2b3c4d5e6f7a8b9c0', '6659f1a2b3c4d5e6f7a8b9c1'],
              alertSubscriptions: prev?.alertSubscriptions || [
                { category: 'Engineering & Tech', frequency: 'weekly' },
                { category: 'Physical & Life Sciences', frequency: 'monthly' },
              ],
            };
            saveLocalProfile(updated);
            return updated;
          });
        }
        setLoading(false);
      });

      setLoading(false);
    };

    initAuth();

    return () => {
      if (unsubFirebase) unsubFirebase();
    };
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      const { token: newToken, user: userData } = res.data.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      const fullUser: User = {
        ...userData,
        authProvider: 'backend',
        photoURL: userData.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: userData.createdAt || new Date().toISOString(),
      };
      setUser(fullUser);
      saveLocalProfile(fullUser);
    }
  };

  const loginGoogle = async (): Promise<User> => {
    const fbUser = await signInWithGoogle();
    const newUser: User = {
      id: fbUser.uid,
      name: fbUser.displayName || 'Google Academic User',
      email: fbUser.email || 'scholar.google@university.edu',
      role: fbUser.email?.includes('admin') ? 'admin' : 'user',
      photoURL: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      institution: 'Stanford University',
      country: 'United States',
      bio: 'Verified Academic Scholar signed in via Firebase Google Auth.',
      fieldOfInterest: 'Engineering & Tech',
      authProvider: 'firebase-google',
      createdAt: new Date().toISOString(),
      bookmarkedConferences: ['6659f1a2b3c4d5e6f7a8b9c0'],
      alertSubscriptions: [
        { category: 'Engineering & Tech', frequency: 'weekly' }
      ]
    };
    setUser(newUser);
    saveLocalProfile(newUser);
    return newUser;
  };

  const loginFirebase = async (email: string, pass: string): Promise<User> => {
    const fbUser = await firebaseLoginEmail(email, pass);
    const newUser: User = {
      id: fbUser.uid,
      name: fbUser.displayName || email.split('@')[0].toUpperCase(),
      email: fbUser.email || email,
      role: email.includes('admin') ? 'admin' : 'user',
      photoURL: fbUser.photoURL || '',
      institution: 'Harvard University',
      country: 'United States',
      bio: 'Research Scholar authenticated via Firebase Email & Password.',
      fieldOfInterest: 'Medical & Health Sciences',
      authProvider: 'firebase-email',
      createdAt: new Date().toISOString(),
      bookmarkedConferences: [],
    };
    setUser(newUser);
    saveLocalProfile(newUser);
    return newUser;
  };

  const registerFirebase = async (data: { name: string; email: string; password: string; institution?: string; country?: string }): Promise<User> => {
    const fbUser = await firebaseRegisterEmail(data.name, data.email, data.password);
    const newUser: User = {
      id: fbUser.uid,
      name: data.name,
      email: data.email,
      role: 'user',
      photoURL: '',
      institution: data.institution || 'Global Research Institute',
      country: data.country || 'International',
      bio: 'Newly registered academic scholar.',
      fieldOfInterest: 'Engineering & Tech',
      authProvider: 'firebase-email',
      createdAt: new Date().toISOString(),
      bookmarkedConferences: [],
    };
    setUser(newUser);
    saveLocalProfile(newUser);
    return newUser;
  };

  const register = async (data: { name: string; email: string; password: string; institution?: string; country?: string }) => {
    const res = await authAPI.register(data);
    if (res.data.success) {
      const { token: newToken, user: userData } = res.data.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      const fullUser: User = {
        ...userData,
        authProvider: 'backend',
        createdAt: new Date().toISOString(),
      };
      setUser(fullUser);
      saveLocalProfile(fullUser);
    }
  };

  const updateProfileData = async (updatedData: Partial<User>) => {
    if (!user) return;
    const merged: User = { ...user, ...updatedData };
    setUser(merged);
    saveLocalProfile(merged);

    if (updatedData.name || updatedData.photoURL) {
      try {
        await updateFirebaseProfileData({
          displayName: updatedData.name,
          photoURL: updatedData.photoURL,
        });
      } catch (err) {
        console.warn('Firebase profile sync notice:', err);
      }
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    saveLocalProfile(null);
    setToken(null);
    setUser(null);
    await logoutFromFirebase();
  };

  const toggleBookmark = async (conferenceId: string): Promise<boolean> => {
    if (!user) return false;
    const currentBookmarks = user.bookmarkedConferences || [];
    const exists = currentBookmarks.includes(conferenceId);
    const updatedBookmarks = exists
      ? currentBookmarks.filter((id) => id !== conferenceId)
      : [...currentBookmarks, conferenceId];

    // Optimistically update state & local storage
    const updatedUser = { ...user, bookmarkedConferences: updatedBookmarks };
    setUser(updatedUser);
    saveLocalProfile(updatedUser);

    // Try backend API update if token exists
    if (token) {
      try {
        await authAPI.toggleBookmark(conferenceId);
      } catch (err) {
        console.warn('Backend sync bookmark notice:', err);
      }
    }
    return !exists;
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
        loginGoogle,
        loginFirebase,
        registerFirebase,
        register,
        updateProfileData,
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
