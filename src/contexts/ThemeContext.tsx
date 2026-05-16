import { createContext, useContext, useState, type ReactNode } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('edr_theme');
    return stored !== 'light';
  });

  const toggle = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('edr_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      <div className={isDark ? 'dark' : 'light-mode'} style={{ minHeight: '100vh' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme outside ThemeProvider');
  return ctx;
}
