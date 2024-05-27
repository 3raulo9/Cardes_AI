// Sidebar.js
import React from 'react';
import './sidebar.css'; // Import the CSS file for the sidebar

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Cardes AI 🐾</h2>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#contact">Learn</a></li>
        <li><a href="#services">Flashcards</a></li>
        <li><a href="#clients">Texts</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
