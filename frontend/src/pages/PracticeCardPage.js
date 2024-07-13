import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/practicecardpage.css'; // Assume you have a CSS file for styling



const PracticeCardPage = ({ decks }) => {
  const { id } = useParams();
  const deck = decks.find((deck) => deck.id === parseInt(id));
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });

  if (!deck) {
    return <div>Deck not found</div>;
  }

  const currentCard = deck.cards[currentCardIndex];

  const handleNextCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prev) => (prev + 1) % deck.cards.length);
  };

  const handleCorrect = () => {
    setScore({ ...score, correct: score.correct + 1 });
    handleNextCard();
  };

  const handleIncorrect = () => {
    setScore({ ...score, incorrect: score.incorrect + 1 });
    handleNextCard();
  };

  return (
    <div className="practice-card-page">
      <h2>Practice {deck.title}</h2>
      <div className="flashcard">
        <p>Card {currentCardIndex + 1} of {deck.cards.length}</p>
        <div className="card-content">
          <p>{currentCard.question}</p>
          {showAnswer && <p><strong>Answer: </strong>{currentCard.answer}</p>}
        </div>
        <button onClick={() => setShowAnswer(true)}>Show Answer</button>
      </div>
      {showAnswer && (
        <div className="feedback-buttons">
          <button onClick={handleCorrect}>Correct</button>
          <button onClick={handleIncorrect}>Not Correct</button>
        </div>
      )}
      <div className="score">
        <p>Correct: {score.correct}</p>
        <p>Incorrect: {score.incorrect}</p>
      </div>
    </div>
  );
};

export default PracticeCardPage;
