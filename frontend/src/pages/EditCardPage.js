import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/editcardpage.css'; // Assume you have a CSS file for styling

const EditCardPage = ({ decks, updateCard }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState({ title: '', memorized: 0, total: 0 });

  useEffect(() => {
    const deck = decks.find((deck) => deck.id === parseInt(id));
    if (deck) setCard(deck.cards[0]); // Assuming you're editing the first card of the deck
  }, [id, decks]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCard({ ...card, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCard(card);
    navigate('/flashcards');
  };

  return (
    <div className="edit-card-page">
      <h2>Edit Card</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={card.title}
          onChange={handleInputChange}
          placeholder="Card Title"
        />
        <input
          type="number"
          name="memorized"
          value={card.memorized}
          onChange={handleInputChange}
          placeholder="Memorized"
        />
        <input
          type="number"
          name="total"
          value={card.total}
          onChange={handleInputChange}
          placeholder="Total"
        />
        <button type="submit">Update Card</button>
      </form>
    </div>
  );
};

export default EditCardPage;
