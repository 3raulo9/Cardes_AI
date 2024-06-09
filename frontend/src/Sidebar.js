// Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css"; // Import the CSS file for the sidebar

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <ul>
        {location.pathname === "/" ? (
          <>
            <li>
              <Link to="/chat">
                <sl-icon className="sl-icon" name="chat"></sl-icon>
                Chat
              </Link>
            </li>
            <li>
              <Link to="/learn">
                <sl-icon className="sl-icon" name="lightning-charge"></sl-icon>
                Learn
              </Link>
            </li>
            <li>
              <Link to="/flashcards">
                <sl-icon className="sl-icon" name="card-text"></sl-icon>
                Flashcards
              </Link>
            </li>
            <li>
              <Link to="/texts">
                <sl-icon className="sl-icon" name="textarea-t"></sl-icon>
                Texts
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/">
                <sl-icon className="sl-icon" name="house"></sl-icon>
                Home
              </Link>
            </li>
            <li>
              <Link to="/learn">
                <sl-icon className="sl-icon" name="lightning-charge"></sl-icon>
                Learn
              </Link>
            </li>
            <li>
              <Link to="/flashcards">
                <sl-icon className="sl-icon" name="card-text"></sl-icon>
                Flashcards
              </Link>
            </li>
            <li>
              <Link to="/texts">
                <sl-icon className="sl-icon" name="textarea-t"></sl-icon>
                Texts
              </Link>
            </li>
            <li>
              <Link to="/chat_history">
                <sl-icon className="sl-icon" name="clock-history"></sl-icon>
                Chat history
              </Link>
            </li>
          </>
        )}
      </ul>
      <div className="footer">
        <p className="footer-text">
          <div>Raul Asadov 2024</div>
          <a
            href="https://www.linkedin.com/in/raul-asadov-b2083a255/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <sl-icon
              style={{ color: "rgba(247, 243, 243, 0.863)" }}
              className="footer-icon"
              name="linkedin"
            ></sl-icon>
          </a>
          <div>Cardes AI &copy;</div>
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
