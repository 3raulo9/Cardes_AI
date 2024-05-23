// webapp/CardesAIComponent.js
import React, { useState, useEffect } from "react";
import windowedCat from "./static/images/windowed-cat.png";
import catIcon from "./static/images/cat_icon.png";
import anonIcon from "./static/images/anon_icon.png";
import "./index.css"; // Import the CSS file

import { SlCopyButton } from '@shoelace-style/shoelace/dist/react';

const CardesAIComponent = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [showTypewriterEffect, setShowTypewriterEffect] = useState(false);
  const [newMessageIndex, setNewMessageIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const surpriseOptions = [
    "How are you?",
    "Give me one sentence using the word hope",
    "Who are you?",
  ];
  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Error! Please ask a question!");
      return;
    }

    // Add user's message to chat history
    setChatHistory((oldChatHistory) => [
      ...oldChatHistory,
      {
        role: "user",
        parts: [value],
      },
    ]);

    setLoading(true); // Show the skeleton loader

    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();
      console.log(data);
      setChatHistory((oldChatHistory) => {
        const newIndex = oldChatHistory.length;
        setNewMessageIndex(newIndex);
        setShowTypewriterEffect(true);
        setLoading(false); // Hide the skeleton loader
        return [
          ...oldChatHistory,
          {
            role: "model",
            parts: [data],
          },
        ];
      });
      setValue("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong, try again.");
      setLoading(false); // Hide the skeleton loader in case of error
    }
  };

  useEffect(() => {
    if (showTypewriterEffect) {
      const timer = setTimeout(() => {
        setShowTypewriterEffect(false);
        setNewMessageIndex(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showTypewriterEffect]);

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  };

  return (
    <div className="app">
      <div className="search-result">
        {chatHistory.map((chatItem, index) => (
          <div key={index} className={`chat-item ${chatItem.role}`}>
            <div className="icon">
              <img
                src={chatItem.role === "user" ? anonIcon : catIcon}
                alt={chatItem.role}
                className="chat-icon"
              />
            </div>
            <div className="answer-container">
              <p className={`answer ${showTypewriterEffect && index === newMessageIndex ? 'typed-out' : ''}`}>
                {chatItem.parts.join(" ")}
              </p>
              <button className="copy-button">
                <SlCopyButton value={chatItem.parts.join(" ")} />
              </button>
            </div>
          </div>
        ))}
        {loading && (
          <div className="skeleton-container">
            <div className="skeleton-icon"></div>
            <div className="skeleton-loader"></div>
          </div>
        )}
      </div>
      <div className="input-container-wrapper">
        <p>
          Hello, my name is Cardes
          <button className="surprise" onClick={surprise}>
            test me!
          </button>
        </p>
        <div className="input-container">
          <input
            value={value}
            placeholder="When is Christmas...?"
            onChange={(e) => setValue(e.target.value)}
          />
          {!error && <button onClick={getResponse}>Ask me</button>}
          {error && <button onClick={clear}>Clear</button>}
        </div>
        {error && <p>{error}</p>}
      </div>
      <img src={windowedCat} alt="Windowed Cat" className="windowed-cat" />
    </div>
  );
};

export default CardesAIComponent;
