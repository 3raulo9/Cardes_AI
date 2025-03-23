import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

// Configuration constants for swipe detection
const SWIPE_DISTANCE_THRESHOLD = 100; // Minimum distance in px to consider as swipe
const SWIPE_VELOCITY_THRESHOLD = 0.3;   // Minimum velocity (px/ms) to trigger swipe
const SWIPE_ANIMATION_DURATION = 300;   // Duration for off-screen animation (ms)

/* ----------------------------------
   TOP FLASHCARD COMPONENT
   - Draggable, flippable; shows front/back based on user choice.
   - Uses advanced swipe detection with velocity/inertia.
---------------------------------- */
const TopFlashcard = ({
  card,
  flipped,
  onFlip,
  onSwipeLeft,
  onSwipeRight,
  dragState,
  setDragState,
  showTermFirst,
}) => {
  // Refs to track last pointer movement for velocity calculation
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Compute opacity: card fades out as |x| increases beyond 100px.
  const opacity = useMemo(() => {
    const absX = Math.abs(dragState.x);
    if (absX <= SWIPE_DISTANCE_THRESHOLD) return 1;
    return Math.max(0, 1 - (absX - SWIPE_DISTANCE_THRESHOLD) / SWIPE_DISTANCE_THRESHOLD);
  }, [dragState.x]);

  // Pointer down: start tracking
  const handlePointerDown = (e) => {
    if (dragState.isSwiping) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    setDragState({ x: 0, startX: clientX, isDragging: true, isSwiping: false });
    lastXRef.current = clientX;
    lastTimeRef.current = performance.now();
  };

  // Pointer move: update drag offset and compute velocity
  const handlePointerMove = (e) => {
    if (!dragState.isDragging || dragState.isSwiping) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const now = performance.now();
    const dt = now - lastTimeRef.current || 1;
    const dx = clientX - dragState.startX;
    const velocity = (clientX - lastXRef.current) / dt; // px per ms

    setDragState((prev) => ({ ...prev, x: dx, velocity }));
    lastXRef.current = clientX;
    lastTimeRef.current = now;
  };

  // Animate the card off-screen with inertia.
  const animateOffScreen = useCallback((finalX, callback) => {
    const start = performance.now();
    const initialX = dragState.x;

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / SWIPE_ANIMATION_DURATION, 1);
      const newX = initialX + (finalX - initialX) * progress;
      setDragState((prev) => ({ ...prev, x: newX }));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        callback();
      }
    };

    requestAnimationFrame(animate);
  }, [dragState.x, setDragState]);

  // Pointer up: decide whether to trigger swipe based on distance or velocity
  const handlePointerUp = () => {
    if (!dragState.isDragging || dragState.isSwiping) return;
    const { x, velocity } = dragState;
    setDragState((prev) => ({ ...prev, isDragging: false }));

    if (x > SWIPE_DISTANCE_THRESHOLD || velocity > SWIPE_VELOCITY_THRESHOLD) {
      // Swipe right
      setDragState((prev) => ({ ...prev, isSwiping: true }));
      animateOffScreen(500, onSwipeRight);
    } else if (x < -SWIPE_DISTANCE_THRESHOLD || velocity < -SWIPE_VELOCITY_THRESHOLD) {
      // Swipe left
      setDragState((prev) => ({ ...prev, isSwiping: true }));
      animateOffScreen(-500, onSwipeLeft);
    } else {
      if (Math.abs(x) < 10) {
        onFlip();
      }
      // Animate back to center
      setDragState({ x: 0, startX: 0, isDragging: false, isSwiping: false });
    }
  };

  return (
    <div
      className="absolute inset-0 select-none cursor-grab"
      role="button"
      tabIndex={0}
      aria-label="Flashcard: click to flip or drag to answer"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      style={{ perspective: "1000px" }}
    >
      <div
        className={`w-full h-full flipper transition-transform duration-300 ease-out ${
          flipped ? "rotated" : ""
        } ${dragState.isDragging ? "scale-105" : "scale-100"}`}
        style={{
          transformStyle: "preserve-3d",
          transform: `translateX(${dragState.x}px) rotateZ(${dragState.x / 25}deg) ${
            flipped ? "rotateY(180deg)" : ""
          }`,
          opacity,
        }}
      >
        {/* Front Side */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl bg-primary text-white p-4 shadow-2xl backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <h1 className="text-lg sm:text-xl font-bold text-center select-none">
            {showTermFirst ? card.term || "No Term" : card.definition || "No Definition"}
          </h1>
        </div>
        {/* Back Side */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl bg-info text-white p-4 shadow-2xl backface-hidden rotate-y-180"
          style={{ backfaceVisibility: "hidden" }}
        >
          <h1 className="text-lg sm:text-xl font-bold text-center select-none">
            {showTermFirst ? card.definition || "No Definition" : card.term || "No Term"}
          </h1>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------
   PROGRESS BAR COMPONENT
---------------------------------- */
const ProgressBar = ({ progressPercentage }) => (
  <div className="w-full max-w-md min-w-[200px] bg-darkAccent rounded-full h-4 overflow-hidden mx-auto">
    <div
      style={{ width: `${progressPercentage}%` }}
      className="bg-success h-4 transition-all duration-300"
    ></div>
  </div>
);

/* ----------------------------------
   TIMER COMPONENT
---------------------------------- */
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
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  return <div className="text-center text-xl font-bold">{timeLeft}s</div>;
};

/* ----------------------------------
   STATS MODAL COMPONENT
---------------------------------- */
const StatsModal = ({ correct, incorrect, total, onRestart, onGoBack }) => (
  <div className="fixed inset-0 bg-darkAccent bg-opacity-70 flex items-center justify-center z-50 p-4">
    <div className="bg-secondary text-white rounded-xl p-8 w-full max-w-md text-center animate-fadeIn">
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
          className="bg-success hover:bg-success transition px-4 py-2 rounded-lg"
        >
          Restart
        </button>
        <button
          onClick={onGoBack}
          className="bg-warning hover:bg-warning transition px-4 py-2 rounded-lg"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
);

/* ----------------------------------
   SETUP MODAL COMPONENT
   - Lets user choose which side to show first.
---------------------------------- */
const SetupModal = ({ showTermFirst, setShowTermFirst, onContinue }) => (
  <div className="fixed inset-0 bg-darkAccent bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fadeIn">
    <div className="bg-secondary text-white rounded-xl p-8 w-full max-w-md text-center">
      <h2 className="text-2xl font-bold mb-4">Choose Card Mode</h2>
      <div className="mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="mode"
            checked={showTermFirst === true}
            onChange={() => setShowTermFirst(true)}
            className="mr-2"
          />
          Show the term first
        </label>
      </div>
      <div className="mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="mode"
            checked={showTermFirst === false}
            onChange={() => setShowTermFirst(false)}
            className="mr-2"
          />
          Show the definition first
        </label>
      </div>
      <button
        onClick={onContinue}
        className="bg-success hover:bg-success transition px-4 py-2 rounded-lg"
      >
        Continue
      </button>
    </div>
  </div>
);

/* ----------------------------------
   MAIN PRACTICE PAGE COMPONENT
   - Cards are managed as a queue. Each swiped card is removed permanently,
     and the next card appears freshly centered.
   - Restart resets to the very first card.
---------------------------------- */
const SimpleReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [initialCards, setInitialCards] = useState([]);
  const [initialCount, setInitialCount] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [timerTrigger, setTimerTrigger] = useState(0);
  const [dragState, setDragState] = useState({
    x: 0,
    startX: 0,
    isDragging: false,
    isSwiping: false,
  });
  // Setup modal state
  const [showSetup, setShowSetup] = useState(true);
  const [showTermFirst, setShowTermFirst] = useState(true);
  const timerDuration = 15;

  // Global overlay for drag feedback
  const overlayStyle = useMemo(() => {
    const { x } = dragState;
    if (x > 0) {
      const alpha = Math.min(x / 200, 0.5);
      return {
        background: `linear-gradient(to left, rgba(0,255,0,${alpha}) 0%, rgba(0,255,0,0) 100%)`,
      };
    } else if (x < 0) {
      const alpha = Math.min(Math.abs(x) / 200, 0.5);
      return {
        background: `linear-gradient(to right, rgba(255,0,0,${alpha}) 0%, rgba(255,0,0,0) 100%)`,
      };
    }
    return { background: "transparent" };
  }, [dragState.x]);

  // Fetch cards from API and store them in both cards and initialCards.
  useEffect(() => {
    axiosInstance
      .get(`/api/cards/?card_set=${id}`)
      .then((res) => {
        let fetchedCards = res.data;
        if (shuffle) {
          fetchedCards = [...fetchedCards].sort(() => Math.random() - 0.5);
        }
        setCards(fetchedCards);
        setInitialCards(fetchedCards);
        setInitialCount(fetchedCards.length);
      })
      .catch((err) => console.error(err));
  }, [id, shuffle]);

  // When a card is swiped off, update stats and remove it from the queue.
  const handleNextCard = useCallback(
    (wasCorrect) => {
      if (wasCorrect) {
        setCorrectCount((prev) => prev + 1);
      } else {
        setIncorrectCount((prev) => prev + 1);
      }
      if (cards.length > 1) {
        setCards((prev) => prev.slice(1));
        setFlipped(false);
        setTimerTrigger((prev) => prev + 1);
        setDragState({ x: 0, startX: 0, isDragging: false, isSwiping: false });
      } else {
        setFinished(true);
      }
    },
    [cards]
  );

  const handleTimeUp = useCallback(() => {
    handleNextCard(false);
  }, [handleNextCard]);

  // Keyboard controls for accessibility.
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
    setFinished(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setFlipped(false);
    setTimerTrigger((prev) => prev + 1);
    setDragState({ x: 0, startX: 0, isDragging: false, isSwiping: false });
    // Reset the cards queue to the original set.
    setCards(initialCards);
    setInitialCount(initialCards.length);
  };

  const handleSwipeLeft = () => {
    handleNextCard(false);
  };

  const handleSwipeRight = () => {
    handleNextCard(true);
  };

  if (showSetup) {
    return (
      <SetupModal
        showTermFirst={showTermFirst}
        setShowTermFirst={setShowTermFirst}
        onContinue={() => setShowSetup(false)}
      />
    );
  }

  // Compute progress percentage based on the initial count.
  const progressPercentage =
    initialCount > 0 ? ((initialCount - cards.length) / initialCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-accent relative flex flex-col items-center justify-center p-4 sm:p-8 text-white">
      {/* Global overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-150"
        style={overlayStyle}
      />
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center">
        Flashcards Practice
      </h1>
      <div className="mb-4 flex gap-4 z-10">
        <button
          onClick={() => setShuffle((prev) => !prev)}
          className="bg-warning hover:bg-danger transition px-4 py-2 rounded-lg"
        >
          {shuffle ? "Unshuffle Cards" : "Shuffle Cards"}
        </button>
      </div>
      <div className="mt-6 flex flex-col items-center gap-6 w-full z-10">
        <Timer duration={timerDuration} onTimeUp={handleTimeUp} resetTrigger={timerTrigger} />
        <div className="relative w-full max-w-[280px] h-[300px]">
          {cards.length > 0 && (
            // Using a key forces a remount so the new card always appears centered.
            <TopFlashcard
              key={cards[0].id || cards[0].term || Date.now()}
              card={cards[0]}
              flipped={flipped}
              onFlip={() => setFlipped((prev) => !prev)}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              dragState={dragState}
              setDragState={setDragState}
              showTermFirst={showTermFirst}
            />
          )}
        </div>
      </div>
      {finished && (
        <StatsModal
          correct={correctCount}
          incorrect={incorrectCount}
          total={initialCount}
          onRestart={restartPractice}
          onGoBack={() => navigate(`/categories/`)}
        />
      )}
      <div className="mt-6 flex flex-col items-center gap-6 w-full z-10">
        <ProgressBar progressPercentage={progressPercentage} />
      </div>
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
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SimpleReviewPage;
