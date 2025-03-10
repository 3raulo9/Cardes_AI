// JourneyPage.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TutorialOverlay from "../components/TutorialOverlay"; // <-- import the shared overlay

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
  const [showModal, setShowModal] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [seedClicked, setSeedClicked] = useState(false);
  const [seedBuried, setSeedBuried] = useState(false);
  const [showTree, setShowTree] = useState(false);
  const [showCommentTooltip, setShowCommentTooltip] = useState(false);

  // Handle the seed click -> show the input modal
  const handleSeedClick = () => {
    if (!seedClicked) {
      setShowModal(true);
    }
  };

  // When user confirms -> close modal, animate seed bury, then show tree
  const handleOk = () => {
    setShowModal(false);
    setSeedClicked(true);
    setTimeout(() => {
      setSeedBuried(true);
      setTimeout(() => {
        setShowTree(true);
        // Show tooltip once the tree is visible
        setShowCommentTooltip(true);
      }, 1000);
    }, 500);
  };

  // Close the modal without burying
  const handleCancel = () => {
    setShowModal(false);
  };

  // Listen for ESC (to cancel) or ENTER (to confirm) when modal is open
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
      {/* The shared tutorial overlay, unique ID = "journey" */}
      <TutorialOverlay tutorialID="journey" />

      <CloudBackground />

      {/* Ground at the bottom */}
      <div className="absolute bottom-0 w-full h-20 bg-green-600" />

      {/* The seed (z-0 ensures it is behind the modal) */}
      {!showTree && (
        <motion.div
          initial={{ y: 0 }}
          animate={{
            y: seedBuried ? 150 : 0,
            transition: { duration: 1, ease: "easeInOut" },
          }}
          onClick={handleSeedClick}
          className="z-0 cursor-pointer bg-yellow-800 w-14 h-14 rounded-full shadow-lg border-4 border-yellow-600 flex items-center justify-center text-white text-center font-bold absolute"
        >
          {!seedClicked && <span className="text-xs">Click Me</span>}
        </motion.div>
      )}

      {/* Tree grows from the ground */}
      <AnimatePresence>
        {showTree && (
          <motion.div
            className="absolute bottom-[5rem] flex flex-col items-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {/* Tree trunk */}
            <div className="w-8 bg-amber-900 h-40 rounded-t-md" />
            {/* Tree foliage */}
            <div className="w-32 h-32 bg-green-500 rounded-full -mt-8 shadow-lg border-4 border-green-700" />

            {/* Final comment box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="relative text-black bg-white p-4 rounded-xl mt-6 text-center"
            >
              this is a demo, nothing's actually working yet,
              <br />
              but try other options on the website

              {/* A small tooltip above the comment */}
              <AnimatePresence>
                {showCommentTooltip && (
                  <motion.div
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-60 bg-gray-800 text-white p-2 text-sm rounded shadow-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    This message is just a placeholder.
                    <br />
                    In the future, it might show progress or hints.
                    <button
                      className="block bg-gray-600 hover:bg-gray-700 mt-2 py-1 px-2 rounded ml-auto mr-auto"
                      onClick={() => setShowCommentTooltip(false)}
                    >
                      Got it
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal (z-50 ensures it is above the seed) */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl flex flex-col"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-xl font-bold mb-4">Enter what you want to learn</h2>
              <input
                className="border border-gray-300 p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="I want to learn..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={handleCancel}
                  className="py-2 px-4 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
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
