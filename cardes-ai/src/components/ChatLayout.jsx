import React from "react";

const ChatLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default ChatLayout;

