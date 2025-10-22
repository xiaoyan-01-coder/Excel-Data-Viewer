import { useState } from 'react';
import type { ServiceGroups, ColumnMapping, ColumnNames } from '../types';
import { readExcelFile, type ExcelReadResult, getSheetNames } from '../utils/excelReader';
import { DEFAULT_SHEET_NAME } from '../constants';

export const useExcelData = () => {
  const [groups, setGroups] = useState<ServiceGroups>({});
  const [colMap, setColMap] = useState<ColumnMapping>({});
  const [headerRow, setHeaderRow] = useState<number>(4);
  const [allRows, setAllRows] = useState<any[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheetName, setSheetName] = useState<string>(DEFAULT_SHEET_NAME);

  const loadExcelFile = async (
    file: File,
    columnNames: ColumnNames,
    headerRowNumber?: number,
    sheetNameOverride?: string
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const effectiveHeaderRow = Math.max(1, (headerRowNumber ?? headerRow));
      const effectiveSheetName = sheetNameOverride || sheetName;
      const result: ExcelReadResult = await readExcelFile(
        file,
        effectiveSheetName,
        effectiveHeaderRow - 1,
        columnNames
      );
      setGroups(result.groups);
      setColMap(result.colMap);
      setAllRows(result.allRows);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to read Excel file';
      setError(message);
      console.error('Excel read error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSheetNames = async (file: File): Promise<string[]> => {
    const names = await getSheetNames(file);
    return names;
  };

  return {
    groups,
    colMap,
    allRows,
    headerRow,
    setHeaderRow,
    sheetName,
    setSheetName,
    isLoading,
    error,
    loadExcelFile,
    fetchSheetNames
  };
};
