import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import windowedCat from "./static/images/windowed-cat.png"; // Adjust the path if necessary
import './index.css'; // Import the CSS file

const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [copied, setCopied] = useState(false);

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
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: [value],
        },
        {
          role: "model",
          parts: [data],
        },
      ]);
      setValue("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong, try again.");
    }
  };

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Hide after 2 seconds
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  return (
    <div className="app">
      {copied && <div className="copied-popup">Copied!</div>}
      <div className="search-result">
        {chatHistory.map((chatItem, _index) => (
          <div key={_index} className="chat-item">
            <p className="answer">
              {chatItem.role}: {chatItem.parts.join(" ")}
            </p>
            <button
              className="copy-button"
              onClick={() => copyToClipboard(chatItem.parts.join(" "))}
            >
              <FontAwesomeIcon icon={faCopy} />
            </button>
          </div>
        ))}
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

export default App;
