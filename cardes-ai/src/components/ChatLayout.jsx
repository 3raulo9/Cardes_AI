import React from "react";
import Sidebar from "./Sidebar";

const ChatLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default ChatLayout;
