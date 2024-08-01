import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/sidebar.css"; // Correct relative import path

const Sidebar = ({ setLoading }) => {
  const location = useLocation();
  const accessToken = localStorage.getItem('accessToken');

  const handleNavigation = () => {
    setLoading(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/login'; // Redirect to login page after logout
  };

  return (
    <div className="sidebar">
      <ul>
        {location.pathname === "/" ? (
          <>
            <li>
              <Link to="/chat" onClick={handleNavigation}>
                <sl-icon className="sl-icon" name="chat"></sl-icon>
                Chat
              </Link>
            </li>
            <li>
              <Link to="/learn" onClick={handleNavigation}>
                <sl-icon className="sl-icon" name="lightning-charge"></sl-icon>
                Learn
              </Link>
            </li>
            <li>
              <Link to="/flashcards" onClick={handleNavigation}>
                <sl-icon className="sl-icon" name="card-text"></sl-icon>
                Flashcards
              </Link>
            </li>
            <li>
              <Link to="/texts" onClick={handleNavigation}>
                <sl-icon className="sl-icon" name="textarea-t"></sl-icon>
                Texts
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/" onClick={handleNavigation}>
                <sl-icon className="sl-icon" name="house"></sl-icon>
                Home
              </Link>
            </li>
            <li>
              <Link to="/learn" onClick={handleNavigation}>
                <sl-icon className="sl-icon" name="lightning-charge"></sl-icon>
                Learn
              </Link>
            </li>
            <li>
              <Link to="/flashcards" onClick={handleNavigation}>
                <sl-icon className="sl-icon" name="card-text"></sl-icon>
                Flashcards
              </Link>
            </li>
            <li>
              <Link to="/texts" onClick={handleNavigation}>
                <sl-icon className="sl-icon" name="textarea-t"></sl-icon>
                Texts
              </Link>
            </li>
            <li>
              <Link to="/chat_history" onClick={handleNavigation}>
                <sl-icon className="sl-icon" name="clock-history"></sl-icon>
                Chat history
              </Link>
            </li>
            <li>
              <Link to="/register" onClick={handleNavigation}>
                <sl-icon className="sl-icon" name="person-add"></sl-icon>
                Register
              </Link>
            </li>
          </>
        )}
        {accessToken ? (
          <li>
            <button onClick={handleLogout} className="logout-button">
              <sl-icon className="sl-icon" name="logout"></sl-icon>
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link to="/login" onClick={handleNavigation}>
              <sl-icon className="sl-icon" name="login"></sl-icon>
              Login
            </Link>
          </li>
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
