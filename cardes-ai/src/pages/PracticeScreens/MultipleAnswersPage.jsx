import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import handleTextToSpeech from "../../utils/handleTextToSpeech";
import { SpeakerWaveIcon } from "@heroicons/react/24/solid";

/**
 * MultipleAnswersPage
 *
 * - All text is unselectable via "select-none"
 * - Single-click answers: user cannot click multiple times per question
 * - Uses /public/audio/correct.mp3 and /public/audio/wrong.mp3
 * - Toned-down "wrong" effect and bigger "correct" effect
 * - Confetti on finish
 */
const MultipleAnswersPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ------------------------- STATE -------------------------
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(""); // "correct" or "wrong"
  const [showConfetti, setShowConfetti] = useState(false);

  // New state for the pre-practice prompt
  const [showPrompt, setShowPrompt] = useState(true);
  // "term" means the question shows the term and options are definitions.
  // "definition" means the question shows the definition and options are terms.
  const [displayMode, setDisplayMode] = useState("term");

  // Makes sure we only click once per question
  const [clickable, setClickable] = useState(true);

  // Refs for animations
  const termRef = useRef(null);
  const buttonsContainerRef = useRef(null);

  // ------------------------- USE EFFECTS -------------------------

  // 1) Load cards
  useEffect(() => {
    axiosInstance
      .get(`/api/cards/?card_set=${id}`)
      .then((res) => setCards(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  // 2) Build multiple-choice answers (when currentIndex or displayMode changes)
  useEffect(() => {
    // If no cards or out of range, do nothing
    if (cards.length === 0 || currentIndex >= cards.length) return;

    // We reset feedback and allow clicking again
    setFeedback("");
    setClickable(true);

    // Current card
    const currentCard = cards[currentIndex];

    // Based on displayMode, pick distractor values.
    // If mode is "term", question shows term so options are definitions.
    // If mode is "definition", question shows definition so options are terms.
    const correctValue =
      displayMode === "term" ? currentCard.definition : currentCard.term;
    let otherValues = cards
      .filter((c) => c.id !== currentCard.id)
      .map((c) => (displayMode === "term" ? c.definition : c.term));
    otherValues = shuffleArray(otherValues).slice(0, 4);

    // Combine correct answer with distractors and shuffle
    const combined = shuffleArray([...otherValues, correctValue]);
    setOptions(combined);

    // Animate the "term" container (question container)
    if (termRef.current) {
      void termRef.current.offsetWidth;
      termRef.current.classList.remove("animate-fadeIn");
      setTimeout(() => termRef.current.classList.add("animate-fadeIn"), 10);
    }

    // Animate the "buttons" container
    if (buttonsContainerRef.current) {
      void buttonsContainerRef.current.offsetWidth;
      buttonsContainerRef.current.classList.remove("animate-slideUp");
      setTimeout(() => buttonsContainerRef.current.classList.add("animate-slideUp"), 10);
    }
  }, [cards, currentIndex, displayMode]);

  // 3) Confetti on finish
  useEffect(() => {
    if (finished) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(t);
    }
  }, [finished]);

  // ------------------------- LOGIC -------------------------
  const shuffleArray = (arr) => arr.slice().sort(() => Math.random() - 0.5);

  // handleAnswer: user picks an option
  const handleAnswer = (selectedOption) => {
    // If user already answered or index is out of range, do nothing
    if (!clickable || currentIndex >= cards.length) return;

    setClickable(false);

    // Determine correct answer based on displayMode
    const correctAnswer =
      displayMode === "term"
        ? cards[currentIndex].definition
        : cards[currentIndex].term;

    if (selectedOption === correctAnswer) {
      setScore((prev) => prev + 1);
      setFeedback("correct");
      // Play correct sound
      const audio = new Audio("/audio/correct.mp3");
      audio.play().catch(() => {});
    } else {
      setFeedback("wrong");
      // Play wrong sound
      const audio = new Audio("/audio/wrong.mp3");
      audio.play().catch(() => {});
    }

    // Move on after a short delay
    setTimeout(() => {
      if (currentIndex + 1 < cards.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setFinished(true);
      }
    }, 850);
  };

  // Restart practice
  const restart = () => {
    setCurrentIndex(0);
    setScore(0);
    setFinished(false);
    setFeedback("");
  };

  // ------------------------- PRE-PRACTICE PROMPT -------------------------
  if (showPrompt) {
    return (
      <div className="select-none min-h-screen flex flex-col items-center justify-center bg-accent text-white p-6 animate-fadeInSlow">
        <h1 className="text-3xl font-extrabold mb-4">Select Practice Mode</h1>
        <div className="flex flex-col gap-2 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="displayMode"
              value="term"
              checked={displayMode === "term"}
              onChange={() => setDisplayMode("term")}
            />
            <span>Show Term (answers are definitions)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="displayMode"
              value="definition"
              checked={displayMode === "definition"}
              onChange={() => setDisplayMode("definition")}
            />
            <span>Show Definition (answers are terms)</span>
          </label>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="bg-success px-4 py-2 rounded hover:bg-highlight font-bold text-lg transition transform hover:scale-110"
        >
          Continue
        </button>
      </div>
    );
  }

  // ------------------------- EARLY RETURNS -------------------------

  // A) No cards -> loading
  if (cards.length === 0) {
    return (
      <div className="select-none min-h-screen flex items-center justify-center bg-accent text-white animate-fadeInSlow">
        <h1 className="text-3xl font-extrabold">Loading cards...</h1>
      </div>
    );
  }

  // B) If currentIndex is out of range, set finished or do a quick fallback
  if (currentIndex >= cards.length && !finished) {
    setFinished(true);
  }

  // C) Finished -> show results
  if (finished) {
    return (
      <div className="select-none relative min-h-screen flex flex-col items-center justify-center bg-accent text-white p-6 animate-fadeInSlow">
        {showConfetti && <ConfettiOverlay />}
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 animate-scaleUp">
          All done!
        </h1>
        <p className="text-xl sm:text-2xl mb-6 font-semibold">
          Score: {score} / {cards.length} (
          {((score / cards.length) * 100).toFixed(1)}%)
        </p>
        <div className="flex gap-4">
          <button
            onClick={restart}
            className="bg-success px-4 py-2 rounded hover:bg-highlight font-bold text-lg transition transform hover:scale-110"
          >
            Restart
          </button>
          <button
            onClick={() => navigate("/categories")}
            className="bg-warning px-4 py-2 rounded hover:bg-danger font-bold text-lg transition transform hover:scale-110"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  // ------------------------- MAIN RENDER -------------------------
  // Determine the question text based on displayMode.
  const currentCard = cards[currentIndex];
  const questionText =
    displayMode === "term" ? currentCard.term : currentCard.definition;

  return (
    <div className="select-none min-h-screen bg-accent text-white flex flex-col items-center justify-center p-6 relative overflow-hidden animate-fadeInSlow">
      {/* Overlays for "correct" or "wrong" */}
      {feedback === "correct" && <BigGreenOverlay />}
      {feedback === "wrong" && <SubtleWrongOverlay />}

      {/* The main container */}
      <div className="max-w-lg w-full bg-secondary p-6 rounded shadow-lg transform transition-all animate-scaleIn relative">
        <h1 className="text-3xl font-extrabold mb-4 text-center">
          Multiple Answers
        </h1>

        {/* Question container with speaker button */}
        <div
          ref={termRef}
          className="mb-6 text-2xl font-bold text-center animate-fadeIn flex items-center justify-center"
        >
          <span className="tracking-wide">
            <strong>{displayMode === "term" ? "Term:" : "Definition:"}</strong> {questionText}
          </span>
          <button
            onClick={() => handleTextToSpeech(questionText)}
            className="ml-2 p-1 rounded-full hover:bg-gray-700 transition"
            aria-label="Play Question Text"
          >
            <SpeakerWaveIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Options container with speaker buttons for each option */}
        <div
          ref={buttonsContainerRef}
          className="grid grid-cols-1 gap-4 animate-slideUp"
        >
          {options.map((opt, idx) => (
            <div
              key={idx}
              onClick={() => handleAnswer(opt)}
              className="bg-primary hover:bg-highlight text-white rounded p-4 text-left transition transform hover:-translate-y-1 hover:shadow-xl hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTextToSpeech(opt);
                  }}
                  className="ml-2 p-1 rounded-full hover:bg-gray-700 transition"
                  aria-label="Play Option Text"
                >
                  <SpeakerWaveIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-lg font-semibold">
          {currentIndex + 1} / {cards.length}
        </p>
      </div>

      {/* LOTS of stylized CSS animations */}
      <style>{`
        /* 
          KEYFRAMES
        */
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInSlow {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.8) rotate(2deg); opacity: 0.5; }
          70% { transform: scale(1.05) rotate(-1deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes slideUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes scaleUp {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        /* UTILITY CLASSES */
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-in-out forwards;
        }
        .animate-fadeInSlow {
          animation: fadeInSlow 1s ease-in-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-in-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-in-out forwards;
        }
        .animate-scaleUp {
          animation: scaleUp 0.8s ease-in-out;
        }
      `}</style>
    </div>
  );
};

/* ------------------------------------------------------------------
    A) ConfettiOverlay
------------------------------------------------------------------ */
const ConfettiOverlay = () => {
  const confettiCount = 40;
  const confettiElements = Array.from({ length: confettiCount }, (_, i) => (
    <div key={i} className="confetti-particle"></div>
  ));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {confettiElements}
      <style>{`
        .confetti-particle {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #ff0;
          opacity: 0.9;
          animation: confetti-fall 2s linear infinite;
          top: -10px;
          left: 50%;
          border-radius: 2px;
        }
        .confetti-particle:nth-child(odd) {
          background: #0f0;
        }
        .confetti-particle:nth-child(3n) {
          background: #f0f;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateX(0) rotate(0deg);
          }
          100% {
            transform: translateX(-180px) translateY(110vh) rotate(1080deg);
          }
        }
      `}</style>
    </div>
  );
};

/* ------------------------------------------------------------------
    B) BigGreenOverlay => "Correct" effect
    - Large, more prominent green overlay
    - With text "Correct!"
------------------------------------------------------------------ */
const BigGreenOverlay = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
      {/* Big green circle that expands */}
      <div className="w-72 h-72 rounded-full bg-success bg-opacity-60 animate-scaleUp flex items-center justify-center">
        <h2 className="text-white text-3xl font-extrabold animate-zoomIn">
          CORRECT!
        </h2>
      </div>

      {/* Additional style for text animation */}
      <style>{`
        @keyframes zoomIn {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-zoomIn {
          animation: zoomIn 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
};

/* ------------------------------------------------------------------
    C) SubtleWrongOverlay => "Wrong" effect
    - Less dramatic red overlay with minimal glitch lines
------------------------------------------------------------------ */
const SubtleWrongOverlay = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {/* Slight red overlay */}
      <div className="w-full h-full bg-danger bg-opacity-30 animate-fadeQuick"></div>

      {/* Some quick glitch lines, but fewer and less intense */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="subtle-glitch-line absolute w-full h-[2px] bg-danger bg-opacity-50"
            style={{ top: `${30 + i * 15}%` }}
          />
        ))}
      </div>

      <style>{`
        /* Quick fade for the red overlay */
        @keyframes fadeQuick {
          0% { opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { opacity: 0; }
        }
        .animate-fadeQuick {
          animation: fadeQuick 0.8s ease-in-out;
        }

        /* Subtle glitch lines sliding horizontally */
        .subtle-glitch-line {
          animation: subtleGlitchLine 0.8s linear infinite alternate;
        }
        @keyframes subtleGlitchLine {
          0% {
            transform: translateX(-5%);
            opacity: 1;
          }
          100% {
            transform: translateX(5%);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default MultipleAnswersPage;
