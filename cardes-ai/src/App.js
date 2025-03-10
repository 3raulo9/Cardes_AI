import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CardesChat from "./pages/ChatPage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import CategoryPage from "./pages/CategoryPage";
import CardSetsPage from "./pages/CardSetsPage";
import CardsPage from "./pages/CardsPage";
import PracticePage from "./pages/PracticePage";
import SettingsPage from "./pages/SettingsPage";
import LandingPage from "./pages/LandingPage";  // Default Landing Page
import AboutPage from "./pages/AboutPage"; // About page import
import ChatLayout from "./components/ChatLayout";
import { loadTheme } from "./utils/themeSwitcher";
import ScrollToTop from "./utils/ScrollToTop"; // Import the new component
import JourneyPage from "./pages/JourneyPage"; // Import JourneyPage

// A simple component to guard protected routes
const PrivateRoute = ({ authToken, children }) => {
  return authToken ? children : <Navigate to="/" replace />;
};

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
    loadTheme();
  }, []);

  return (
    <Router>
      <ScrollToTop /> {/* This will scroll to top on every route change */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <PrivateRoute authToken={authToken}>
              <ChatLayout>
                <Routes>
                  <Route index element={<CategoryPage />} />
                  <Route path="categories" element={<CategoryPage />} />
                  <Route path="categories/:id" element={<CardSetsPage />} />
                  <Route path="categories/:id/sets/:setId" element={<CardsPage />} />
                  <Route path="chat" element={<CardesChat />} />
                  <Route path="practice/:id" element={<PracticePage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="journey" element={<JourneyPage />} />

                </Routes>
              </ChatLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
