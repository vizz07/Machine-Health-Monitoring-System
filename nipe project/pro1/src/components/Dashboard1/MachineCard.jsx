import React from 'react';
import Gauge from './Gauge';

const MachineCard = ({ machine, darkMode }) => {
  // Status color mapping
  const statusColors = {
    normal: darkMode ? '#34d399' : '#10b981',
    warning: darkMode ? '#fbbf24' : '#f59e0b',
    critical: darkMode ? '#ef4444' : '#ef4444'
  };
  
  // Format last updated time
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`machine-card ${machine.status}`}>
      <div className="card-header">
        <div className="machine-name">{machine.name}</div>
        <div 
          className="status-indicator" 
          style={{ backgroundColor: statusColors[machine.status] }}
        >
          {machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}
        </div>
      </div>
      
      <div className="gauge-container">
        <Gauge 
          title="Voltage" 
          value={machine.voltage} 
          unit="V" 
          min={200} 
          max={250} 
          thresholds={[210, 240]} 
          darkMode={darkMode}
        />
        <Gauge 
          title="Temperature" 
          value={machine.temperature} 
          unit="°C" 
          min={20} 
          max={100} 
          thresholds={[60, 80]} 
          darkMode={darkMode}
        />
        <Gauge 
          title="Vibration" 
          value={machine.vibration} 
          unit="mm/s" 
          min={0} 
          max={10} 
          thresholds={[4, 7]} 
          darkMode={darkMode}
        />
      </div>
      
      <div className="card-footer">
        <span className="last-updated">Last updated: {formatTime(machine.lastUpdated)}</span>
      </div>
    </div>
  );
};

export default MachineCard;