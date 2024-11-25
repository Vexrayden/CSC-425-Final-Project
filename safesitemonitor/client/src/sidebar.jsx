import React from 'react';
import './sidebar.css'; // CSS for sidebar look
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Arrow icons

const Sidebar = ({ isOpen, toggleSidebar }) => {
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
      </ul>
    </div>
  );
};

export default Sidebar;


