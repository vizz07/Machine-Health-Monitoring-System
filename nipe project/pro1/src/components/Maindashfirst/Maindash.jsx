import React, { useState, useEffect } from 'react';
import Card from './Card';
import axios from 'axios';
import './Maindash.css';

const Dashboard = ({ isSidebarOpen }) => {
  const [machineData, setMachineData] = useState([]);

  useEffect(() => {
    const fetchMachineData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/segregated');

        const grouped = {};

        res.data.forEach(entry => {
          const id = entry.sensor_id;
          const tag = entry.tagname.toLowerCase();
          const value = parseFloat(entry.value);
          const time = new Date(entry.time).toLocaleTimeString();

          if (!grouped[id]) {
            grouped[id] = {
              name: entry.machine_name,
              voltage: null,
              temperature: null,
              vibration: null,
              chartData: [],
              status: 'Operational'
            };
          }

          if (tag.includes("volt")) grouped[id].voltage = value;
          if (tag.includes("temp")) grouped[id].temperature = value;
          if (tag.includes("vib")) grouped[id].vibration = value;

          grouped[id].chartData.push({ time, value });
        });

        Object.values(grouped).forEach(machine => {
          const { temperature, voltage, vibration } = machine;
          if (temperature > 80 || voltage < 210 || voltage > 240 || vibration > 7) {
            machine.status = 'Critical';
          } else if (temperature > 60 || vibration > 4) {
            machine.status = 'Warning';
          } else {
            machine.status = 'Operational';
          }
        });

        const allowedMachines = [
          'Laser Cut',
          'Generator 250 KVA',
          'TPP-AE2510NT',
          'Bending Machine 100T',
          'Press Brake 150T',
          'Paint Booth Blue',
          'Shearing M/c',
          'Compressor Elgi-129CFM',
          'TPP-AE255NT',
          'Press Brake 35T'
        ];

        const filteredMachines = Object.values(grouped).filter(machine =>
          allowedMachines.includes(machine.name)
        );

        setMachineData(filteredMachines);
      } catch (err) {
        console.error("❌ Error fetching data:", err.message);
      }
    };

    fetchMachineData();
    const interval = setInterval(fetchMachineData, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`main-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Machine Health Dashboard</h1>
          <div className="dashboard-status">
            <div className="dashboard-status-dot"></div>
            <span>Live Data Streaming</span>
          </div>
        </div>

        <div className="grid">
          {machineData.map((machine, index) => (
            <Card key={index} machine={machine} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
