import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CardesChat from "./components/CardesChat";
import Login from "./components/Login";
import ChatLayout from "./components/ChatLayout";
import Register from "./components/Register";
import CategoryPage from "./components/CategoryPage";
import CardSetsPage from "./components/CardSetsPage";
import CardsPage from "./components/CardsPage";
import PracticePage from "./components/PracticePage";

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
    setAuthToken(localStorage.getItem("accessToken"));
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes: No Sidebar */}
        <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
        <Route path="/register" element={<Register />} />

        {/* Redirect to login if not authenticated */}
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

// TODO: In the future, consider adding a dedicated landing page for users who are not logged in.
