import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import ChatItem from "../components/ChatItem";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import { FiMic, FiMicOff, FiSend } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import surpriseOptions from "../utils/surpriseData";

const CardesChat = () => {
  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false); // Track if a message has been sent

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

    // Load chat history from local storage
    const savedChatHistory = localStorage.getItem("chatHistory");
    if (savedChatHistory) {
      setChatHistory(JSON.parse(savedChatHistory));
    }
  }, []);

  // Save chat history to local storage whenever it updates
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const getResponse = async (customValue = value) => {
    if (!customValue) {
      toast.error("Please enter a question!");
      return;
    }

    // Append the user's query to chatHistory
    const updatedChatHistory = [
      ...chatHistory,
      { role: "user", parts: [customValue], id: Date.now() },
    ];

    setChatHistory(updatedChatHistory);
    setLoading(true);
    setMessageSent(true); // Mark message as sent

    try {
      const { data } = await axiosInstance.post("/api/gemini/", {
        history: updatedChatHistory, // Pass the full history
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
      setValue(""); // Clear the input
    } catch (error) {
      console.error("Fetching error: ", error);
      toast.error("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTextToSpeech = async (text, forDownload = false) => {
    try {
      const response = await axiosInstance.post("/api/text-to-speech/", { text }, {
        responseType: 'blob',
      });

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
    localStorage.removeItem("chatHistory"); // Clear from local storage
    setMessageSent(false); // Hide "Clear Chat" button
    toast.success("Chat cleared!");
  };

  return (
    <div className="flex h-screen bg-primary">
      <div className="flex-1 relative bg-darkAccent p-4 sm:p-6">
        <div className="h-[60vh] md:h-[70vh] overflow-y-auto p-4 bg-white rounded-xl shadow-lg space-y-4">
          {chatHistory.map((chatItem, index) => (
            <ChatItem
              key={chatItem.id}
              chatItem={chatItem}
              index={index}
              handleTextToSpeech={(text) => handleTextToSpeech(text)}
            />
          ))}
          {loading && (
            <div className="text-center text-gray-500 animate-pulse">Loading...</div>
          )}
        </div>

        {/* Input field and buttons */}
        <div className="mt-6 space-y-4">
          {/* Rounded input field */}
          <input
            value={value}
            placeholder="Message Cardes AI..."
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full border border-gray-300 rounded-full p-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Buttons row aligned to left and right corners */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-2">
              <button
                onClick={surprise}
                className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-secondary"
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

        <ToastContainer />
      </div>
    </div>
  );
};

export default CardesChat;
