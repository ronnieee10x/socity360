import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export interface MobileUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  societyId?: string;
  societyName?: string;
}

interface AuthContextType {
  user: MobileUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  demoLogin: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MobileUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('auth_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Error loading stored user', err);
      } finally {
        setLoading(false);
      }
    };
    checkStoredUser();
  }, []);

  const login = async (email: string, passwordHash: string) => {
    const res = await api.post('/auth/login', { email, password: passwordHash });
    const authData = res.data?.data;
    if (authData) {
      await AsyncStorage.setItem('access_token', authData.accessToken);
      if (authData.societyId) {
        await AsyncStorage.setItem('society_id', authData.societyId);
      }
      const u: MobileUser = {
        id: authData.user.id,
        fullName: authData.user.fullName,
        email: authData.user.email,
        role: authData.user.role,
        societyId: authData.societyId,
        societyName: authData.societyName,
      };
      await AsyncStorage.setItem('auth_user', JSON.stringify(u));
      setUser(u);
    }
  };

  const demoLogin = async (email: string) => {
    return login(email, 'Password@123');
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
