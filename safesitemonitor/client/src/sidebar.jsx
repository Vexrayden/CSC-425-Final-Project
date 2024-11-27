import React from 'react';
import './sidebar.css'; // CSS for sidebar look
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Arrow icons
import { useNavigate } from 'react-router-dom'; // For navigation

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the authentication token
    localStorage.removeItem('token');

    // Navigate to the login screen
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isOpen ? <FaArrowLeft /> : <FaArrowRight />} {/* Arrow icon toggle */}
        </button>
      </div>
      <ul className={`sidebar-links ${isOpen ? 'show' : ''}`}>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/emails">Emails</a></li>
        <li><a href="/profile">Profile</a></li>
        <li>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;



