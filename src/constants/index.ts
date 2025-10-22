import type { ColumnNames } from '../types';

export const DEFAULT_COLUMN_NAMES: ColumnNames = {
  'NO': 'NO',
  'Service Name': 'Service Name',
  'Sender Account Type': 'Sender Account Type',
  'Sender Account': 'Sender Account',
  'Sender Account Currency': 'Sender Account Currency',
  'Receiver Account Type': 'Receiver Account Type',
  'Receiver Account': 'Receiver Account',
  'Receiver Account Currency': 'Receiver Account Currency'
};

export const COLUMN_KEYS = [
  'NO',
  'Service Name',
  'Sender Account Type',
  'Sender Account',
  'Sender Account Currency',
  'Receiver Account Type',
  'Receiver Account',
  'Receiver Account Currency'
] as const;

export const DEFAULT_SHEET_NAME = '1-WingBank_Current-Prod_Build';
export const DEFAULT_HEADER_ROW = 4;

export const STORAGE_KEYS = {
  THEME: 'theme',
  COLUMN_NAMES: 'columnNames'
} as const;
