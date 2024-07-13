import React from "react";
import { Link } from "react-router-dom";

const ChatHistory = () => {
  const chatHistory = [
    { id: 1, name: "First Chat" },
    { id: 2, name: "Second Chat" },
    { id: 3, name: "Third Chat" },
  ];

  return (
    <div>
      <h1>Chat History</h1>
      <ul>
        {chatHistory.map((chat) => (
          <li key={chat.id}>
            <Link to={`/chat/${chat.id}`}>{chat.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatHistory;
