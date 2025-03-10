// CardesChat.js
import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import ChatItem from "../components/ChatItem";
import ToolsWindow from "../components/ToolsWindow";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import { FiMic, FiMicOff, FiSend, FiTool } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import surpriseOptions from "../utils/surpriseData";
import handleTextToSpeech from "../utils/handleTextToSpeech"; 
import TutorialOverlay from "../components/TutorialOverlay"; // <--- Make sure this path is correct

const CardesChat = () => {
  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  // For speech recognition
  const handleSpeechRecognition = (phrases) => {
    const speech = phrases[0];
    setValue(speech);
    getResponse(speech);
  };
  const { isListening, startListening, stopListening } =
    useSpeechRecognition(handleSpeechRecognition);

  // On mount, set up auth header & load chat history if present
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    const savedChatHistory = localStorage.getItem("chatHistory");
    if (savedChatHistory) {
      setChatHistory(JSON.parse(savedChatHistory));
    }
  }, []);

  // Whenever chatHistory changes, save it
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  // "Surprise me" button logic
  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  /**
   * Generic function to get a response from the server (the chatbot).
   * @param customValue - text to send
   * @param shouldAddUserMessage - whether to add user text to the chat history
   * @param historyToSend - a chat history array to pass along
   */
  const getResponse = async (
    customValue = value,
    shouldAddUserMessage = true,
    historyToSend = chatHistory
  ) => {
    // Validate input
    if (!customValue) {
      toast.error("Please enter a question!");
      return;
    }

    // Optionally add user message to chat
    let updatedChatHistory = shouldAddUserMessage
      ? [...historyToSend, { role: "user", parts: [customValue], id: Date.now() }]
      : historyToSend;

    setChatHistory(updatedChatHistory);

    setLoading(true);
    setMessageSent(true);

    try {
      const { data } = await axiosInstance.post("/api/gemini/", {
        history: updatedChatHistory,
        message: customValue,
      });

      console.log("🔍 API Response:", data.text);

      // The server response might contain '^' to separate sections
      const splitLines = data?.text
        ?.split("^")
        .map((line) => line.trim())
        .filter((line) => line);

      // Build an array of model messages
      const modelResponse = [];
      for (let i = 0; i < splitLines.length; i++) {
        if (i % 2 === 0) {
          modelResponse.push({
            role: "model",
            parts: [splitLines[i]],
            id: Date.now() + i,
            hideIcon: false,
          });
        } else {
          modelResponse.push({
            role: "model",
            parts: [splitLines[i]],
            term: splitLines[i - 1], // The preceding chunk
            id: Date.now() + i,
            hideIcon: true,
          });
        }
      }

      // Append the model messages to the chat
      setChatHistory((prevChat) => [...prevChat, ...modelResponse]);
      setValue("");
    } catch (error) {
      console.error("Fetching error: ", error);
      toast.error("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Called when a tool (e.g., Tool3) is submitted
  const handleTool3Submit = (displayMessage, internalQuery) => {
    setIsToolsOpen(false);
    // Add user message to chat
    const newUserMsg = {
      role: "user",
      parts: [displayMessage],
      id: Date.now(),
    };
    const newHistory = [...chatHistory, newUserMsg];
    setChatHistory(newHistory);
    // Send the internal query to the model, but don't add user message again
    getResponse(internalQuery, false, newHistory);
  };

  // Send on Enter
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      getResponse();
    }
  };

  // Clear the chat
  const clear = () => {
    setValue("");
    setChatHistory([]);
    localStorage.removeItem("chatHistory");
    setMessageSent(false);
    toast.success("Chat cleared!");
  };

  return (
    <div className="flex h-screen bg-primary">
      {/* The SINGLE tutorial overlay for the chatbot */}
      <TutorialOverlay tutorialID="chatbot" />

      <div className="flex-1 relative bg-gradient-to-r from-primary via-[-10%] via-darkAccent p-4 sm:p-6">
        {/* Chat messages area */}
        <div className="h-[60vh] md:h-[70vh] overflow-y-auto p-4 bg-white rounded-xl shadow-lg flex flex-col space-y-2">
          {chatHistory.map((chatItem) => (
            <ChatItem
              key={chatItem.id}
              chatItem={chatItem}
              handleTextToSpeech={handleTextToSpeech} // TTS on each message
              updateMessage={() => {}} // If you want to support message editing
            />
          ))}
          {loading && (
            <div className="text-center text-gray-500 animate-pulse">
              Loading...
            </div>
          )}
        </div>

        {/* Input area + Buttons */}
        <div className="mt-6 space-y-4">
          <input
            value={value}
            placeholder="Message Cardes AI..."
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full border border-gray-300 rounded-full p-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-2">
              {/* Surprise Me button */}
              <button
                onClick={surprise}
                className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-secondary"
              >
                Surprise Me
              </button>

              {/* Mic toggle */}
              <button
                className={`p-2 rounded-full ${
                  isListening ? "bg-red-500" : "bg-secondary"
                } text-white`}
                onClick={() => (isListening ? stopListening() : startListening())}
              >
                {isListening ? <FiMicOff /> : <FiMic />}
              </button>

              {/* Tools window open */}
              <button
                className="p-2 bg-secondary text-white rounded-full hover:bg-accent transition duration-200"
                onClick={() => setIsToolsOpen(true)}
              >
                <FiTool />
              </button>
            </div>

            <div className="flex space-x-2">
              {/* Send Button */}
              <button
                onClick={() => getResponse()}
                className="bg-primary text-white px-4 py-2 rounded-full hover:bg-accent"
              >
                <FiSend className="inline" /> Send
              </button>

              {/* Clear Chat Button */}
              {messageSent && (
                <button
                  onClick={clear}
                  className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
                >
                  Clear Chat
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ToolsWindow for extra features, e.g. "Tool3Submit" */}
        <ToolsWindow
          isOpen={isToolsOpen}
          onClose={() => setIsToolsOpen(false)}
          onTool3Submit={handleTool3Submit}
        />
        <ToastContainer />
      </div>
    </div>
  );
};

export default CardesChat;
