import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FiUserPlus } from "react-icons/fi";
import { motion } from "framer-motion"; // Animation Library
import { Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axiosInstance.post("/api/register/", {
        username,
        email,
        password,
        confirm_password: confirmPassword,
      });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.error || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-primary to-accent text-white">
      <header className="relative z-10">
        <div className="bg-secondary px-6 py-4 flex items-center justify-center shadow-md">
          <h1 className="text-3xl font-bold cursor-pointer transition hover:text-gray-300">
            <Link to="/">Cardes AI</Link>
          </h1>{" "}
        </div>
      </header>

      {/* REGISTER FORM CARD */}
      <main className="flex flex-1 items-center justify-center p-6">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-darkAccent p-8 rounded-2xl shadow-lg max-w-md w-full space-y-6 text-center border border-gray-600"
        >
          <h2 className="text-3xl font-bold text-white">Create an Account</h2>
          {error && <p className="text-red-400 text-center">{error}</p>}
          {success && <p className="text-green-400 text-center">{success}</p>}

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
                Email
              </label>
              <input
                type="email"
                className="w-full p-3 rounded-lg border border-gray-500 bg-primary placeholder-gray-300 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <div>
              <label className="block font-semibold mb-1 text-accent">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full p-3 rounded-lg border border-gray-500 bg-primary placeholder-gray-300 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="w-full bg-accent text-darkAccent font-semibold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-secondary transition duration-300"
          >
            <FiUserPlus className="mr-2" /> Register
          </button>

          {/* LOGIN LINK */}
          <p className="text-center mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-accent hover:underline">
              Login here
            </a>
          </p>
        </motion.form>
      </main>
    </div>
  );
};

export default Register;
