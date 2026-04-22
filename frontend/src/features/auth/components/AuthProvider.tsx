import { useAuthState } from '../hooks/useAuth';
import { AuthContext } from '../hooks/useAuth';
import type { ReactNode } from 'react';

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useAuthState();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
