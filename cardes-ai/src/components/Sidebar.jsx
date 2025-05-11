import React, { useState } from "react";
import {
  FiPlus,
  FiSettings,
  FiLogOut,
  FiLayers,
  FiMessageSquare, // Keep this icon for "View Chats"
  FiCompass,
  FiBookOpen,
  FiUsers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Fireworks } from "@fireworks-js/react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [showFireworks, setShowFireworks] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    if (toggleSidebar) { // Check if toggleSidebar is provided before calling
      toggleSidebar(); // Close sidebar after clicking
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Clear token
    // Instead of full page reload, use navigate for SPA behavior if / is a React route
    navigate("/"); // Redirect to landing/login page handled by React Router
    // If "/" truly is outside your React app and requires a full reload, then:
    // window.location.href = "/";
  };

  return (
    <>
      {/* SIDEBAR CONTAINER */}
      <div
        className={`
          fixed inset-y-0 left-0 w-72
          bg-gradient-to-b from-secondary to-darkAccent text-white
          shadow-xl transform
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 z-50
          md:translate-x-0 md:static md:shadow-none
          flex flex-col
        `}
      >
        {/* TOP SECTION: LOGO & DECORATIVE WAVE */}
        <div className="relative flex items-center justify-center h-24 cursor-pointer">
          {/* Decorative wave behind brand */}
          <div className="pointer-events-none absolute bottom-0 left-0 w-full overflow-hidden leading-[0]"></div>
          {/* Brand Name & Fireworks */}
          <button
            onClick={() => handleNavigation("/")} // Use handleNavigation for consistency
            onMouseEnter={() => setShowFireworks(true)}
            onMouseLeave={() => setShowFireworks(false)}
            className="relative text-2xl font-bold tracking-wide focus:outline-none"
          >
            Cardes
            {showFireworks && (
              <Fireworks
                options={{ rocketsPoint: { min: 50, max: 50 } }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
              />
            )}
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* New Chat */}
          <button
            className="flex items-center gap-3 w-full py-3 px-5
                       bg-primary hover:bg-accent
                       transition rounded-xl text-lg font-semibold shadow-md"
            onClick={() => handleNavigation("/chat")} // Navigates to new chat interface
          >
            <FiPlus className="text-xl" />
            New Chat
          </button>

          {/* === MODIFIED View Chats Button === */}
          <button
            className="flex items-center gap-3 w-full py-3 px-5
                       bg-highlight hover:bg-gray-300
                       transition rounded-xl text-lg font-semibold shadow-md text-black mt-4"
            onClick={() => handleNavigation("/chats")} // Changed from alert to navigate
          >
            <FiMessageSquare className="text-xl" />
            View Chats
          </button>
          {/* ================================ */}

          {/* NAV LINKS */}
          <ul className="mt-6 space-y-4">
            <li
              className="flex items-center gap-3 text-lg px-5 py-3 rounded-xl cursor-pointer
                         hover:bg-primary transition font-medium"
              onClick={() => handleNavigation("/categories")}
            >
              <FiLayers className="text-xl" />
              Categories
            </li>
            <li
              className="flex items-center gap-3 text-lg px-5 py-3 rounded-xl cursor-pointer
                         hover:bg-primary transition font-medium"
              onClick={() => handleNavigation("/settings")}
            >
              <FiSettings className="text-xl" />
              Settings
            </li>

            {/* New Options with Alert */}
            <li
              className="flex items-center gap-3 text-lg px-5 py-3 rounded-xl cursor-pointer
             hover:bg-primary transition font-medium"
              onClick={() => handleNavigation("/journey")}
            >
              <FiCompass className="text-xl" />
              Journey
            </li>

            <li
              className="flex items-center gap-3 text-lg px-5 py-3 rounded-xl cursor-pointer
                         hover:bg-primary transition font-medium"
              onClick={() => alert("Courses feature coming soon!")}
            >
              <FiBookOpen className="text-xl" />
              Courses
            </li>
            <li
              className="flex items-center gap-3 text-lg px-5 py-3 rounded-xl cursor-pointer
                         hover:bg-primary transition font-medium"
              onClick={() => alert("Community feature coming soon!")}
            >
              <FiUsers className="text-xl" />
              Community
            </li>
          </ul>
        </div>

        {/* LOGOUT BUTTON */}
        <div className="p-5 border-highlight">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                       bg-red-600 hover:bg-red-700 transition
                       text-white text-lg font-semibold shadow-md"
          >
            <FiLogOut className="text-xl" />
            Log Out
          </button>
        </div>
      </div>

      {/* DARK OVERLAY (Mobile Only) */}
      {isOpen && toggleSidebar && ( // Check if toggleSidebar is provided
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;