import React, { useState } from "react";
import "./rightbar.css";

const Rightbar = ({ getResponse }) => {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");

  const handleSubmit = (value) => {
    getResponse(value);
  };

  return (
    <div className="rightbar">
      <h2>Suggested uses</h2>

      <div className="custom-input">
        <label>
          Create 5 sentences in French using the word 
          <input type="text" value={input1} onChange={(e) => setInput1(e.target.value)} />
        </label>
        <button onClick={() => handleSubmit(`Create 5 sentences in French using the word ${input1}`)}>Send</button>
      </div>
      <div className="custom-input">
        <label>
          Give me 10 words in Arabic using the letter 
          <input type="text" value={input2} onChange={(e) => setInput2(e.target.value)} />
        </label>
        <button onClick={() => handleSubmit(`Give me 10 words in Arabic using the letter ${input2}`)}>Send</button>
      </div>
      <div className="custom-input">
        <label>
          Give me the word 
          <input type="text" value={input3} onChange={(e) => setInput3(e.target.value)} />
          in every possible pronoun expression
        </label>
        <button onClick={() => handleSubmit(`Give me the word ${input3} in every possible pronoun expression`)}>Send</button>
      </div>
    </div>
  );
};

export default Rightbar;
