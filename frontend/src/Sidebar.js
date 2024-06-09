// Sidebar.js
import React from "react";
import "./sidebar.css"; // Import the CSS file for the sidebar


const Sidebar = () => {
  return (
    <div className="sidebar">
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
          <a href="#chat_history">Chat history</a>
        </li>
      </ul>
     
    </div>
  );
};

export default Sidebar;
