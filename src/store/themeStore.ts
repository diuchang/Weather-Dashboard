import { create } from 'zustand';

export type Theme = 'dark' | 'light';

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('theme');
  return stored === 'light' ? 'light' : 'dark';
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('light', theme === 'light');
  localStorage.setItem('theme', theme);
}

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const initialTheme = getInitialTheme();
applyTheme(initialTheme);

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme,
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    set({ theme: next });
  },
}));
