import React, { useState, useEffect } from "react";
import { SlCopyButton, SlTooltip } from "@shoelace-style/shoelace/dist/react";
import catIcon from "../static/images/cat_icon.png";
import anonIcon from "../static/images/anon_icon.png";
import {
  SpeakerWaveIcon,
  ArrowDownTrayIcon,
  CreditCardIcon,
} from "@heroicons/react/24/solid";
import axiosInstance from "../utils/axiosInstance";

const ChatItem = ({
  chatItem,
  tooltipContent = { listen: "Listen", download: "Download" },
  handleTextToSpeech,
  updateMessage,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [newMessageContent, setNewMessageContent] = useState(
    chatItem.parts.join(" ")
  );
  const [visible, setVisible] = useState(false);

  // Modal state for deck selection
  const [showDeckSelector, setShowDeckSelector] = useState(false);
  const [decks, setDecks] = useState([]);
  const [loadingDecks, setLoadingDecks] = useState(false);
  const [deckError, setDeckError] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleSaveClick = () => {
    if (updateMessage) {
      updateMessage(chatItem.id, newMessageContent);
    }
    setEditMode(false);
  };

  const isUser = chatItem.role === "user";
  const isModel = chatItem.role === "model";

  // Container for the entire chat item.
  const containerClasses = [
    "flex",
    "items-start",
    "w-full",
    isUser ? "justify-end" : "justify-start",
  ];

  // Function to open the deck selector modal and fetch decks.
  const openDeckSelector = () => {
    setShowDeckSelector(true);
    setLoadingDecks(true);
    axiosInstance
      .get("/api/cardsets/")
      .then((res) => {
        setDecks(res.data);
        setLoadingDecks(false);
      })
      .catch((err) => {
        setDeckError("Error loading decks");
        setLoadingDecks(false);
      });
  };

  // Function to handle deck selection.
  // It uses the first sentence as the term and the second as the definition.
  const handleDeckSelect = (deck) => {
    console.log("Selected deck:", deck);
    console.log("🔍 ChatItem Parts (Before Processing):", chatItem.parts);

    if (!chatItem.term || chatItem.parts.length === 0) {
      alert("Not enough data to create a card.");
      return;
    }

    const term = chatItem.term.trim(); // First sentence (original)
    const definition = chatItem.parts[0].trim(); // Second sentence (translation)

    console.log("🔍 Extracted Term:", term);
    console.log("🔍 Extracted Definition:", definition);

    const cardPayload = {
      term,
      definition,
      card_set: deck.id,
    };

    console.log("📤 Posting card with payload:", cardPayload);

    axiosInstance
      .post("/api/cards/", cardPayload)
      .then(() => {
        alert(`Card added to deck: ${deck.name}`);
        setShowDeckSelector(false);
      })
      .catch((err) => {
        console.error("❌ Error adding card:", err.response?.data || err);
        alert("Error adding card");
        setShowDeckSelector(false);
      });
  };

  return (
    <>
      <div className={`flex items-start w-full ${isUser ? "justify-end" : "justify-start"}`}>
        {/* Bot Icon for AI Responses */}
        {isModel && !chatItem.hideIcon && (
          <div className="w-10 flex-shrink-0">
            <img
              src={catIcon}
              alt="Bot Icon"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md"
            />
          </div>
        )}
  
        {/* Chat Bubble */}
        <div
          className={`flex flex-col items-start gap-1 ${
            isModel ? (chatItem.hideIcon ? "ml-14" : "ml-5") : ""
          }`}
        >
          <div
            className={`relative max-w-full md:max-w-lg rounded-3xl px-5 py-3 shadow-md transition-transform duration-300 transform ${
              isUser
                ? "bg-primary text-white rounded-br-none"
                : "bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-none"
            } ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
          >
            {editMode ? (
              <div className="flex flex-col gap-2">
                <textarea
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={newMessageContent}
                  onChange={(e) => setNewMessageContent(e.target.value)}
                />
                <button
                  onClick={handleSaveClick}
                  className="self-end bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-1 transition"
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                {chatItem.parts.map((part, idx) => (
                  <p key={idx} className="whitespace-pre-line break-words">
                    {part}
                  </p>
                ))}
              </div>
            )}
          </div>
  
          {/* Buttons Section */}
          <div className={`flex items-center gap-2 mt-2 ${isUser ? "justify-start" : "justify-end"}`}>
            <SlCopyButton
              value={chatItem.parts.join(" ")}
              className="text-black hover:text-gray-700"
            />
            <SlTooltip content={tooltipContent.listen || "Listen"}>
              <button
                className="p-2 bg-transparent rounded-full hover:bg-gray-100 focus:outline-none transition"
                aria-label="Play audio"
                onClick={() => handleTextToSpeech(chatItem.parts.join(" "))}
              >
                <SpeakerWaveIcon className="w-6 h-6 text-black" />
              </button>
            </SlTooltip>
            <SlTooltip content={tooltipContent.download || "Download"}>
              <button
                className="p-2 bg-transparent rounded-full hover:bg-gray-100 focus:outline-none transition"
                aria-label="Download audio"
                onClick={() => handleTextToSpeech(chatItem.parts.join(" "), true)}
              >
                <ArrowDownTrayIcon className="w-6 h-6 text-black" />
              </button>
            </SlTooltip>
            {/* Show "Add to Deck" button only for second sentences */}
            {isModel && chatItem.hideIcon && (
              <SlTooltip content="Add to my deck">
                <button
                  className="p-2 bg-transparent rounded-full hover:bg-gray-100 focus:outline-none transition"
                  aria-label="Add to my deck"
                  onClick={openDeckSelector}
                >
                  <CreditCardIcon className="w-6 h-6 text-black" />
                </button>
              </SlTooltip>
            )}
          </div>
        </div>
  
        {/* User Icon for Sent Messages */}
        {isUser && (
          <div className="w-10 flex-shrink-0">
            <img
              src={anonIcon}
              alt="User Icon"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md"
            />
          </div>
        )}
      </div>
  
      {/* Modal for Deck Selection */}
      {showDeckSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Select a Deck</h2>
            {loadingDecks ? (
              <p>Loading...</p>
            ) : deckError ? (
              <p className="text-red-500">{deckError}</p>
            ) : (
              <ul className="space-y-2">
                {decks.map((deck) => (
                  <li
                    key={deck.id}
                    className="cursor-pointer p-3 rounded-md hover:bg-gray-200 transition"
                    onClick={() => handleDeckSelect(deck)}
                  >
                    {deck.name}
                  </li>
                ))}
              </ul>
            )}
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              onClick={() => setShowDeckSelector(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
  
};

export default ChatItem;
