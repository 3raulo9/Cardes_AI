import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CardesChat from "./pages/ChatPage";
import ChatSessionsListPage from "./pages/ChatSessionsListPage"; // Create this new page
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import CategoryPage from "./pages/CategoryPage";
import CardSetsPage from "./pages/CardSetsPage";
import CardsPage from "./pages/CardsPage";
import SettingsPage from "./pages/SettingsPage";
import LandingPage from "./pages/LandingPage";  // Default Landing Page
import AboutPage from "./pages/AboutPage"; // About page import
import ChatLayout from "./components/ChatLayout";
import { loadTheme } from "./utils/themeSwitcher";
import ScrollToTop from "./utils/ScrollToTop"; // Import the new component
import JourneyPage from "./pages/JourneyPage"; // Import JourneyPage
import PracticeModeSelection from "./pages/PracticeScreens/PracticeModeSelection";
import SimpleReviewPage from "./pages/PracticeScreens/SimpleReviewPage";
import MultipleAnswersPage from "./pages/PracticeScreens/MultipleAnswersPage";
import MatchCardsPage from "./pages/PracticeScreens/MatchCardsPage";
import WritingReviewPage from "./pages/PracticeScreens/WritingReviewPage";

// A simple component to guard protected routes
const PrivateRoute = ({ authToken, children }) => {
  return authToken ? children : <Navigate to="/" replace />;
};
function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
    loadTheme();
    // Optional: Add a listener to update authToken if it changes in another tab/window
    const handleStorageChange = () => {
      setAuthToken(localStorage.getItem("accessToken"));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setAuthToken={setAuthToken} />} /> {/* Pass setAuthToken */}
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Protected Routes */}
        <Route
          path="/*" // This catch-all needs to be more specific or ChatLayout needs to handle 404s
          element={
            <PrivateRoute authToken={authToken}>
              <ChatLayout>
                <Routes> {/* Nested Routes within ChatLayout */}
                  <Route index element={<CategoryPage />} /> {/* Default for authenticated users */}
                  <Route path="categories" element={<CategoryPage />} />
                  <Route path="categories/:id" element={<CardSetsPage />} />
                  <Route path="categories/:id/sets/:setId" element={<CardsPage />} />

                  {/* New Chat History Routes */}
                  <Route path="chats" element={<ChatSessionsListPage />} /> {/* List all chats */}
                  <Route path="chat/:sessionId" element={<CardesChat />} /> {/* Specific existing chat */}
                  <Route path="chat" element={<CardesChat />} /> {/* New chat (no sessionId yet) */}

                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="journey" element={<JourneyPage />} />
                  <Route path="practice/:id" element={<PracticeModeSelection />} />
                  <Route path="practice/:id/simple" element={<SimpleReviewPage />} />
                  <Route path="practice/:id/multiple" element={<MultipleAnswersPage />} />
                  <Route path="practice/:id/match" element={<MatchCardsPage />} />
                  <Route path="practice/:id/writing" element={<WritingReviewPage />} />

                   {/* Consider adding a 404 route within ChatLayout as well */}
                   {/* <Route path="*" element={<NotFoundPageInsideLayout />} /> */}
                </Routes>
              </ChatLayout>
            </PrivateRoute>
          }
        />
        {/* <Route path="*" element={<NotFoundPagePublic />} />  A general 404 page */}
      </Routes>
    </Router>
  );
}
export default App;