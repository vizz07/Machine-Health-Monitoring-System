import React from 'react';
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer 
} from 'recharts';
import Gauge from './Graph';
import './Card.css';

const Card = ({ machine }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <span className="card-icon">⚙</span> {machine.name}
        </div>
        <div className={`status-badge ${machine.status.toLowerCase()}`}>
          {machine.status}
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
        />
        <Gauge 
          title="Temperature" 
          value={machine.temperature} 
          unit="°C" 
          min={20} 
          max={100} 
          thresholds={[60, 80]} 
        />
        <Gauge 
          title="Vibration" 
          value={machine.vibration} 
          unit="mm/s" 
          min={0} 
          max={10} 
          thresholds={[4, 7]} 
        />
      </div>

      <div className="card-body">
        <label>📈 Live Data</label>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={machine.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="time" stroke="var(--chart-axis)" />
            <YAxis stroke="var(--chart-axis)" />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'var(--card-bg)', 
                border: '1px solid var(--card-border)',
                color: 'var(--primary-text)'
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--chart-line)"
              strokeWidth={2}
              dot={{ r: 3, fill: 'var(--chart-dot)' }}
              activeDot={{ r: 5, fill: 'var(--chart-active-dot)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Card;