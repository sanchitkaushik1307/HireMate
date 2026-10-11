import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { api, type UserResponse } from '../lib/api';

// ─── Types ───────────────────────────────────────

export type User = UserResponse['user'];

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────

export const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Check if the user has an active session.
   * Called once on app startup and after Google OAuth redirect.
   */
  const checkAuth = useCallback(async () => {
    try {
      const { data } = await api.auth.me();
      if (data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    const { data, error } = await api.auth.login(email, password);
    if (error) return { error };
    if (data?.user) setUser(data.user);
    return {};
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    const { data, error } = await api.auth.register(name, email, password);
    if (error) return { error };
    if (data?.user) setUser(data.user);
    return {};
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
