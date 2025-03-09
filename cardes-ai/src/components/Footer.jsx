import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <footer className="relative bg-gradient-to-r from-primary to-accent text-center pt-14 sm:pt-20 pb-6 sm:pb-10">
      {/* Transparent reversed wave on top */}
      <div className="pointer-events-none absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180 -mt-px">
        <svg
          className="block w-full h-14 sm:h-20 md:h-32"
          viewBox="0 0 120 28"
          preserveAspectRatio="none"
        >
          <path
            d="M0,20 C40,40 80,0 120,20 L120,30 L0,30 Z"
            fill="currentColor"
            className="text-darkAccent"
          />
        </svg>
      </div>

      <div className="px-4 sm:px-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Follow Us</h3>

        <div className="flex justify-center space-x-6 text-gray-300 text-2xl">
          <a
            href="https://www.linkedin.com/in/raul-asadov/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="hover:text-white transition cursor-pointer" />
          </a>
        </div>

        {/* Conditional Button */}
        {isLandingPage ? (
          <div className="mt-6">
            <Link
              to="/about"
              className="px-6 py-2 bg-primary text-white font-semibold rounded-full shadow-md hover:bg-darkAccent transition duration-300"
            >
              About Us
            </Link>
          </div>
        ) : (
          <div className="mt-10 text-center">
            <Link
              to="/"
              className="inline-block px-6 py-2 bg-primary text-white font-semibold rounded-full shadow-md hover:bg-darkAccent transition duration-300"
            >
              Go Home
            </Link>
          </div>
        )}

        <p className="mt-4 text-white text-sm sm:text-base">
          &copy; 2025 Cardes AI | Created by Raul Asadov. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
