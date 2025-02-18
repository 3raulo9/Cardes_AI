import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import ChatItem from "../components/ChatItem";
import ToolsWindow from "../components/ToolsWindow"; // Import the Tools Window component
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import { FiMic, FiMicOff, FiSend, FiTool } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import surpriseOptions from "../utils/surpriseData";

const CardesChat = () => {
  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false); // State for Tools Window

  const handleSpeechRecognition = (phrases) => {
    const speech = phrases[0];
    setValue(speech);
    getResponse(speech);
  };

  const { isListening, startListening, stopListening } =
    useSpeechRecognition(handleSpeechRecognition);

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

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  /**
   * getResponse:
   *   - customValue: The message to send (this may be the internal query)
   *   - shouldAddUserMessage: If true (default), a new user message is added to the UI.
   *   - historyToSend: (optional) A history override to ensure the API call uses the correct chat history.
   */
  const getResponse = async (customValue = value, shouldAddUserMessage = true, historyToSend = null) => {
    if (!customValue) {
      toast.error("Please enter a question!");
      return;
    }
  
    let updatedChatHistory = [];
    if (shouldAddUserMessage) {
      updatedChatHistory = [
        ...chatHistory,
        { role: "user", parts: [customValue], id: Date.now() },
      ];
      setChatHistory(updatedChatHistory);
    } else {
      updatedChatHistory = historyToSend || chatHistory;
    }
  
    setLoading(true);
    setMessageSent(true);
  
    try {
      const { data } = await axiosInstance.post("/api/gemini/", {
        history: updatedChatHistory,
        message: customValue,
      });
  
      console.log("🔍 API Response:", data.text); // 🛠️ Debug log
  
      const splitLines = data?.text
      ?.split("^")
      .map((line) => line.trim())
      .filter((line) => line);
      const modelResponse = [];
      for (let i = 0; i < splitLines.length; i += 2) {
        if (splitLines[i] && splitLines[i + 1]) {
          // First sentence (original)
          modelResponse.push({
            role: "model",
            parts: [splitLines[i]],
            id: Date.now() + i,
            hideIcon: false, // Show cat icon
          });
      
          // Second sentence (translation) - Stores first sentence for "Add to Deck"
          modelResponse.push({
            role: "model",
            parts: [splitLines[i + 1]],
            term: splitLines[i], // Store first sentence as the term
            id: Date.now() + i + 1,
            hideIcon: true, // Hide cat icon, show "Add to Deck" button
          });
        }
      }
      
      
    
    
  
      setChatHistory((oldChatHistory) => [...oldChatHistory, ...modelResponse]);
      setValue("");
    } catch (error) {
      console.error("Fetching error: ", error);
      toast.error("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  /**
   * handleTool3Submit:
   *   - displayMessage: The message to display in the chat UI.
   *   - internalQuery: The reformatted API query.
   */
  const handleTool3Submit = (displayMessage, internalQuery) => {
    setIsToolsOpen(false);
    const newUserMsg = { role: "user", parts: [displayMessage], id: Date.now() };
    const newHistory = [...chatHistory, newUserMsg];
    setChatHistory(newHistory);
    // Call getResponse with the internal query, skipping the addition of a duplicate user message.
    getResponse(internalQuery, false, newHistory);
  };

  const handleTextToSpeech = async (text, forDownload = false) => {
    try {
      const response = await axiosInstance.post(
        "/api/text-to-speech/",
        { text },
        { responseType: "blob" }
      );
      const audioBlob = response.data;
      const audioUrl = URL.createObjectURL(audioBlob);
      if (forDownload) {
        const link = document.createElement("a");
        link.href = audioUrl;
        link.download = "audio.mp3";
        link.click();
        toast.info("Downloading audio...");
      } else {
        const audio = new Audio(audioUrl);
        audio.play();
        toast.info("Playing audio...");
      }
    } catch (error) {
      console.error("Fetching error: ", error);
      toast.error("Something went wrong with text-to-speech.");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      getResponse();
    }
  };

  const clear = () => {
    setValue("");
    setChatHistory([]);
    localStorage.removeItem("chatHistory");
    setMessageSent(false);
    toast.success("Chat cleared!");
  };

  return (
    <div className="flex h-screen bg-primary">
      <div className="flex-1 relative bg-darkAccent p-4 sm:p-6">
        <div className="h-[60vh] md:h-[70vh] overflow-y-auto p-4 bg-white rounded-xl shadow-lg flex flex-col space-y-2">
          {chatHistory.map((chatItem) => (
            <ChatItem
              key={chatItem.id}
              chatItem={chatItem}
              handleTextToSpeech={handleTextToSpeech}
              updateMessage={() => {}}
            />
          ))}
          {loading && (
            <div className="text-center text-gray-500 animate-pulse">
              Loading...
            </div>
          )}
        </div>

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
              <button
                onClick={surprise}
                className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-secondary"
              >
                Surprise Me
              </button>

              <button
                className={`p-2 rounded-full ${
                  isListening ? "bg-red-500" : "bg-secondary"
                } text-white`}
                onClick={() =>
                  isListening ? stopListening() : startListening()
                }
              >
                {isListening ? <FiMicOff /> : <FiMic />}
              </button>

              <button
                className="p-2 bg-secondary text-white rounded-full hover:bg-accent transition duration-200"
                onClick={() => setIsToolsOpen(true)}
              >
                <FiTool />
              </button>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => getResponse()}
                className="bg-primary text-white px-4 py-2 rounded-full hover:bg-accent"
              >
                <FiSend className="inline" /> Send
              </button>

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
