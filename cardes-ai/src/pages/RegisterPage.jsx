import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

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
    <div className="flex justify-center items-center min-h-screen bg-[#343131] text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[#A04747] p-8 rounded-xl shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-center mb-4 text-[#EEDF7A]">
          Create an Account
        </h2>
        {error && <p className="text-red-300 text-center">{error}</p>}
        {success && <p className="text-green-300 text-center">{success}</p>}
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1 text-[#EEDF7A]">Username</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg border border-[#D8A25E] focus:outline-none focus:ring-2 focus:ring-[#EEDF7A] bg-[#343131] placeholder-gray-300 text-white"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-[#EEDF7A]">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-lg border border-[#D8A25E] focus:outline-none focus:ring-2 focus:ring-[#EEDF7A] bg-[#343131] placeholder-gray-300 text-white"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-[#EEDF7A]">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-lg border border-[#D8A25E] focus:outline-none focus:ring-2 focus:ring-[#EEDF7A] bg-[#343131] placeholder-gray-300 text-white"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-[#EEDF7A]">Confirm Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-lg border border-[#D8A25E] focus:outline-none focus:ring-2 focus:ring-[#EEDF7A] bg-[#343131] placeholder-gray-300 text-white"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-[#D8A25E] text-[#343131] font-semibold py-3 px-4 rounded-lg w-full hover:bg-[#EEDF7A] transition duration-300"
        >
          Register
        </button>
        <p className="text-center mt-4">
          Already have an account? {" "}
          <a href="/login" className="text-[#EEDF7A] hover:underline">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
