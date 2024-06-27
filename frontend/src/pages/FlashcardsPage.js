import React, { useState } from 'react';

const FlashCardsPage = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      title: 'Ελληνικά - ένα',
      memorized: 26,
      total: 306,
    },
    {
      id: 2,
      title: 'Ελληνικά δύο',
      memorized: 0,
      total: 105,
    },
  ]);

  const renderPracticeOptions = () => (
    <div className="practice-options">
      <div className="option">Basic Review</div>
      <div className="option">Multiple answers</div>
      <div className="option">Match Cards</div>
      <div className="option">Writing Review</div>
      <div className="option">Audio Player</div>
      <div className="option">Whiteboard review <span className="pro-badge">PRO</span></div>
    </div>
  );

  return (
    <div className="flash-cards-page">
      <header className="header">
        <div className="header-title">Greek</div>
        <div className="header-buttons">
          <button>REVIEW ALL</button>
          <button>PRACTICE ALL</button>
          <button>+ CREATE SET</button>
        </div>
      </header>
      <div className="create-cards-banner">
        <p>Create cards on a PC</p>
        <span>Use the flashcards.world website to create cards.</span>
      </div>
      <div className="cards-container">
        {cards.map((card) => (
          <div key={card.id} className="card">
            <div className="card-title">{card.title}</div>
            <div className="card-progress">{card.memorized}/{card.total} Cards memorized</div>
            <div className="card-buttons">
              <button>REVIEW</button>
              <button>PRACTICE</button>
            </div>
          </div>
        ))}
      </div>
      {renderPracticeOptions()}
    </div>
  );
};

export default FlashCardsPage;
