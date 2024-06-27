// src/components/ChatItem.js
import React from "react";
import Typewriter from "typewriter-effect";
import { SlCopyButton, SlTooltip } from "@shoelace-style/shoelace/dist/react";
import catIcon from "../static/images/cat_icon.png";
import anonIcon from "../static/images/anon_icon.png";

const ChatItem = ({
  chatItem,
  index,
  cursorVisibility,
  tooltipContent,
  handleTextToSpeech,
  handleTypingComplete,
  hasShownCatIcon
}) => {
  return (
    <div key={chatItem.id} className={`chat-item ${chatItem.role}`}>
      <div className="icon">
        {(index === 0 ||
          (!chatItem.showCardButton && !hasShownCatIcon)) && (
          <img
            src={chatItem.role === "user" ? anonIcon : catIcon}
            alt={chatItem.role}
            className="chat-icon"
          />
        )}
        {chatItem.role !== "user" && chatItem.showCardButton && (hasShownCatIcon = true)}
      </div>
      <div className={`answer-container ${chatItem.role === 'model' && index % 2 === 0 ? 'second-box' : ''}`}>
        {chatItem.role === "model" ? (
          <div className={`typed-out ${cursorVisibility[chatItem.id] ? 'hide-cursor' : ''}`}>
            <Typewriter
              onInit={(typewriter) => {
                typewriter.typeString(chatItem.parts.join(" "))
                  .callFunction(() => {
                    handleTypingComplete(chatItem.id);
                  })
                  .start();
              }}
              options={{ delay: 8, cursor: "🐾" }}
            />
          </div>
        ) : (
          <p className="answer">{chatItem.parts.join(" ")} </p>
        )}
        <button className="copy-button " aria-label="Copy text">
          <SlCopyButton value={chatItem.parts.join(" ")} />
        </button>
        <SlTooltip content={tooltipContent.listen || "Listen"}>
          <button
            className="audio-button asnwer-buttons"
            aria-label="Play audio"
            onClick={() => handleTextToSpeech(chatItem.parts.join(" "))}
          >
            <sl-icon name="volume-down-fill" />
          </button>
        </SlTooltip>
        <SlTooltip content={tooltipContent.download || "Download"}>
          <button
            className="download-button asnwer-buttons"
            aria-label="Download audio"
            onClick={() =>
              handleTextToSpeech(chatItem.parts.join(" "), true)
            }
          >
            <sl-icon name="download" />
          </button>
        </SlTooltip>
      </div>
      <SlTooltip  placement="right" content={  "Add to cards"}>
        {chatItem.showCardButton && (
          <div className="add-to-cards">
            <div className="line"></div>
            <button className="add-to-cards-button">
              <sl-icon className="add-to-cards-button" name="file-plus-fill" />
            </button>
          </div>
        )}
      </SlTooltip>
    </div>
  );
};

export default ChatItem;
