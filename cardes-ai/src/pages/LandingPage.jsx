import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaRegStickyNote, FaMicrophoneAlt } from "react-icons/fa";
import { FiVolume2, FiArrowUp } from "react-icons/fi";
import { Typewriter } from "react-simple-typewriter";

import Header from "../components/Header"; // Extracted header component
import Footer from "../components/Footer"; // Footer component

const LandingPage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Listen for scroll events to control "Back to Top" button visibility
  useEffect(() => {
    const handleScroll = () => {
      const threshold = 600;
      setShowScrollTop(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to play audio files in the TTS showcase
  const playAudio = (fileName) => {
    const audio = new Audio(`/audio/${fileName}`);
    audio.play().catch((err) => console.error("Error playing audio:", err));
  };

  // Scroll to top function for the button
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-accent text-white flex flex-col relative">
      {/* HEADER */}
      <Header />

      {/* Spacer to account for the fixed header */}
      <div className="h-10 sm:h-10 md:h-13"></div>

      {/* Hero Section */}
      <div className="relative w-full flex-grow flex flex-col justify-center items-center text-center px-6 pt-32 sm:pt-24 pb-20">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-md"
        >
          <Typewriter
            words={["Speak Fluently,", "Learn Effortlessly."]}
            loop={false}
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
          />
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-4 text-lg text-gray-200 max-w-xl leading-relaxed"
        >
          AI-powered text-to-speech smart flashcards, and conversational AI make language learning fun, interactive, and personalized.
        </motion.p>
        <div className="h-10 sm:h-10 md:h-13"></div>
        {/* Navigation buttons appear below the hero */}
        <nav className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Link
            to="/login"
            className="px-6 py-2 bg-white text-primary font-semibold rounded-full shadow-md hover:bg-gray-200 transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 bg-primary text-white font-semibold rounded-full shadow-md hover:bg-darkAccent transition duration-300"
          >
            Register
          </Link>
        </nav>
        <div className="h-10 sm:h-10 md:h-13"></div>
        {/* Decorative wave at the bottom of the Hero */}
        <div className="pointer-events-none absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-full h-20 md:h-32"
            viewBox="0 0 120 28"
            preserveAspectRatio="none"
          >
            <path
              d="M0,20 C40,40 80,0 120,20 L120,30 L0,30 Z"
              fill="currentColor"
              className="text-darkAccent"
            />
          </svg>
        </div>
      </div>

      {/* 🔊 AI-Powered TTS Showcase Section */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 bg-darkAccent text-center">
        {/* Reversed wave on top */}
        <div className="pointer-events-none absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180 -mt-px">
          <svg
            className="relative block w-full h-14 sm:h-20 md:h-32"
            viewBox="0 0 120 28"
            preserveAspectRatio="none"
          >
            <path
              d="M0,20 C40,40 80,0 120,20 L120,30 L0,30 Z"
              fill="currentColor"
              className="text-darkAccent"
            />
          </svg>
        </div>
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6"
        >
          Experience AI-Driven Speech Training
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-10 text-gray-300 max-w-md sm:max-w-xl mx-auto text-sm sm:text-base md:text-lg"
        >
          Click on a phrase to hear{" "}
          <span className="text-info">near-native AI pronunciation</span>.
        </motion.p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-4xl mx-auto">
          {[
            { text: "Bonjour!", file: "bonjour.mp3" },
            { text: "Hola!", file: "hola.mp3" },
            { text: "你好!", file: "nihao.mp3" },
            { text: "こんにちは!", file: "konnichiwa.mp3" },
            { text: "Hello!", file: "hello.mp3" },
          ].map(({ text, file }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="bg-primary text-white rounded-xl p-4 sm:p-6 shadow-lg w-36 sm:w-44 flex flex-col items-center cursor-pointer hover:bg-danger hover:shadow-xl transition-transform transform hover:scale-105"
              onClick={() => playAudio(file)}
            >
              <FiVolume2 className="text-2xl sm:text-3xl mb-1 sm:mb-2" />
              <span className="font-semibold text-sm sm:text-lg">{text}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🎨 Features Section */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 bg-darkAccent">
        {/* Reversed wave on top */}
        <div className="pointer-events-none absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180 -mt-px">
          <svg
            className="relative block w-full h-14 sm:h-20 md:h-32"
            viewBox="0 0 120 28"
            preserveAspectRatio="none"
          >
            <path
              d="M0,20 C40,40 80,0 120,20 L120,30 L0,30 Z"
              fill="currentColor"
              className="text-darkAccent"
            />
          </svg>
        </div>
        <motion.h2
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 text-white"
        >
          Why Choose Cardes AI?
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mx-auto max-w-6xl">
          {[
            {
              feature: "AI Chatbot",
              icon: <FaRobot className="mx-auto text-3xl text-accent" />,
            },
            {
              feature: "Flashcards",
              icon: <FaRegStickyNote className="mx-auto text-3xl text-accent" />,
            },
            {
              feature: "Speech Recognition",
              icon: <FaMicrophoneAlt className="mx-auto text-3xl text-accent" />,
            },
          ].map(({ feature, icon }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="bg-white text-gray-900 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1"
            >
              {icon}
              <h3 className="text-xl sm:text-2xl font-semibold mt-4">{feature}</h3>
              <p className="mt-3 text-gray-600 text-sm sm:text-base">
                {feature} helps you learn faster and better with AI-driven technology.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 💬 Testimonials Section */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-secondary to-darkAccent">
        {/* Reversed wave on top */}
        <div className="pointer-events-none absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180 -mt-px">
          <svg
            className="relative block w-full h-14 sm:h-20 md:h-32"
            viewBox="0 0 120 28"
            preserveAspectRatio="none"
          >
            <path
              d="M0,20 C40,40 80,0 120,20 L120,30 L0,30 Z"
              fill="currentColor"
              className="text-darkAccent"
            />
          </svg>
        </div>
        <div className="h-10 sm:h-10 md:h-13"></div>
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center text-2l sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 text-white"
        >
          What Our Users Say
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {[
            { text: "Best AI flashcard tool I've ever used!", user: "Adi from Tel Aviv" },
            { text: "Made studying efficient and enjoyable!", user: "Noa from Tel Aviv" },
            { text: "Perfect for quick revision before exams!", user: "Mark from Tel Aviv" },
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="bg-white text-gray-900 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1"
            >
              <p className="text-base sm:text-lg font-medium mb-2">"{testimonial.text}"</p>
              <p className="text-xs sm:text-sm text-gray-600">- {testimonial.user}</p>
            </motion.div>
          ))}
        </div>
        <div className="h-10 sm:h-10 md:h-13"></div>
        <div className="pointer-events-none absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-full h-20 md:h-32"
            viewBox="0 0 120 28"
            preserveAspectRatio="none"
          >
            <path
              d="M0,20 C40,40 80,0 120,20 L120,30 L0,30 Z"
              fill="currentColor"
              className="text-darkAccent"
            />
          </svg>
        </div>
      </section>
{/** 🏆 FAQ Section */}
<section className="relative py-16 sm:py-20 px-4 sm:px-6 bg-darkAccent">
        {/** Reversed wave on top */}
        <div className="pointer-events-none absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180 -mt-px">
          <svg
            className="relative block w-full h-14 sm:h-20 md:h-32"
            viewBox="0 0 120 28"
            preserveAspectRatio="none"
          >
            <path
              d="M0,20 C40,40 80,0 120,20 L120,30 L0,30 Z"
              fill="currentColor"
              className="text-darkAccent"
            />
          </svg>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10"
        >
          Frequently Asked Questions
        </motion.h2>
        {/** Space out details on small screens */}
        <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
          {[
            "What is Cardes AI?",
            "How does it help me?",
            "Is it free to use?",
          ].map((question, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-secondary p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <summary className="cursor-pointer text-sm sm:text-base md:text-lg font-semibold">
                {question}
              </summary>
              <p className="mt-2 sm:mt-3 text-gray-400 text-xs sm:text-sm md:text-base">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu.
              </p>
            </motion.details>
          ))}
        </div>
      </section>
      {/* FOOTER */}
      <Footer />

      {/* "Back to Top" Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scrollTop"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-5 right-5 bg-accent p-3 rounded-full shadow-md hover:bg-warning transition text-white"
            aria-label="Scroll to top"
          >
            <FiArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
