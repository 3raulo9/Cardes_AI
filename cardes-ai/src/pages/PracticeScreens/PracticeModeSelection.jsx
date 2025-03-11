import React from "react";
import { useNavigate, useParams } from "react-router-dom";

/**
 * This component is shown when the user clicks "Practice" on a set.
 * The user selects which practice mode they want to do.
 */
const PracticeModeSelection = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // This is the card set ID.

  const handleModeClick = (mode) => {
    // Example: /practice/123/simple or /practice/123/multiple
    navigate(`/practice/${id}/${mode}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-accent text-white p-4 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center">
        Choose Practice Mode
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl w-full">
        <button
          onClick={() => handleModeClick("simple")}
          className="bg-primary hover:bg-highlight transition px-4 py-6 rounded-lg text-xl font-bold"
        >
          Simple Review
        </button>
        <button
          onClick={() => handleModeClick("multiple")}
          className="bg-primary hover:bg-highlight transition px-4 py-6 rounded-lg text-xl font-bold"
        >
          Multiple Answers
        </button>
        <button
          onClick={() => handleModeClick("match")}
          className="bg-primary hover:bg-highlight transition px-4 py-6 rounded-lg text-xl font-bold"
        >
          Match Cards
        </button>
        <button
          onClick={() => handleModeClick("writing")}
          className="bg-primary hover:bg-highlight transition px-4 py-6 rounded-lg text-xl font-bold"
        >
          Writing Review
        </button>
      </div>
    </div>
  );
};

export default PracticeModeSelection;
