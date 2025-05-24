// src/components/ToolsWindow.jsx
import React, { useState, useEffect, useRef } from "react";

// --- Reusable ToolCard Component ---
const ToolCard = ({ title, children, newModalBgClass = "bg-white" }) => (
  <div
    className={`bg-white p-5 rounded-2xl shadow-lg w-full h-full flex flex-col overflow-hidden`}
  >
    <h3 className="font-bold text-xl text-primary mb-5 flex-shrink-0 text-center">
      {title}
    </h3>
    <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-5">
      {children}
    </div>
  </div>
);

// --- Form Input Group Component ---
const FormGroup = ({ label, children, helperText }) => (
  <div>
    <label className="block text-darkAccent text-sm font-semibold mb-1.5">
      {label}
    </label>
    {children}
    {helperText && (
      <p className="text-xs text-darkAccent opacity-70 mt-1.5 px-1">
        {helperText}
      </p>
    )}
  </div>
);

// --- Reusable Input Component ---
const StyledInput = React.forwardRef(({ ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 text-darkAccent placeholder-gray-400
               focus:ring-2 focus:ring-primary focus:border-transparent outline-none
               transition-all duration-150 ease-in-out shadow-sm hover:border-gray-400 focus:shadow-md"
  />
));

// --- Reusable Button Component ---
const StyledButton = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}) => {
  const baseStyle =
    "px-5 py-2.5 rounded-lg font-medium transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
  const variantStyles = {
    primary:
      "bg-primary text-white hover:bg-opacity-90 active:bg-opacity-80 focus:ring-primary disabled:hover:bg-primary",
    accent:
      "bg-accent text-white hover:bg-opacity-90 active:bg-opacity-80 focus:ring-accent disabled:hover:bg-accent",
    secondary:
      "bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400 focus:ring-gray-400 disabled:hover:bg-gray-200",
  };
  if (variant === "secondary" && className.includes("!ring-offset-white")) {
    variantStyles.secondary =
      "bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300 focus:ring-gray-400 disabled:hover:bg-gray-100";
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// --- Tool1Form ---
const Tool1Form = ({ onSubmit, isActive, isOpen }) => {
  const [expression, setExpression] = useState("");
  const inputRef = useRef(null);

  // useEffect(() => {
  //   if (isActive && isOpen && inputRef.current) inputRef.current.focus();
  // }, [isActive, isOpen]);

  const perform = (expr) => {
    if (!expr.trim()) return alert("Please enter an expression.");
    const dm = `Conjugate "${expr}" for all pronouns.`;
    const iq = `Give me the word "${expr}" in every possible pronoun expression.`;
    onSubmit("conjugateWord", dm, iq);
    setExpression("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        perform(expression);
      }}
    >
      <FormGroup label="Expression:" helperText="In every possible pronoun expression.">
        <StyledInput
          ref={inputRef}
          placeholder="Хочу"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          required
        />
      </FormGroup>
      <div className="flex gap-3 mt-6">
        <StyledButton type="submit" variant="primary">
          Send
        </StyledButton>
        <StyledButton onClick={() => perform("Хочу")} variant="accent">
          Test
        </StyledButton>
      </div>
    </form>
  );
};

// --- Tool2Form ---
const Tool2Form = ({ onSubmit, isActive, isOpen }) => {
  const [language, setLanguage] = useState("");
  const [letter, setLetter] = useState("");
  const langInputRef = useRef(null);

  // useEffect(() => {
  //   if (isActive && isOpen && langInputRef.current) langInputRef.current.focus();
  // }, [isActive, isOpen]);

  const perform = (lang, ltr) => {
    if (!lang.trim() || !ltr.trim()) return alert("Please fill in all fields.");
    const dm = `Give me 10 words in ${lang} using the letter ${ltr}.`;
    const iq = `generate me 10 words in ${lang} that use the letter ${ltr}. Provide translations to English.`;
    onSubmit("wordsByLetter", dm, iq);
    setLanguage("");
    setLetter("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        perform(language, letter);
      }}
    >
      <FormGroup label="Language:">
        <StyledInput
          ref={langInputRef}
          placeholder="Arabic"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          required
        />
      </FormGroup>
      <FormGroup label="Letter:" helperText="The specific letter to feature.">
        <StyledInput
          placeholder="ع"
          value={letter}
          onChange={(e) => setLetter(e.target.value)}
          required
        />
      </FormGroup>
      <div className="flex gap-3 mt-6">
        <StyledButton type="submit" variant="primary">
          Send
        </StyledButton>
        <StyledButton onClick={() => perform("Arabic", "ع")} variant="accent">
          Test
        </StyledButton>
      </div>
    </form>
  );
};

