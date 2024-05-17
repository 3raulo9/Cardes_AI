import { useState } from "react";

const App = () => {

  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([])

  const surpriseOptions = [
    'How are you?',
    'Give me one sentence using the word hope',
    'who are you?'
  ]
  const surprise =()=> {
    const randomValue = surpriseOptions[Math.floor(Math.random() *surpriseOptions.length)]
    setValue(randomValue)
  }

  return (
      <div className="app">
        <p>
          what do you want to know?
          <button className="surprise" onClick={surprise} disabled={!chatHistory}>surprise me!</button>
        </p>
        <div className="input-container">
          <input value={value} placeholder="When is Christmas...?" onChange={(e) => setValue(e.target.value)} />
          {!error && <button>Ask me</button>}
          {error && <button>Clear</button>}
        </div>
        {error && <p>{error}</p>}
        <div className="search-result">
          <div key={""}>
            <p className="answer"></p>

          </div>

        </div>

      </div>
  );
};

export default App;
