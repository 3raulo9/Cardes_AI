/* This JavaScript code snippet is a React functional component named `ArticlePage`. It is using React
hooks like `useState` and `useParams` from 'react' and 'react-router-dom' libraries respectively. */
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const staticData = [
  ["Lorem ipsum dolor sit amet.", "Consectetur adipiscing elit.", "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", "Ut enim ad minim veniam.", "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."],
  ["Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", "Excepteur sint occaecat cupidatat non proident.", "Sunt in culpa qui officia deserunt mollit anim id est laborum.", "Curabitur pretium tincidunt lacus.", "Nulla gravida orci a odio."],
  ["Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.", "Integer in mauris eu nibh euismod gravida.", "Duis ac tellus et risus vulputate vehicula.", "Donec lobortis risus a elit.", "Etiam tempor."],
  ["Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam.", "Maecenas fermentum consequat mi.", "Donec fermentum.", "Pellentesque malesuada nulla a mi.", "Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque."],
  ["Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat.", "Cras mollis scelerisque nunc.", "Nullam arcu.", "Aliquam erat volutpat.", "Duis ac turpis."]
];

const ArticlePage = () => {
  const { id } = useParams();
  const articleIndex = parseInt(id, 10);
  const [popup, setPopup] = useState(null);
  const [vocab, setVocab] = useState({});

  const handleWordClick = (e, word) => {
    const rect = e.target.getBoundingClientRect();
    setPopup({ word, x: rect.x, y: rect.y });
    if (!vocab[word]) {
      setVocab(prevVocab => ({ ...prevVocab, [word]: 'definition goes here' }));
    }
  };

  const handleClosePopup = () => {
    setPopup(null);
  };

  return (
    <div>
      {staticData[articleIndex].map((line, idx) => (
        <p key={idx}>
          {line.split(' ').map((word, i) => (
            <span key={i} onClick={(e) => handleWordClick(e, word)} style={{ cursor: 'pointer', margin: '0 2px' }}>
              {word}
            </span>
          ))}
        </p>
      ))}
      {popup && (
        <div style={{
          position: 'absolute',
          top: popup.y,
          left: popup.x,
          backgroundColor: 'white',
          border: '1px solid black',
          padding: '5px',
          zIndex: 1000
        }}>
          <p>{popup.word}</p>
          <p>{vocab[popup.word]}</p>
          <button onClick={handleClosePopup}>Close</button>
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <h3>Vocabulary</h3>
        <ul>
          {Object.keys(vocab).map((word, index) => (
            <li key={index}>
              {word}: {vocab[word]}
            </li>
          ))}
        </ul>
      </div>
      <Link to="/texts" style={{ textDecoration: 'none', color: 'inherit' }}>
        <button>Back to Texts</button>
      </Link>
    </div>
  );
};

export default ArticlePage;
