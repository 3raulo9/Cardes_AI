// src/components/ChatItem.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { SlCopyButton, SlTooltip } from "@shoelace-style/shoelace/dist/react";
import catIcon from "../static/images/cat_icon.png";
import anonIcon from "../static/images/anon_icon.png";
import {
  SpeakerWaveIcon,
  ArrowDownTrayIcon,
  CreditCardIcon,
} from "@heroicons/react/24/solid";
import axiosInstance from "../utils/axiosInstance";
import { GiTurtle } from "react-icons/gi";

import { searchYouTube } from "../utils/youtubeAPI";
import PronunciationModal from "./PronunciationModal";

const ChatItem = ({
  chatItem,
  tooltipContent = { listen: "Listen", download: "Download" },
  handleTextToSpeech,
  updateMessage,
}) => {
  /* ─────────────────────────────── STATE ─────────────────────────────── */
  const [editMode, setEditMode]           = useState(false);
  const [newMessageContent, setNewMessageContent] = useState(
    chatItem.parts.join(" ")
  );
  const [visible, setVisible]             = useState(false);

  const [showDeckSelector, setShowDeckSelector] = useState(false);
  const [decks, setDecks]                 = useState([]);
  const [loadingDecks, setLoadingDecks]   = useState(false);
  const [deckError, setDeckError]         = useState(null);

  const [showDropdownForWord, setShowDropdownForWord] = useState(null);
  const [modalOpen, setModalOpen]         = useState(false);
  const [videoTitle, setVideoTitle]       = useState("");
  const [videoUrl, setVideoUrl]           = useState("");

  const [selectedText, setSelectedText]   = useState("");
  const [selectionPos, setSelectionPos]   = useState({ x: 0, y: 0 });
  const [showSelectionMenu, setShowSelectionMenu] = useState(false);

  const [touchSelection, setTouchSelection] = useState(null);
  const premiumUsageLimit = 5;
  const [usageCount, setUsageCount]       = useState(0);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const containerRef = useRef(null);
  const [audioPlaying, setAudioPlaying]   = useState(false);

  /* ─────────────────────────── LIFECYCLE ─────────────────────────────── */
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdownForWord(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleMouseUp = () => {
      const sel = window.getSelection();
      const txt = sel.toString().trim();
      if (txt) {
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        setSelectionPos({ x: rect.left + rect.width / 2, y: rect.top - 40 });
        setSelectedText(txt);
        setShowSelectionMenu(true);
      } else setShowSelectionMenu(false);
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  /* ─────────────────────────── HELPERS ──────────────────────────────── */
  const sanitisedParts = useMemo(
    () => chatItem.parts.map((p) => p.replace(/\s+$/g, "")),
    [chatItem.parts]
  );

  // 🔹 ONE-LINE ROLE LOGIC  ──────────────────────────────────────────────
  const isUser  = chatItem.role === "user";
  const isModel = !isUser;   // treat every non-user message as model/assistant
  // ─────────────────────────────────────────────────────────────────────

  const handleSaveClick = () => {
    updateMessage?.(chatItem.id, newMessageContent.trim());
    setEditMode(false);
  };

  const handleSearchPronunciation = async (text) => {
    if (usageCount >= premiumUsageLimit) return setShowPremiumModal(true);

    setUsageCount((c) => c + 1);
    const queries = [text, text.toLowerCase(), text.toUpperCase()];
    let result = null;
    for (const q of queries) {
      const r = await searchYouTube(q);
      if (r.length) { result = r[0]; break; }
    }
    if (!result) return alert("No matching video found. Try another spelling.");

    setVideoTitle(result.snippet.title);
    setVideoUrl(`https://www.youtube.com/watch?v=${result.id.videoId}`);
    setModalOpen(true);
    setShowDropdownForWord(null);
    setShowSelectionMenu(false);
    setTouchSelection(null);
  };

  const handleDeckSelect = (deck) => {
    if (!chatItem.term || !chatItem.parts.length) {
      alert("Not enough data to create a card."); return;
    }
    const payload = {
      term: chatItem.term.trim(),
      definition: chatItem.parts[0].trim(),
      card_set: deck.id,
    };
    axiosInstance.post("/api/cards/", payload)
      .then(() => { alert(`Card added to deck: ${deck.name}`); setShowDeckSelector(false); })
      .catch(() => { alert("Error adding card"); setShowDeckSelector(false); });
  };

  const handlePlayAudio = async (download = false, slow = false) => {
    if (audioPlaying) return;
    setAudioPlaying(true);
    try {
      await handleTextToSpeech(sanitisedParts.join(" "), download, slow);
    } finally { setAudioPlaying(false); }
  };

  /* ─────────────────────────── RENDER TOKEN ─────────────────────────── */
  const renderPart = (part, partIndex) => {
    const tokens = part.split(/(\s+)/);
    return (
      <div key={partIndex} className="whitespace-pre-wrap break-words">
        {tokens.map((tok, tokIndex) => {
          const combined = `${partIndex}-${tokIndex}`;
          if (/^\s+$/.test(tok)) return <span key={combined}>{tok}</span>;

          const selected =
            touchSelection &&
            touchSelection.part === partIndex &&
            ((touchSelection.count === 1 && tokIndex === touchSelection.base) ||
              (touchSelection.count === 2 &&
                tokIndex >= touchSelection.range[0] &&
                tokIndex <= touchSelection.range[1]));

          return (
            <span key={combined} className="relative inline-block">
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setTouchSelection(null);
                  setShowDropdownForWord(
                    showDropdownForWord === combined ? null : combined
                  );
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  if (
                    !touchSelection ||
                    touchSelection.count === 2 ||
                    touchSelection.part !== partIndex
                  ) {
                    setTouchSelection({ count: 1, part: partIndex, base: tokIndex });
                  } else if (touchSelection.count === 1) {
                    if (tokIndex === touchSelection.base) return;
                    const [s, e] = [
                      Math.min(touchSelection.base, tokIndex),
                      Math.max(touchSelection.base, tokIndex),
                    ];
                    setTouchSelection({ count: 2, part: partIndex, range: [s, e] });
                  }
                }}
                className={`cursor-pointer hover:text-blue-500 hover:underline ${
                  selected ? "bg-blue-200" : ""
                }`}
              >
                {tok}
              </span>

              {showDropdownForWord === combined && !touchSelection && (
                <div className="absolute z-10 bg-primary text-white p-2 rounded-lg shadow-lg whitespace-nowrap">
                  <div className="text-xs mb-1">
                    Uses left {premiumUsageLimit - usageCount}/{premiumUsageLimit}
                  </div>
                  <button
                    onClick={() => handleSearchPronunciation(tok)}
                    className="block w-full text-left hover:bg-primary-dark px-3 py-1 rounded"
                  >
                    Pronunciation
                  </button>
                </div>
              )}
            </span>
          );
        })}
      </div>
    );
  };

  /* ───────────────────────────── JSX ──────────────────────────────── */
  return (
    <>
      <div ref={containerRef} className="relative">
        {/* ROW (icon + bubble + icon) */}
        <div className={`flex items-start w-full ${isUser ? "justify-end" : "justify-start"}`}>
          {/* MODEL ICON */}
          {isModel && (
            <div className="w-10 flex-shrink-0">
              <img
                src={catIcon}
                alt="Bot Icon"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md"
              />
            </div>
          )}

          {/* TEXT + TOOLS */}
          <div className={`flex flex-col items-start gap-1 ${isModel ? "ml-5" : ""}`}>
            {/* MESSAGE BUBBLE */}
            <div
              className={`relative max-w-full md:max-w-lg rounded-3xl px-5 py-3 shadow-md transition-transform ${
                isUser
                  ? "bg-primary text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-none"
              } ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
            >
              {editMode ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary"
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
                sanitisedParts.map((p, idx) => renderPart(p, idx))
              )}
            </div>

            {/* BUTTONS ROW */}
            <div className={`flex items-center gap-2 mt-2 ${isUser ? "justify-start" : "justify-end"}`}>
              <SlCopyButton
                value={sanitisedParts.join(" ")}
                className="text-black hover:text-gray-700"
              />

              {/* AUDIO GROUP */}
              <div className="relative inline-flex items-center group">
                <SlTooltip content={tooltipContent.listen}>
                  <button
                    disabled={audioPlaying}
                    className="p-2 rounded-full hover:bg-gray-100"
                    onClick={() => handlePlayAudio(false, false)}
                  >
                    <SpeakerWaveIcon className="w-6 h-6" />
                  </button>
                </SlTooltip>
                <SlTooltip content="Slow speech">
                  <button
                    disabled={audioPlaying}
                    className="p-2 rounded-full hover:bg-gray-100 w-0 opacity-0 overflow-hidden group-hover:w-auto group-hover:opacity-100 group-hover:mx-1"
                    onClick={() => handlePlayAudio(false, true)}
                  >
                    <GiTurtle className="w-6 h-6" />
                  </button>
                </SlTooltip>
                <SlTooltip content={tooltipContent.download}>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 ml-0 group-hover:ml-1.5"
                    onClick={() => handleTextToSpeech(sanitisedParts.join(" "), true)}
                  >
                    <ArrowDownTrayIcon className="w-6 h-6" />
                  </button>
                </SlTooltip>
              </div>

              {/* ADD-TO-DECK */}
              {isModel && (
                <SlTooltip content="Add to my deck">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100"
                    onClick={() => {
                      setShowDeckSelector(true);
                      setLoadingDecks(true);
                      axiosInstance
                        .get("/api/cardsets/")
                        .then((res) => { setDecks(res.data); setLoadingDecks(false); })
                        .catch(() => { setDeckError("Error loading decks"); setLoadingDecks(false); });
                    }}
                  >
                    <CreditCardIcon className="w-6 h-6" />
                  </button>
                </SlTooltip>
              )}
            </div>
          </div>

          {/* USER ICON */}
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
      </div>

      {/* Pronunciation modal */}
      <PronunciationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        videoTitle={videoTitle}
        videoUrl={videoUrl}
      />

      {/* Multi-word floating menu */}
      {showSelectionMenu && (
        <div className="fixed z-20" style={{ top: selectionPos.y, left: selectionPos.x }}>
          <div className="bg-white border rounded shadow-lg px-3 py-1 flex items-center space-x-2 animate-fadeIn">
            <button
              onClick={() => handleSearchPronunciation(selectedText)}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Pronunciation for “
              {selectedText.length > 10 ? `${selectedText.slice(0, 10)}…` : selectedText}
              ”
            </button>
            <button
              onClick={() => setShowSelectionMenu(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Deck selector */}
      {showDeckSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Select a Deck</h2>
            {loadingDecks ? (
              <p>Loading…</p>
            ) : deckError ? (
              <p className="text-red-500">{deckError}</p>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-auto">
                {decks.map((d) => (
                  <li
                    key={d.id}
                    className="cursor-pointer p-3 rounded hover:bg-gray-200"
                    onClick={() => handleDeckSelect(d)}
                  >
                    {d.name}
                  </li>
                ))}
              </ul>
            )}
            <button
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => setShowDeckSelector(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Premium usage modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white p-6 w-11/12 md:w-1/2 rounded-lg shadow-xl relative">
            <button
              onClick={() => setShowPremiumModal(false)}
              className="absolute top-2 right-2 text-2xl text-gray-700 hover:text-gray-900"
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
                  onClick={() => setShowPremiumModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatItem;
