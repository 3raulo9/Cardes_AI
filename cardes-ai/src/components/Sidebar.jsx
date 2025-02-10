import React from "react";
import { FiPlus, FiSettings, FiHelpCircle, FiLogOut, FiLayers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    toggleSidebar(); // Close sidebar after clicking
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Clear token
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-primary text-highlight shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50 md:translate-x-0 md:static md:shadow-none flex flex-col`}
      >
        <div className="p-6 text-center font-bold text-2xl border-b border-secondary">
          Cardes AI
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <button
            className="flex items-center gap-2 w-full py-3 px-4 bg-secondary hover:bg-accent rounded-lg mb-4 text-white"
            onClick={() => handleNavigation("/chat")}
          >
            <FiPlus /> New Chat
          </button>
          <ul className="space-y-4">
            <li
              className="hover:bg-accent p-3 rounded-lg flex items-center gap-2 cursor-pointer"
              onClick={() => handleNavigation("/categories")}
            >
              <FiLayers /> Categories
            </li>
            <li
              className="hover:bg-accent p-3 rounded-lg flex items-center gap-2 cursor-pointer"
              onClick={toggleSidebar}
            >
              <FiSettings /> Settings
            </li>
            <li
              className="hover:bg-accent p-3 rounded-lg flex items-center gap-2 cursor-pointer"
              onClick={toggleSidebar}
            >
              <FiHelpCircle /> Help
            </li>
          </ul>
        </div>
        <div className="p-4 border-t border-secondary">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full py-2 rounded-lg bg-secondary hover:bg-red-700 text-white"
          >
            <FiLogOut /> Log Out
          </button>
        </div>
      </div>

      {/* Faster Fade Effect on Dark Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
