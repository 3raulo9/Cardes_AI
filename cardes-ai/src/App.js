import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CardesChat from "./components/CardesChat";
import Login from "./components/Login";
import ChatLayout from "./components/ChatLayout";
import "@shoelace-style/shoelace/dist/themes/light.css";

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("accessToken"));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
        <Route
          path="/chat"
          element={
            authToken ? (
              <ChatLayout>
                <CardesChat />
              </ChatLayout>
            ) : (
              <Login setAuthToken={setAuthToken} />
            )
          }
        />
        <Route path="*" element={<Login setAuthToken={setAuthToken} />} />
      </Routes>
    </Router>
  );
}

export default App;
