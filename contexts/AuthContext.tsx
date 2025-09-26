import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getMockUserByEmail } from '../services/firebaseService';
import { UserProfile } from '../lib/types';

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    login: (email: string, password?: string) => Promise<void>;
    logout: () => void;
    updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate checking for an existing session
        setLoading(true);
        try {
            const storedUserEmail = localStorage.getItem('authUserEmail');
            if (storedUserEmail) {
                const loggedInUser = getMockUserByEmail(storedUserEmail);
                setUser(loggedInUser || null);
            }
        } catch (e) {
            console.error("Failed to load user from storage", e);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (email: string, password?: string) => {
        setLoading(true);
        // Simulate API call
        await new Promise(res => setTimeout(res, 500));
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

    const updateUserProfile = useCallback(async (profile: Partial<UserProfile>) => {
        if (!user) throw new Error("Not authenticated");
        // Simulate API call
        await new Promise(res => setTimeout(res, 500));
        setUser(prevUser => {
            if (!prevUser) return null;
            const updatedUser = { ...prevUser, ...profile };
            // In a real app, you would update the source data. Here we just update state.
            return updatedUser;
        });
    }, [user]);

    const value = { user, loading, login, logout, updateUserProfile };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
