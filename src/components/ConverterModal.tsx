import { useState } from 'react';
import { convertUserAccountToJSON } from '../utils/excelReader';

interface ConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

declare const XLSX: any;

export const ConverterModal = ({ isOpen, onClose }: ConverterModalProps) => {
  const [status, setStatus] = useState<string>('');
  const [statusColor, setStatusColor] = useState<string>('var(--btn-secondary)');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('Converting...');
    setStatusColor('var(--btn-secondary)');

    try {
      const jsonData = await convertUserAccountToJSON(file);
      
      // Download as JSON
      const jsonString = JSON.stringify(jsonData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'UserAccount.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus('✓ Conversion successful! File downloaded.');
      setStatusColor('#4CAF50');
    } catch (err) {
      console.error('Conversion error:', err);
      setStatus('✗ Failed to convert file. Please check the format.');
      setStatusColor('#f44336');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setStatus('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal show" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Convert UserAccount Excel to JSON</h3>
          <button className="close-btn" onClick={handleClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p>Select your UserAccount Excel file to convert it to JSON format. The JSON file will be automatically downloaded.</p>
          <div className="file-input-wrapper" style={{ width: '100%' }}>
            <input
              type="file"
              id="convertInput"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              style={{ position: 'absolute', left: '-9999px' }}
            />
            <label
              htmlFor="convertInput"
              className="file-input-label"
              style={{ width: '100%', textAlign: 'center' }}
            >
              Select UserAccount Excel File
            </label>
          </div>
          {status && (
            <div style={{ marginTop: '15px', color: statusColor }}>
              {status}
            </div>
          )}
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
};
