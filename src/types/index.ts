export interface UserAccount {
  'Phone Number': string;
  'Account Type': string;
  'Currency': string;
  'Account Number': string;
}

export interface ColumnNames {
  'NO': string;
  'Service Name': string;
  'Sender Account Type': string;
  'Sender Account': string;
  'Sender Account Currency': string;
  'Receiver Account Type': string;
  'Receiver Account': string;
  'Receiver Account Currency': string;
}

export interface ServiceGroups {
  [service: string]: any[][];
}

export interface ColumnMapping {
  [key: string]: number;
}

export type Theme = 'light' | 'dark';
