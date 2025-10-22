import { useState, useEffect } from 'react';
import type { ColumnNames } from '../types';
import { DEFAULT_COLUMN_NAMES, COLUMN_KEYS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  columnNames: ColumnNames;
  onSave: (columnNames: ColumnNames) => void;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  columnNames,
  onSave
}: SettingsModalProps) => {
  const [tempColumnNames, setTempColumnNames] = useState<ColumnNames>(columnNames);

  useEffect(() => {
    setTempColumnNames(columnNames);
  }, [columnNames, isOpen]);

  const handleChange = (key: string, value: string) => {
    setTempColumnNames(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleReset = () => {
    setTempColumnNames(DEFAULT_COLUMN_NAMES);
  };

  const handleSave = () => {
    onSave(tempColumnNames);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show" onClick={handleBackdropClick}>
      <div className="modal-content wide">
        <div className="modal-header">
          <h3>Column Header Settings</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p>Configure column header names if your Excel file uses different naming conventions.</p>
          
          {COLUMN_KEYS.map(key => (
            <div key={key} className="column-mapping">
              <label>{key} Column:</label>
              <input
                type="text"
                value={tempColumnNames[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={`Enter column name`}
              />
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={handleReset}>
            Reset to Default
          </button>
          <button className="export-btn" onClick={handleSave}>
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
