import type { ColumnNames, ServiceGroups, ColumnMapping, UserAccount } from '../types';
import { COLUMN_KEYS } from '../constants';
import { findAccountNumber } from './accountMatcher';

declare const XLSX: any;

export interface ExcelReadResult {
  groups: ServiceGroups;
  colMap: ColumnMapping;
  allRows: any[][];
}

export const readExcelFile = (
  file: File,
  sheetName: string,
  headerRowIndex: number,
  columnNames: ColumnNames
): Promise<ExcelReadResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[sheetName];
        
        if (!sheet) {
          reject(new Error('Sheet not found'));
          return;
        }

        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

        // Fill merged cells
        (sheet['!merges'] || []).forEach((m: any) => {
          const val = jsonData[m.s.r][m.s.c];
          for (let R = m.s.r; R <= m.e.r; ++R) {
            for (let C = m.s.c; C <= m.e.c; ++C) {
              jsonData[R][C] = val;
            }
          }
        });

        if (jsonData.length <= headerRowIndex) {
          reject(new Error(`Header row ${headerRowIndex + 1} not found. File has only ${jsonData.length} rows.`));
          return;
        }

        const headerRow = jsonData[headerRowIndex];
        
        // Build column mapping
        const colMap: ColumnMapping = {};
        COLUMN_KEYS.forEach(col => {
          const configuredName = columnNames[col];
          const i = headerRow.indexOf(configuredName);
          if (i !== -1) colMap[col] = i;
        });

        if (Object.keys(colMap).length === 0) {
          reject(new Error('No specified columns found. Please check column settings.'));
          return;
        }

        // Group rows by service
        const groups: ServiceGroups = {};
        for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          const svc = row[colMap['Service Name']] || 'Unknown';
          if (!groups[svc]) groups[svc] = [];
          groups[svc].push(row);
        }

        resolve({ groups, colMap, allRows: jsonData });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const getSheetNames = (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        resolve(workbook.SheetNames || []);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const convertUserAccountToJSON = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const exportToExcel = (data: any[][], filename: string, sheetName: string): void => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  const colWidths = [
    { wch: 10 },  // NO
    { wch: 20 },  // Service Name
    { wch: 20 },  // Sender Account Type
    { wch: 15 },  // Sender Account
    { wch: 12 },  // Sender Account Currency
    { wch: 20 },  // Receiver Account Type
    { wch: 15 },  // Receiver Account
    { wch: 12 }   // Receiver Account Currency
  ];
  ws['!cols'] = colWidths.slice(0, data[0]?.length || 0);

  XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
  XLSX.writeFile(wb, filename);
};

// Export the original sheet data with Sender/Receiver Account numbers injected based on userAccounts and selected phone.
export const exportOriginalWithAccounts = (
  allRows: any[][],
  headerRowIndex: number,
  colMap: ColumnMapping,
  userAccounts: UserAccount[],
  phoneNumber: string,
  filename: string,
  sheetName: string
): void => {
  if (!allRows || allRows.length === 0) return;

  // Deep copy rows to avoid mutating state
  const data: any[][] = allRows.map(r => [...r]);

  // For each data row after header
  for (let i = headerRowIndex + 1; i < data.length; i++) {
    const row = data[i];
    // Compute and inject Sender Account
    if (colMap['Sender Account'] != null) {
      const sType = colMap['Sender Account Type'] != null ? row[colMap['Sender Account Type']] || '' : '';
      const sCur = colMap['Sender Account Currency'] != null ? row[colMap['Sender Account Currency']] || '' : '';
      const sAcc = findAccountNumber(userAccounts, sType, sCur, phoneNumber);
      row[colMap['Sender Account']] = sAcc;
    }

    // Compute and inject Receiver Account
    if (colMap['Receiver Account'] != null) {
      const rType = colMap['Receiver Account Type'] != null ? row[colMap['Receiver Account Type']] || '' : '';
      const rCur = colMap['Receiver Account Currency'] != null ? row[colMap['Receiver Account Currency']] || '' : '';
      const rAcc = findAccountNumber(userAccounts, rType, rCur, phoneNumber);
      row[colMap['Receiver Account']] = rAcc;
    }
  }

  // Write workbook - keep generic column widths
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  // Basic dynamic width per first row length
  const colCount = data[0]?.length || 0;
  ws['!cols'] = Array.from({ length: colCount }, () => ({ wch: 18 }));
  XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
  XLSX.writeFile(wb, filename);
};
