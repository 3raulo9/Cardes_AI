// src/pages/ChatPage.jsx (Adapted from your CardesChat.js, aiming for minimal visual change)
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance"; // Make sure this is your configured instance
import {
  fetchChatSessionDetails,
  postMessageToSession,
  createChatSession,
} from "../services/chatApiService"; // Ensure this path is correct
import ChatItem from "../components/ChatItem";
import ToolsWindow from "../components/ToolsWindow";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import { FiMic, FiMicOff, FiSend, FiTool } from "react-icons/fi"; // Your original icons
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import surpriseOptions from "../utils/surpriseData";
import handleTextToSpeech from "../utils/handleTextToSpeech";
import TutorialOverlay from "../components/TutorialOverlay";

// This component will now be responsible for a single chat session (new or existing)
const ChatPage = () => { // Renamed from CardesChat if this is the new standard name
  const { sessionId: routeSessionId } = useParams();
  const navigate = useNavigate();

  // States from your original component
  const [value, setValue] = useState(""); // User's current input
  const [chatHistory, setChatHistory] = useState([]); // Messages displayed in the chat
  const [loading, setLoading] = useState(false); // True when waiting for AI response
  const [messageSent, setMessageSent] = useState(false); // From your old code, to show "Clear Chat"
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  // New state to manage the current backend session
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const messagesEndRef = useRef(null);

  // --- Speech Recognition (from your old code) ---
  const handleSpeechRecognition = useCallback((phrases) => {
    const speech = phrases[0];
    setValue(speech);
    // Automatically send the message after speech recognition
    // This will now use the updated handleSendMessage logic
    if (speech.trim()) {
      handleSendMessage(speech.trim());
    }
  }, [/* dependencies for handleSendMessage if any, or empty if it uses up-to-date state via closures */]); // Re-eval if handleSendMessage changes

  const { isListening, startListening, stopListening } = useSpeechRecognition(handleSpeechRecognition);

  // --- Scroll to bottom ---
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [chatHistory]);


  // --- Load chat data based on sessionId (NEW FUNCTIONALITY) ---
  useEffect(() => {
    // This effect runs when the component mounts or routeSessionId changes.
    // It determines if we're loading an existing chat or starting a new one.
    if (routeSessionId) {
      setLoading(true); // Use general loading indicator while fetching
      setChatHistory([]); // Clear any previous local state
      fetchChatSessionDetails(routeSessionId)
        .then((response) => {
          setCurrentSessionId(response.data.id);
          setChatHistory(
            response.data.messages.map((msg) => ({
              role: msg.sender,
              parts: [msg.content], // Assuming ChatItem expects parts as an array
              id: msg.id,
              timestamp: msg.timestamp,
              // Add other properties your ChatItem might expect from the old structure
              // hideIcon: (determine based on msg.sender or other logic if needed)
            }))
          );
          // Optional: Set a page title or some identifier if needed
          // document.title = response.data.title || `Chat ${response.data.id}`;
          setMessageSent(response.data.messages.length > 0);
        })
        .catch((err) => {
          console.error("Failed to fetch chat details:", err);
          toast.error("Could not load chat. Starting a new chat.");
          // If loading an existing chat fails, reset to a new chat state
          setCurrentSessionId(null);
          setChatHistory([]);
          setMessageSent(false);
          navigate("/chat", { replace: true }); // Navigate to the base /chat URL for a new chat
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // No routeSessionId: this is a new chat. Reset state.
      setCurrentSessionId(null);
      setChatHistory([]);
      setValue("");
      setMessageSent(false);
      // No loading needed as it's a fresh state
    }
  }, [routeSessionId, navigate]);


  // --- "Surprise me" button logic (from your old code) ---
  const surprise = () => {
    if (loading) return;
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  // --- Main function to send message and get response (ADAPTED FROM OLD getResponse) ---
  const handleSendMessage = async (customValue = value) => {
    const trimmedMessage = customValue.trim();
    if (!trimmedMessage) {
      toast.error("Please enter a question!");
      return;
    }

    setLoading(true); // Show loading indicator
    setValue(""); // Clear input field

    // Optimistic UI update for user's message
    const optimisticUserMessage = {
      role: "user",
      parts: [trimmedMessage],
      id: `temp-user-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setChatHistory((prevHistory) => [...prevHistory, optimisticUserMessage]);
    setMessageSent(true); // To show "Clear Chat" button

    try {
      let sessionToUse = currentSessionId;

      if (!sessionToUse) {
        // If no current session, create one
        const newSessionResponse = await createChatSession(); // Backend will handle title if not provided
        sessionToUse = newSessionResponse.data.id;
        setCurrentSessionId(sessionToUse);
        // Update URL to reflect the new session without full page reload
        navigate(`/chat/${sessionToUse}`, { replace: true });
      }

      // Post message to the (potentially new) session
      const response = await postMessageToSession(sessionToUse, trimmedMessage);
      const { user_message, ai_message } = response.data;

      // Update chat history with confirmed messages from backend
      setChatHistory((prevHistory) => [
        ...prevHistory.filter((msg) => msg.id !== optimisticUserMessage.id), // Remove optimistic
        { role: user_message.sender, parts: [user_message.content], id: user_message.id, timestamp: user_message.timestamp },
        { role: ai_message.sender, parts: [ai_message.content], id: ai_message.id, timestamp: ai_message.timestamp },
      ]);

    } catch (error) {
      console.error("Fetching error: ", error);
      toast.error("Something went wrong, please try again.");
      // Revert optimistic update on error
      setChatHistory((prevHistory) =>
        prevHistory.filter((msg) => msg.id !== optimisticUserMessage.id)
      );
      // If the optimistic message was the only one, reset messageSent
      if (chatHistory.length === 1 && chatHistory[0].id === optimisticUserMessage.id) {
        setMessageSent(false);
      }
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // --- Tool submit logic (adapted from your old code) ---
  const handleTool3Submit = (displayMessage, internalQuery) => {
    if (loading) return;
    setIsToolsOpen(false);
    // Optimistically add the display message for the tool to the chat
    const optimisticToolMessage = {
      role: "user", // Or a custom role if you want to style tool interactions differently
      parts: [displayMessage],
      id: `temp-tool-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setChatHistory((prevHistory) => [...prevHistory, optimisticToolMessage]);
    setMessageSent(true);

    // Send the internal query to the AI using the main sendMessage flow
    handleSendMessage(internalQuery);
  };

  // --- Send on Enter (from your old code) ---
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey && !loading) { // Added !event.shiftKey to allow multiline with Shift+Enter if input becomes textarea
      event.preventDefault(); // Prevent default form submission if it's in a form
      handleSendMessage();
    }
  };

  // --- Clear the chat (adapted from your old code) ---
  // This now means starting a "new chat" interface, not deleting from backend.
  const clear = () => {
    setValue("");
    setChatHistory([]);
    setCurrentSessionId(null); // Reset current session ID
    setMessageSent(false);
    toast.success("Ready for a new chat!");
    // Navigate to the base /chat URL to signify a new, unsaved chat state
    if (routeSessionId) { // Only navigate if we were on a specific chat URL
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
              key={chatItem.id} // Will be temp ID then backend ID
              chatItem={chatItem}
              handleTextToSpeech={handleTextToSpeech}
              updateMessage={() => {}}
            />
          ))}
          {/* This is your original loading indicator style */}
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
            disabled={loading} // Disable input while AI is responding
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
                onClick={() => handleSendMessage()}
                disabled={!value.trim() || loading}
                className="bg-primary text-white px-4 py-2 rounded-full hover:bg-accent disabled:opacity-70"
              >
                <FiSend className="inline" /> Send
              </button>
              {/* "Clear Chat" button from your old code, uses adapted clear function */}
              {messageSent && ( // Show if any message has been sent in the current view
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

export default ChatPage; // Or CardesChat, depending on your file naming convention