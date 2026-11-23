// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom'; 
import { 
  FaHome, 
  FaExclamationTriangle, 
  FaBell, 
  FaCog, 
  FaChartBar, 
  FaSignOutAlt 
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isOpen, darkMode }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <FaHome />, path: '/Dashboard' },
    { name: 'Alerts', icon: <FaExclamationTriangle />, path: '/alerts' },
    { name: 'Notifications', icon: <FaBell />, path: '/notifications' },
    { name: 'Settings', icon: <FaCog />, path: '/settings' },
    { name: 'Report', icon: <FaChartBar />, path: '/report' },
    { name: 'Logout', icon: <FaSignOutAlt />, path: '/logout' },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'} ${darkMode ? 'dark' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">MHM</div>
        <div className="sidebar-title">Machine Health</div>
      </div>
      <div className="sidebar-menu">
        {menuItems.map((item) => (
           <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <div className="sidebar-icon">{item.icon}</div>
            <div className="sidebar-text">{item.name}</div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;