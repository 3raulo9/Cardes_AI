import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { FiPlus, FiArrowLeft, FiEdit, FiTrash2 } from "react-icons/fi";
import { SlCopyButton, SlTooltip } from "@shoelace-style/shoelace/dist/react";
import { SpeakerWaveIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import handleTextToSpeech from "../utils/handleTextToSpeech";
import Loader from "../components/Loader";

const CardsPage = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setId, id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/api/categories/")
      .then((res) => {
        if (res.data.length === 0) {
          navigate("/categories");
        } else {
          if (!setId) return;
          axiosInstance
            .get(`/api/cards/?card_set=${setId}`)
            .then((res) => {
              setCards(res.data);
              setLoading(false);
            })
            .catch((err) => {
              console.error("Error fetching cards:", err);
              setLoading(false);
            });
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setLoading(false);
      });
  }, [setId, navigate]);

  const addCard = async () => {
    const term = prompt("Enter the term:");
    if (!term) return;
    const definition = prompt("Enter the definition:");
    if (!definition) return;
    try {
      const response = await axiosInstance.post("/api/cards/", {
        term,
        definition,
        card_set: setId,
      });
      setCards([...cards, response.data]);
    } catch (err) {
      console.error("Error adding card:", err.response?.data || err.message);
    }
  };

  const editCard = async (card) => {
    const newTerm = prompt("Edit term:", card.term);
    if (!newTerm) return;
    const newDefinition = prompt("Edit definition:", card.definition);
    if (!newDefinition) return;

    try {
      const response = await axiosInstance.patch(`/api/cards/${card.id}/`, {
        term: newTerm,
        definition: newDefinition,
      });
      setCards(
        cards.map((c) => (c.id === card.id ? { ...c, ...response.data } : c))
      );
    } catch (err) {
      console.error("Error editing card:", err.response?.data || err.message);
    }
  };

  const deleteCard = async (cardId) => {
    if (!window.confirm("Delete this card?")) return;
    try {
      await axiosInstance.delete(`/api/cards/${cardId}/`);
      setCards(cards.filter((c) => c.id !== cardId));
    } catch (err) {
      console.error("Error deleting card:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-primary via-[-10%] via-darkAccent text-white">
      {/* Sticky Header with Back Button */}
      <header className="relative z-10">
        <div className="bg-secondary px-6 py-4 flex justify-between items-center shadow-md">
          <div className="flex items-center">
            <button
              onClick={() => navigate(`/categories/${id}`)}
              className="bg-primary text-white px-3 py-2 rounded-lg flex items-center hover:bg-darkAccent transition"
            >
              <FiArrowLeft className="mr-2" /> Back
            </button>
            <h1 className="text-2xl font-bold text-white ml-4">Cards</h1>
          </div>
          <button
            onClick={addCard}
            className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-darkAccent transition"
          >
            <FiPlus className="mr-2" /> Add Card
          </button>
        </div>
      </header>

      {/* Scrollable Cards Grid */}
      <main className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
        {loading ? (
          <Loader />
        ) : cards.length === 0 ? (
          <p className="text-center text-gray-300 text-lg mt-4">
            No cards available. Add a new one!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {cards.map((card) => (
              <div
                key={card.id}
                className="p-4 bg-secondary text-white rounded-lg shadow-md transition duration-300 hover:scale-105 hover:shadow-xl flex flex-col gap-2"
              >
                {/* Term Row */}
                <div className="flex items-center gap-2">
                  <strong>Term:</strong>
                  <span className="flex-1 break-words">{card.term}</span>
                  <SlTooltip content="Copy Term">
                    <SlCopyButton value={card.term} className="text-white" />
                  </SlTooltip>
                  <SlTooltip content="Listen">
                    <button
                      onClick={() => handleTextToSpeech(card.term)}
                      className="p-1 rounded-full hover:bg-gray-700 transition"
                      aria-label="Play Term"
                    >
                      <SpeakerWaveIcon className="w-5 h-5 text-white" />
                    </button>
                  </SlTooltip>
                  <SlTooltip content="Download">
                    <button
                      onClick={() => handleTextToSpeech(card.term, true)}
                      className="p-1 rounded-full hover:bg-gray-700 transition"
                      aria-label="Download Term"
                    >
                      <ArrowDownTrayIcon className="w-5 h-5 text-white" />
                    </button>
                  </SlTooltip>
                </div>

                {/* Definition Row */}
                <div className="flex items-center gap-2">
                  <strong>Definition:</strong>
                  <span className="flex-1 break-words">{card.definition}</span>
                  <SlTooltip content="Copy Definition">
                    <SlCopyButton value={card.definition} className="text-white" />
                  </SlTooltip>
                  <SlTooltip content="Listen">
                    <button
                      onClick={() => handleTextToSpeech(card.definition)}
                      className="p-1 rounded-full hover:bg-gray-700 transition"
                      aria-label="Play Definition"
                    >
                      <SpeakerWaveIcon className="w-5 h-5 text-white" />
                    </button>
                  </SlTooltip>
                  <SlTooltip content="Download">
                    <button
                      onClick={() => handleTextToSpeech(card.definition, true)}
                      className="p-1 rounded-full hover:bg-gray-700 transition"
                      aria-label="Download Definition"
                    >
                      <ArrowDownTrayIcon className="w-5 h-5 text-white" />
                    </button>
                  </SlTooltip>
                </div>

                {/* Action Buttons Row */}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => editCard(card)}
                    className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
                    aria-label="Edit"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => deleteCard(card.id)}
                    className="p-2 bg-red-500 hover:bg-red-700 text-white rounded-lg transition"
                    aria-label="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CardsPage;
