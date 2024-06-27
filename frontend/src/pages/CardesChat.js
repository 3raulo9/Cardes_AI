import React, { useState } from "react";
import windowedCat from "../static/images/windowed-cat.png";
import "../styles/cardeschat.css";
import SuggestBar from "../components/SuggestBar";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import { fetchResponse } from "../utils/fetchUtils";
import ChatItem from "../components/ChatItem";
import surpriseOptions from "../utils/surpriseData";

const CardesChat = ({ isOpen }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTabOpen, setIsTabOpen] = useState(false);
  const [tooltipContent, setTooltipContent] = useState({});
  const [cursorVisibility, setCursorVisibility] = useState({});
  let hasShownCatIcon = false;

  const handleSpeechRecognition = (phrases) => {
    const speech = phrases[0];
    setValue(speech);
    getResponse(speech);
    stopListening();
  };

  const { isListening, startListening, stopListening } = useSpeechRecognition(handleSpeechRecognition);

  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
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

    try {
      const data = await fetchResponse("http://localhost:8000/gemini", options);
      if (data) {
        const modelResponses = data
          .split("^")
          .filter((sentence) => sentence.trim())
          .map((sentence) => sentence.replace(/[.,\/#$%\<>&\*:{}=\-_`~()]/g, "")); // Remove punctuation and dashes
        if (modelResponses.length === 0) {
          modelResponses.push("I didn't catch that try again");
        }
        const newChatItems = modelResponses.map((sentence, index) => ({
          role: "model",
          parts: [sentence.trim()],
          showCardButton: index % 2 !== 0,
          id: Date.now() + index, // Unique id for each message
        }));
        setChatHistory((oldChatHistory) => [...oldChatHistory, ...newChatItems]);
        setValue("");
        setLoading(false);
      }
    } catch (error) {
      console.error("Fetching error: ", error);
      setError("Something went wrong, try again.");
      setLoading(false);
    }
  };

  const handleTextToSpeech = async (text, forDownload = false) => {
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

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (forDownload) {
        const link = document.createElement("a");
        link.href = audioUrl;
        link.download = "audio.mp3";
        link.click();
        setTooltipContent((prev) => ({
          ...prev,
          download: "Downloading...",
        }));
        setTimeout(() => {
          setTooltipContent((prev) => ({
            ...prev,
            download: "Download",
          }));
        }, 2000);
      } else {
        const audio = new Audio(audioUrl);
        audio.play();
        setTooltipContent((prev) => ({
          ...prev,
          listen: "Playing...",
        }));
        setTimeout(() => {
          setTooltipContent((prev) => ({
            ...prev,
            listen: "Listen",
          }));
        }, 2000);
      }
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
    setCursorVisibility({});
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      getResponse();
    }
  };

  const handleAskMeClick = () => {
    getResponse();
  };

  const handleTypingComplete = (id) => {
    setCursorVisibility((prevState) => ({
      ...prevState,
      [id]: true,
    }));
  };

  return (
    <div className={`app ${isOpen ? "" : "sidebar-closed"}`}>
      <div className="search-result">
        {chatHistory.map((chatItem, index) => (
          <ChatItem
            key={chatItem.id}
            chatItem={chatItem}
            index={index}
            cursorVisibility={cursorVisibility}
            tooltipContent={tooltipContent}
            handleTextToSpeech={handleTextToSpeech}
            handleTypingComplete={handleTypingComplete}
            hasShownCatIcon={hasShownCatIcon}
          />
        ))}
        {loading && (
          <div className="skeleton-container">
            <div className="skeleton-icon"></div>
            <div className="skeleton-loader"></div>
          </div>
        )}
      </div>
      <div className="input-container-wrapper">
        <div className="btn-wrapper">
          <button className="surprise" onClick={surprise}>
            test
          </button>
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
            <button onClick={handleAskMeClick}>
              Ask me
              <div className="svg-wrapper-1">
                <div className="svg-wrapper">
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
      <SuggestBar
        getResponse={getResponse}
        isTabOpen={isTabOpen}
        setIsTabOpen={setIsTabOpen}
      />
    </div>
  );
};

export default CardesChat;
