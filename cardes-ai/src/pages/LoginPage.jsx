import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import { motion } from "framer-motion"; // Animation Library
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import Loader from "../components/Loader"; // Import the loader component

const Login = ({ setAuthToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const response = await axiosInstance.post("/api/login/", {
        username,
        password,
      });
      const accessToken = response.data.access;
      localStorage.setItem("accessToken", accessToken);
      setAuthToken(accessToken);
      setTimeout(() => {
        setLoading(false);
        navigate("/chat");
      }, 2000);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError("Invalid username or password.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");
      setLoading(true);
      const token = credentialResponse.credential;
      // Send the Google token to your backend endpoint for login
      const { data } = await axiosInstance.post("/api/google-login/", { token });
      localStorage.setItem("accessToken", data.accessToken);
      setAuthToken(data.accessToken);
      setTimeout(() => {
        setLoading(false);
        navigate("/chat");
      }, 2000);
    } catch (error) {
      console.error("Google login error:", error);
      setLoading(false);
      setError("Google login failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    setError("Google Sign In was unsuccessful. Please try again later.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-primary to-accent text-white relative">
      {/* Conditionally render the loader overlay */}
      {loading && <Loader />}
      
      <header className="relative z-10">
        <div className="bg-secondary px-6 py-4 flex items-center justify-center shadow-md">
          <h1 className="text-3xl font-bold cursor-pointer transition hover:text-gray-300">
            <Link to="/">Cardes</Link>
          </h1>
        </div>
      </header>

      {/* LOGIN FORM CARD */}
      <main className="flex flex-1 items-center justify-center p-6 relative z-10">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-darkAccent p-8 rounded-2xl shadow-lg max-w-md w-full space-y-6 text-center border border-gray-600"
        >
          <h2 className="text-3xl font-bold text-white">Welcome Back!</h2>
          {error && <p className="text-red-400 text-center">{error}</p>}

          {/* INPUT FIELDS */}
          <div className="space-y-5">
            <div>
              <label className="block font-semibold mb-1 text-accent">
                Username
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-lg border border-gray-500 bg-primary placeholder-gray-300 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-accent">
                Password
              </label>
              <input
                type="password"
                className="w-full p-3 rounded-lg border border-gray-500 bg-primary placeholder-gray-300 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full bg-accent text-darkAccent font-semibold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-secondary transition duration-300"
          >
            <FiLogIn className="mr-2" /> Log In
          </button>

          {/* OR DIVIDER */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-gray-500" />
            <span className="mx-2 text-gray-300">Or</span>
            <hr className="flex-grow border-t border-gray-500" />
          </div>

          {/* GOOGLE LOGIN BUTTON */}
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />

          {/* REGISTER LINK */}
          <p className="text-center mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-accent hover:underline">
              Register here
            </Link>
          </p>
        </motion.form>
      </main>
    </div>
  );
};

export default Login;
