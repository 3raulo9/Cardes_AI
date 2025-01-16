import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import ChatItem from "../components/ChatItem";
import Sidebar from "../components/Sidebar";
import SuggestBar from "../components/SuggestBar";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import { FiMic, FiMicOff, FiCopy, FiSend, FiMenu } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import surpriseOptions from "../utils/surpriseData";

const CardesChat = () => {
  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTabOpen, setIsTabOpen] = useState(false);

  const handleSpeechRecognition = (phrases) => {
    const speech = phrases[0];
    setValue(speech);
    getResponse(speech);
  };

  const { isListening, startListening, stopListening } = useSpeechRecognition(handleSpeechRecognition);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const getResponse = async (customValue = value) => {
    if (!customValue) {
      toast.error("Please enter a question!");
      return;
    }

    setChatHistory((oldChatHistory) => [
      ...oldChatHistory,
      { role: "user", parts: [customValue], id: Date.now() },
    ]);

    setLoading(true);

    try {
      const { data } = await axiosInstance.post("/api/gemini/", {
        history: chatHistory,
        message: customValue,
      });

      const modelResponse = data?.text
        ?.split("^")
        .filter((sentence) => sentence.trim())
        .map((sentence, index) => ({
          role: "model",
          parts: [sentence],
          id: Date.now() + index,
        }));

      setChatHistory((oldChatHistory) => [...oldChatHistory, ...modelResponse]);
      setValue("");
    } catch (error) {
      console.error("Fetching error: ", error);
      toast.error("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      getResponse();
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const clear = () => {
    setValue("");
    setChatHistory([]);
    toast.success("Chat cleared!");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="flex h-screen bg-primary">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 relative bg-darkAccent p-6">
        <button
          className="md:hidden bg-secondary text-white p-2 rounded-lg mb-4"
          onClick={toggleSidebar}
        >
          <FiMenu size={24} />
        </button>

        <div className="h-[65vh] overflow-y-auto p-4 bg-white rounded-xl shadow-lg space-y-4">
          {chatHistory.map((chatItem, index) => (
            <ChatItem
              key={chatItem.id}
              chatItem={chatItem}
              index={index}
              handleTextToSpeech={(text) => toast.info(`Playing audio: ${text}`)}
            >
              <button
                className="text-gray-500 hover:text-gray-700 ml-2"
                onClick={() => copyToClipboard(chatItem.parts.join(" "))}
                aria-label="Copy to clipboard"
              >
                <FiCopy />
              </button>
            </ChatItem>
          ))}
          {loading && (
            <div className="text-center text-gray-500 animate-pulse">Loading...</div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={surprise}
            className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-secondary transition"
          >
            Surprise Me
          </button>
          <button
            className={`p-2 rounded-full ${isListening ? "bg-red-500" : "bg-secondary"} text-white`}
            onClick={() => (isListening ? stopListening() : startListening())}
            aria-label="Toggle microphone"
          >
            {isListening ? <FiMicOff /> : <FiMic />}
          </button>
          <input
            value={value}
            placeholder="Ask me something..."
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => getResponse()}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent"
          >
            <FiSend />
          </button>
        </div>

        <button
          onClick={clear}
          className="mt-4 w-full bg-accent text-white py-2 rounded-lg hover:bg-darkAccent"
        >
          Clear Chat
        </button>

        <ToastContainer />
      </div>

      <SuggestBar getResponse={getResponse} isTabOpen={isTabOpen} setIsTabOpen={setIsTabOpen} />
    </div>
  );
};

export default CardesChat;
