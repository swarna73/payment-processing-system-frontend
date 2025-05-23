// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// Import pages from the correct folder under src/pages
import Dashboard from './pages/DashboardPage';
import Login from './pages/LoginPage';

export default function App() {
  const isLoggedIn = Boolean(localStorage.getItem('jwt'));

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* Add other routes here as needed */}
    </Routes>
  );
}

