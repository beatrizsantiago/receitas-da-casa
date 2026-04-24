import api from '@/shared/services/api';
import type { AuthResponse, LoginDto, RegisterDto } from '../types';

export const authService = {
  async login(dto: LoginDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', dto);
    return data;
  },

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', dto);
    return data;
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout', { refreshToken });
  },
};
