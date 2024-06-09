import React from "react";
import "./sidebar.css"; // Import the CSS file for the sidebar

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <a href="#home">
            <sl-icon className="sl-icon" name="house"></sl-icon>
            Home
          </a>
        </li>
        <li>
          <a href="#learn">
            <sl-icon className="sl-icon" name="lightning-charge"></sl-icon>
            Learn
          </a>
        </li>
        <li>
          <a href="#flashcard">
            <sl-icon className="sl-icon" name="card-text"></sl-icon>
            Flashcards
          </a>
        </li>
        <li>
          <a href="#texts">
            <sl-icon className="sl-icon" name="textarea-t"></sl-icon>
            Texts
          </a>
        </li>
        <li>
          <a href="#chat_history">
            <sl-icon className="sl-icon" name="clock-history"></sl-icon>
            Chat history
          </a>
        </li>
      </ul>
      <div className="footer">
        <p className="footer-text">
          Raul Asadov 2024
          <a href="https://www.linkedin.com/in/raul-asadov-b2083a255/" target="_blank" rel="noopener noreferrer">
            <sl-icon style={{ color: "white" }} className="footer-icon" name="linkedin"></sl-icon>
          </a> 
          Cardes AI &copy;
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
