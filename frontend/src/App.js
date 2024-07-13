import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "./styles/index.css";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Loading from "./components/Loading";
import HomePage from "./pages/HomePage";
import CardesChat from "./pages/CardesChat";
import LearnPage from "./pages/LearnPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import TextsPage from "./pages/TextsPage";
import ArticlePage from "./pages/ArticlePage";
import ChatHistory from "./pages/ChatHistory";
import EditCardPage from "./pages/EditCardPage";
import PracticeCardPage from "./pages/PracticeCardPage";
import logo from "./static/images/cardes_logo.png";
import { initialDecks } from "./data"; // Import the static data

const AppContent = ({ setLoading }) => {
  const location = useLocation();

  useEffect(() => {
    setLoading(false);
  }, [location]);

  return (
    <div className="app-container">
      <Sidebar setLoading={setLoading} />
      <img src={logo} alt="Cardes AI Logo" className="sidebar-logo" />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<CardesChat />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/flashcards" element={<FlashcardsPage decks={initialDecks} />} />
          <Route path="/texts" element={<TextsPage />} />
          <Route path="/texts/:id" element={<ArticlePage />} />
          <Route path="/chat_history" element={<ChatHistory />} />
          <Route path="/flashcards/edit/:id" element={<EditCardPage decks={initialDecks} />} />
          <Route path="/flashcards/practice/:id" element={<PracticeCardPage decks={initialDecks} />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
};

const App = () => {
  const [loading, setLoading] = useState(false);

  return (
    <Router>
      {loading && <Loading />}
      <AppContent setLoading={setLoading} />
    </Router>
  );
};

export default App;
