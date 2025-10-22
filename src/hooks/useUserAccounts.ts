import { useState, useEffect } from 'react';
import type { UserAccount } from '../types';
import { convertUserAccountToJSON } from '../utils/excelReader';

export const useUserAccounts = () => {
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([]);

  useEffect(() => {
    // Try to load default UserAccount.json
    fetch('./UserAccount.json')
      .then(res => res.json())
      .then(data => {
        setUserAccounts(data);
        console.log('Default user accounts loaded:', data.length);
      })
      .catch(() => console.log('No default UserAccount.json found'));
  }, []);

  const loadFromFile = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          setUserAccounts(data);
          console.log('User accounts loaded:', data.length);
          resolve();
        } catch (err) {
          console.error('Failed to parse JSON file', err);
          reject(new Error('Invalid JSON file format'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const loadFromExcel = async (file: File): Promise<void> => {
    const records = await convertUserAccountToJSON(file);
    setUserAccounts(records as UserAccount[]);
    console.log('User accounts (from Excel) loaded:', records.length);
  };

  const setFromArray = (records: UserAccount[]): void => {
    setUserAccounts(records);
  };

  return { userAccounts, loadFromFile, loadFromExcel, setFromArray };
};
