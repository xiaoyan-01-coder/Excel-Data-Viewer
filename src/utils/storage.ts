import type { Theme, ColumnNames } from '../types';
import { STORAGE_KEYS, DEFAULT_COLUMN_NAMES } from '../constants';

export const storage = {
  getTheme: (): Theme => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as Theme) || 'light';
  },

  setTheme: (theme: Theme): void => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  getColumnNames: (): ColumnNames => {
    const saved = localStorage.getItem(STORAGE_KEYS.COLUMN_NAMES);
    return saved ? JSON.parse(saved) : DEFAULT_COLUMN_NAMES;
  },

  setColumnNames: (columnNames: ColumnNames): void => {
    localStorage.setItem(STORAGE_KEYS.COLUMN_NAMES, JSON.stringify(columnNames));
  }
};
