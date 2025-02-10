import React, { useState } from "react";
import Sidebar from "./Sidebar";

const ChatLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-primary relative">
      {/* Sidebar is globally controlled here */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* 🛠️ Mobile Sidebar Toggle Button - Faster Fade Effect */}
        <button
          className={`md:hidden fixed top-4 left-4 z-50 bg-secondary p-3 rounded-full text-white shadow-lg transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          onClick={() => setIsSidebarOpen(true)}
        >
          ☰
        </button>

        {children}
      </div>
    </div>
  );
};

export default ChatLayout;
