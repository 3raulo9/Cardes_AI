// JourneyPage.js
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TutorialOverlay from "../components/TutorialOverlay";

// Returns a random element from an array
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Arrays for random phrase generation
const places = [
  "airport",
  "restaurant",
  "hotel",
  "train station",
  "bus station",
  "shopping mall",
  "museum",
  "library",
  "university",
  "park",
  "stadium",
  "concert hall",
  "hospital",
  "pharmacy",
  "theater",
  "beach",
  "bar",
  "bakery",
  "supermarket",
];

const languages = [
  "French",
  "Spanish",
  "German",
  "Japanese",
  "Chinese",
  "Arabic",
  "Greek",
  "Italian",
  "Russian",
  "Hebrew",
];

// Simple cloud BG
function CloudBackground() {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute top-10 left-[10%] w-72 h-72 bg-white opacity-30 rounded-full filter blur-3xl" />
      <div className="absolute top-20 left-[40%] w-96 h-96 bg-white opacity-20 rounded-full filter blur-3xl" />
      <div className="absolute top-32 left-[70%] w-60 h-60 bg-white opacity-25 rounded-full filter blur-2xl" />
    </div>
  );
}

const JourneyPage = () => {
  // State hooks
  const [showModal, setShowModal] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [seedClicked, setSeedClicked] = useState(false);
  const [seedBuried, setSeedBuried] = useState(false);
  const [showTree, setShowTree] = useState(false);
  const [showCommentTooltip, setShowCommentTooltip] = useState(false);

  // For the auto-resizing textarea
  const textareaRef = useRef(null);

  // --------------------
  // Seed click -> open modal
  // --------------------
  const handleSeedClick = () => {
    if (!seedClicked) {
      setUserInput(""); // Clear input when first showing modal
      setShowModal(true);
    }
  };

  // --------------------
  // Generate random phrase
  // (ensuring two different languages)
  // --------------------
  const handleRandom = () => {
    const place = getRandomElement(places);
    const lang1 = getRandomElement(languages);
    let lang2 = getRandomElement(languages);

    // Force two different languages
    while (lang2 === lang1) {
      lang2 = getRandomElement(languages);
    }

    const phrase = `I want to learn how to talk at the ${place} in ${lang1} using ${lang2}.`;
    setUserInput(phrase);
  };

  // --------------------
  // Auto-resize on change
  // --------------------
  const handleChange = (e) => {
    setUserInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  // Recalc on any userInput change (e.g. “Random” button)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [userInput]);

  // --------------------
  // Modal OK -> bury seed
  // --------------------
  const handleOk = () => {
    setShowModal(false);
    setSeedClicked(true);
    // Animate burying
    setTimeout(() => {
      setSeedBuried(true);
      // After bury animation, show tree
      setTimeout(() => {
        setShowTree(true);
        setShowCommentTooltip(true);
      }, 1000);
    }, 500);
  };

  // --------------------
  // Modal Cancel
  // --------------------
  const handleCancel = () => {
    setShowModal(false);
  };

  // Press ESC to cancel, ENTER to confirm if modal is open
  useEffect(() => {
    const onKeyDown = (e) => {
      if (showModal) {
        if (e.key === "Escape") handleCancel();
        if (e.key === "Enter") handleOk();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showModal]);

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gradient-to-b from-sky-300 to-sky-100 overflow-hidden">
      {/* Reusable tutorial overlay */}
      <TutorialOverlay tutorialID="journey" />

      <CloudBackground />

      {/* Lower ground (green) behind everything */}
      <div className="absolute bottom-0 w-full h-20 bg-green-600 z-10" />

      {/* Slightly upper ground (brown) in front so seed can pass behind */}
      <div className="absolute bottom-0 w-full h-16 bg-yellow-800 z-20" />

      {/* 
        The seed. 
        - Bounces on hover to encourage clicking
        - Falls to y:400 when seedBuried = true 
      */}
      {!showTree && (
        <motion.div
          className="z-0 cursor-pointer bg-yellow-800 w-14 h-14 rounded-full shadow-lg border-4 border-yellow-600 flex items-center justify-center text-white text-center font-bold absolute"
          initial={{ y: 0 }}
          animate={{
            y: seedBuried ? 400 : 0,
            transition: { duration: 1, ease: "easeInOut" },
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          onClick={handleSeedClick}
        >
          {!seedClicked && <span className="text-xs">Click Me</span>}
        </motion.div>
      )}

      {/* Tree grows from the ground once the seed is buried */}
      <AnimatePresence>
        {showTree && (
          <motion.div
            className="absolute bottom-[5rem] flex flex-col items-center"
          >
           
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { delay: 1, duration: 0.5, ease: "easeOut" },
              }}
              className=" bottom-[10rem] relative text-white bg-green-500  p-9 rounded-xl mt-10 text-center border-4 border-green-700 "
            >
              This is a demo, nothing's actually working yet,
              <br />
              but try other options on the website
            </motion.div>

            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 2 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              style={{ transformOrigin: "bottom center" }}
              className="w-9 bg-amber-900 h-40 rounded-t-md"
            />

            {/* 2) Foliage appears (scale+fade) after trunk finishes */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --------------- Modal --------------- */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // ARIA for accessibility
            role="dialog"
            aria-modal="true"
            aria-labelledby="modalTitle"
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl flex flex-col"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {/* The heading for screen readers */}
              <h2 id="modalTitle" className="text-xl font-bold mb-4">
                Enter what you want to learn
              </h2>

              {/* Auto-resizing textarea */}
              <textarea
                ref={textareaRef}
                rows={1}
                className="border border-gray-300 p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
                placeholder="I want to learn..."
                value={userInput}
                onChange={handleChange}
              />

              {/* Modal buttons */}
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={handleCancel}
                  className="py-2 px-4 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRandom}
                  className="py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Random
                </button>
                <button
                  onClick={handleOk}
                  className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JourneyPage;
