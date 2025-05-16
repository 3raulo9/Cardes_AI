// src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchChatSessionDetails,
  postMessageToSession,
  createChatSession,
} from "../services/chatApiService";
import ChatItem from "../components/ChatItem";
import ToolsWindow from "../components/ToolsWindow";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import { FiMic, FiMicOff, FiSend, FiTool } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import surpriseOptions from "../utils/surpriseData";
import handleTextToSpeech from "../utils/handleTextToSpeech";
import TutorialOverlay from "../components/TutorialOverlay";

// ────────────────────────────────────────────────────────────
// Helper → explodes a caret-delimited AI response into many
// ChatItem-shaped objects so each sentence/translation gets
// its own bubble (with copy / TTS / add-to-deck etc.).
// ────────────────────────────────────────────────────────────
const explodeByCaret = (raw) =>
  raw
    .split("^")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .flatMap((chunk, idx, arr) =>
      idx % 2 === 0
        ? [
            // original sentence – show icon
            {
              role: "model",
              parts: [chunk],
              hideIcon: false,
            },
          ]
        : [
            // translation – no icon, but keep “term” (=preceding French)
            {
              role: "model",
              parts: [chunk],
              term: arr[idx - 1],
              hideIcon: true,
            },
          ]
    );

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

  // ── Scroll to bottom whenever chat updates ──
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [chatHistory, scrollToBottom]);

  // ───────────────────────────────────────────
  // MAIN SEND / RECEIVE LOGIC
  // ───────────────────────────────────────────
  const handleSendMessage = useCallback(
    async (customValue = value) => {
      const trimmedMessage = customValue.trim();
      if (!trimmedMessage) {
        toast.error("Please enter a question!");
        return;
      }

      setLoading(true);
      setValue("");

      // optimistic user bubble
      const optimisticUser = {
        role: "user",
        parts: [trimmedMessage],
        id: `temp-user-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      setChatHistory((h) => [...h, optimisticUser]);
      setMessageSent(true);

      try {
        // ensure we have a session
        let session = currentSessionId;
        if (!session) {
          const newSession = await createChatSession();
          session = newSession.data.id;
          setCurrentSessionId(session);
          navigate(`/chat/${session}`, { replace: true });
        }

        // talk to the backend
        const res = await postMessageToSession(session, trimmedMessage);
        const { user_message, ai_message } = res.data;

        // convert AI message to one or many chunks
        const aiChunks = ai_message.content.includes("^")
          ? explodeByCaret(ai_message.content)
          : [
              {
                role: ai_message.sender,
                parts: [ai_message.content],
                hideIcon: false,
              },
            ];

        // attach stable ids so React is happy
        const stampedChunks = aiChunks.map((c, i) => ({
          ...c,
          id: `${ai_message.id}-${i}`,
          timestamp: ai_message.timestamp,
        }));

        // replace optimistic + add real messages
        setChatHistory((h) => [
          ...h.filter((m) => m.id !== optimisticUser.id),
          {
            role: user_message.sender,
            parts: [user_message.content],
            id: user_message.id,
            timestamp: user_message.timestamp,
          },
          ...stampedChunks,
        ]);
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong, please try again.");
        setChatHistory((h) => h.filter((m) => m.id !== optimisticUser.id));
        if (chatHistory.length === 0) setMessageSent(false);
      } finally {
        setLoading(false);
      }
    },
    [value, currentSessionId, navigate, chatHistory]
  );

  // ── Speech recognition hook ──
  const handleSpeechRecognition = useCallback(
    (phrases) => {
      const speech = phrases[0];
      setValue(speech);
      if (speech.trim()) handleSendMessage(speech.trim());
    },
    [handleSendMessage]
  );
  const { isListening, startListening, stopListening } =
    useSpeechRecognition(handleSpeechRecognition);

  // ── Load existing session (route param) ──
  useEffect(() => {
    if (!routeSessionId) {
      // fresh chat
      setCurrentSessionId(null);
      setChatHistory([]);
      setValue("");
      setMessageSent(false);
      return;
    }

    setLoading(true);
    fetchChatSessionDetails(routeSessionId)
      .then(({ data }) => {
        setCurrentSessionId(data.id);
        setChatHistory(
          data.messages.map((m) => ({
            role: m.sender,
            parts: [m.content],
            id: m.id,
            timestamp: m.timestamp,
          }))
        );
        setMessageSent(data.messages.length > 0);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Could not load chat. Starting new chat.");
        navigate("/chat", { replace: true });
      })
      .finally(() => setLoading(false));
  }, [routeSessionId, navigate]);

  // ── Misc helpers ──
  const surprise = () => {
    if (!loading) {
      setValue(
        surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
      );
    }
  };

  const clear = () => {
    setValue("");
    setChatHistory([]);
    setCurrentSessionId(null);
    setMessageSent(false);
    toast.success("Ready for a new chat!");
    if (routeSessionId) navigate("/chat", { replace: true });
  };

  // ───────────────────────────────────────────
  // JSX
  // ───────────────────────────────────────────
  return (
    <div className="flex h-screen bg-primary">
      <TutorialOverlay tutorialID="chatbot" />

      <div className="flex-1 relative bg-gradient-to-r from-primary via-[-10%] via-darkAccent p-4 sm:p-6">
        {/* CHAT AREA */}
        <div className="h-[60vh] md:h-[70vh] overflow-y-auto p-4 bg-white rounded-xl shadow-lg flex flex-col space-y-2">
          {chatHistory.map((item) => (
            <ChatItem
              key={item.id}
              chatItem={item}
              handleTextToSpeech={handleTextToSpeech}
              updateMessage={() => {}}
            />
          ))}
          {loading && (
            <div className="text-center text-gray-500 animate-pulse">
              Loading…
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT + BUTTONS */}
        <div className="mt-6 space-y-4">
          <input
            value={value}
            placeholder="Message Cardes…"
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !loading) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
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
                onClick={() =>
                  isListening ? stopListening() : startListening()
                }
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

        {/* TOOLS WINDOW + TOASTS */}
        <ToolsWindow
          isOpen={isToolsOpen}
          onClose={() => setIsToolsOpen(false)}
          onTool3Submit={(displayMessage, internalQuery) => {
            if (loading) return;
            setIsToolsOpen(false);
            const optimisticTool = {
              role: "user",
              parts: [displayMessage],
              id: `temp-tool-${Date.now()}`,
              timestamp: new Date().toISOString(),
            };
            setChatHistory((h) => [...h, optimisticTool]);
            setMessageSent(true);
            handleSendMessage(internalQuery);
          }}
        />
        <ToastContainer theme="colored" position="bottom-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default ChatPage;
