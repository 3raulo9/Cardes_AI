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
import LandingPage from "./pages/LandingPage";  // ✅ Import Landing Page
import ChatLayout from "./components/ChatLayout";
import { loadTheme } from "./utils/themeSwitcher"; // ✅ Load theme on startup

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
    loadTheme();
    setAuthToken(localStorage.getItem("accessToken"));
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} /> {/* ✅ Default Landing Page */}
        <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            authToken ? (
              <ChatLayout>
                <Routes>
                  <Route index element={<CategoryPage />} />
                  <Route path="categories" element={<CategoryPage />} />
                  <Route path="categories/:id" element={<CardSetsPage />} />
                  <Route path="categories/:id/sets/:setId" element={<CardsPage />} />
                  <Route path="chat" element={<CardesChat />} />
                  <Route path="practice/:id" element={<PracticePage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Routes>
              </ChatLayout>
            ) : (
              <Navigate to="/" replace /> // ✅ Redirect unauthenticated users to Landing Page
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
