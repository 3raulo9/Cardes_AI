// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css"; // Import the CSS file
import Footer from "./Footer";
import CardesChat from "./CardesChat";
import Sidebar from "./Sidebar"; // Import the Sidebar component

import HomePage from "./HomePage"; // Import the HomePage component
import LearnPage from './LearnPage'
import FlashcardsPage from './FlashcardsPage'
import TextsPage from './TextsPage'

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
