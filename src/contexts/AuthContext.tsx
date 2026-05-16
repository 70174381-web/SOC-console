import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string, mfa: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('edr_session') === 'active';
  });

  const login = (username: string, password: string, mfa: string) => {
    if (username === 'admin' && password === 'internee2024' && /^\d{6}$/.test(mfa)) {
      localStorage.setItem('edr_session', 'active');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('edr_session');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const handler = () => {
      if (localStorage.getItem('edr_session') !== 'active') setIsAuthenticated(false);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside AuthProvider');
  return ctx;
}
