import React, { useState, useEffect } from "react";
import anime from "animejs/lib/anime.es.js";
import "../styles/suggestbar.css";

const SuggestBar = ({ getResponse, isTabOpen, setIsTabOpen }) => {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [transInput1, setTransInput1] = useState("");
  const [language1, setLanguage1] = useState("");
  const [language2, setLanguage2] = useState("");
  const [numberOfSentences, setNumberOfSentences] = useState(5);

  const handleSubmit = (value) => {
    getResponse(value);
    setIsTabOpen(false); // Close the tab when "Send" is clicked
  };

  const handleTest = (inputs) => {
    inputs.forEach(([setter, value]) => setter(value));
  };

  useEffect(() => {
    if (isTabOpen) {
      anime({
        targets: ".tab-content",
        translateY: 0, // Adjust to make the tab content appear lower
        opacity: [0, 1],
        duration: 3000,
      });
    } else {
      anime({
        targets: ".tab-content",
        translateY: 16,
        opacity: [1, 0],
        duration: 3000,
      });
    }
  }, [isTabOpen]);

  return (
    <div className="SuggestBar">
      <div className="tab-header" onClick={() => setIsTabOpen(!isTabOpen)}>
        <h2>Suggested uses</h2>
        <button className="toggle-button">
          {isTabOpen ? "Close" : "Open"}
        </button>
      </div>

      <div className={`tab-content ${isTabOpen ? "open" : "closed"}`}>
        <div className="input_suggest">
          <label>
            Create
            <input
              type="number"
              value={numberOfSentences}
              onChange={(e) => setNumberOfSentences(e.target.value)}
              min="1"
              max="100"
            />
            sentences in
            <input
              type="text"
              placeholder="French"
              value={language1}
              onChange={(e) => setLanguage1(e.target.value)}
            />
            using the word
            <input
              type="text"
              placeholder="Merci"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
            />
            translation in
            <input
              type="text"
              placeholder="English"
              value={transInput1}
              onChange={(e) => setTransInput1(e.target.value)}
            />
          </label>
          <div className="button-group">
            <button
              onClick={() =>
                handleSubmit(`Create ${numberOfSentences} sentences in ${language1} using the word ${input1}. Provide the translation in ${transInput1}. 
                  Each sentence and its translation should be enclosed in "^" without any other symbols or punctuation. 
                  Format: ^translation in ${transInput1}^sentence in ${language1}^, and do not use the "-" symbol.`)
                    }
            >
              Send
            </button>
            <button
              onClick={() =>
                handleTest([
                  [setNumberOfSentences, 5],
                  [setLanguage1, "French"],
                  [setInput1, "Merci"],
                  [setTransInput1, "English"],
                ])
              }
            >
              Test
            </button>
          </div>
        </div>
        <div className="input_suggest">
          <label>
            Give me 10 words in
            <input
              type="text"
              placeholder="Arabic"
              value={language2}
              onChange={(e) => setLanguage2(e.target.value)}
            />
            using the letter
            <input
              type="text"
              placeholder="ع"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
            />
          </label>
          <div className="button-group">
            <button
              onClick={() =>
                handleSubmit(
                  `Give me 10 words in ${language2} using the letter ${input2} and incase each word with "^"', first the translation then the word, only the word, the only allowed symbol to appear is the "^" that will incase each word, you cannot send numbers or any symbol other than the words i had demanded`
                )
              }
            >
              Send
            </button>
            <button
              onClick={() =>
                handleTest([
                  [setLanguage2, "Arabic"],
                  [setInput2, "ع"],
                ])
              }
            >
              Test
            </button>
          </div>
        </div>
        <div className="input_suggest">
          <label>
            Give me the word
            <input
              type="text"
              placeholder="Хочу"
              value={input3}
              onChange={(e) => setInput3(e.target.value)}
            />
            in every possible pronoun expression
          </label>
          <div className="button-group">
            <button
              onClick={() =>
                handleSubmit(
                  `Give me the word ${input3} in every possible pronoun expression`
                )
              }
            >
              Send
            </button>
            <button onClick={() => handleTest([[setInput3, "Хочу"]])}>
              Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestBar;
