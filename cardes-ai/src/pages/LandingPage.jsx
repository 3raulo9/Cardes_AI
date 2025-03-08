import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLinkedin,
  FaRobot,
  FaRegStickyNote,
  FaMicrophoneAlt,
} from "react-icons/fa";
import { FiVolume2, FiLogOut, FiArrowUp } from "react-icons/fi";
import { Typewriter } from "react-simple-typewriter";

// Import your images
import firstImage from "../static/images/firstimage.jpg";
import secondImage from "../static/images/secondImage.png";
import thirdImage from "../static/images/thirdImage.jpg";

// Example hero background image path:

const LandingPage = () => {
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Show/hide buttons in header after a scroll threshold
  const [showHeaderButtons, setShowHeaderButtons] = useState(false);

  // Show/hide "Back to Top" button
  const [showScrollTop, setShowScrollTop] = useState(false);

  // On mount, check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  // Listen for scroll to control header and scrollTop button
  useEffect(() => {
    const handleScroll = () => {
      // Adjust threshold to taste
      const threshold = 490;
      setShowHeaderButtons(window.scrollY > threshold);
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
  };

  const playAudio = (fileName) => {
    const audio = new Audio(`/audio/${fileName}`);
    audio.play().catch((err) => console.error("Error playing audio:", err));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-accent text-white flex flex-col relative">
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

      {/* Spacer div to add spacing below fixed header */}
      <div className="h-10 sm:h-10 md:h-13"></div>

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
          AI-powered text-to-speech smart flashcards, and conversational AI make
          language learning fun, interactive, and personalized.
        </motion.p>
        <div className="h-10 sm:h-10 md:h-13"></div>

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
        <div className="h-10 sm:h-10 md:h-13"></div>

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

      {/** 🔊 AI-Powered TTS Showcase */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 bg-darkAccent text-center">
        {/** Wave on top (reversed) */}
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
              className="bg-primary text-white rounded-xl p-4 sm:p-6 shadow-lg w-36 sm:w-44 flex flex-col items-center
                         cursor-pointer hover:bg-danger hover:shadow-xl transition-transform transform hover:scale-105"
              onClick={() => playAudio(file)}
            >
              <FiVolume2 className="text-2xl sm:text-3xl mb-1 sm:mb-2" />
              <span className="font-semibold text-sm sm:text-lg">{text}</span>
            </motion.div>
          ))}
        </div>
      </section>
      {/** 🎨 Features Section */}
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
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 text-white"
        >
          Why Choose Cardes AI?
        </motion.h2>
        {/** Single column on mobile, 2 on sm, 3 on md+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mx-auto max-w-6xl">
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
              className="bg-white text-gray-900 p-6 rounded-xl shadow-lg 
                         hover:shadow-2xl transition-transform transform hover:-translate-y-1"
            >
              {icon}
              <h3 className="text-xl sm:text-2xl font-semibold mt-4">
                {feature}
              </h3>
              <p className="mt-3 text-gray-600 text-sm sm:text-base">
                {feature} helps you learn faster and better with AI-driven
                technology.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/** 💬 Testimonials Section */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-secondary to-darkAccent">
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
            {
              text: "Best AI flashcard tool I've ever used!",
              user: "Adi from Tel Aviv",
            },
            {
              text: "Made studying efficient and enjoyable!",
              user: "Noa from Tel Aviv",
            },
            {
              text: "Perfect for quick revision before exams!",
              user: "Mark from Tel Aviv",
            },

          ].map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="bg-white text-gray-900 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1"
            >
              <p className="text-base sm:text-lg font-medium mb-2">
                "{testimonial.text}"
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                - {testimonial.user}
              </p>
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
      {/** ABOUT / ORIGIN SECTIONS */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 bg-darkAccent text-white">
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

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 text-center">
          How This Website Came to Life
        </h2>

        {/* 1st Block (Image left, Text right) */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 flex justify-center"
          >
            <img
              src={firstImage}
              alt="Raul the Dev and Language Learner"
              className="w-full max-w-sm h-auto rounded shadow-lg hover:shadow-xl 
                         transition-transform transform hover:-translate-y-1"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <h3 className="text-xl sm:text-2xl font-semibold mb-2">
              Meet Raul Asadov
            </h3>
            <p className="text-gray-200 leading-relaxed">
              From the time I first discovered the beauty of foreign scripts and
              sounds, I felt an insatiable hunger to learn new languages.
              Nothing brings me more joy than exploring how people communicate
              around the globe and how words shape our thoughts. Over the years,
              I envisioned a single hub that could combine{" "}
              <strong>personalized flashcards</strong>, harness the power of
              <strong> AI-driven learning</strong>, and provide incredibly{" "}
              <strong>natural text-to-speech</strong> capabilities. My goal has
              always been to make language acquisition an exciting, dynamic, and
              downright magical experience. With AI-generated decks tailored to
              each learner’s specific needs, we’re diving into a future where
              every user can progress at their own pace, guided by advanced
              technology that understands and adapts to them. And the best part?
              We’re just getting started—soon, we’ll be rolling out{" "}
              <em>AI-generated courses</em> that use your level, interests, and
              goals to create a truly one-of-a-kind journey!
            </p>
          </motion.div>
        </div>

        {/* 2nd Block (Text left, Image right) */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8 mb-10">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 flex justify-center"
          >
            <img
              src={secondImage}
              alt="Raul's Developer Experience"
              className="w-full max-w-sm h-auto rounded  
                         transition-transform transform hover:-translate-y-1"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <h3 className="text-xl sm:text-2xl font-semibold mb-2">
              5+ Years of Dev Expertise
            </h3>
            <p className="text-gray-200 leading-relaxed">
              Crafting user-centric applications and pushing creative boundaries
              has been my calling throughout my 5+ years in software
              development. My formal journey took off with two immersive years
              at John Brice Bootcamp, where I dove headfirst into front-end
              design, back-end architecture, databases, APIs—you name it.
              Picking up multiple programming languages along the way, I’ve
              always believed in the power of merging clean code with an
              engaging user experience. Every project I tackle aims to bridge
              the gap between people and technology. Seeing real users benefit
              from what I build—the very tools that simplify and enrich their
              daily lives—is, in my mind, the best reward a developer could ask
              for!
            </p>
          </motion.div>
        </div>

        {/* 3rd Block (Image left, Text right) */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 flex justify-center"
          >
            <img
              src={thirdImage}
              alt="How Yazyk was born"
              className="w-full max-w-sm h-auto rounded shadow-lg hover:shadow-xl 
                         transition-transform transform hover:-translate-y-1"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <h3 className="text-xl sm:text-2xl font-semibold mb-2">
              The Birth of Yazyk
            </h3>
            <p className="text-gray-200 leading-relaxed">
              During my second year at John Brice, the gears really started
              turning—I wanted to build a space that fulfilled a growing need:
              an all-in-one tool for mastering new languages. That’s how “Yazyk”
              came to be, a name drawn from a Slavic word meaning “tongue.” It’s
              a nod to both the anatomical part of our speech mechanism and the
              linguistic diversity we aim to celebrate. In honor of my very
              first orange cat, our adorable mascot embodies the spirit of
              curiosity, warmth, and a playful approach to learning. My hope is
              that, as you explore Yazyk, you’ll feel just as excited
              discovering new expressions and cultures as I did while creating
              this platform. Here’s to a vibrant community of learners who
              continue pushing the boundaries of language study—together, we’ll
              write the next chapter in the global conversation!
            </p>
          </motion.div>
        </div>
      </section>
      {/* * 📩 Newsletter Subscription
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 bg-secondary text-center">
        <motion.h2
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6"
        >
          Subscribe to Our Newsletter
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-6 text-gray-300 max-w-md sm:max-w-xl mx-auto text-sm sm:text-base md:text-lg"
        >
          Get exclusive learning tips and updates straight to your inbox.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-center items-center mx-auto max-w-md"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 w-full sm:w-2/3 rounded-l-lg sm:rounded-r-none border-none outline-none 
                       focus:ring-2 focus:ring-accent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="mt-4 sm:mt-0 sm:ml-0 sm:rounded-l-none sm:rounded-r-lg px-6 py-2 bg-accent text-white font-semibold 
                             hover:bg-darkAccent transition w-full sm:w-auto"
          >
            Subscribe
          </button>
        </motion.div>
      </section> */}
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

      {/* 🌍 Footer */}
      <footer className="relative bg-gradient-to-r from-primary to-accent text-center pt-14 sm:pt-20 pb-6 sm:pb-10">
        {/* Transparent reversed wave on top */}
        {/* Transparent reversed wave on top */}
        <div className="pointer-events-none absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180 -mt-px">
          <svg
            className="block w-full h-14 sm:h-20 md:h-32"
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

        <div className="px-4 sm:px-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Follow Us</h3>

          <div className="flex justify-center space-x-6 text-gray-300 text-2xl">
            <a
              href="https://www.linkedin.com/in/raul-asadov/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="hover:text-white transition cursor-pointer" />
            </a>
          </div>

          <p className="mt-4 text-white text-sm sm:text-base">
            &copy; 2025 Cardes AI | Created by Raul Asadov. All rights reserved.
          </p>
        </div>
      </footer>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scrollTop"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-5 right-5 bg-accent p-3 rounded-full shadow-md 
                       hover:bg-warning transition text-white"
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
