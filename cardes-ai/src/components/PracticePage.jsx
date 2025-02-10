import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiRotateCw } from "react-icons/fi";

const PracticePage = () => {
  const { id } = useParams(); // Card set ID
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTermFirst, setShowTermFirst] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/api/cards/?card_set=${id}`)
      .then((res) => setCards(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleSwipe = (direction) => {
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    } else {
      setFinished(true);
    }
  };

  const restartPractice = () => {
    setCurrentIndex(0);
    setFinished(false);
  };

  return (
    <div className="p-6 bg-accent min-h-screen flex flex-col items-center justify-center text-white">
      {finished ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Congrats! 🎉</h1>
          <button
            onClick={restartPractice}
            className="bg-primary text-white px-4 py-2 rounded-lg mx-2"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate(`/categories/${id}`)}
            className="bg-secondary text-white px-4 py-2 rounded-lg mx-2"
          >
            Go Back
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={() => setShowTermFirst(!showTermFirst)}
            className="mb-4 bg-secondary px-4 py-2 rounded-lg"
          >
            {showTermFirst ? "Show Definition First" : "Show Term First"}
          </button>

          {cards.length > 0 ? (
            <div
              className="w-80 h-60 bg-white text-black p-6 rounded-xl shadow-lg flex items-center justify-center cursor-pointer"
              onClick={() => setFlipped(!flipped)}
            >
              <h1 className="text-xl font-bold">
                {flipped
                  ? showTermFirst
                    ? cards[currentIndex].definition
                    : cards[currentIndex].term
                  : showTermFirst
                  ? cards[currentIndex].term
                  : cards[currentIndex].definition}
              </h1>
            </div>
          ) : (
            <p>No cards available.</p>
          )}

          <div className="mt-4 flex gap-4">
            <button
              onClick={() => handleSwipe("left")}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Wrong
            </button>
            <button
              onClick={() => handleSwipe("right")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Correct
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PracticePage;
