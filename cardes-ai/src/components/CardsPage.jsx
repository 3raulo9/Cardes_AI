import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { FiPlus, FiArrowLeft } from "react-icons/fi";
import { SlCopyButton, SlTooltip } from "@shoelace-style/shoelace/dist/react";
import { SpeakerWaveIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import handleTextToSpeech from "../utils/textToSpeech"; // Import TTS utility

const CardsPage = () => {
  const [cards, setCards] = useState([]);
  const { setId, id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!setId) return;

    axiosInstance
      .get(`/api/cards/?card_set=${setId}`)
      .then((res) => setCards(res.data))
      .catch((err) => console.error("Error fetching cards:", err));
  }, [setId]);

  const addCard = async () => {
    const term = prompt("Enter the term:");
    if (!term) return;

    const definition = prompt("Enter the definition:");
    if (!definition) return;

    axiosInstance
      .post("/api/cards/", { term, definition, card_set: setId })
      .then((res) => setCards([...cards, res.data]))
      .catch((err) => console.error("Error adding card:", err));
  };

  return (
    <div className="flex flex-col h-screen bg-accent">
      {/* Sticky Header */}
      <div className="p-4 bg-secondary flex justify-between items-center sticky top-0 z-10 shadow-md">
        <div className="flex items-center">
          <button
            onClick={() => navigate(`/categories/${id}`)}
            className="bg-primary text-white px-3 py-2 rounded-lg flex items-center hover:bg-highlight transition"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-2xl font-bold text-white ml-4">Cards</h1>
        </div>
        <button
          onClick={addCard}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-highlight transition"
        >
          <FiPlus className="mr-2" /> Add Card
        </button>
      </div>

      {/* Scrollable Cards List */}
      <div className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-4">
          {cards.length > 0 ? (
            cards.map((card) => (
              <li
                key={card.id}
                className="p-4 bg-secondary text-white rounded-lg shadow-md transition-transform duration-300 ease-out hover:scale-100 hover:shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <strong>Term:</strong> {card.term}

                  {/* Copy Term Button */}
                  <SlTooltip content="Copy Term">
                    <SlCopyButton value={card.term} className="text-white hover:text-gray-300" />
                  </SlTooltip>

                  {/* Listen to Term */}
                  <SlTooltip content="Listen">
                    <button
                      className="p-2 bg-transparent rounded-full hover:bg-gray-700 focus:outline-none transition"
                      aria-label="Play Term"
                      onClick={() => handleTextToSpeech(card.term)}
                    >
                      <SpeakerWaveIcon className="w-6 h-6 text-white" />
                    </button>
                  </SlTooltip>

                  {/* Download Term */}
                  <SlTooltip content="Download">
                    <button
                      className="p-2 bg-transparent rounded-full hover:bg-gray-700 focus:outline-none transition"
                      aria-label="Download Term"
                      onClick={() => handleTextToSpeech(card.term, true)}
                    >
                      <ArrowDownTrayIcon className="w-6 h-6 text-white" />
                    </button>
                  </SlTooltip>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <strong>Definition:</strong> {card.definition}

                  {/* Copy Definition Button */}
                  <SlTooltip content="Copy Definition">
                    <SlCopyButton value={card.definition} className="text-white hover:text-gray-300" />
                  </SlTooltip>

                  {/* Listen to Definition */}
                  <SlTooltip content="Listen">
                    <button
                      className="p-2 bg-transparent rounded-full hover:bg-gray-700 focus:outline-none transition"
                      aria-label="Play Definition"
                      onClick={() => handleTextToSpeech(card.definition)}
                    >
                      <SpeakerWaveIcon className="w-6 h-6 text-white" />
                    </button>
                  </SlTooltip>

                  {/* Download Definition */}
                  <SlTooltip content="Download">
                    <button
                      className="p-2 bg-transparent rounded-full hover:bg-gray-700 focus:outline-none transition"
                      aria-label="Download Definition"
                      onClick={() => handleTextToSpeech(card.definition, true)}
                    >
                      <ArrowDownTrayIcon className="w-6 h-6 text-white" />
                    </button>
                  </SlTooltip>
                </div>
              </li>
            ))
          ) : (
            <p className="text-white text-center">No cards available. Add new cards!</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CardsPage;
