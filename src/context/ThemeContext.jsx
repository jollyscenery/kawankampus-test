import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();
const THEME_STORAGE_KEY = 'kk-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';
const LIGHT = 'light';
const DARK = 'dark';
const SYSTEM = 'system';
const THEME_COLORS = { light: '#f7faf9', dark: '#0b1514' };

function isPreference(value) {
  return value === LIGHT || value === DARK || value === SYSTEM;
}

function readStoredPreference() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isPreference(stored) ? stored : SYSTEM;
  } catch {
    return SYSTEM;
  }
}

function getSystemTheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return LIGHT;
  return window.matchMedia(DARK_QUERY).matches ? DARK : LIGHT;
}

function resolveTheme(preference) {
  return preference === SYSTEM ? getSystemTheme() : preference;
}

function applyTheme(theme) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME_COLORS[theme] || THEME_COLORS.light);
}

export function ThemeProvider({ children }) {
  // The pre-paint script in index.html already applied this; state mirrors it
  // so React never has to correct the first paint.
  const [preference, setPreferenceState] = useState(readStoredPreference);
  const [theme, setTheme] = useState(() => resolveTheme(preference));

  useEffect(() => {
    setTheme(resolveTheme(preference));

    try {
      localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      // Storage may be unavailable; the theme still applies for this session.
    }
  }, [preference]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Follow the operating system live while the user stays on "system".
  useEffect(() => {
    if (preference !== SYSTEM || typeof window.matchMedia !== 'function') return undefined;

    const media = window.matchMedia(DARK_QUERY);
    const onChange = (event) => setTheme(event.matches ? DARK : LIGHT);

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, [preference]);

  // Keep tabs in sync when the preference changes elsewhere.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      setPreferenceState(isPreference(event.newValue) ? event.newValue : SYSTEM);
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setPreference = useCallback((next) => {
    setPreferenceState(isPreference(next) ? next : SYSTEM);
  }, []);

  // Existing API: the toggle flips between explicit light and dark.
  const toggleTheme = useCallback(() => {
    setPreferenceState(theme === DARK ? LIGHT : DARK);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        preference,
        setPreference,
        toggleTheme,
        isDark: theme === DARK
      }}
    >
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
