import type { UserAccount } from '../types';

export const findAccountNumber = (
  userAccounts: UserAccount[],
  accountType: string,
  currency: string,
  phoneNumber: string
): string => {
  const account = userAccounts.find(
    a => a['Account Type'] === accountType && 
         a['Currency'] === currency && 
         a['Phone Number'] === phoneNumber
  );
  return account?.['Account Number'] || '';
};

export const getUniquePhoneNumbers = (userAccounts: UserAccount[]): string[] => {
  return [...new Set(userAccounts.map(a => a['Phone Number']))];
};
