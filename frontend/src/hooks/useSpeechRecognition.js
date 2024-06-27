import { useState, useEffect } from "react";
import annyang from "annyang";

const useSpeechRecognition = (handleSpeechRecognition) => {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (annyang) {
      annyang.addCallback("result", handleSpeechRecognition);
    }
    return () => {
      if (annyang) {
        annyang.removeCallback("result", handleSpeechRecognition);
      }
    };
  }, [handleSpeechRecognition]);

  const startListening = () => {
    if (annyang) {
      annyang.start({ autoRestart: false, continuous: false });
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (annyang) {
      annyang.abort();
      setIsListening(false);
    }
  };

  return { isListening, startListening, stopListening };
};

export default useSpeechRecognition;
