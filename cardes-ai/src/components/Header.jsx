import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showHeaderButtons, setShowHeaderButtons] = useState(false);

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  // Listen for scroll events to show/hide header buttons
  useEffect(() => {
    const handleScroll = () => {
      const threshold = 490;
      setShowHeaderButtons(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
  };

  return (
    <header
      className={`
        w-full py-6 px-8 fixed top-0 left-0 bg-opacity-90 bg-secondary shadow-md z-50
        flex items-center transition-all duration-300
        ${showHeaderButtons ? "justify-between" : "justify-center"}
      `}
    >
      {/* Left: Site Title */}
      <h1 className="text-xl sm:text-3xl font-bold cursor-pointer transition hover:text-gray-300">
        <Link to="/">Cardes AI</Link>
      </h1>

      {/* Right: Conditional Navigation */}
      {showHeaderButtons && (
        <nav className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="px-6 py-2 bg-white text-primary font-semibold rounded-full shadow-md hover:bg-gray-200 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-primary text-white font-semibold rounded-full shadow-md hover:bg-darkAccent transition duration-300"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/categories"
                className="px-6 py-2 bg-accent text-white font-semibold rounded-full shadow-md hover:bg-darkAccent transition duration-300"
              >
                Continue Learning
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-accent text-white font-semibold rounded-full shadow-md hover:bg-darkAccent transition duration-300 flex items-center"
              >
                <FiLogOut className="mr-2" /> Logout
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
