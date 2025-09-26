import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserProfile } from '../lib/types';
import { getMockUserByEmail } from '../services/firebaseService';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a logged-in user
    const storedUserEmail = localStorage.getItem('authUserEmail');
    if (storedUserEmail) {
      const loggedInUser = getMockUserByEmail(storedUserEmail);
      setUser(loggedInUser || null);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password?: string) => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 1000)); // Simulate network delay
    const foundUser = getMockUserByEmail(email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('authUserEmail', email);
      setLoading(false);
    } else {
      setLoading(false);
      throw new Error('User not found');
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('authUserEmail');
  }, []);

  const updateUserProfile = useCallback(async (profileData: Partial<UserProfile>) => {
      if (!user) throw new Error("Not logged in");
      await new Promise(res => setTimeout(res, 500));
      setUser(prevUser => ({...prevUser!, ...profileData}));
  }, [user]);

  const value = { user, loading, login, logout, updateUserProfile };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
