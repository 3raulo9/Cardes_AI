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

  const handleEditClick = () => setEditMode(true);
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
      <div className={containerClasses.join(" ")}>
        {/* For model messages, always reserve space for the icon */}
        {/* Add to Deck button should ONLY appear on the second sentence */}
        {/* If this is the first sentence, show the cat icon */}
        {isModel && !chatItem.hideIcon && (
          <div className="w-10 flex-shrink-0">
            <img
              src={catIcon}
              alt="Bot Icon"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md"
            />
          </div>
        )}



        {/* Bubble container with extra left margin */}
        <div
  className={`flex flex-col items-start gap-1 ${
    isModel ? (chatItem.hideIcon ? "ml-14" : "ml-5") : ""
  }`}
>

          {/* Message Bubble */}
          <div
            className={`relative max-w-full md:max-w-md rounded-3xl px-4 sm:px-6 py-3 shadow-md ${
              isUser
                ? "bg-orange-800 text-white rounded-br-none"
                : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
            } transition-transform duration-300 transform ${
              visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            {editMode ? (
              <div className="flex flex-col gap-2">
                <textarea
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newMessageContent}
                  onChange={(e) => setNewMessageContent(e.target.value)}
                />
                <button
                  onClick={handleSaveClick}
                  className="self-end bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-1"
                >
                  Save
                </button>
              </div>
            ) : (
              // Display each part on its own line.
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
          <div
            className={`flex items-center gap-2 mt-2 ${
              isUser ? "justify-start" : "justify-end"
            }`}
          >
            <SlCopyButton
              value={chatItem.parts.join(" ")}
              className="text-black hover:text-gray-700"
            />
            <SlTooltip content={tooltipContent.listen || "Listen"}>
              <button
                className="p-1 bg-transparent rounded-full hover:bg-gray-100 focus:outline-none"
                aria-label="Play audio"
                onClick={() => handleTextToSpeech(chatItem.parts.join(" "))}
              >
                <SpeakerWaveIcon className="w-6 h-6 text-black" />
              </button>
            </SlTooltip>
            <SlTooltip content={tooltipContent.download || "Download"}>
              <button
                className="p-1 bg-transparent rounded-full hover:bg-gray-100 focus:outline-none"
                aria-label="Download audio"
                onClick={() =>
                  handleTextToSpeech(chatItem.parts.join(" "), true)
                }
              >
                <ArrowDownTrayIcon className="w-6 h-6 text-black" />
              </button>
            </SlTooltip>
            {/* For model messages representing the second sentence (hideIcon true), show the flashcard button */}
            {isModel && chatItem.hideIcon && (
              <SlTooltip content="Add to my deck">
                <button
                  className="p-1 bg-transparent rounded-full hover:bg-gray-100 focus:outline-none"
                  aria-label="Add to my deck"
                  onClick={openDeckSelector}
                >
                  <CreditCardIcon className="w-6 h-6 text-black" />
                </button>
              </SlTooltip>
            )}
          </div>
        </div>

        {/* For user messages, show the user icon on the right */}
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

      {/* Modal for deck selection */}
      {showDeckSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-xl font-bold mb-4">Select a Deck</h2>
            {loadingDecks ? (
              <p>Loading...</p>
            ) : deckError ? (
              <p>{deckError}</p>
            ) : (
              <ul>
                {decks.map((deck) => (
                  <li
                    key={deck.id}
                    className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                    onClick={() => handleDeckSelect(deck)}
                  >
                    {deck.name}
                  </li>
                ))}
              </ul>
            )}
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
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
