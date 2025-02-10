import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

const CardsPage = () => {
  const [cards, setCards] = useState([]);
  const { id, setId } = useParams();

  useEffect(() => {
    axiosInstance.get(`/api/cards/?card_set=${setId}`)
      .then((res) => setCards(res.data))
      .catch((err) => console.error(err));
  }, [setId]);

  const addCard = async () => {
    const term = prompt("Enter the term:");
    if (!term) return;

    const definition = prompt("Enter the definition:");
    if (!definition) return;

    axiosInstance.post("/api/cards/", { term, definition, card_set: setId })
      .then((res) => setCards([...cards, res.data]))
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6 bg-accent min-h-screen"> {/* 🛠️ Applied `bg-accent` for background */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold ml-11 md:ml-0 text-white">Cards</h1> {/* 🛠️ Made text white for visibility */}
        <button onClick={addCard} className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center">
          <FiPlus className="mr-2" /> Add Card
        </button>
      </div>
      <ul className="mt-4">
        {cards.map((card) => (
          <li key={card.id} className="p-4 bg-secondary text-white rounded-lg my-2">
            <strong>Term:</strong> {card.term} <br />
            <strong>Definition:</strong> {card.definition}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CardsPage;
