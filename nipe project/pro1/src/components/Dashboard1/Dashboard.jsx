// components/Dashboard1/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import MachineCard from './MachineCard';
import './Dashboard.css';


const Dashboard = () => {
  const [machines, setMachines] = useState([]);


  useEffect(() => {
    const fetchMachineAlerts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/segregated');
        const data = await res.json();

        const grouped = {};

        data.forEach(entry => {
          const id = entry.sensor_id;
          const tag = entry.tagname.toLowerCase();
          const value = parseFloat(entry.value);
          const time = new Date(entry.time);

          if (!grouped[id]) {
            grouped[id] = {
              id,
              name: entry.machine_name,
              voltage: null,
              temperature: null,
              vibration: null,
              status: 'normal',
              lastUpdated: time,
              chartData: []
            };
          }

          if (tag.includes('volt')) grouped[id].voltage = value;
          if (tag.includes('temp')) grouped[id].temperature = value;
          if (tag.includes('vib')) grouped[id].vibration = value;

          grouped[id].chartData.push({ time: time.toLocaleTimeString(), value });
        });

        Object.values(grouped).forEach(machine => {
          const { temperature, voltage, vibration } = machine;
          if (temperature > 80 || voltage < 210 || voltage > 240 || vibration > 7) {
            machine.status = 'critical';
          } else if (temperature > 60 || vibration > 4) {
            machine.status = 'warning';
          } else {
            machine.status = 'normal';
          }
        });

        const finalMachines = Object.values(grouped);
        console.log("✅ Showing machines:", finalMachines.map(m => m.name));
        setMachines(finalMachines);
      } catch (err) {
        console.error('❌ Error fetching machine alerts:', err.message);
      }
    };

    fetchMachineAlerts();
    const interval = setInterval(fetchMachineAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1>Machine Health Dashboard</h1>
        <p>Real‑time monitoring of industrial equipment status and performance</p>
      </div>

      <div className="machine-grid">
        {machines.map((machine, index) => (
          <MachineCard key={machine.name + index} machine={machine} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;


