import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App'; // Home page
import Login from './Login'; // Login page
import Dashboard from './Dashboard'; // Dashboard page
import Emails from './Emails'; // Emails page for MongoDB data
import NotFound from './NotFound'; // NotFound component
import './index.css'; // Global styles
import reportWebVitals from './reportWebVitals'; // Performance measurement
import ProtectedRoute from './ProtectedRoute'; // Protect routes for authenticated users

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Login" element={<Login />} />
        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Emails"
          element={
            <ProtectedRoute>
              <Emails />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();


