
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    savedAccounts: User[];
    login: (user: User, password?: string) => void;
    logout: () => void;
    isLoggingIn: boolean;
    setIsLoggingIn: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [savedAccounts, setSavedAccounts] = useState<User[]>([]);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await fetch('http://localhost:5000/auth/current_user', {
                    credentials: 'include' // Important for cookies
                });
                const data = await res.json();
                if (data) {
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth check failed", error);
                setUser(null);
            }
        };
        checkUser();
    }, []);

    // Placeholder for manual login if we kept it, but for Google Auth we trust the session
    const login = (newUser: User) => {
        setUser(newUser);
    };

    const logout = async () => {
        try {
            window.location.href = "http://localhost:5000/auth/logout";
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, savedAccounts, login, logout, isLoggingIn, setIsLoggingIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
