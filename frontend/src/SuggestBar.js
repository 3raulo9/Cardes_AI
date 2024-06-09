import React, { useState } from "react";
import "./suggestbar.css";

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

  return (
    <div className="SuggestBar">
      <div className="tab-header" onClick={() => setIsTabOpen(!isTabOpen)}>
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
          <button
            onClick={() =>
              handleSubmit(`Create ${numberOfSentences} sentences in ${language1} using the word ${input1} + translation in ${transInput1}
 'and incase each sentence with "^"', first the translation then the sentence`)
            }
          >
            Send
          </button>
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
          <button
            onClick={() =>
              handleSubmit(
                `Give me 10 words in ${language2} using the letter ${input2}`
              )
            }
          >
            Send
          </button>
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
          <button
            onClick={() =>
              handleSubmit(
                `Give me the word ${input3} in every possible pronoun expression`
              )
            }
          >
            Send
          </button>
        </div>
      </div>
      <div className="tab-header" onClick={() => setIsTabOpen(!isTabOpen)}>
        <h2>Suggested uses</h2>
        <button className="toggle-button">
          {isTabOpen ? "Close" : "Open"}
        </button>
      </div>
    </div>
  );
};

export default SuggestBar;
