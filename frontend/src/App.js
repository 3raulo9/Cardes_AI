// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/index.css"; // Import the CSS file
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar"; // Import the Sidebar component

import HomePage from "./pages/HomePage"; // Import the HomePage component
import CardesChat from "./pages/CardesChat";

import LearnPage from './pages/LearnPage'
import FlashcardsPage from './pages/FlashcardsPage'
import TextsPage from './pages/TextsPage'

import logo from "./static/images/cardes_logo.png";



const App = () => {
  return (
    <Router>
      
      <div className="app-container">

        <Sidebar />
        <img src={logo} alt="Cardes AI Logo" className="sidebar-logo" />

        <div className="main-content">
          <Routes>
            
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<CardesChat />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
            <Route path="/texts" element={<TextsPage />} />

          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;
