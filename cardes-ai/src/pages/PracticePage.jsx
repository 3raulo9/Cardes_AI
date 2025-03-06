import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

/* ----------------------------------
   INDIVIDUAL FLASHCARD COMPONENT
   (Top card only, with dragging/overlay)
---------------------------------- */
const TopFlashcard = ({
  card,
  flipped,
  onFlip,
  onSwipeLeft,
  onSwipeRight,
  dragState,
  setDragState,
}) => {
  // Compute overlay style based on drag offset
  const getOverlayStyle = () => {
    const dx = dragState.x;
    if (dx > 0) {
      // Dragging right => green
      const alpha = Math.min(dx / 200, 0.5);
      return {
        background: `linear-gradient(to left, rgba(0,255,0,${alpha}) 0%, rgba(0,255,0,0) 100%)`,
      };
    } else if (dx < 0) {
      // Dragging left => red
      const alpha = Math.min(Math.abs(dx) / 200, 0.5);
      return {
        background: `linear-gradient(to right, rgba(255,0,0,${alpha}) 0%, rgba(255,0,0,0) 100%)`,
      };
    }
    return { background: "transparent" };
  };

  const handlePointerDown = (e) => {
    if (dragState.isSwiping) return;
    const clientX = e.clientX ?? (e.touches?.[0]?.clientX || 0);
    setDragState({ x: 0, startX: clientX, isDragging: true, isSwiping: false });
  };

  const handlePointerMove = (e) => {
    if (!dragState.isDragging || dragState.isSwiping) return;
    const clientX = e.clientX ?? (e.touches?.[0]?.clientX || 0);
    const dx = clientX - dragState.startX;
    setDragState((prev) => ({ ...prev, x: dx }));
  };

  const handlePointerUp = () => {
    if (!dragState.isDragging || dragState.isSwiping) return;
    const dx = dragState.x;
    setDragState((prev) => ({ ...prev, isDragging: false }));

    // Big swipe => animate off-screen
    if (dx > 100) {
      // Right => correct
      setDragState((prev) => ({ ...prev, x: 500, isSwiping: true }));
      setTimeout(() => {
        onSwipeRight();
        setDragState({ x: 0, startX: 0, isDragging: false, isSwiping: false });
      }, 300);
    } else if (dx < -100) {
      // Left => wrong
      setDragState((prev) => ({ ...prev, x: -500, isSwiping: true }));
      setTimeout(() => {
        onSwipeLeft();
        setDragState({ x: 0, startX: 0, isDragging: false, isSwiping: false });
      }, 300);
    } else {
      // Small drag => flip
      if (Math.abs(dx) < 10) {
        onFlip();
      }
      // Otherwise reset
      setDragState({ x: 0, startX: 0, isDragging: false, isSwiping: false });
    }
  };

  return (
    <div
      className="absolute inset-0 select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      style={{ perspective: "1000px" }}
    >
      {/* Side overlay behind the card */}
      <div className="absolute inset-0 pointer-events-none" style={getOverlayStyle()} />

      {/* The flipping card */}
      <div
        className={`w-full h-full flipper transition-transform duration-300 ${
          flipped ? "rotated" : ""
        }`}
        style={{
          transformStyle: "preserve-3d",
          transform: `translateX(${dragState.x}px) rotateZ(${dragState.x / 25}deg) ${
            flipped ? "rotateY(180deg)" : ""
          }`,
        }}
      >
        {/* FRONT: Term */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl bg-primary text-white p-4 shadow-xl backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <h1 className="text-lg sm:text-xl font-bold text-center select-none">
            {card.term || "No Term"}
          </h1>
        </div>

        {/* BACK: Definition */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl bg-info text-white p-4 shadow-xl backface-hidden rotate-y-180"
          style={{ backfaceVisibility: "hidden" }}
        >
          <h1 className="text-lg sm:text-xl font-bold text-center select-none">
            {card.definition || "No Definition"}
          </h1>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------
   NEXT FLASHCARD (STACKED BEHIND)
   - Slight offset & scale
   - Not draggable
---------------------------------- */
const NextFlashcard = ({ card }) => {
  // Just show the card with no flipping or dragging
  return (
    <div
      className="absolute inset-0 select-none pointer-events-none"
      style={{
        transformStyle: "preserve-3d",
        transform: "translate(10px, 15px) scale(0.95)",
      }}
    >
      <div className="w-full h-full">
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl bg-secondary text-white p-4 shadow-xl backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <h1 className="text-lg sm:text-xl font-bold text-center select-none">
            {card.term || "No Term"}
          </h1>
        </div>
      </div>
    </div>
  );
};

/* -----------------------------
   PROGRESS BAR SUBCOMPONENT
------------------------------ */
const ProgressBar = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="w-full max-w-md min-w-[200px] bg-darkAccent rounded-full h-4 overflow-hidden mx-auto">
      <div
        style={{ width: `${percentage}%` }}
        className="bg-success h-4 transition-all duration-300"
      ></div>
    </div>
  );
};

/* -----------------------------
   TIMER SUBCOMPONENT
------------------------------ */
const Timer = ({ duration, onTimeUp, resetTrigger }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, resetTrigger]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  return <div className="text-center text-xl font-bold">{timeLeft}s</div>;
};

/* -----------------------------
   STATS MODAL SUBCOMPONENT
------------------------------ */
const StatsModal = ({ correct, incorrect, total, onRestart, onGoBack }) => {
  return (
    <div className="fixed inset-0 bg-darkAccent bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary text-white rounded-xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Session Summary</h1>
        <p className="mb-2">Total Cards: {total}</p>
        <p className="mb-2">Correct Answers: {correct}</p>
        <p className="mb-2">Incorrect Answers: {incorrect}</p>
        <p className="mb-4">
          Score: {total > 0 ? ((correct / total) * 100).toFixed(1) : 0}%
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={onRestart}
            className="bg-success hover:bg-success transition text-white px-4 py-2 rounded-lg"
          >
            Restart
          </button>
          <button
            onClick={onGoBack}
            className="bg-warning hover:bg-warning transition text-white px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

/* -----------------------------
   MAIN EPIC PRACTICE PAGE
   - Stacks top 2 cards
   - Top card is draggable/flippable
   - Next card is offset behind
------------------------------ */
const EpicPracticePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [timerTrigger, setTimerTrigger] = useState(0);

  // Draggable state for the top card
  const [dragState, setDragState] = useState({
    x: 0,
    startX: 0,
    isDragging: false,
    isSwiping: false,
  });

  const timerDuration = 15;

  // Fetch cards
  useEffect(() => {
    axiosInstance
      .get(`/api/cards/?card_set=${id}`)
      .then((res) => {
        let fetchedCards = res.data;
        if (shuffle) {
          fetchedCards = shuffleArray(fetchedCards);
        }
        setCards(fetchedCards);
      })
      .catch((err) => console.error(err));
  }, [id, shuffle]);

  const shuffleArray = (array) => array.slice().sort(() => Math.random() - 0.5);

  const handleNextCard = useCallback(
    (wasCorrect) => {
      if (wasCorrect) {
        setCorrectCount((prev) => prev + 1);
      } else {
        setIncorrectCount((prev) => prev + 1);
      }
      if (currentIndex + 1 < cards.length) {
        setCurrentIndex((prev) => prev + 1);
        setFlipped(false);
        setTimerTrigger((prev) => prev + 1);
        setDragState({ x: 0, startX: 0, isDragging: false, isSwiping: false });
      } else {
        setFinished(true);
      }
    },
    [currentIndex, cards.length]
  );

  const handleTimeUp = useCallback(() => {
    handleNextCard(false);
  }, [handleNextCard]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowRight") {
        handleNextCard(true);
      } else if (event.key === "ArrowLeft") {
        handleNextCard(false);
      } else if (event.key === " ") {
        setFlipped((prev) => !prev);
      }
    },
    [handleNextCard]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const restartPractice = () => {
    setCurrentIndex(0);
    setFinished(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setFlipped(false);
    setTimerTrigger((prev) => prev + 1);
    setDragState({ x: 0, startX: 0, isDragging: false, isSwiping: false });
  };

  // SWIPE callbacks for top card
  const handleSwipeLeft = () => {
    handleNextCard(false);
  };
  const handleSwipeRight = () => {
    handleNextCard(true);
  };

  return (
    <div className="min-h-screen bg-accent flex flex-col items-center justify-center p-4 sm:p-8 text-white">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center">
        Epic Flashcards Practice
      </h1>

      {/* Shuffle button */}
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setShuffle((prev) => !prev)}
          className="bg-warning hover:bg-danger transition px-4 py-2 rounded-lg"
        >
          {shuffle ? "Unshuffle Cards" : "Shuffle Cards"}
        </button>
      </div>

      {/* Progress bar */}
      <ProgressBar current={currentIndex} total={cards.length} />

      {/* Timer + Card Stack */}
      <div className="mt-6 flex flex-col items-center gap-6 w-full">
        <Timer duration={timerDuration} onTimeUp={handleTimeUp} resetTrigger={timerTrigger} />

        {/* Card stack container */}
        <div className="relative w-full max-w-[320px] h-[200px]">
          {/* Next card (stacked behind) if available */}
          {currentIndex + 1 < cards.length && (
            <NextFlashcard card={cards[currentIndex + 1]} />
          )}

          {/* Top card (draggable/flippable) if available */}
          {cards.length > 0 && currentIndex < cards.length && (
            <TopFlashcard
              card={cards[currentIndex]}
              flipped={flipped}
              onFlip={() => setFlipped((prev) => !prev)}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              dragState={dragState}
              setDragState={setDragState}
            />
          )}
        </div>
      </div>

      {/* Wrong / Correct Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => handleNextCard(false)}
          className="bg-danger hover:bg-danger transition px-4 py-2 rounded-lg"
        >
          Wrong (←)
        </button>
        <button
          onClick={() => handleNextCard(true)}
          className="bg-success hover:bg-success transition px-4 py-2 rounded-lg"
        >
          Correct (→)
        </button>
      </div>

      {/* Stats modal when finished */}
      {finished && (
        <StatsModal
          correct={correctCount}
          incorrect={incorrectCount}
          total={cards.length}
          onRestart={restartPractice}
          onGoBack={() => navigate(`/categories/`)}
        />
      )}

      <style>{`
        .flipper.rotated {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default EpicPracticePage;
