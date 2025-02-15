import React, { useState, useEffect, useRef } from "react";

const ToolsWindow = ({ isOpen, onClose, onTool3Submit }) => {
  const [tool3Count, setTool3Count] = useState("");
  const [tool3Language, setTool3Language] = useState("");
  const [tool3Word, setTool3Word] = useState("");
  const [tool3Translation, setTool3Translation] = useState("");

  // Ref to focus the first input when the window opens
  const tool3CountRef = useRef(null);

  useEffect(() => {
    if (isOpen && tool3CountRef.current) {
      tool3CountRef.current.focus();
    }
  }, [isOpen]);

  // Extracted submission logic for Tool 3
  const submitTool3 = (count, language, word, translation) => {
    if (!count || !language || !word || !translation) {
      alert("Please fill in all fields for Tool 3.");
      return;
    }
    const displayMessage = `Create ${count} sentences in ${language} using the word ${word} translation in ${translation}`;
    const internalQuery = `generate me ${count} sentences using the word ${word} in ${language} and right after each sentence send me the translation of that sentence in ${translation}, each sentence should be incased in "^"`;
    if (onTool3Submit) {
      onTool3Submit(displayMessage, internalQuery);
    } else {
      console.log("Display Message:", displayMessage);
      console.log("Internal Query:", internalQuery);
    }
    // Reset fields after submission
    setTool3Count("");
    setTool3Language("");
    setTool3Word("");
    setTool3Translation("");
  };

  // Handler for the "Send" button submission from the form
  const handleTool3Send = (e) => {
    e.preventDefault();
    submitTool3(tool3Count, tool3Language, tool3Word, tool3Translation);
  };

  // Handler for the "Test" button that autofills and submits with placeholder values
  const handleTool3Test = () => {
    const defaultCount = "5";
    const defaultLanguage = "French";
    const defaultWord = "Merci";
    const defaultTranslation = "English";
    // Autofill the fields with the default (placeholder) values
    setTool3Count(defaultCount);
    setTool3Language(defaultLanguage);
    setTool3Word(defaultWord);
    setTool3Translation(defaultTranslation);
    // Submit using the default values
    submitTool3(defaultCount, defaultLanguage, defaultWord, defaultTranslation);
  };

  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-secondary p-6 rounded-2xl shadow-2xl w-11/12 max-w-5xl relative">
        {/* Title and Close Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Suggested Uses</h2>
          <button
            onClick={onClose}
            className="bg-accent text-white px-4 py-1 rounded-lg hover:bg-primary transition"
          >
            Close
          </button>
        </div>

        {/* Horizontal Tool Containers */}
        <div className="flex flex-wrap gap-6">
          {/* Tool 1 */}
          <div className="bg-primary p-6 rounded-lg shadow-md flex-1 min-w-[300px]">
            <h3 className="font-bold text-lg text-darkAccent">Give me the word</h3>
            <label className="block text-darkAccent text-sm mt-2">
              Expression:
              <input
                type="text"
                placeholder="Хочу"
                className="w-full border border-accent rounded-md p-3 my-2 bg-white text-darkAccent"
              />
            </label>
            <p className="text-darkAccent text-sm">
              in every possible pronoun expression
            </p>
            <div className="flex gap-2 mt-4">
              <button className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-darkAccent">
                Send
              </button>
              <button className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-darkAccent">
                Test
              </button>
            </div>
          </div>

          {/* Tool 2 */}
          <div className="bg-primary p-6 rounded-lg shadow-md flex-1 min-w-[300px]">
            <h3 className="font-bold text-lg text-darkAccent">Give me 10 words in</h3>
            <label className="block text-darkAccent text-sm mt-2">
              Language:
              <input
                type="text"
                placeholder="Arabic"
                className="w-full border border-accent rounded-md p-3 my-2 bg-white text-darkAccent"
              />
            </label>
            <p className="text-darkAccent text-sm">using the letter</p>
            <label className="block text-darkAccent text-sm mt-2">
              Letter:
              <input
                type="text"
                placeholder="ع"
                className="w-full border border-accent rounded-md p-3 my-2 bg-white text-darkAccent"
              />
            </label>
            <div className="flex gap-2 mt-4">
              <button className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-darkAccent">
                Send
              </button>
              <button className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-darkAccent">
                Test
              </button>
            </div>
          </div>

          {/* Tool 3 */}
          <div className="bg-primary p-6 rounded-lg shadow-md flex-1 min-w-[300px]">
            <h3 className="font-bold text-lg text-darkAccent">Create Sentences</h3>
            <form onSubmit={handleTool3Send}>
              <label className="block text-darkAccent text-sm mt-2">
                Number of Sentences:
                <input
                  type="number"
                  placeholder="5"
                  value={tool3Count}
                  onChange={(e) => setTool3Count(e.target.value)}
                  ref={tool3CountRef}
                  className="w-full border border-accent rounded-md p-3 my-2 bg-white text-darkAccent"
                  required
                />
              </label>
              <label className="block text-darkAccent text-sm mt-2">
                Language:
                <input
                  type="text"
                  placeholder="French"
                  value={tool3Language}
                  onChange={(e) => setTool3Language(e.target.value)}
                  className="w-full border border-accent rounded-md p-3 my-2 bg-white text-darkAccent"
                  required
                />
              </label>
              <label className="block text-darkAccent text-sm mt-2">
                Word:
                <input
                  type="text"
                  placeholder="Merci"
                  value={tool3Word}
                  onChange={(e) => setTool3Word(e.target.value)}
                  className="w-full border border-accent rounded-md p-3 my-2 bg-white text-darkAccent"
                  required
                />
              </label>
              <label className="block text-darkAccent text-sm mt-2">
                Translation in:
                <input
                  type="text"
                  placeholder="English"
                  value={tool3Translation}
                  onChange={(e) => setTool3Translation(e.target.value)}
                  className="w-full border border-accent rounded-md p-3 my-2 bg-white text-darkAccent"
                  required
                />
              </label>
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-darkAccent"
                >
                  Send
                </button>
                <button
                  type="button"
                  onClick={handleTool3Test}
                  className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-darkAccent"
                >
                  Test
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsWindow;
