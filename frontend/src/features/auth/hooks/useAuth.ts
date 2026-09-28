import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { refreshSession, setAccessToken, setSessionExpiredHandler } from '@/shared/services/api';
import { authService } from '../services/auth.service';
import type { AuthResponse, LoginDto, RegisterDto, User } from '../types';

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

type AuthMessage = 'login' | 'logout';

// Sincroniza login/logout entre abas abertas
const authChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('auth') : null;

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  // Começa carregando: a sessão é restaurada pelo cookie de refresh ao abrir o app
  const [isLoading, setIsLoading] = useState(true);

  const applySession = useCallback((res: AuthResponse) => {
    setAccessToken(res.accessToken);
    setUser(res.user);
  }, []);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    // Tokens da versão anterior ficavam no localStorage
    ['accessToken', 'refreshToken', 'user'].forEach((key) => localStorage.removeItem(key));

    let cancelled = false;
    refreshSession()
      .then((res) => {
        if (!cancelled) applySession(res);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    setSessionExpiredHandler(clearSession);

    const handleMessage = (event: MessageEvent<AuthMessage>) => {
      if (event.data === 'logout') clearSession();
      if (event.data === 'login') refreshSession().then(applySession).catch(() => {});
    };
    authChannel?.addEventListener('message', handleMessage);

    return () => {
      cancelled = true;
      authChannel?.removeEventListener('message', handleMessage);
    };
  }, [applySession, clearSession]);

  const login = useCallback(async (dto: LoginDto) => {
    setIsLoading(true);
    try {
      applySession(await authService.login(dto));
      authChannel?.postMessage('login' satisfies AuthMessage);
    } finally {
      setIsLoading(false);
    }
  }, [applySession]);

  const register = useCallback(async (dto: RegisterDto) => {
    setIsLoading(true);
    try {
      applySession(await authService.register(dto));
      authChannel?.postMessage('login' satisfies AuthMessage);
    } finally {
      setIsLoading(false);
    }
  }, [applySession]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    clearSession();
    authChannel?.postMessage('logout' satisfies AuthMessage);
  }, [clearSession]);

  return { user, isLoading, login, register, logout, isAuthenticated: !!user };
}
