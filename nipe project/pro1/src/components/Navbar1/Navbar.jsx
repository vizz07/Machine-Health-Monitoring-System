import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
// ← add FaCog
import './Navbarnew.css';                                                // ← pull in the real CSS file
import { FaBell, FaCog, FaSun, FaMoon, FaBars } from 'react-icons/fa'; 

const Navbar = ({ darkMode, toggleTheme, toggleSidebar }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertsOpen, setAlertsOpen] = useState(false);
  
  // Sample alerts data
  const alerts = [
    { id: 1, machine: 'Laser Cut', status: 'critical', message: 'Motor temperature critical (98°C)', time: '10:23:45 AM' },
    { id: 2, machine: 'Generator 250 KVA', status: 'warning', message: 'Voltage fluctuation detected', time: '09:45:21 AM' },
    { id: 3, machine: 'Press Brake 150T', status: 'critical', message: 'Hydraulic pressure low', time: '08:31:17 AM' },
    { id: 4, machine: 'TPP-AE2510NT', status: 'warning', message: 'Coolant level below threshold', time: 'Yesterday 05:15:33 PM' },
    { id: 5, machine: 'Paint Booth Blue', status: 'critical', message: 'Filter replacement needed', time: 'Yesterday 03:42:11 PM' }
  ];

  // Critical alerts count
  const criticalAlerts = alerts.filter(alert => alert.status === 'critical').length;

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format date and time
  const formatTime = (date) => {
    const options = { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    return date.toLocaleString('en-US', options);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FaBars className="menu-icon" />
        </button>
        <div className="logo">
          <div className="logo-icon">⚙️</div>
          <div className="logo-text">IoT Machine Health Monitoring</div>
        </div>
        <div className="time-display">{formatTime(currentTime)}</div>
      </div>
      
      <div className="navbar-right">
        {/* Alert Notification */}
        <div className="alert-container">
          <button 
            className="alert-button"
            onClick={() => setAlertsOpen(!alertsOpen)}
          >
            <FaBell className="alert-icon" />
            {criticalAlerts > 0 && (
              <span className="alert-count">{criticalAlerts}</span>
            )}
          </button>
          
          {alertsOpen && (
            <div className="alert-dropdown">
              <div className="alert-header">
                <h3>Critical Alerts ({criticalAlerts})</h3>
                <button className="close-btn" onClick={() => setAlertsOpen(false)}>
                  &times;
                </button>
              </div>
              <div className="alert-list">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`alert-item ${alert.status}`}
                  >
                    <div className="alert-machine">
                      <div className="status-indicator"></div>
                      {alert.machine}
                    </div>
                    <div className="alert-message">{alert.message}</div>
                    <div className="alert-timestamp">{alert.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Theme Toggle */}
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <FaSun className="theme-icon sun" />
          ) : (
            <FaMoon className="theme-icon moon" />
          )}
        </button>
        
      <button className="admin-panel-btn">
  <FaUserCircle className="admin-icon" />
</button>


      </div>
    </nav>
  );
};

export default Navbar;