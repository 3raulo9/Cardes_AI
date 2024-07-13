import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/flashcardspage.css'; // Assume you have a CSS file for styling


const FlashCardsPage = ({ decks }) => {
  if (!decks) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flash-cards-page">
      <header className="header">
        <div className="header-title">Greek</div>
        <div className="header-buttons">
          <button>+ CREATE SET</button>
        </div>
      </header>
      <div className="create-cards-banner">
        <p>Create cards on a PC</p>
        <span>Use the flashcards.world website to create cards.</span>
      </div>
      <div className="cards-container">
        {decks.map((deck) => (
          <div key={deck.id} className="card">
            <div className="card-title">{deck.title}</div>
            <div className="card-progress">Total Cards: {deck.cards.length}</div>
            <div className="card-buttons">
              <Link to={`/flashcards/edit/${deck.id}`}><button>EDIT</button></Link>
              <Link to={`/flashcards/practice/${deck.id}`}><button>PRACTICE</button></Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashCardsPage;