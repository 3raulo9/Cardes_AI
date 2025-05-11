// src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchChatSessionDetails,
  postMessageToSession,
  createChatSession,
} from "../services/chatApiService"; // Ensure this path is correct
import ChatItem from "../components/ChatItem"; // Ensure this path is correct
import ToolsWindow from "../components/ToolsWindow"; // Ensure this path is correct
import useSpeechRecognition from "../hooks/useSpeechRecognition"; // Ensure this path is correct
import { FiMic, FiMicOff, FiSend, FiTool } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import surpriseOptions from "../utils/surpriseData"; // Ensure this path is correct
import handleTextToSpeech from "../utils/handleTextToSpeech"; // Ensure this path is correct
import TutorialOverlay from "../components/TutorialOverlay"; // Ensure this path is correct

const ChatPage = () => {
  const { sessionId: routeSessionId } = useParams();
  const navigate = useNavigate();

  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  // --- Scroll to bottom ---
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // --- useEffect for scrolling ---
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, scrollToBottom]); // scrollToBottom is stable, chatHistory triggers scroll

  // --- Main function to send message and get response ---
  // This is the primary, corrected, and memoized version.
  const handleSendMessage = useCallback(async (customValue = value) => {
    const trimmedMessage = customValue.trim();
    if (!trimmedMessage) {
      toast.error("Please enter a question!");
      return;
    }

    setLoading(true);
    setValue(""); // Clear input field

    const optimisticUserMessage = {
      role: "user",
      parts: [trimmedMessage],
      id: `temp-user-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setChatHistory((prevHistory) => [...prevHistory, optimisticUserMessage]);
    setMessageSent(true);

    try {
      let sessionToUse = currentSessionId;

      if (!sessionToUse) {
        const newSessionResponse = await createChatSession();
        sessionToUse = newSessionResponse.data.id;
        setCurrentSessionId(sessionToUse);
        navigate(`/chat/${sessionToUse}`, { replace: true });
      }

      const response = await postMessageToSession(sessionToUse, trimmedMessage);
      const { user_message, ai_message } = response.data;

      setChatHistory((prevHistory) => [
        ...prevHistory.filter((msg) => msg.id !== optimisticUserMessage.id),
        { role: user_message.sender, parts: [user_message.content], id: user_message.id, timestamp: user_message.timestamp },
        { role: ai_message.sender, parts: [ai_message.content], id: ai_message.id, timestamp: ai_message.timestamp },
      ]);

    } catch (error) {
      console.error("Fetching error: ", error);
      toast.error("Something went wrong, please try again.");
      
      // Revert optimistic update and manage messageSent based on the resulting history
      setChatHistory(prevHistory => {
        const newHistory = prevHistory.filter(msg => msg.id !== optimisticUserMessage.id);
        if (newHistory.length === 0) {
          setMessageSent(false); // If history becomes empty, set messageSent to false
        }
        return newHistory;
      });
    } finally {
      setLoading(false);
    }
  }, [value, currentSessionId, navigate]); // Dependencies for handleSendMessage


  // --- Speech Recognition ---
  const handleSpeechRecognition = useCallback((phrases) => {
    const speech = phrases[0];
    setValue(speech);
    if (speech.trim()) {
      handleSendMessage(speech.trim()); // Calls the single, memoized handleSendMessage
    }
  }, [handleSendMessage]); // Depends on the memoized handleSendMessage

  const { isListening, startListening, stopListening } = useSpeechRecognition(handleSpeechRecognition);


  // --- Load chat data based on sessionId ---
  useEffect(() => {
    if (routeSessionId) {
      setLoading(true); // Indicate loading of history
      setChatHistory([]); // Clear previous chat messages
      fetchChatSessionDetails(routeSessionId)
        .then((response) => {
          setCurrentSessionId(response.data.id);
          setChatHistory(
            response.data.messages.map((msg) => ({
              role: msg.sender,
              parts: [msg.content],
              id: msg.id,
              timestamp: msg.timestamp,
            }))
          );
          setMessageSent(response.data.messages.length > 0);
        })
        .catch((err) => {
          console.error("Failed to fetch chat details:", err);
          toast.error("Could not load chat. Starting a new chat.");
          // Reset to a new chat state if loading fails
          setCurrentSessionId(null);
          setChatHistory([]);
          setValue(""); // Also clear input value for a truly new chat
          setMessageSent(false);
          navigate("/chat", { replace: true }); // Navigate to base /chat URL
        })
        .finally(() => {
          setLoading(false); // Done loading history (or attempting to)
        });
    } else {
      // No routeSessionId: this is a new chat. Reset all relevant state.
      setCurrentSessionId(null);
      setChatHistory([]);
      setValue("");
      setMessageSent(false);
      // No setLoading(true/false) here as it's an initial state, not an async operation
    }
  }, [routeSessionId, navigate]); // Effect depends on routeSessionId and navigate


  // --- "Surprise me" button logic ---
  const surprise = () => {
    if (loading) return;
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  // --- Tool submit logic ---
  const handleTool3Submit = (displayMessage, internalQuery) => {
    if (loading) return;
    setIsToolsOpen(false);
    const optimisticToolMessage = {
      role: "user", // Or a custom role for styling if needed
      parts: [displayMessage],
      id: `temp-tool-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setChatHistory((prevHistory) => [...prevHistory, optimisticToolMessage]);
    setMessageSent(true);
    handleSendMessage(internalQuery); // Calls the single, memoized handleSendMessage
  };

  // --- Send on Enter ---
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey && !loading) {
      event.preventDefault();
      handleSendMessage(); // Calls the single, memoized handleSendMessage
    }
  };

  // --- Clear the chat ---
  const clear = () => {
    setValue("");
    setChatHistory([]);
    setCurrentSessionId(null); // Critical to reset for a new session logic
    setMessageSent(false);
    toast.success("Ready for a new chat!");
    // If user was in a specific chat, navigate to the generic /chat to signify "new"
    if (routeSessionId) {
        navigate("/chat", { replace: true });
    }
  };

  // --- JSX Structure (FROM YOUR OLD CODE) ---
  return (
    <div className="flex h-screen bg-primary">
      <TutorialOverlay tutorialID="chatbot" />

      <div className="flex-1 relative bg-gradient-to-r from-primary via-[-10%] via-darkAccent p-4 sm:p-6">
        {/* Chat messages area */}
        <div className="h-[60vh] md:h-[70vh] overflow-y-auto p-4 bg-white rounded-xl shadow-lg flex flex-col space-y-2">
          {chatHistory.map((chatItem) => (
            <ChatItem
              key={chatItem.id}
              chatItem={chatItem}
              handleTextToSpeech={handleTextToSpeech}
              updateMessage={() => {}}
            />
          ))}
          {/* This is your original loading indicator style, shows when AI is responding or history is loading */}
          {loading && (
            <div className="text-center text-gray-500 animate-pulse">
              Loading...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area + Buttons */}
        <div className="mt-6 space-y-4">
          <input
            value={value}
            placeholder="Message Cardes..."
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="w-full border border-gray-300 rounded-full p-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-70"
          />

          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-2">
              <button
                onClick={surprise}
                disabled={loading}
                className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-secondary disabled:opacity-70"
              >
                Surprise Me
              </button>
              <button
                className={`p-2 rounded-full ${
                  isListening ? "bg-red-500" : "bg-secondary"
                } text-white disabled:opacity-70`}
                onClick={() => (isListening ? stopListening() : startListening())}
                disabled={loading}
              >
                {isListening ? <FiMicOff /> : <FiMic />}
              </button>
              <button
                className="p-2 bg-secondary text-white rounded-full hover:bg-accent transition duration-200 disabled:opacity-70"
                onClick={() => setIsToolsOpen(true)}
                disabled={loading}
              >
                <FiTool />
              </button>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleSendMessage()} // Calls the single, memoized handleSendMessage
                disabled={!value.trim() || loading}
                className="bg-primary text-white px-4 py-2 rounded-full hover:bg-accent disabled:opacity-70"
              >
                <FiSend className="inline" /> Send
              </button>
              {messageSent && (
                <button
                  onClick={clear}
                  disabled={loading}
                  className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 disabled:opacity-70"
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
        <ToastContainer theme="colored" position="bottom-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default ChatPage;