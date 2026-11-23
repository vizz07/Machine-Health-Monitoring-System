import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Navbar from './components/Navbar1/Navbar';
import Sidebar from './components/Navbar1/Sidebar';
import Maindash from './components/Maindashfirst/Maindash';
import Dashboard from './components/Dashboard1/Dashboard';
import ReportPage from './pages/ReportPage';

function MainLayout({ page }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/';
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Maindash darkMode={darkMode} />;
      case 'alerts':
        return <Dashboard darkMode={darkMode} verticalLayout={true} />;
      case 'report':
        return <ReportPage darkMode={darkMode} />;
      default:
        return null;
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      {!isLoginPage && (
        <>
          <Navbar
            darkMode={darkMode}
            toggleTheme={toggleTheme}
            toggleSidebar={toggleSidebar}
          />
          <Sidebar isOpen={sidebarOpen} darkMode={darkMode} onLogout={handleLogout} />
        </>
      )}

      <div className={`main-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="dashboard-content">{renderPage()}</div>
      </div>
    </div>
  );
}

export default MainLayout;
