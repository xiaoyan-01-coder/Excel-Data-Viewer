import { useState, useEffect } from 'react';
import type { UserAccount, ColumnMapping } from '../types';
import { COLUMN_KEYS } from '../constants';
import { findAccountNumber, getUniquePhoneNumbers } from '../utils/accountMatcher';
import { exportToExcel } from '../utils/excelReader';

interface ServiceTableProps {
  serviceName: string;
  rows: any[][];
  colMap: ColumnMapping;
  userAccounts: UserAccount[];
}

export const ServiceTable = ({
  serviceName,
  rows,
  colMap,
  userAccounts
}: ServiceTableProps) => {
  const [selectedPhone, setSelectedPhone] = useState<string>('');
  const phoneNumbers = getUniquePhoneNumbers(userAccounts);

  useEffect(() => {
    if (phoneNumbers.length > 0 && !selectedPhone) {
      setSelectedPhone(phoneNumbers[0]);
    }
  }, [phoneNumbers, selectedPhone]);

  const renderTableRow = (row: any[], isHeader: boolean = false) => {
    const cells = COLUMN_KEYS.filter(c => colMap[c] != null).map(col => {
      let value = '';
      let className = 'other-column';

      if (col === 'Sender Account') {
        const sType = row[colMap['Sender Account Type']] || '';
        const sCur = row[colMap['Sender Account Currency']] || '';
        value = findAccountNumber(userAccounts, sType, sCur, selectedPhone);
        className = 'sender-account';
      } else if (col === 'Receiver Account') {
        const rType = row[colMap['Receiver Account Type']] || '';
        const rCur = row[colMap['Receiver Account Currency']] || '';
        value = findAccountNumber(userAccounts, rType, rCur, selectedPhone);
        className = 'receiver-account';
      } else {
        value = row[colMap[col]] || '';
      }

      return { value, className, col };
    });

    if (isHeader) {
      return (
        <tr key="header">
          {cells.map(({ col }) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      );
    }

    return cells.map(({ value, className }, idx) => (
      <td key={idx} className={className}>
        {value}
      </td>
    ));
  };

  const handleExport = () => {
    const exportData: any[][] = [];
    
    // Header row
    const header = COLUMN_KEYS.filter(c => colMap[c] != null);
    exportData.push(header);

    // Data rows
    rows.forEach(row => {
      const dataRow: any[] = [];
      COLUMN_KEYS.forEach(col => {
        if (colMap[col] == null) return;
        
        let value = '';
        if (col === 'Sender Account') {
          const sType = row[colMap['Sender Account Type']] || '';
          const sCur = row[colMap['Sender Account Currency']] || '';
          value = findAccountNumber(userAccounts, sType, sCur, selectedPhone);
        } else if (col === 'Receiver Account') {
          const rType = row[colMap['Receiver Account Type']] || '';
          const rCur = row[colMap['Receiver Account Currency']] || '';
          value = findAccountNumber(userAccounts, rType, rCur, selectedPhone);
        } else {
          value = row[colMap[col]] || '';
        }
        dataRow.push(value);
      });
      exportData.push(dataRow);
    });

    exportToExcel(exportData, `${serviceName}_${selectedPhone}.xlsx`, serviceName);
  };

  return (
    <div className="service-container" data-service={serviceName}>
      <h2>{serviceName}</h2>
      <div className="service-controls">
        <label>
          Phone Number:
          <select
            value={selectedPhone}
            onChange={(e) => setSelectedPhone(e.target.value)}
          >
            {phoneNumbers.map(phone => (
              <option key={phone} value={phone}>
                {phone}
              </option>
            ))}
          </select>
        </label>
        <button className="export-btn" onClick={handleExport}>
          Export to Excel
        </button>
      </div>
      <table>
        <thead>
          {renderTableRow([], true)}
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {renderTableRow(row)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
