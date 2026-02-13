
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
                const res = await fetch('/auth/current_user', {
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

    // Updated login to call the backend and persist the session
    const login = async (newUser: User, password?: string) => {
        try {
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: newUser.email, password }),
                credentials: 'include'
            });
            const authenticatedUser = await res.json();
            if (authenticatedUser && !authenticatedUser.error) {
                setUser(authenticatedUser);
            } else {
                // Fallback for demo if backend fails
                setUser(newUser);
            }
        } catch (error) {
            console.error("Login call failed", error);
            setUser(newUser);
        }
    };

    const logout = async () => {
        try {
            window.location.href = "/auth/logout";
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
