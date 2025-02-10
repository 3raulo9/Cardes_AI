import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CardesChat from "./components/CardesChat";
import Login from "./components/Login";
import ChatLayout from "./components/ChatLayout";
import Register from "./components/Register";
import CategoryPage from "./components/CategoryPage";
import CardSetsPage from "./components/CardSetsPage";
import CardsPage from "./components/CardsPage";

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("accessToken"));

  return (
    <Router>
      <Routes>
        {/* No Sidebar on Login/Register */}
        <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
        <Route path="/register" element={<Register />} />

        {/* Sidebar stays for all main pages */}
        <Route
          path="/*"
          element={
            <ChatLayout>
              <Routes>
                <Route path="/categories" element={<CategoryPage />} />
                <Route path="/categories/:id" element={<CardSetsPage />} />
                <Route path="/categories/:id/sets/:setId" element={<CardsPage />} />
                <Route path="/chat" element={<CardesChat />} />
              </Routes>
            </ChatLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
