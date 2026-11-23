import React from 'react';
import './Graph.css';

const Gauge = ({ title, value, unit, min, max, thresholds }) => {
  // Calculate percentage for gauge fill
  const percentage = ((value - min) / (max - min)) * 100;
  
  // Determine gauge color based on thresholds
  let gaugeColor = '#10b981'; // Green - normal
  if (value >= thresholds[0] && value < thresholds[1]) {
    gaugeColor = '#f59e0b'; // Yellow - warning
  } else if (value >= thresholds[1] || value < thresholds[0]) {
    gaugeColor = '#ef4444'; // Red - critical
  }
  
  return (
    <div className="gauge">
      <div className="gauge-title">{title}</div>
      <div className="gauge-value">{value}{unit}</div>
      <div className="gauge-bar">
        <div 
          className="gauge-fill" 
          style={{ 
            width: `${percentage}%`,
            backgroundColor: gaugeColor
          }}
        ></div>
      </div>
      <div className="gauge-labels">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};

export default Gauge;