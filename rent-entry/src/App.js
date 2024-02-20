import React, { useState } from 'react';

function App() {
  const [entries, setEntries] = useState([]);
  const [date, setDate] = useState('');
  const [property, setProperty] = useState('');
  const [unit, setUnit] = useState('');
  const [amount, setAmount] = useState('');
  const [fileName, setFileName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      date,
      property,
      unit,
      amount: parseFloat(amount).toFixed(2),
    };
    setEntries([...entries, newEntry]);
    // Clear only the unit and amount fields
    setUnit('');
    setAmount('');
  };

  const handleSave = () => {
    const data = JSON.stringify(entries, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = JSON.parse(event.target.result);
      setEntries(data); // Replace existing entries with loaded entries
    };
    reader.readAsText(file);
  };

  // Calculate the sum of all amounts
  const totalAmount = entries.reduce((total, entry) => total + parseFloat(entry.amount), 0).toFixed(2);

  return (
    <div>
      <h1>Data Entry Application</h1>
      <div>
        <input type="file" onChange={handleFileChange} />
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <br />
        <label>
          Property:
          <input type="text" value={property} onChange={(e) => setProperty(e.target.value)} required />
        </label>
        <br />
        <label>
          Unit:
          <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} required />
        </label>
        <br />
        <label>
          Amount:
          <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <h2>Collected Entries:</h2>
      <ul>
        {entries.map((entry, index) => (
          <li key={index}>
            <strong>Date:</strong> {entry.date}, <strong>Property:</strong> {entry.property}, <strong>Unit:</strong>{' '}
            {entry.unit}, <strong>Amount:</strong> {entry.amount}
          </li>
        ))}
      </ul>
      <h2>Total Amount: {totalAmount}</h2>
      <div>
        <label>
          Enter File Name:
          <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} />
        </label>
        <button onClick={handleSave}>Save as JSON</button>
      </div>
    </div>
  );
}

export default App;
