import React, { useState, useEffect } from "react";
import windowedCat from "./static/images/windowed-cat.png";
import catIcon from "./static/images/cat_icon.png";
import anonIcon from "./static/images/anon_icon.png";
import "./maincontent.css";
import Rightbar from "./Rightbar";
import { SlCopyButton } from "@shoelace-style/shoelace/dist/react";
import Typewriter from "typewriter-effect";

const Maincontent = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const surpriseOptions = [
    "Give me 5 sentences in French for beginners",
    "Give me one sentence using the word hope in German",
    "Give me 10 sentences in Hebrew using the word שלום",
    "Give me 5 sentences in Hebrew using the word שלום",
  ];

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const fetchResponse = async (url, options) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.text();
    } catch (error) {
      console.error("Fetching error: ", error);
      setError("Something went wrong, try again.");
      setLoading(false);
    }
  };

  const getResponse = async (customValue = value) => {
    if (!customValue) {
      setError("Error! Please ask a question!");
      return;
    }

    setChatHistory((oldChatHistory) => [
      ...oldChatHistory,
      { role: "user", parts: [customValue] },
    ]);

    setLoading(true);

    const options = {
      method: "POST",
      body: JSON.stringify({ history: chatHistory, message: customValue }),
      headers: { "Content-Type": "application/json" },
    };

    const data = await fetchResponse("http://localhost:8000/gemini", options);
    if (data) {
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        { role: "model", parts: [data] },
      ]);
      setValue("");
      setLoading(false);
    }
  };

  const handleTextToSpeech = async (text) => {
    const options = {
      method: "POST",
      body: JSON.stringify({ text }),
      headers: { "Content-Type": "application/json" },
    };

    const audioUrl = await fetchResponse("http://localhost:8000/text-to-speech", options);
    if (audioUrl) {
      const audio = new Audio(URL.createObjectURL(await audioUrl.blob()));
      audio.play();
    }
  };

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
              {chatItem.role === "model" ? (
                <div className="typed-out">
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter.typeString(chatItem.parts.join(" ")).start();
                    }}
                    options={{ delay: 20, cursor: "🐾" }}
                  />
                </div>
              ) : (
                <p className="answer">{chatItem.parts.join(" ")}</p>
              )}
              <button className="copy-button" aria-label="Copy text">
                <SlCopyButton value={chatItem.parts.join(" ")} />
              </button>
              <button
                className="audio-button"
                aria-label="Play audio"
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
            Test me!
          </button>
        </p>
        <div className="input-container">
          <input
            value={value}
            placeholder="How do I say hello in Greek?"
            onChange={(e) => setValue(e.target.value)}
          />
          {!error && <button onClick={() => getResponse()}>Ask me</button>}
          {error && <button onClick={clear}>Clear</button>}
        </div>
        <img src={windowedCat} alt="Windowed Cat" className="windowed-cat" />
      </div>
      <Rightbar getResponse={getResponse} />
    </div>
  );
};

export default Maincontent;
