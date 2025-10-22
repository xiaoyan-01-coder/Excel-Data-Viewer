import { useEffect, useRef, useState } from 'react';
import type { Theme } from '../types';

interface HeaderProps {
  theme: Theme;
  onThemeToggle: () => void;
  onJsonFileSelect: (file: File) => void;
  onUserAccountsExcelSelect: (file: File) => void;
  onExcelFileSelect: (file: File) => void;
  sheetNames: string[];
  sheetName: string;
  onSheetNameChange: (name: string) => void;
  headerRow: number;
  onHeaderRowChange: (row: number) => void;
  onSettingsClick: () => void;
  onExportAllClick?: () => void;
}

export const Header = ({
  theme,
  onThemeToggle,
  onJsonFileSelect,
  onUserAccountsExcelSelect,
  onExcelFileSelect,
  sheetNames,
  sheetName,
  onSheetNameChange,
  headerRow,
  onHeaderRowChange,
  onSettingsClick,
  onExportAllClick
}: HeaderProps) => {
  const [importOpen, setImportOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const importRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const handleJsonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onJsonFileSelect(file);
  };

  const handleExcelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onExcelFileSelect(file);
  };

  const handleUserAccExcelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUserAccountsExcelSelect(file);
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (importRef.current && !importRef.current.contains(e.target as Node)) {
        setImportOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <div className="header">
      <h1>Excel Data Viewer</h1>
      <div className="header-controls">
        {/* Import group */}
        <div className="dropdown" ref={importRef}>
          <button className="btn primary" onClick={() => setImportOpen(v => !v)}>Import ▾</button>
          <div className={`dropdown-menu ${importOpen ? 'show' : ''}`}>
            <button className="dropdown-item" onClick={() => document.getElementById('jsonInput')?.click()}>User JSON</button>
            <button className="dropdown-item" onClick={() => document.getElementById('userAccXlsxInput')?.click()}>User Account Excel</button>
            <button className="dropdown-item" onClick={() => document.getElementById('fileInput')?.click()}>Data Excel</button>
          </div>
          {/* hidden inputs */}
          <input
            type="file"
            id="jsonInput"
            accept=".json"
            onChange={handleJsonChange}
            style={{ position: 'absolute', left: '-9999px' }}
          />
          <input
            type="file"
            id="fileInput"
            accept=".xlsx,.xls"
            onChange={handleExcelChange}
            style={{ position: 'absolute', left: '-9999px' }}
          />
          <input
            type="file"
            id="userAccXlsxInput"
            accept=".xlsx,.xls"
            onChange={handleUserAccExcelChange}
            style={{ position: 'absolute', left: '-9999px' }}
          />
        </div>

        {/* Sheet + Header Row pill */}
        {(sheetNames && sheetNames.length > 0) && (
          <div className="pill-group">
            <label>Sheet:</label>
            <select
              value={sheetName}
              onChange={(e) => onSheetNameChange(e.target.value)}
            >
              {sheetNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <div className="divider" />
            <label htmlFor="headerRowInput">Header Row:</label>
            <input
              type="number"
              id="headerRowInput"
              value={headerRow}
              min={1}
              max={100}
              onChange={(e) => onHeaderRowChange(parseInt(e.target.value) || 4)}
            />
          </div>
        )}

        {/* Tools */}
        <div className="dropdown" ref={toolsRef}>
          <button className="btn" onClick={() => setToolsOpen(v => !v)}>Tools ▾</button>
          <div className={`dropdown-menu ${toolsOpen ? 'show' : ''}`}>
            <button className="dropdown-item" onClick={onSettingsClick}>Column Settings</button>
            {onExportAllClick && (
              <button className="dropdown-item" onClick={onExportAllClick}>Export All</button>
            )}
          </div>
        </div>

        {/* Theme toggle */}
        <button className="theme-toggle" onClick={onThemeToggle}>
          <span>{theme === 'dark' ? '○' : '●'}</span>
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </div>
  );
};
