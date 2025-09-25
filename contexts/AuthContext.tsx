
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserProfile } from '../lib/types';
import { mockSignIn, mockSignOut, onAuthStateChanged, mockGetUserProfile } from '../services/firebaseService';

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                const userProfile = await mockGetUserProfile(firebaseUser.uid);
                setUser(userProfile);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = useCallback(async (email: string, pass: string) => {
        setLoading(true);
        try {
            const userCredential = await mockSignIn(email, pass);
            if (userCredential) {
                const userProfile = await mockGetUserProfile(userCredential.uid);
                setUser(userProfile);
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setLoading(true);
        await mockSignOut();
        setUser(null);
        setLoading(false);
    }, []);

    const value = { user, loading, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
