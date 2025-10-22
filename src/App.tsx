import { useEffect, useState } from 'react';
import './App.css';
import { Header } from './components/Header';
import { ServiceTable } from './components/ServiceTable';
import { SettingsModal } from './components/SettingsModal';
import { ConverterModal } from './components/ConverterModal';
import { Footer } from './components/Footer';
import { useTheme } from './hooks/useTheme';
import { useUserAccounts } from './hooks/useUserAccounts';
import { useExcelData } from './hooks/useExcelData';
import type { ColumnNames } from './types';
import { storage } from './utils/storage';
import { exportOriginalWithAccounts } from './utils/excelReader';
import { getUniquePhoneNumbers } from './utils/accountMatcher';
import { useMemo } from 'react';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { userAccounts, loadFromFile, loadFromExcel } = useUserAccounts();
  const { groups, colMap, allRows, headerRow, setHeaderRow, sheetName, setSheetName, isLoading, error, loadExcelFile, fetchSheetNames } = useExcelData();
  
  const [columnNames, setColumnNames] = useState<ColumnNames>(storage.getColumnNames());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [sheetOptions, setSheetOptions] = useState<string[]>([]);
  const [isExportAllOpen, setIsExportAllOpen] = useState(false);
  const phoneNumbers = useMemo(() => getUniquePhoneNumbers(userAccounts), [userAccounts]);
  const [exportPhone, setExportPhone] = useState<string>('');

  // keep a reasonable default phone when accounts change
  useEffect(() => {
    if (!exportPhone && phoneNumbers.length > 0) {
      setExportPhone(phoneNumbers[0]);
    }
  }, [phoneNumbers, exportPhone]);

  const handleJsonFileSelect = async (file: File) => {
    try {
      await loadFromFile(file);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to load JSON file');
    }
  };

  const handleUserAccountsExcelSelect = async (file: File) => {
    try {
      await loadFromExcel(file);
      // No download; populated in memory silently
    } catch (err) {
      alert('Failed to parse User Account Excel');
    }
  };

  const handleExcelFileSelect = async (file: File) => {
    setCurrentFile(file);
    const names = await fetchSheetNames(file);
    setSheetOptions(names);
    // pick default sheet: keep previous selection if present, else DEFAULT, else first
    const preferred = sheetName && names.includes(sheetName) ? sheetName : (names.includes('1-WingBank_Current-Prod_Build') ? '1-WingBank_Current-Prod_Build' : names[0]);
    setSheetName(preferred);
    await loadExcelFile(file, columnNames, headerRow, preferred);
  };

  const handleHeaderRowChange = async (row: number) => {
    setHeaderRow(row);
    if (currentFile) {
      await loadExcelFile(currentFile, columnNames, row, sheetName);
    }
  };

  const handleSaveColumnSettings = async (newColumnNames: ColumnNames) => {
    setColumnNames(newColumnNames);
    storage.setColumnNames(newColumnNames);
    
    if (currentFile) {
      await loadExcelFile(currentFile, newColumnNames, headerRow, sheetName);
    }
  };

  const handleSheetChange = async (name: string) => {
    setSheetName(name);
    if (currentFile) {
      await loadExcelFile(currentFile, columnNames, headerRow, name);
    }
  };

  const handleOpenExportAll = () => {
    if (phoneNumbers.length === 0) {
      alert('No user accounts loaded. Please import UserAccount JSON/Excel first.');
      return;
    }
    setIsExportAllOpen(true);
  };

  const handleExportAll = () => {
    if (!allRows || allRows.length === 0) {
      alert('No data loaded. Please import the Data Excel first.');
      return;
    }
    if (!exportPhone) {
      alert('Please select a phone number for export.');
      return;
    }
    const filename = `${sheetName || 'AllServices'}_${exportPhone}_All.xlsx`;
    // headerRow in hook is 1-based; convert to index
    exportOriginalWithAccounts(allRows, Math.max(0, headerRow - 1), colMap, userAccounts, exportPhone, filename, sheetName || 'Data');
    setIsExportAllOpen(false);
  };

  return (
    <>
      <Header
        theme={theme}
        onThemeToggle={toggleTheme}
        onJsonFileSelect={handleJsonFileSelect}
        onUserAccountsExcelSelect={handleUserAccountsExcelSelect}
        onExcelFileSelect={handleExcelFileSelect}
        sheetNames={sheetOptions}
        sheetName={sheetName}
        onSheetNameChange={handleSheetChange}
        headerRow={headerRow}
        onHeaderRowChange={handleHeaderRowChange}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onExportAllClick={handleOpenExportAll}
      />

      <div id="output">
        {isLoading && <div className="loading">Loading...</div>}
        {error && <div className="loading">{error}</div>}
        {!isLoading && !error && Object.keys(groups).length > 0 && (
          Object.keys(groups).map(serviceName => (
            <ServiceTable
              key={serviceName}
              serviceName={serviceName}
              rows={groups[serviceName]}
              colMap={colMap}
              userAccounts={userAccounts}
            />
          ))
        )}
      </div>

      <Footer />

      {isExportAllOpen && (
        <div className="modal show" onClick={(e) => { if (e.target === e.currentTarget) setIsExportAllOpen(false); }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Export All Services</h3>
              <button className="close-btn" onClick={() => setIsExportAllOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <label>Phone Number:</label>
              <select value={exportPhone} onChange={(e) => setExportPhone(e.target.value)} style={{ width: '100%' }}>
                {phoneNumbers.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setIsExportAllOpen(false)}>Cancel</button>
              <button className="export-btn" onClick={handleExportAll}>Export</button>
            </div>
          </div>
        </div>
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        columnNames={columnNames}
        onSave={handleSaveColumnSettings}
      />

      <ConverterModal
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
      />
    </>
  );
}

export default App;
