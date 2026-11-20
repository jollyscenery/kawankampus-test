import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();
const THEME_STORAGE_KEY = 'kk-theme';

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore if localStorage unavailable
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