// --- Tool3Form ---
const Tool3Form = ({ onSubmit, isActive, isOpen }) => {
  const [count, setCount] = useState("");
  const [language, setLanguage] = useState("");
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const countInputRef = useRef(null);

  // useEffect(() => {
  //   if (isActive && isOpen && countInputRef.current) countInputRef.current.focus();
  // }, [isActive, isOpen]);

  const perform = (c, lang, w, t) => {
    if (!c || !lang || !w || !t) return alert("Please fill in all fields for Tool 3.");
    const dm = `Create ${c} sentences in ${lang} using the word ${w} translation in ${t}`;
    const iq = `generate me ${c} sentences using the word ${w} in ${lang} and right after each sentence send me the translation of that sentence in ${t}, each sentence should be incased in "^"`;
    onSubmit("createSentences", dm, iq);
    setCount("");
    setLanguage("");
    setWord("");
    setTranslation("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        perform(count, language, word, translation);
      }}
    >
      <FormGroup label="Number of Sentences:">
        <StyledInput
          ref={countInputRef}
          type="number"
          placeholder="5"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          required
        />
      </FormGroup>
      <FormGroup label="Language:">
        <StyledInput
          placeholder="French"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          required
        />
      </FormGroup>
      <FormGroup label="Word:">
        <StyledInput
          placeholder="Merci"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          required
        />
      </FormGroup>
      <FormGroup label="Translate sentences to:">
        <StyledInput
          placeholder="English"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          required
        />
      </FormGroup>
      <div className="flex gap-3 mt-6">
        <StyledButton type="submit" variant="primary">
          Send
        </StyledButton>
        <StyledButton onClick={() => perform("5", "French", "Merci", "English")} variant="accent">
          Test
        </StyledButton>
      </div>
    </form>
  );
};

