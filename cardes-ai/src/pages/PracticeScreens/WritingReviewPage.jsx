import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

const WritingReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/api/cards/?card_set=${id}`)
      .then((res) => {
        setCards(res.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleCheck = () => {
    const correctDefinition = cards[currentIndex].definition;
    if (userInput.trim().toLowerCase() === correctDefinition.trim().toLowerCase()) {
      setScore(score + 1);
    }
    setShowAnswer(true);
  };

  const handleNext = () => {
    setUserInput("");
    setShowAnswer(false);
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setScore(0);
    setCurrentIndex(0);
    setUserInput("");
    setShowAnswer(false);
    setFinished(false);
  };

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-accent text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-accent text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-4">All done!</h1>
        <p className="text-xl mb-4">
          Score: {score} / {cards.length} ({((score / cards.length) * 100).toFixed(1)}%)
        </p>
        <div className="flex gap-4">
          <button onClick={restart} className="bg-success px-4 py-2 rounded hover:bg-highlight">
            Restart
          </button>
          <button
            onClick={() => navigate("/categories")}
            className="bg-warning px-4 py-2 rounded hover:bg-danger"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  const currentTerm = cards[currentIndex].term;
  const currentDefinition = cards[currentIndex].definition;

  return (
    <div className="min-h-screen bg-accent text-white flex flex-col items-center p-6">
      <div className="max-w-lg w-full bg-secondary p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Writing Review</h1>
        <p className="text-xl text-center mb-6">
          <strong>Term:</strong> {currentTerm}
        </p>

        {!showAnswer ? (
          <>
            <input
              type="text"
              className="w-full mb-4 p-2 rounded text-black"
              placeholder="Type the definition..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            />
            <button
              onClick={handleCheck}
              className="bg-primary hover:bg-highlight w-full py-2 rounded font-bold transition"
            >
              Check
            </button>
          </>
        ) : (
          <>
            <p className="text-center mb-4">
              Correct Definition:{" "}
              <strong className="text-success">{currentDefinition}</strong>
            </p>
            <p className="text-center mb-4">
              Your Answer:{" "}
              <strong
                className={
                  userInput.trim().toLowerCase() ===
                  currentDefinition.trim().toLowerCase()
                    ? "text-success"
                    : "text-warning"
                }
              >
                {userInput}
              </strong>
            </p>
            <button
              onClick={handleNext}
              className="bg-primary hover:bg-highlight w-full py-2 rounded font-bold transition"
            >
              Next
            </button>
          </>
        )}

        <p className="mt-4 text-center">
          {currentIndex + 1} / {cards.length}
        </p>
      </div>
    </div>
  );
};

export default WritingReviewPage;
