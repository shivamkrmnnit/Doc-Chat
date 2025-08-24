import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="flex justify-between items-center bg-white px-8 py-2 shadow-sm border-b border-gray-500 sticky top-0 z-50">
      {/* Logo */}
      <Link
          to="/"
          className={`hover:text-purple-600 transition-colors ${
            isActive("/") ? "text-purple-600" : "text-gray-700"
          }`}
        >
      <div className="p-4 flex items-center">
          <img
            className="w-6 h-6"
            alt="DOC-Chat Logo"
            src="/images/docChatIcon-purple.png"
          />
          <div className="ml-3 text-xl font-bold text-black">
            DOC-Chat
          </div>
      </div>
        </Link>

      {/* Menu */}
      <div className="flex items-center space-x-6 text-sm font-semibold ">
        <Link
          to="/"
          className={`hover:text-purple-600 transition-colors ${
            isActive("/") ? "text-purple-600" : "text-gray-700"
          }`}
        >
          Home
        </Link>
        <Link
          to="/login"
          className={`hover:text-purple-600 transition-colors ${
            isActive("/login") ? "text-purple-600" : "text-gray-700"
          }`}
        >
          Login
        </Link>
        <Link
          to="/signup"
          className={`hover:text-purple-600 transition-colors ${
            isActive("/signup") ? "text-purple-600" : "text-gray-700"
          }`}
        >
          Signup
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
