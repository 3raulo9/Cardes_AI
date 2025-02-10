import React from "react";

const ToolsWindow = ({ isOpen, onClose }) => {
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
            <input
              type="text"
              placeholder="Хочу"
              className="w-full border border-accent rounded-md p-3 my-2 bg-white text-darkAccent"
            />
            <p className="text-darkAccent text-sm">in every possible pronoun expression</p>
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
            <input
              type="text"
              placeholder="Arabic"
              className="w-full border border-accent rounded-md p-3 my-2 bg-white text-darkAccent"
            />
            <p className="text-darkAccent text-sm">using the letter</p>
            <input
              type="text"
              placeholder="ع"
              className="w-full border border-accent rounded-md p-3 my-2 bg-white text-darkAccent"
            />
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
            <h3 className="font-bold text-lg text-darkAccent">Create</h3>
            <input
              type="number"
              placeholder="5"
              className="w-full border border-accent rounded-md p-3 my-2 bg-white text-darkAccent"
            />
            <p className="text-darkAccent text-sm">sentences in</p>
            <input
              type="text"
              placeholder="French"
              className="w-full border border-accent rounded-md p-3 my-2 bg-white text-darkAccent"
            />
            <p className="text-darkAccent text-sm">using the word</p>
            <input
              type="text"
              placeholder="Merci"
              className="w-full border border-accent rounded-md p-3 my-2 bg-white text-darkAccent"
            />
            <p className="text-darkAccent text-sm">translation in</p>
            <input
              type="text"
              placeholder="English"
              className="w-full border border-accent rounded-md p-3 my-2 bg-white text-darkAccent"
            />
            <div className="flex gap-2 mt-4">
              <button className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-darkAccent">
                Send
              </button>
              <button className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-darkAccent">
                Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsWindow;
