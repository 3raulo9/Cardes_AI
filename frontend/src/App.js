// App.js
import React from "react";
import "./index.css"; // Import the CSS file
import Footer from "./Footer";
import CardesChat from "./CardesChat";
import Sidebar from "./Sidebar"; // Import the Sidebar component

const App = () => {
  return (
    <div className="app-container">
      <Sidebar /> {/* Include the Sidebar component */}
      <div className="main-content">
        <CardesChat />
        <Footer />
      </div>

    </div>
  );
};

export default App;
