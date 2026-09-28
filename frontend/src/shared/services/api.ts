import axios, { type InternalAxiosRequestConfig } from 'axios';
import type { AuthResponse } from '@/features/auth/types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  // Envia/recebe o cookie HttpOnly do refresh token (restrito a /api/auth)
  withCredentials: true,
  // Header exigido pelo backend nas rotas de cookie (proteção CSRF)
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

// O access token fica só em memória: nada de localStorage, onde um XSS poderia
// lê-lo. Ao recarregar a página, a sessão é restaurada via refresh (cookie).
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

let onSessionExpired: () => void = () => {};

export function setSessionExpiredHandler(handler: () => void) {
  onSessionExpired = handler;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise: Promise<AuthResponse> | null = null;

async function requestRefresh() {
  const { data } = await api.post<AuthResponse>('/auth/refresh');
  accessToken = data.accessToken;
  return data;
}

/**
 * Renova a sessão. Chamadas simultâneas compartilham a mesma requisição, e
 * entre abas o Web Locks serializa: como o refresh token é rotacionado a cada
 * uso, duas abas renovando juntas com o mesmo token seriam vistas como reuso.
 */
export function refreshSession(): Promise<AuthResponse> {
  refreshPromise ??= (
    navigator.locks
      ? navigator.locks.request('auth-refresh', requestRefresh)
      : requestRefresh()
  ).finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => original?.url?.includes(path));

    // 401 on login/register/refresh means bad credentials or an expired
    // session, not a stale access token — let the caller handle it.
    if (error.response?.status !== 401 || !original || original._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    original._retry = true;
    try {
      await refreshSession();
    } catch (refreshError) {
      // Só encerra a sessão se o servidor recusou o refresh token. Falha de
      // rede ou 5xx (ex.: API reiniciando no deploy) mantém o usuário logado.
      if (axios.isAxiosError(refreshError) && refreshError.response?.status === 401) {
        accessToken = null;
        onSessionExpired();
      }
      return Promise.reject(error);
    }
    return api(original);
  },
);

export default api;
