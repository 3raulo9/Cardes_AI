import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // 🚀 Animations
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"; // Social Icons
import { FiVolume2, FiLogOut } from "react-icons/fi"; // Icons

const LandingPage = () => {
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  // Logout Function (Logs out without redirecting)
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Clear token
    setIsLoggedIn(false); // Update state to refresh the buttons
  };

  // Function to Play AI TTS Audio
  const playAudio = (fileName) => {
    const audio = new Audio(`/audio/${fileName}`); // ✅ Load audio from public/audio/
    audio.play().catch((err) => console.error("Error playing audio:", err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-700 text-white">
      {/* 🔥 Sticky Header */}
      <header className="w-full py-6 px-8 flex justify-between items-center fixed top-0 left-0 bg-opacity-90 bg-secondary shadow-md z-50">
        <h1 className="text-3xl font-bold cursor-pointer transition hover:text-gray-300">
          <Link to="/">Cardes AI</Link>
        </h1>
        <nav className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <Link 
                to="/login" 
                className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-full shadow-md hover:bg-gray-200 transition duration-300"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-300"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/categories" 
                className="px-6 py-2 bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-600 transition duration-300"
              >
                Continue Learning
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition duration-300 flex items-center"
              >
                <FiLogOut className="mr-2" /> Logout
              </button>
            </>
          )}
        </nav>
      </header>

      {/* 🚀 Hero Section */}
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-6">
        <motion.h2 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }}
          className="text-6xl font-extrabold leading-tight"
        >
          Speak <span className="text-yellow-300">Fluently</span>, <br />
          Learn <span className="text-yellow-300">Effortlessly</span>.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-4 text-lg text-gray-200"
        >
          AI-powered **text-to-speech**, **smart flashcards**, and **conversational AI** make language learning **fun, interactive, and personalized**!
        </motion.p>
      </div>

      {/* 🔊 AI-Powered TTS Showcase */}
      <section className="py-20 px-6 bg-gray-900 text-center">
        <h2 className="text-4xl font-bold mb-6">Experience AI-Driven Speech Training</h2>
        <p className="mb-6 text-gray-300">Click on a phrase to hear **near-native AI pronunciation**.</p>
        <div className="flex flex-wrap justify-center space-x-4">
          {[
            { text: "Bonjour!", file: "bonjour.mp3" },
            { text: "Hola!", file: "hola.mp3" },
            { text: "你好!", file: "nihao.mp3" },
            { text: "こんにちは!", file: "konnichiwa.mp3" },
            { text: "Hello!", file: "hello.mp3" }
          ].map(({ text, file }, i) => (
            <motion.button 
              key={i}
              className="px-6 py-3 bg-blue-600 rounded-full text-white shadow-md hover:bg-blue-700 transition duration-300"
              whileHover={{ scale: 1.1 }}
              onClick={() => playAudio(file)}
            >
              {text} <FiVolume2 className="inline ml-2" />
            </motion.button>
          ))}
        </div>
      </section>


      {/* 🎨 Features Section */}
      <section className="py-20 px-6 bg-gray-900">
        <h2 className="text-center text-4xl font-bold mb-10">Why Choose Cardes AI?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {["AI Chatbot", "Flashcards", "Speech Recognition"].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="bg-white text-gray-900 p-6 rounded-lg shadow-lg text-center"
            >
              <h3 className="text-2xl font-semibold">{feature}</h3>
              <p className="mt-3 text-gray-600">
                {feature} helps you learn faster and better with AI-driven technology.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 💬 Testimonials Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-blue-500">
        <h2 className="text-center text-4xl font-bold mb-10">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {["Amazing tool!", "Helped me ace my exams!", "Best AI tutor ever!"].map((testimonial, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -50 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="bg-white text-gray-900 p-6 rounded-lg shadow-lg"
            >
              <p className="text-lg">"{testimonial}"</p>
              <p className="mt-3 text-gray-600">- Happy User</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 📩 Newsletter Subscription */}
      <section className="py-20 px-6 bg-gray-800 text-center">
        <h2 className="text-4xl font-bold mb-6">Subscribe to Our Newsletter</h2>
        <p className="mb-6 text-gray-300">Get exclusive learning tips and updates straight to your inbox.</p>
        <div className="flex justify-center">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="px-4 py-2 w-80 rounded-l-lg border-none outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="px-6 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-r-lg hover:bg-yellow-500 transition">
            Subscribe
          </button>
        </div>
      </section>

      {/* 🏆 FAQ Section */}
      <section className="py-20 px-6 bg-gray-900">
        <h2 className="text-center text-4xl font-bold mb-10">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {["What is Cardes AI?", "How does it help me?", "Is it free to use?"].map((question, i) => (
            <details key={i} className="bg-gray-800 p-4 rounded-lg">
              <summary className="cursor-pointer text-lg font-semibold">{question}</summary>
              <p className="mt-3 text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu.
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* 🌍 Footer */}
      <footer className="py-10 bg-gray-900 text-center">
        <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
        <div className="flex justify-center space-x-6 text-gray-300 text-2xl">
          <FaFacebook className="hover:text-white transition cursor-pointer" />
          <FaTwitter className="hover:text-white transition cursor-pointer" />
          <FaInstagram className="hover:text-white transition cursor-pointer" />
          <FaLinkedin className="hover:text-white transition cursor-pointer" />
        </div>
        <p className="mt-4 text-gray-500">&copy; 2025 Cardes AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
