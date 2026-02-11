
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
        const saved = localStorage.getItem('fitfocus_accounts');
        const active = localStorage.getItem('fitfocus_user');

        if (saved) {
            setSavedAccounts(JSON.parse(saved));
        }
        if (active) {
            setUser(JSON.parse(active));
        }
    }, []);

    const login = (newUser: User, password?: string) => {
        // Assign role based on email
        let role: 'customer' | 'host' | 'admin' = 'customer';
        if (newUser.email === 'admin@fitfocus.ai') {
            role = 'admin';
        } else if (newUser.email === 'host@fitfocus.ai') {
            role = 'host';
        }

        const userWithRole = { ...newUser, role };
        setUser(userWithRole);
        const userToSave = password ? { ...userWithRole, password } : userWithRole;
        localStorage.setItem('fitfocus_user', JSON.stringify(userToSave));

        const updatedAccounts = [...savedAccounts];
        const accountIndex = updatedAccounts.findIndex(a => a.email === newUser.email);
        if (accountIndex === -1) {
            updatedAccounts.push(userToSave as User);
            localStorage.setItem('fitfocus_accounts', JSON.stringify(updatedAccounts));
            setSavedAccounts(updatedAccounts);
        } else {
            // Update role for existing account
            updatedAccounts[accountIndex] = userToSave as User;
            localStorage.setItem('fitfocus_accounts', JSON.stringify(updatedAccounts));
            setSavedAccounts(updatedAccounts);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('fitfocus_user');
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
