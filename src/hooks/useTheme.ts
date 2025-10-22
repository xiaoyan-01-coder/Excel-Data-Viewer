import { useState, useEffect } from 'react';
import type { Theme } from '../types';
import { storage } from '../utils/storage';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(storage.getTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    storage.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme };
};
