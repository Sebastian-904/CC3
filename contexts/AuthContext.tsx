
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserProfile } from '../lib/types';
import { getMockLoginUsers, getStoredUser, setStoredUser, clearStoredUser } from '../services/firebaseService';

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
    switchCompany: (companyId: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = getStoredUser();
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (email: string, pass: string) => {
        // In a real app, you'd validate credentials. Here we just find a mock user.
        await new Promise(res => setTimeout(res, 1000)); // Simulate network latency
        const mockUsers = getMockLoginUsers();
        const foundUser = mockUsers.find(u => u.email === email);
        if (foundUser) {
            setUser(foundUser);
            setStoredUser(foundUser); // Persist user session
        } else {
            throw new Error('User not found');
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        clearStoredUser(); // Clear user session
        // Force reload to clear all state
        window.location.hash = '/login';
        window.location.reload();
    }, []);
    
    const updateUserProfile = useCallback(async (profileUpdate: Partial<UserProfile>) => {
        if (!user) return;
        
        await new Promise(res => setTimeout(res, 500)); // Simulate network latency
        const updatedUser = { ...user, ...profileUpdate };
        setUser(updatedUser);
        setStoredUser(updatedUser); // Persist updated user profile session
        // In a real app, this would also update the user record in the database.
    }, [user]);
    
    const switchCompany = useCallback((companyId: string) => {
        if (user && (user.role === 'admin' || user.role === 'consultor')) {
            const newUserState = { ...user, companyId };
            setUser(newUserState);
            setStoredUser(newUserState);
            // State update will trigger re-render. App.tsx uses a key on the layout 
            // to force a full component tree refresh, ensuring a clean state.
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUserProfile, switchCompany }}>
            {children}
        </AuthContext.Provider>
    );
};
