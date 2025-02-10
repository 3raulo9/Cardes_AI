import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { FiPlus, FiArrowLeft } from "react-icons/fi";

const CardsPage = () => {
  const [cards, setCards] = useState([]);
  const { setId, id } = useParams(); // 🛠️ Ensure we get `setId` correctly
  const navigate = useNavigate();

  useEffect(() => {
    if (!setId) return; // Ensure `setId` exists

    axiosInstance
      .get(`/api/cards/?card_set=${setId}`) // 🛠️ Ensure the request includes `setId`
      .then((res) => setCards(res.data))
      .catch((err) => console.error("Error fetching cards:", err));
  }, [setId]);

  const addCard = async () => {
    const term = prompt("Enter the term:");
    if (!term) return;

    const definition = prompt("Enter the definition:");
    if (!definition) return;

    axiosInstance
      .post("/api/cards/", { term, definition, card_set: setId }) // 🛠️ Ensure new cards go into `setId`
      .then((res) => setCards([...cards, res.data]))
      .catch((err) => console.error("Error adding card:", err));
  };

  return (
    <div className="p-6 bg-accent min-h-screen">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => navigate(`/categories/${id}`)}
            className="bg-secondary text-white px-3 py-2 rounded-lg flex items-center mr-4 hover:bg-primary transition"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-2xl font-bold text-white">Cards</h1>
        </div>

        <button onClick={addCard} className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center">
          <FiPlus className="mr-2" /> Add Card
        </button>
      </div>
      <ul className="mt-4">
        {cards.length > 0 ? (
          cards.map((card) => (
            <li key={card.id} className="p-4 bg-secondary text-white rounded-lg my-2">
              <strong>Term:</strong> {card.term} <br />
              <strong>Definition:</strong> {card.definition}
            </li>
          ))
        ) : (
          <p className="text-white mt-4">No cards available. Add new cards!</p>
        )}
      </ul>
    </div>
  );
};

export default CardsPage;
