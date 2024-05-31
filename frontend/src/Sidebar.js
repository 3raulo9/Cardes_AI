// Sidebar.js
import React from "react";
import "./sidebar.css"; // Import the CSS file for the sidebar

import logo from "./static/images/cardes_logo.png"; // Import the logo image

const Sidebar = () => {
  return (
    <div className="sidebar">
      <img src={logo} alt="Cardes AI Logo" className="sidebar-logo" />
      <ul>
        <li>
          <a href="#home">Home</a>
        </li>
        <li>
          <a href="#learn">Learn</a>
        </li>
        <li>
          <a href="#flashcard">Flashcards</a>
        </li>
        <li>
          <a href="#texts">Texts</a>
        </li>
        <li>
          <a href="#chat_history">chat history</a>
        </li>
      </ul>
     
    </div>
  );
};

export default Sidebar;
