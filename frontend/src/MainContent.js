import React, { useState, useEffect } from "react";
import windowedCat from "./static/images/windowed-cat.png";
import catIcon from "./static/images/cat_icon.png";
import anonIcon from "./static/images/anon_icon.png";
import "./maincontent.css";

import { SlCopyButton } from "@shoelace-style/shoelace/dist/react";
import Typewriter from "typewriter-effect";

const Maincontent = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
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

    setChatHistory((oldChatHistory) => [
      ...oldChatHistory,
      {
        role: "user",
        parts: [value],
      },
    ]);

    setLoading(true);

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
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "model",
          parts: [data],
        },
      ]);
      setValue("");
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Something went wrong, try again.");
      setLoading(false);
    }
  };

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  };

  const handleTextToSpeech = async (text) => {
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/text-to-speech", options);
      if (response.ok) {
        const audioUrl = URL.createObjectURL(await response.blob());
        const audio = new Audio(audioUrl);
        audio.play();
      } else {
        console.error("Error generating the audio");
      }
    } catch (error) {
      console.error("Error generating the audio", error);
    }
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
              {chatItem.role === "model" ? (
                <div className="typed-out">
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter.typeString(chatItem.parts.join(" ")).start();
                    }}
                    options={{
                      delay: 20,
                      cursor: "🐾",
                    }}
                  />
                </div>
              ) : (
                <p className="answer">{chatItem.parts.join(" ")}</p>
              )}
              <button className="copy-button">
                <SlCopyButton value={chatItem.parts.join(" ")} />
              </button>
              <button
                className="audio-button"
                onClick={() => handleTextToSpeech(chatItem.parts.join(" "))}
              >
                <sl-icon name="volume-down-fill" />
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
        <img src={windowedCat} alt="Windowed Cat" className="windowed-cat" />
      </div>
    </div>
  );
};

export default Maincontent;
