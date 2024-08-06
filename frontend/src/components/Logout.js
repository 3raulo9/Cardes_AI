import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('accessToken');
    navigate('/login'); // Redirect to login page after logout
  }, [navigate]);

  return (
    <div className="auth-container">
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
