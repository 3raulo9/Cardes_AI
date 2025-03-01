import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CardesChat from "./pages/ChatPage";
import Login from "./pages/LoginPage";
import ChatLayout from "./components/ChatLayout";
import Register from "./pages/RegisterPage";
import CategoryPage from "./pages/CategoryPage";
import CardSetsPage from "./pages/CardSetsPage";
import CardsPage from "./pages/CardsPage";
import PracticePage from "./pages/PracticePage";
import SettingsPage from "./pages/SettingsPage";
import { loadTheme } from "./utils/themeSwitcher"; // ✅ Load theme on startup

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
    loadTheme(); // ✅ Load saved theme or default to Cardes
    setAuthToken(localStorage.getItem("accessToken"));
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes: No Sidebar */}
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
                  <Route path="settings" element={<SettingsPage />} /> {/* ✅ Settings Page */}
                </Routes>
              </ChatLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
