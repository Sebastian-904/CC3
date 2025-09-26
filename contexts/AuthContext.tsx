
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserProfile } from '../lib/types';
import { getMockLoginUsers } from '../services/firebaseService';

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate checking for an existing session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (email: string, pass: string) => {
        // In a real app, you'd validate credentials. Here we just find a mock user.
        await new Promise(res => setTimeout(res, 1000));
        const mockUsers = getMockLoginUsers();
        const foundUser = mockUsers.find(u => u.email === email);
        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('user', JSON.stringify(foundUser));
        } else {
            throw new Error('User not found');
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('user');
    }, []);
    
    const updateUserProfile = useCallback(async (profileUpdate: Partial<UserProfile>) => {
        if (!user) return;
        
        await new Promise(res => setTimeout(res, 500));
        const updatedUser = { ...user, ...profileUpdate };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
