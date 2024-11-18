import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import App from './App'; // Home page
import Login from './Login'; // Login page
import Dashboard from './Dashboard'; // Dashboard page
import Emails from './Emails'; // Emails page for MongoDB data
import NotFound from './NotFound'; // NotFound component
import ProtectedRoute from './ProtectedRoute'; // Protect routes for authenticated users
import './index.css'; // Global styles
import reportWebVitals from './reportWebVitals'; // Performance measurement

console.log('React App is starting...');

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/emails"
          element={
            <ProtectedRoute>
              <Emails />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();

