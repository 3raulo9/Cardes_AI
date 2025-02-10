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

  const getResponse = async (customValue = value) => {
    if (!customValue) {
      toast.error("Please enter a question!");
      return;
    }

    const updatedChatHistory = [
      ...chatHistory,
      { role: "user", parts: [customValue], id: Date.now() },
    ];

    setChatHistory(updatedChatHistory);
    setLoading(true);
    setMessageSent(true);

    try {
      const { data } = await axiosInstance.post("/api/gemini/", {
        history: updatedChatHistory,
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
        <div className="h-[60vh] md:h-[70vh] overflow-y-auto p-4 bg-white rounded-xl shadow-lg space-y-4">
          {chatHistory.map((chatItem, index) => (
            <ChatItem key={chatItem.id} chatItem={chatItem} />
          ))}
          {loading && (
            <div className="text-center text-gray-500 animate-pulse">Loading...</div>
          )}
        </div>

        <div className="mt-6 space-y-4">
          <input
            value={value}
            placeholder="Message Cardes AI..."
            onChange={(e) => setValue(e.target.value)}
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
                onClick={() => (isListening ? stopListening() : startListening())}
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

        <ToolsWindow isOpen={isToolsOpen} onClose={() => setIsToolsOpen(false)} />
        <ToastContainer />
      </div>
    </div>
  );
};

export default CardesChat;
