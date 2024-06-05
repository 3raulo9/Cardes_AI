import React, { useState, useEffect } from "react";
import annyang from "annyang";
import windowedCat from "./static/images/windowed-cat.png";
import catIcon from "./static/images/cat_icon.png";
import anonIcon from "./static/images/anon_icon.png";
import "./maincontent.css";
import Rightbar from "./Rightbar";
import { SlCopyButton } from "@shoelace-style/shoelace/dist/react";
import Typewriter from "typewriter-effect";
import surpriseOptions from "./surpriseData"; // Import surpriseOptions from the other file

const Maincontent = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (annyang) {
      annyang.start({ autoRestart: false, continuous: false });
      annyang.addCallback("result", handleSpeechRecognition);
    }
    return () => {
      if (annyang) {
        annyang.removeCallback("result", handleSpeechRecognition);
        annyang.abort();
      }
    };
  }, []);

  const startListening = () => {
    setIsListening(true);
    annyang.start();
  };

  const stopListening = () => {
    setIsListening(false);
    annyang.abort();
  };

  const handleSpeechRecognition = (phrases) => {
    const speech = phrases[0];
    setValue(speech);
    getResponse(speech);
    stopListening();
  };

  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
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
      const modelResponses = data.split("^").filter((sentence) => sentence.trim()); // Filter out empty sentences
      const newChatItems = modelResponses.map((sentence) => ({
        role: "model",
        parts: [sentence.trim()], // Trim any extra whitespace
      }));
      setChatHistory((oldChatHistory) => [...oldChatHistory, ...newChatItems]);
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

    try {
      const response = await fetch(
        "http://localhost:8000/text-to-speech",
        options
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const audioBlob = await response.blob(); // Get the response as a Blob
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Fetching error: ", error);
      setError("Something went wrong, try again.");
      setLoading(false);
    }
  };

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      getResponse();
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
                    options={{ delay: 8, cursor: "🐾" }}
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

        <div className="button-wrapper">
          <button
            className={`surprise mic-button ${isListening ? "clicked" : ""}`}
            onClick={() => (isListening ? stopListening() : startListening())}
          >
            <sl-icon name="mic" />
          </button>
          <button className="surprise">
            <sl-icon name="file-earmark-image" />
          </button>
        </div>

        <div className="input-container">
          <input
            value={value}
            placeholder="How do I say hello in Greek?"
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          {!error && (
            <button onClick={() => getResponse()}>
              Ask me
              <div class="svg-wrapper-1">
                <div class="svg-wrapper">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path
                      fill="currentColor"
                      d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                    ></path>
                  </svg>
                </div>
              </div>
            </button>
          )}

          {error && <button onClick={clear}>Clear</button>}
        </div>
        <img src={windowedCat} alt="Windowed Cat" className="windowed-cat" />
      </div>
      <Rightbar getResponse={getResponse} />
    </div>
  );
};

export default Maincontent;
