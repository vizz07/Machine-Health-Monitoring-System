import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Navbar1/Sidebar';
import Navbar from '../components/Navbar1/Navbar';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './ReportPage.css';

const ReportPage = ({ darkMode }) => {
  const [machine, setMachine] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [rawData, setRawData] = useState([]);

  const [machinesList] = useState([
    'All', 'Laser Cut', 'Generator 250 KVA', 'TPP-AE2510NT',
    'Bending Machine 100T', 'Press Brake 150T', 'Paint Booth Blue',
    'Shearing M/c', 'Compressor Elgi-129CFM', 'TPP-AE255NT', 'Press Brake 35T'
  ]);

  const handleSubmit = async () => {
    if (!fromDate || !toDate) {
      alert('Please select the date range');
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      alert('From date must be before To date');
      return;
    }

    try {
      const url = `http://localhost:5000/api/report?machine=${encodeURIComponent(machine)}&from=${fromDate}&to=${toDate}`;
      const res = await fetch(url);
      const json = await res.json();

      if (!Array.isArray(json)) {
        alert("Invalid response from server");
        console.error("Invalid response:", json);
        return;
      }

      setRawData(json);
      console.log("✅ RawData received:", json);
    } catch (err) {
      console.error('Failed to fetch data', err);
      alert('Failed to fetch data – check console for details.');
    }
  };

  const parsedData = useMemo(() => {
    const grouped = {};

    rawData.forEach(item => {
      const fullDateTime = `${item.date || ''}T${item.time || ''}`;
      const dateObj = new Date(fullDateTime);

      if (isNaN(dateObj.getTime())) {
        console.warn("❌ Invalid date/time:", item.time, item.date);
        return;
      }

      const dateStr = dateObj.toISOString().split('T')[0];
      const timeStr = dateObj.toTimeString().split(' ')[0];
      const key = `${dateStr}_${item.sensor_id}`;

      if (!grouped[key]) {
        grouped[key] = {
          date: dateStr,
          time: timeStr,
          machine: item.machine_name || 'N/A',
          temperature: 0,
          voltage: 0,
          vibration: 0
        };
      }

      const tag = item.tagname?.toLowerCase();
      if (tag?.includes('temp')) grouped[key].temperature = item.value;
      else if (tag?.includes('volt')) grouped[key].voltage = item.value;
      else if (tag?.includes('vib')) grouped[key].vibration = item.value;
    });

    return Object.values(grouped);
  }, [rawData]);

  const averages = useMemo(() => {
    if (parsedData.length === 0) return { temperature: 0, voltage: 0, vibration: 0 };

    const total = parsedData.reduce(
      (acc, cur) => ({
        temperature: acc.temperature + cur.temperature,
        voltage: acc.voltage + cur.voltage,
        vibration: acc.vibration + cur.vibration,
      }),
      { temperature: 0, voltage: 0, vibration: 0 }
    );

    return {
      temperature: (total.temperature / parsedData.length).toFixed(2),
      voltage: (total.voltage / parsedData.length).toFixed(2),
      vibration: (total.vibration / parsedData.length).toFixed(2),
    };
  }, [parsedData]);

  // Styling (unchanged)
  const containerStyle = {
    marginLeft: '250px',
    marginTop: '70px',
    padding: '1rem 2.5rem 2.5rem',
    backgroundColor: darkMode ? '#1e1e1e' : '#f6f7fb',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, sans-serif',
    color: darkMode ? '#f0f0f0' : '#333',
  };

  const filterBox = {
    background: darkMode ? '#2b2b2b' : '#fff',
    padding: '25px',
    marginBottom: '30px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    borderRadius: '10px',
  };

  const labelStyle = { display: 'block', fontWeight: 600, marginBottom: '8px' };
  const inputStyle = {
    padding: '8px 12px', marginRight: '15px',
    border: '1px solid #ccc', borderRadius: '5px', fontSize: '14px'
  };
  const selectStyle = { ...inputStyle, minWidth: '200px' };
  const buttonStyle = {
    padding: '10px 20px', marginTop: '15px',
    backgroundColor: '#007bff', color: 'white',
    border: 'none', borderRadius: '6px',
    cursor: 'pointer', fontWeight: 'bold'
  };

  const chartContainerStyle = {
    marginTop: '30px',
    backgroundColor: darkMode ? '#2b2b2b' : '#fff',
    padding: '15px', borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    height: 400
  };

  const averageBoxStyle = {
    marginTop: '20px', padding: '15px',
    backgroundColor: darkMode ? '#2b2b2b' : '#fff',
    borderRadius: '10px', display: 'flex',
    justifyContent: 'space-around', fontWeight: '600'
  };

  const tableStyle = {
    width: '100%', borderCollapse: 'collapse',
    backgroundColor: darkMode ? '#2b2b2b' : 'white',
    marginTop: '20px', borderRadius: '5px'
  };

  const thTdStyle = {
    border: '1px solid #e1e1e1', padding: '12px', textAlign: 'left'
  };

  return (
    <>
      <Sidebar darkMode={darkMode} />
      <Navbar darkMode={darkMode} />
      <div style={containerStyle}>
        <div style={filterBox}>
          <h2 style={{ marginBottom: '20px' }}>Generate Report</h2>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Select Machine:</label>
            <select value={machine} onChange={e => setMachine(e.target.value)} style={selectStyle}>
              {machinesList.map((m, i) => <option key={i} value={m}>{m}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>From:</label>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={inputStyle} />
            <label style={{ ...labelStyle, display: 'inline', marginLeft: '20px' }}>To:</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={inputStyle} />
          </div>
          <button
            style={buttonStyle}
            onClick={handleSubmit}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0056b3')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = '#007bff')}
          >
            Generate Report
          </button>
        </div>

        <div style={chartContainerStyle}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={parsedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
              <Line type="monotone" dataKey="voltage" stroke="#82ca9d" />
              <Line type="monotone" dataKey="vibration" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={averageBoxStyle}>
          <div>Avg Temperature: {averages.temperature}</div>
          <div>Avg Voltage: {averages.voltage}</div>
          <div>Avg Vibration: {averages.vibration}</div>
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thTdStyle}>Date</th>
              <th style={thTdStyle}>Time</th>
              <th style={thTdStyle}>Machine</th>
              <th style={thTdStyle}>Temperature</th>
              <th style={thTdStyle}>Voltage</th>
              <th style={thTdStyle}>Vibration</th>
            </tr>
          </thead>
          <tbody>
            {parsedData.length === 0 ? (
              <tr><td colSpan={6} style={thTdStyle}>No data found</td></tr>
            ) : (
              parsedData.map((row, i) => (
                <tr key={i}>
                  <td style={thTdStyle}>{row.date}</td>
                  <td style={thTdStyle}>{row.time}</td>
                  <td style={thTdStyle}>{row.machine}</td>
                  <td style={thTdStyle}>{row.temperature}</td>
                  <td style={thTdStyle}>{row.voltage}</td>
                  <td style={thTdStyle}>{row.vibration}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ReportPage;
