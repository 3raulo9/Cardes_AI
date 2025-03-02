import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FiVolume2, FiLogOut } from "react-icons/fi";

// Optional icons for features
import { FaRobot, FaRegStickyNote, FaMicrophoneAlt } from "react-icons/fa";

const LandingPage = () => {
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // State to track whether we've scrolled far enough to show buttons in header
  const [showHeaderButtons, setShowHeaderButtons] = useState(false);

  // On mount, check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  // Listen for window scroll, toggle showHeaderButtons after threshold
  useEffect(() => {
    const handleScroll = () => {
      const threshold = 490;
      if (window.scrollY > threshold) {
        setShowHeaderButtons(true);
      } else {
        setShowHeaderButtons(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
  };

  // Play TTS Audio
  const playAudio = (fileName) => {
    const audio = new Audio(`/audio/${fileName}`);
    audio.play().catch((err) => console.error("Error playing audio:", err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-accent text-white flex flex-col">
      {/** HEADER */}
      <header
        className={`
          w-full py-6 px-8 fixed top-0 left-0 bg-opacity-90 bg-secondary shadow-md z-50
          flex items-center transition-all duration-300
          ${showHeaderButtons ? "justify-between" : "justify-center"}
        `}
      >
        {/** Left: Cardes AI text */}
        <h1 className="text-xl sm:text-3xl font-bold cursor-pointer transition hover:text-gray-300">
          <Link to="/">Cardes AI</Link>
        </h1>

        {/** Right: Buttons appear only if showHeaderButtons == true */}
        {showHeaderButtons && (
          <nav className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
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
              </>
            ) : (
              <>
                <Link
                  to="/categories"
                  className="px-6 py-2 bg-accent text-white font-semibold rounded-full shadow-md hover:bg-darkAccent transition duration-300"
                >
                  Continue Learning
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-accent text-white font-semibold rounded-full shadow-md hover:bg-darkAccent transition duration-300 flex items-center"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </>
            )}
          </nav>
        )}
      </header>

      {/** HERO SECTION */}
      {/**
       * Only show the buttons within the hero if we haven't scrolled past threshold
       * (i.e., showHeaderButtons == false).
       */}
      <div className="relative w-full flex-grow flex flex-col justify-center items-center text-center px-6 pt-32 sm:pt-24 pb-20">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl font-extrabold leading-tight drop-shadow-md"
        >
          Speak <span className="text-warning">Fluently</span>, <br />
          Learn <span className="text-success">Effortlessly</span>.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-4 text-lg text-gray-200 max-w-xl leading-relaxed"
        >
          AI-powered <strong className="text-info">text-to-speech</strong>,{" "}
          <strong className="text-danger">smart flashcards</strong>, and{" "}
          <strong className="text-warning">conversational AI</strong> make
          language learning <em className="text-success">fun</em>,{" "}
          <em className="text-warning">interactive</em>, and{" "}
          <em className="text-info">personalized</em>!
        </motion.p>

        {!showHeaderButtons && (
          <nav className="flex items-center space-x-4 mt-4 sm:mt-0">
            {!isLoggedIn ? (
              <>
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
              </>
            ) : (
              <>
                <Link
                  to="/categories"
                  className="px-6 py-2 bg-accent text-white font-semibold rounded-full shadow-md hover:bg-darkAccent transition duration-300"
                >
                  Continue Learning
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-accent text-white font-semibold rounded-full shadow-md hover:bg-darkAccent transition duration-300 flex items-center"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </>
            )}
          </nav>
        )}

        {/** Decorative wave at the bottom of the Hero */}
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
      {/* 🔊 AI-Powered TTS Showcase */}
      <section className="relative py-20 px-6 bg-darkAccent text-center">
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-bold mb-6"
        >
          Experience AI-Driven Speech Training
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-10 text-gray-300"
        >
          Click on a phrase to hear{" "}
          <span className="text-info">near-native AI pronunciation</span>.
        </motion.p>
        <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
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
              className="bg-primary text-white rounded-xl p-6 shadow-lg w-44 flex flex-col items-center cursor-pointer hover:bg-danger hover:shadow-xl transition transform hover:scale-105"
              onClick={() => playAudio(file)}
            >
              <FiVolume2 className="text-3xl mb-2" />
              <span className="font-semibold text-lg">{text}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🎨 Features Section */}
      <section className="py-20 px-6 bg-darkAccent">
        <motion.h2
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center text-4xl font-bold mb-10"
        >
          Why Choose Cardes AI?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mx-auto max-w-6xl">
          {[
            {
              feature: "AI Chatbot",
              icon: <FaRobot className="mx-auto text-3xl text-accent" />,
            },
            {
              feature: "Flashcards",
              icon: (
                <FaRegStickyNote className="mx-auto text-3xl text-accent" />
              ),
            },
            {
              feature: "Speech Recognition",
              icon: (
                <FaMicrophoneAlt className="mx-auto text-3xl text-accent" />
              ),
            },
          ].map(({ feature, icon }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="bg-white text-gray-900 p-8 rounded-xl shadow-lg hover:shadow-2xl transition"
            >
              {icon}
              <h3 className="text-2xl font-semibold mt-4">{feature}</h3>
              <p className="mt-3 text-gray-600">
                {feature} helps you learn faster and better with AI-driven
                technology.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 💬 Testimonials Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-secondary to-darkAccent">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center text-4xl font-bold mb-10"
        >
          What Our Users Say
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            "Amazing tool!",
            "Helped me ace my exams!",
            "Best AI tutor ever!",
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="bg-white text-gray-900 p-6 rounded-lg shadow-lg hover:shadow-2xl transition"
            >
              <p className="text-lg font-medium mb-2">"{testimonial}"</p>
              <p className="text-sm text-gray-600">- Happy User</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 📩 Newsletter Subscription */}
      <section className="py-20 px-6 bg-secondary text-center">
        <motion.h2
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-bold mb-6"
        >
          Subscribe to Our Newsletter
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-6 text-gray-300"
        >
          Get exclusive learning tips and updates straight to your inbox.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 w-80 rounded-l-lg border-none outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="px-6 py-2 bg-accent text-white font-semibold rounded-r-lg hover:bg-darkAccent transition">
            Subscribe
          </button>
        </motion.div>
      </section>

      {/* 🏆 FAQ Section */}
      <section className="py-20 px-6 bg-darkAccent">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center text-4xl font-bold mb-10"
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="space-y-6 max-w-3xl mx-auto">
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
              <summary className="cursor-pointer text-lg font-semibold">
                {question}
              </summary>
              <p className="mt-3 text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu.
              </p>
            </motion.details>
          ))}
        </div>
      </section>

      {/* 🌍 Footer (no wave) */}
      <footer className="bg-darkAccent text-center pt-10 pb-10">
        <div className="px-6">
          <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
          <div className="flex justify-center space-x-6 text-gray-300 text-2xl">
            <a
              href="https://www.linkedin.com/in/raul-asadov/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="hover:text-white transition cursor-pointer" />
            </a>
          </div>

          <p className="mt-4 text-gray-500">
            &copy; Raul Asadov 2025 Cardes AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
