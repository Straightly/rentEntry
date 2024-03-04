// App.js
import React, { useState } from 'react';
import Papa from 'papaparse';

function App() {
  const [csvData, setCsvData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          if (result.data.length > 1) {
            let parsedData = result.data;
            if (!parsedData[0]['Sequence#']) {
              parsedData = parsedData.map((entry, index) => ({
                ...entry,
                'Sequence#': index + 1,
              }));
            }
            parsedData = parsedData.map((entry) => ({
              ...entry,
              'Amount': parseFloat(entry['Amount']).toFixed(2),
            }));
            setCsvData(parsedData);
          } else {
            alert('The CSV file must have at least one row of data.');
          }
        },
        header: true,
      });
    }
  };

  const sortByColumn = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = csvData.slice(0);
  if (sortConfig.key) {
    sortedData.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (sortConfig.key === 'Sequence#') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return aValue && bValue ? aValue.localeCompare(bValue) : 0;
    });
  }

  const handleSaveAsCSV = () => {
    if (csvData.length === 0) {
      alert('There is no data to save.');
      return;
    }

    let sortedCsvData = csvData.slice(0);
    if (!csvData[0]['Sequence#']) {
      sortedCsvData = sortedCsvData.map((entry, index) => ({
        ...entry,
        'Sequence#': index + 1,
      }));
    }
    sortedCsvData.sort((a, b) => a['Sequence#'] - b['Sequence#']);

    const csvContent = Papa.unparse(sortedCsvData, { header: true });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'data.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <h1>CSV File Loader</h1>
      <input type="file" onChange={handleFileChange} accept=".csv" />
      {csvData.length > 0 && (
        <div>
          <h2>CSV Data:</h2>
          <button onClick={handleSaveAsCSV}>Save as CSV</button>
          <table>
            <thead>
              <tr>
                <th onClick={() => sortByColumn('Sequence#')}>
                  Sequence# {sortConfig.key === 'Sequence#' && (
                    sortConfig.direction === 'asc' ? '↑' : '↓'
                  )}
                </th>
                {Object.keys(csvData[0]).map((key, index) => (
                  key !== 'Sequence#' && (
                    <th key={index} onClick={() => sortByColumn(key)}>
                      {key} {sortConfig.key === key && (
                        sortConfig.direction === 'asc' ? '↑' : '↓'
                      )}
                    </th>
                  )
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{row['Sequence#']}</td>
                  {Object.keys(row).map((key, cellIndex) => (
                    key !== 'Sequence#' && (
                      <td key={cellIndex}>{key === 'Amount' ? parseFloat(row[key]).toFixed(2) : row[key]}</td>
                    )
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
