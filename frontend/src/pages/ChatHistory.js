import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";

const ChatHistory = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const { data } = await axiosInstance.get("/api/chat-history/");
        setChatHistory(data.chats || []); // Ensure chatHistory is always an array
        setLoading(false);
      } catch (err) {
        console.error("Error fetching chat history: ", err);
        setError("Failed to load chat history.");
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Chat History</h1>
      <ul>
        {chatHistory.length > 0 ? (
          chatHistory.map((chat) => (
            <li key={chat.id}>
              <Link to={`/chat/${chat.id}`}>{chat.name}</Link>
            </li>
          ))
        ) : (
          <p>No chats available</p>
        )}
      </ul>
    </div>
  );
};

export default ChatHistory;
