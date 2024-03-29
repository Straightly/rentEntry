import React, { useState } from 'react';

const properties = ["2604", "ChinaTown", "Marie", "Sacajawea", "Yakima", "Ruby"];

function App() {
  const [entries, setEntries] = useState([]);
  const [date, setDate] = useState('');
  const [property, setProperty] = useState('');
  const [unit, setUnit] = useState('');
  const [amount, setAmount] = useState('');
  const [fileName, setFileName] = useState('');
  const [sequence, setSequence] = useState(1);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [positionToAdd, setPositionToAdd] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      id: sequence,
      date,
      property,
      unit,
      amount: parseFloat(amount).toFixed(2),
    };
    if (selectedEntry) {
      const updatedEntries = entries.map((entry) => {
        if (entry.id === selectedEntry.id) {
          return {
            ...entry,
            date,
            property,
            unit,
            amount: parseFloat(amount).toFixed(2),
          };
        }
        return entry;
      });
      setEntries(updatedEntries);
      setSelectedEntry(null); // Clear selected entry after updating
    } else {
      let newEntries = [...entries];
      if (positionToAdd !== '') {
        const position = parseInt(positionToAdd);
        newEntries.splice(position - 1, 0, { ...newEntry, id: position }); // Insert at the specified position
      } else {
        newEntry.id = sequence;
        newEntries.push(newEntry); // Add to the bottom if no position specified
      }
      // Update sequence numbers
      newEntries = newEntries.map((entry, index) => ({
        ...entry,
        id: index + 1,
      }));
      setEntries(newEntries);
      setSequence(newEntries.length + 1); // Increment sequence number
    }
    // Clear only the unit and amount fields after submission
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
      const lastEntry = data[data.length - 1];
      if (lastEntry) {
        setSequence(lastEntry.id + 1); // Update sequence number based on the last loaded entry
      }
    };
    reader.readAsText(file);
  };

  const handleEntrySelect = (entry) => {
    setSelectedEntry(entry);
    setDate(entry.date);
    setProperty(entry.property);
    setUnit(entry.unit);
    setAmount(entry.amount);
  };

  const handleDelete = (id) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    // Reassign IDs to make them continuous
    const updatedEntriesWithContinuousIds = updatedEntries.map((entry, index) => ({
      ...entry,
      id: index + 1,
    }));
    setEntries(updatedEntriesWithContinuousIds);
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
          <select
            value={property}
            onChange={(e) => setProperty(e.target.value)}
            required
          >
            <option value="">Select Property</option>
            {properties.map((prop, index) => (
              <option key={index} value={prop}>{prop}</option>
            ))}
          </select>
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
        <button type="submit">{selectedEntry ? 'Update' : 'Submit'}</button>
        {!selectedEntry && (
          <label>
            Position to Add:
            <input
              type="number"
              value={positionToAdd}
              onChange={(e) => setPositionToAdd(e.target.value)}
              min="1"
              step="1"
            />
          </label>
        )}
      </form>
      <h2>Collected Entries:</h2>
      <table>
        <thead>
          <tr>
            <th>Sequence</th>
            <th>Date</th>
            <th>Property</th>
            <th>Unit</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr
              key={index}
              onClick={() => handleEntrySelect(entry)}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedEntry && selectedEntry.id === entry.id ? '#f0f0f0' : 'transparent',
              }}
            >
              <td>{entry.id}</td>
              <td>{entry.date}</td>
              <td>{entry.property}</td>
              <td>{entry.unit}</td>
              <td style={{ textAlign: 'right' }}>{entry.amount}</td>
              <td><button onClick={() => handleDelete(entry.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
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
