import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CardesChat from "./components/CardesChat";
import Login from "./components/Login";
import ChatLayout from "./components/ChatLayout";
import Register from "./components/Register";
import CategoryPage from "./components/CategoryPage";
import CardSetsPage from "./components/CardSetsPage";
import CardsPage from "./components/CardsPage";
import PracticePage from "./components/PracticePage";

function App() {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [authToken, setAuthToken] = useState(localStorage.getItem("accessToken"));

  console.log(authToken); // Just to avoid the warning

  return (
    <Router>
      <Routes>
        {/* Public Routes: No Sidebar */}
        <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected / Main Routes: Wrapped in ChatLayout */}
        <Route
          path="/*"
          element={
            <ChatLayout>
              <Routes>
                {/* Index route for when no sub-path is provided */}
                <Route index element={<CategoryPage />} />
                <Route path="categories" element={<CategoryPage />} />
                <Route path="categories/:id" element={<CardSetsPage />} />
                <Route path="categories/:id/sets/:setId" element={<CardsPage />} />
                <Route path="chat" element={<CardesChat />} />
                <Route path="practice/:id" element={<PracticePage />} />
              </Routes>
            </ChatLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
