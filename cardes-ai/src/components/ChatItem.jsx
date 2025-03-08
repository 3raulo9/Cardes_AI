import React, { useState, useEffect, useRef } from "react";
import { SlCopyButton, SlTooltip } from "@shoelace-style/shoelace/dist/react";
import catIcon from "../static/images/cat_icon.png";
import anonIcon from "../static/images/anon_icon.png";
import {
  SpeakerWaveIcon,
  ArrowDownTrayIcon,
  CreditCardIcon,
} from "@heroicons/react/24/solid";
import axiosInstance from "../utils/axiosInstance";

// Import the search function & the PronunciationModal
import { searchYouTube } from "../utils/youtubeAPI";
import PronunciationModal from "./PronunciationModal";

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

  // Deck-related states
  const [showDeckSelector, setShowDeckSelector] = useState(false);
  const [decks, setDecks] = useState([]);
  const [loadingDecks, setLoadingDecks] = useState(false);
  const [deckError, setDeckError] = useState(null);

  // States for dropdown & modal for individual words
  const [showDropdownForWord, setShowDropdownForWord] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // States for multi-word selection
  const [selectedText, setSelectedText] = useState("");
  const [selectionPos, setSelectionPos] = useState({ x: 0, y: 0 });
  const [showSelectionMenu, setShowSelectionMenu] = useState(false);

  // New states for usage count and premium modal
  const premiumUsageLimit = 5;
  const [usageCount, setUsageCount] = useState(0);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Ref for outside click detection
  const containerRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  // Close dropdown if clicking outside the container
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdownForWord(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Listen for multi-word selection on mouse up
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      if (text) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectionPos({
          x: rect.left + rect.width / 2,
          y: rect.top - 40,
        });
        setSelectedText(text);
        setShowSelectionMenu(true);
      } else {
        setShowSelectionMenu(false);
      }
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const handleSaveClick = () => {
    if (updateMessage) {
      updateMessage(chatItem.id, newMessageContent);
    }
    setEditMode(false);
  };

  const isUser = chatItem.role === "user";
  const isModel = chatItem.role === "model";

  // Toggle dropdown for a specific word
  const handleWordClick = (wordIndex, e) => {
    e.stopPropagation();
    setShowDropdownForWord((prev) =>
      prev === wordIndex ? null : wordIndex
    );
  };

  // Perform the YouTube search for a given text (only if usage is below limit)
  const handleSearchPronunciation = async (text) => {
    if (usageCount >= premiumUsageLimit) {
      setShowPremiumModal(true);
      return;
    }

    // Increase usage count (using functional update to guarantee correct value)
    setUsageCount((prev) => prev + 1);

    const queriesToTry = [text, text.toLowerCase(), text.toUpperCase()];
    let foundResults = null;

    for (let q of queriesToTry) {
      const results = await searchYouTube(q);
      if (results.length > 0) {
        foundResults = results;
        break;
      }
    }

    if (!foundResults) {
      alert(
        "No matching video found. Try a shorter word/sentence or check spelling!"
      );
      setShowDropdownForWord(null);
      setShowSelectionMenu(false);
      return;
    }

    const video = foundResults[0];
    setVideoTitle(video.snippet.title);
    setVideoUrl(`https://www.youtube.com/watch?v=${video.id.videoId}`);
    setModalOpen(true);
    setShowDropdownForWord(null);
    setShowSelectionMenu(false);
  };

  // Close the pronunciation modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setVideoTitle("");
    setVideoUrl("");
  };

  // Premium modal component for usage limit exceeded
  const PremiumModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
        <div className="bg-white p-6 w-11/12 md:w-1/2 rounded-lg shadow-xl relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-2xl font-bold text-gray-700 hover:text-gray-900"
          >
            &times;
          </button>
          <div className="text-center">
            <div className="text-4xl mb-4">👑</div>
            <h2 className="text-2xl font-semibold mb-4">
              Pronunciation Feature Limit Exceeded
            </h2>
            <p className="mb-4">
              Buy premium to enjoy all the features freely!
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                See Plans
              </button>
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Splits each part into tokens (words and whitespace) while preserving spacing/punctuation.
   */
  const renderPart = (part, partIndex) => {
    const tokens = part.split(/(\s+)/);
    return tokens.map((token, tokenIndex) => {
      const combinedIndex = `${partIndex}-${tokenIndex}`;
      if (/^\s+$/.test(token)) {
        return <span key={combinedIndex}>{token}</span>;
      } else {
        return (
          <span key={combinedIndex} className="relative inline-block">
            <span
              onClick={(e) => handleWordClick(combinedIndex, e)}
              className="clickable-word cursor-pointer transition-colors duration-200 hover:text-blue-500 hover:underline decoration-blue-500"
            >
              {token}
            </span>
            {showDropdownForWord === combinedIndex && (
              <div className="dropdown-box absolute z-10 bg-primary text-white p-2 mt-2 rounded-lg shadow-lg transition-all duration-200">
                <div className="text-xs text-white mb-1">
                  Uses left {premiumUsageLimit - usageCount}/{premiumUsageLimit}
                </div>
                <button
                  onClick={() => handleSearchPronunciation(token)}
                  className="block w-full text-left hover:bg-primary-dark px-3 py-1 rounded"
                >
                  Pronunciation
                </button>
              </div>
            )}
          </span>
        );
      }
    });
  };

  // Deck-related functions remain unchanged
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

  const handleDeckSelect = (deck) => {
    if (!chatItem.term || chatItem.parts.length === 0) {
      alert("Not enough data to create a card.");
      return;
    }
    const term = chatItem.term.trim();
    const definition = chatItem.parts[0].trim();
    const cardPayload = { term, definition, card_set: deck.id };

    axiosInstance
      .post("/api/cards/", cardPayload)
      .then(() => {
        alert(`Card added to deck: ${deck.name}`);
        setShowDeckSelector(false);
      })
      .catch((err) => {
        console.error("Error adding card:", err.response?.data || err);
        alert("Error adding card");
        setShowDeckSelector(false);
      });
  };

  return (
    <>
      <div ref={containerRef} className="relative">
        <div
          className={`flex items-start w-full ${
            isUser ? "justify-end" : "justify-start"
          }`}
        >
          {isModel && !chatItem.hideIcon && (
            <div className="w-10 flex-shrink-0">
              <img
                src={catIcon}
                alt="Bot Icon"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md"
              />
            </div>
          )}

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
                <>
                  {chatItem.parts.map((part, idx) => (
                    <div key={idx} className="whitespace-pre-line break-words">
                      {renderPart(part, idx)}
                    </div>
                  ))}
                </>
              )}
            </div>

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
                  className="p-2 bg-transparent rounded-full hover:bg-gray-100 focus:outline-none transition"
                  aria-label="Play audio"
                  onClick={() =>
                    handleTextToSpeech(chatItem.parts.join(" "))
                  }
                >
                  <SpeakerWaveIcon className="w-6 h-6 text-black" />
                </button>
              </SlTooltip>
              <SlTooltip content={tooltipContent.download || "Download"}>
                <button
                  className="p-2 bg-transparent rounded-full hover:bg-gray-100 focus:outline-none transition"
                  aria-label="Download audio"
                  onClick={() =>
                    handleTextToSpeech(chatItem.parts.join(" "), true)
                  }
                >
                  <ArrowDownTrayIcon className="w-6 h-6 text-black" />
                </button>
              </SlTooltip>
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

        {/* Floating selection menu for multi-word selection */}
        {showSelectionMenu && (
          <div
            className="fixed z-20"
            style={{ top: selectionPos.y, left: selectionPos.x }}
          >
            <div className="bg-white border border-gray-300 rounded shadow-lg px-3 py-1 flex items-center space-x-2 animate-fadeIn">
              <button
                onClick={() => handleSearchPronunciation(selectedText)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
              >
                Pronunciation for “
                {selectedText.length > 10
                  ? selectedText.slice(0, 10) + "…"
                  : selectedText}
                ”
              </button>
              <button
                onClick={() => setShowSelectionMenu(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                &#10005;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pronunciation Modal */}
      <PronunciationModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        videoTitle={videoTitle}
        videoUrl={videoUrl}
      />

      {/* Premium Modal for exceeding usage */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </>
  );
};

export default ChatItem;