// --- Main ToolsWindow ---
const ToolsWindow = ({ isOpen, onClose, onTool3Submit }) => {
  const [idx, setIdx] = useState(0);
  const startX = useRef(0);
  const endX = useRef(0);
  const isDragging = useRef(false);
  const modalBgClass = "bg-white";
  const maxCardHeight = "440px";

  const TOOLS = [
    { id: "conjugateWord", title: "Conjugate Word", Form: Tool1Form },
    { id: "wordsByLetter", title: "Words by Letter", Form: Tool2Form },
    { id: "createSentences", title: "Create Sentences", Form: Tool3Form },
  ];

  const handleSubmit = (toolId, dm, iq) => {
    if (toolId === "createSentences" && onTool3Submit) {
      onTool3Submit(dm, iq);
      onClose();
    } else if (toolId !== "createSentences") {
      console.log(`Tool ${toolId} submitted with: `, dm, iq);
    }
  };

  const next = () => setIdx((i) => Math.min(i + 1, TOOLS.length - 1));
  const prev = () => setIdx((i) => Math.max(i - 1, 0));

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };
  const onTouchMove = (e) => {
    if (!isDragging.current) return;
    endX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const d = startX.current - endX.current;
    if (Math.abs(d) > 50) {
      d > 0 ? next() : prev();
    }
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-2 md:p-4 transition-opacity duration-300">
      <div className="bg-secondary p-4 md:p-6 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl relative max-h-[95vh] md:max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-200 flex-shrink-0">
          <h2 id="tools-window-title" className="text-2xl font-semibold text-accent">
            Suggested Uses
          </h2>
          <StyledButton onClick={onClose} variant="secondary" className="!px-3 !py-1.5 !ring-offset-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </StyledButton>
        </div>

        <div className="bg-primary p-3 sm:p-4 md:p-6 rounded-xl relative flex-grow flex flex-col">
          <div
            className="relative flex-grow"
            style={{ perspective: "1500px" }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {[prev, next].map((handler, navIdx) => (
              <button
                key={navIdx}
                onClick={handler}
                disabled={(navIdx === 0 && idx === 0) || (navIdx === 1 && idx === TOOLS.length - 1)}
                className={`absolute top-1/2 -translate-y-1/2 ${
                  navIdx === 0 ? "left-0 sm:left-1" : "right-0 sm:right-1"
                } text-white p-1 sm:p-2 transition-all duration-150 ease-in-out disabled:opacity-20 disabled:cursor-not-allowed hover:opacity-80 active:opacity-60 z-20 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-primary`}
                aria-label={navIdx === 0 ? "Previous tool" : "Next tool"}
              >
                {navIdx === 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="w-7 h-7 sm:w-8 md:w-10 lg:w-12 lg:h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="w-7 h-7 sm:w-8 md:w-10 lg:w-12 lg:h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                )}
              </button>
            ))}

            <div className="relative w-full h-full" style={{ minHeight: maxCardHeight }}>
              {TOOLS.map(({ id, title, Form }, i) => {
                const offset = i - idx;
                const direction = Math.sign(offset);
                const absOffset = Math.abs(offset);
                let style = {};
                const baseTransform = "translateX(-50%) translateY(-50%)";

                if (offset === 0) {
                  style = {
                    transform: `${baseTransform} translateZ(5px) scale(1)`,
                    opacity: 1,
                    zIndex: 20,
                  };
                } else if (absOffset === 1) {
                  style = {
                    transform: `${baseTransform} translateX(${direction * 38}%) translateZ(-60px) rotateY(${direction * -12}deg) scale(0.82)`,
                    opacity: 0.75,
                    zIndex: 10,
                  };
                } else if (absOffset === 2) {
                  style = {
                    transform: `${baseTransform} translateX(${direction * 60}%) translateZ(-130px) rotateY(${direction * -20}deg) scale(0.7)`,
                    opacity: 0.4,
                    zIndex: 5,
                  };
                } else {
                  style = {
                    transform: `${baseTransform} translateX(${direction * 70}%) translateZ(-180px) rotateY(${direction * -25}deg) scale(0.6)`,
                    opacity: 0,
                    zIndex: 1,
                  };
                }

                return (
                  <div
                    key={id}
                    className="absolute top-1/2 left-1/2 transition-transform transition-opacity duration-300 ease-out"
                    style={{
                      width: "clamp(270px, 70vw, 320px)",
                      height: "clamp(400px, 65vh, 440px)",
                      ...style,
                    }}
                    aria-hidden={i !== idx}
                  >
                    <ToolCard title={title} newModalBgClass={modalBgClass}>
                      <Form isActive={i === idx} isOpen={isOpen} onSubmit={handleSubmit} />
                    </ToolCard>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center space-x-1.5 sm:space-x-2 pt-4 md:pt-6 pb-1 md:pb-2 flex-shrink-0">
            {TOOLS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`rounded-full transition-all duration-300 ease-out ${
                  i === idx
                    ? "bg-white w-2.5 h-2.5 sm:w-3 sm:h-3"
                    : "bg-white opacity-50 hover:opacity-75 w-2 h-2 sm:w-2.5 sm:h-2.5"
                } focus:outline-none focus:ring-2 focus:ring-white/70 ring-offset-2 ring-offset-primary`}
                aria-label={`Go to tool ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsWindow;
