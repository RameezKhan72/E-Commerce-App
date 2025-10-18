import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../constants/config';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    reloadUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null, token: null, loading: true,
    login: async () => {}, logout: async () => {}, reloadUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const reloadUser = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                const { data } = await axios.get(`${API_URL}/users/profile`);
                setUser(data);
            } else {
                logout(); // If no token, ensure we are logged out
            }
        } catch (error) {
            // Let the interceptor handle the 401 error
            console.error('Failed to load auth state');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        reloadUser();
    }, []);

    const login = async (newToken: string) => {
        await AsyncStorage.setItem('token', newToken);
        await reloadUser();
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, reloadUser }}>
            {children}
        </AuthContext.Provider>
    );
};

