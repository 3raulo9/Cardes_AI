import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { FiUserPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";

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
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.error || "Registration failed. Please try again."
      );
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const { data } = await axiosInstance.post("/api/google-register/", { token });
      localStorage.setItem("accessToken", data.accessToken);
      setSuccess("Registration successful via Google! Redirecting...");
      setError("");
      setTimeout(() => navigate("/categories"), 2000);
    } catch (error) {
      console.error("Google registration error:", error);
      setError("Google registration failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    setError("Google Sign In was unsuccessful. Please try again later.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-primary to-accent text-white">
      <header className="relative z-10">
        <div className="bg-secondary px-6 py-4 flex items-center justify-center shadow-md">
          <h1 className="text-3xl font-bold cursor-pointer transition hover:text-gray-300">
            <Link to="/">Cardes AI</Link>
          </h1>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-darkAccent p-8 rounded-2xl shadow-lg max-w-md w-full space-y-6 text-center border border-gray-600"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Create an Account</h2>
          
          {error && (
            <p className="text-red-400 text-center p-2 rounded-md border border-red-400">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-400 text-center p-2 rounded-md border border-green-400">
              {success}
            </p>
          )}
          
          <div className="space-y-5">
            <div>
              <label className="block font-semibold mb-1 text-accent">
                Username
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-lg border border-gray-500 bg-primary placeholder-gray-300 text-white focus:ring-2 focus:ring-accent focus:outline-none transition duration-200"
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
                className="w-full p-3 rounded-lg border border-gray-500 bg-primary placeholder-gray-300 text-white focus:ring-2 focus:ring-accent focus:outline-none transition duration-200"
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
                className="w-full p-3 rounded-lg border border-gray-500 bg-primary placeholder-gray-300 text-white focus:ring-2 focus:ring-accent focus:outline-none transition duration-200"
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
                className="w-full p-3 rounded-lg border border-gray-500 bg-primary placeholder-gray-300 text-white focus:ring-2 focus:ring-accent focus:outline-none transition duration-200"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-accent text-darkAccent font-semibold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-secondary transition duration-300"
          >
            <FiUserPlus className="mr-2" /> Register
          </button>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-gray-500" />
            <span className="mx-2 text-gray-300">Or</span>
            <hr className="flex-grow border-t border-gray-500" />
          </div>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />

          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-accent hover:underline">
              Login here
            </Link>
          </p>
        </motion.form>
      </main>
    </div>
  );
};

export default Register;
