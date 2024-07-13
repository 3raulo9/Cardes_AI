import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/textspage.css'; // Ensure this import points to your CSS file

const boxNames = ["Article 1", "Article 2", "Article 3", "Article 4", "Article 5"];

const TextsPage = () => {
  return (
    <div className="container">
      {boxNames.map((name, index) => (
        <Link key={index} to={`/texts/${index}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="text-box">
            <h3>{name}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TextsPage;
