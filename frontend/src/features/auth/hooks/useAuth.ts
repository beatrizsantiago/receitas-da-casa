import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';
import type { LoginDto, RegisterDto, User } from '../types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

function safeParseUser(raw: string | null): User | null {
  if (!raw || raw === 'undefined' || raw === 'null') return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function useAuthState() {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('user');
    return safeParseUser(raw);
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (dto: LoginDto) => {
    setIsLoading(true);
    try {
      const res = await authService.login(dto);
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (dto: RegisterDto) => {
    setIsLoading(true);
    try {
      const res = await authService.register(dto);
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      if (refreshToken) await authService.logout(refreshToken);
    } catch {
      // ignore
    }
    localStorage.clear();
    setUser(null);
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const raw = localStorage.getItem('user');
      setUser(safeParseUser(raw));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return { user, isLoading, login, register, logout, isAuthenticated: !!user };
}
