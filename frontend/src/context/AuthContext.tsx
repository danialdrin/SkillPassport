import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthStatus, UserLoginRequest, UserRegisterRequest } from '../types/auth';
import { authApi } from '../api/auth';

interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  login: (credentials: UserLoginRequest) => Promise<void>;
  register: (data: UserRegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    setUser(null);
    setStatus('anonymous');
  }, []);

  const refreshUser = useCallback(async () => {
    const isDemoRoute =
      ['/', '/search', '/skill-graph', '/passport'].includes(window.location.pathname) ||
      window.location.pathname.startsWith('/quiz/mock-resource-') ||
      window.location.pathname.startsWith('/resources/mock-resource-');

    const queryParams = new URLSearchParams(window.location.search);
    const hasExplicitDemoEmail = queryParams.has('email');
    const hasAccessToken = !!localStorage.getItem('access_token');
    const isMockResourceRoute = window.location.pathname.startsWith('/resources/mock-resource-') ||
      window.location.pathname.startsWith('/quiz/mock-resource-');
    const isExplicitMock = queryParams.get('mock') === 'true' || hasExplicitDemoEmail || isMockResourceRoute;
    const isDemoSession = isDemoRoute && isExplicitMock && !hasAccessToken;

    if (isDemoSession) {
      const queryEmail = new URLSearchParams(window.location.search).get('email');
      const demoEmail = queryEmail || sessionStorage.getItem('myskills.demo.email') || 'arul@gmail.com';
      sessionStorage.setItem('myskills.demo.email', demoEmail.toLowerCase().trim());
      setUser({
        user_id: 'mock-student-001',
        name: 'arul',
        email: demoEmail.toLowerCase().trim(),
        created_at: '2026-09-07T00:00:00Z',
      });
      setStatus('authenticated');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      setUser(null);
      setStatus('anonymous');
      return;
    }

    try {
      const userData = await authApi.getMe();
      setUser(userData);
      setStatus('authenticated');
    } catch {
      logout();
    }
  }, [logout]);

  useEffect(() => {
    refreshUser();

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [refreshUser, logout]);

  const login = async (credentials: UserLoginRequest) => {
    setStatus('loading');
    try {
      const tokenRes = await authApi.login(credentials);
      localStorage.setItem('access_token', tokenRes.access_token);
      await refreshUser();
    } catch (err) {
      setStatus('anonymous');
      throw err;
    }
  };

  const register = async (data: UserRegisterRequest) => {
    await authApi.register(data);
  };

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
