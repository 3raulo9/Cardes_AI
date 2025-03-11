import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

/**
 * A basic "match cards" mode:
 * - We show a list of terms and definitions (both shuffled).
 * - User clicks a term, then a definition, tries to match them.
 */
const MatchCardsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [terms, setTerms] = useState([]);
  const [definitions, setDefinitions] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [matches, setMatches] = useState({}); // { termId: definitionId }
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/api/cards/?card_set=${id}`)
      .then((res) => {
        const data = res.data;
        setCards(data);

        // separate out terms & definitions, store IDs
        const termsArr = data.map((c) => ({ id: c.id, text: c.term }));
        const defsArr = data.map((c) => ({ id: c.id, text: c.definition }));
        setTerms(shuffleArray(termsArr));
        setDefinitions(shuffleArray(defsArr));
      })
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    // Check if user matched everything
    if (Object.keys(matches).length === cards.length) {
      setFinished(true);
    }
  }, [matches, cards]);

  const shuffleArray = (arr) => arr.slice().sort(() => Math.random() - 0.5);

  const selectTerm = (term) => {
    setSelectedTerm(term);
  };

  const selectDefinition = (def) => {
    if (!selectedTerm) return;
    // If correct match
    if (selectedTerm.id === def.id) {
      setMatches((prev) => ({ ...prev, [selectedTerm.id]: def.id }));
    }
    setSelectedTerm(null);
  };

  const restart = () => {
    setMatches({});
    setFinished(false);
    // re-shuffle
    const termsArr = cards.map((c) => ({ id: c.id, text: c.term }));
    const defsArr = cards.map((c) => ({ id: c.id, text: c.definition }));
    setTerms(shuffleArray(termsArr));
    setDefinitions(shuffleArray(defsArr));
  };

  if (!cards.length) {
    return (
      <div className="min-h-screen bg-accent text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-accent text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">All matches found!</h1>
        <button
          onClick={restart}
          className="bg-primary hover:bg-highlight px-4 py-2 rounded"
        >
          Restart
        </button>
        <button
          onClick={() => navigate("/categories")}
          className="bg-warning hover:bg-danger px-4 py-2 rounded mt-4"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Match Cards</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Terms list */}
        <div className="bg-secondary p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Terms</h2>
          <div className="flex flex-col gap-2">
            {terms.map((term) => {
              const matched = matches[term.id] !== undefined;
              return (
                <button
                  key={term.id}
                  onClick={() => selectTerm(term)}
                  disabled={matched}
                  className={`rounded px-3 py-2 text-left ${
                    matched
                      ? "bg-success cursor-not-allowed"
                      : selectedTerm?.id === term.id
                      ? "bg-highlight"
                      : "bg-primary hover:bg-highlight"
                  }`}
                >
                  {term.text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Definitions list */}
        <div className="bg-secondary p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Definitions</h2>
          <div className="flex flex-col gap-2">
            {definitions.map((def) => {
              // See if this definition is already matched
              const alreadyUsed = Object.values(matches).includes(def.id);
              return (
                <button
                  key={def.id}
                  onClick={() => selectDefinition(def)}
                  disabled={alreadyUsed}
                  className={`rounded px-3 py-2 text-left ${
                    alreadyUsed
                      ? "bg-success cursor-not-allowed"
                      : "bg-primary hover:bg-highlight"
                  }`}
                >
                  {def.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCardsPage;
