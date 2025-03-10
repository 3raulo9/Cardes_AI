// TutorialOverlay.js
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

// A central store of all tutorial content
const TUTORIALS = {
  journey: {
    title: "Welcome to Your Journey Page",
    paragraphs: [
      "Here you can cultivate your own personalized learning journey. In the future, click on the seed to open a prompt specifying what you want to learn, and a tree will grow to represent your progress.",
      "Experiment with this demo:",
    ],
    bulletPoints: [
      "Click the seed to plant it.",
      "Press ESC to cancel or ENTER to confirm.",
      "Watch the tree grow!",
    ],
  },
  categories: {
    title: "Welcome to Categories!",
    paragraphs: [
      "Here, you can organize your study materials into Categories. Each category can have multiple Sets, and each set can hold multiple Cards.",
      "You can also leverage the built-in AI ChatBot to generate new cards, plus Text-To-Speech functionalities and various Practice Modes to help you study.",
      "To get started:",
    ],
    bulletPoints: [
      "Create a Category using the “New Category” button.",
      "Click a Category to add or view its Sets.",
      "Within a Set, create new Cards manually or let AI help!",
    ],
  },

  // NEW: Chatbot tutorial
  chatbot: {
    title: "Welcome to CardesChat!",
    paragraphs: [
      "This AI-powered chatbot helps you create, practice, and explore new content using advanced features. Here’s how it works:",
    ],
    bulletPoints: [
      "Type a message or question to get a response.",
      "Use 'Surprise Me' to randomly prompt the bot.",
      "Click the microphone icon to enable voice input.",
      "Use TTS (Text-to-Speech) on any response for audio playback.",
      "Open the Tools window (wrench icon) for extra functionality.",
      "Clear the chat history when you want to start fresh.",
    ],
  },
};

/**
 * Reusable tutorial overlay component.
 *
 * Props:
 *   - tutorialID (string): e.g. "journey", "categories", or "chatbot"
 */
export default function TutorialOverlay({ tutorialID }) {
  const [showTutorial, setShowTutorial] = useState(false);

  // Check localStorage on mount to see if user has already seen this tutorial
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem(`tutorialSeen-${tutorialID}`);
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, [tutorialID]);

  const closeTutorial = () => {
    localStorage.setItem(`tutorialSeen-${tutorialID}`, "true");
    setShowTutorial(false);
  };

  // If no data or user already closed it, render nothing
  if (!showTutorial || !TUTORIALS[tutorialID]) {
    return null;
  }

  const { title, paragraphs, bulletPoints } = TUTORIALS[tutorialID];

  return (
    <AnimatePresence>
      {showTutorial && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white text-black rounded-lg p-6 max-w-xl w-full shadow-2xl"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4">{title}</h2>

            {paragraphs?.map((para, idx) => (
              <p className="mb-4" key={idx}>
                {para}
              </p>
            ))}

            {bulletPoints?.length > 0 && (
              <ul className="list-disc list-inside mt-2 mb-4">
                {bulletPoints.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            )}

            <button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded py-2 px-4 mt-4"
              onClick={closeTutorial}
            >
              Got It
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
