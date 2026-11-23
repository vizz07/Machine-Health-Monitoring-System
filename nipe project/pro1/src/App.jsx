// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Dashboard1/Login/Login';
import ProtectedRoute from './components/Dashboard1/ProtectedRoute';
import MainLayout from './MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout page="dashboard" />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <MainLayout page="alerts" />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <MainLayout page="report" />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
