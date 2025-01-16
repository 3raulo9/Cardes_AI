import React, { useState, useEffect } from "react";
import { SlCopyButton, SlTooltip } from "@shoelace-style/shoelace/dist/react";
import catIcon from "../static/images/cat_icon.png";
import anonIcon from "../static/images/anon_icon.png";

const ChatItem = ({
  chatItem,
  tooltipContent = { listen: "Listen", download: "Download" },
  handleTextToSpeech,
  updateMessage,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [newMessageContent, setNewMessageContent] = useState(chatItem.parts.join(" "));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleEditClick = () => setEditMode(true);
  const handleSaveClick = () => {
    updateMessage(chatItem.id, newMessageContent);
    setEditMode(false);
  };

  return (
    <div className={`flex items-start gap-4 ${chatItem.role === "user" ? "justify-end" : "justify-start"} w-full`}>
      {/* Bot Icon */}
      {chatItem.role !== "user" && (
        <img
          src={catIcon}
          alt="Bot Icon"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md"
        />
      )}

      {/* Message Bubble */}
      <div
        className={`relative max-w-full md:max-w-lg rounded-3xl px-4 sm:px-6 py-3 shadow-md ${
          chatItem.role === "user"
            ? "bg-indigo-500 text-white rounded-br-none"
            : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
        } transition-transform duration-300 transform ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
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
          <p className="whitespace-pre-line break-words">{chatItem.parts.join(" ")}</p>
        )}

        {/* Copy and Play Audio Buttons */}
        <div className="absolute right-2 bottom-2 flex items-center gap-2">
          <SlCopyButton value={chatItem.parts.join(" ")} className="text-gray-500" />
          <SlTooltip content={tooltipContent.listen || "Listen"}>
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Play audio"
              onClick={() => handleTextToSpeech(chatItem.parts.join(" "))}
            >
              <sl-icon name="volume-down-fill" />
            </button>
          </SlTooltip>
          <SlTooltip content={tooltipContent.download || "Download"}>
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Download audio"
              onClick={() => handleTextToSpeech(chatItem.parts.join(" "), true)}
            >
              <sl-icon name="download" />
            </button>
          </SlTooltip>
        </div>
      </div>

      {/* User Icon */}
      {chatItem.role === "user" && (
        <img
          src={anonIcon}
          alt="User Icon"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md"
        />
      )}
    </div>
  );
};

export default ChatItem;
