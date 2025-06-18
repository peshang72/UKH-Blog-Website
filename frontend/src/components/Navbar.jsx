import React from "react";
import logo from "../assets/logo-horizontal.png";
import Search from "./Search";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ className }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove authentication data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    // Redirect to login page
    navigate("/login", { replace: true });
  };

  return (
    <header
      className={`bg-primary px-6 h-16 flex items-center justify-between shadow-xl ${className}`}
    >
      <img
        src={logo}
        alt="Logo of University of Kurdistan Hewler"
        className="py-4 w-1/9"
      />
      <Search />
      <div className="flex items-center gap-4">
        <Link
          to="/my-blogs"
          className="text-white font-semibold my-auto hover:text-gray-300 text-lg"
        >
          My Blogs
        </Link>
        <Link
          to="/post-blog"
          className="text-white font-semibold my-auto hover:text-gray-300 text-lg"
        >
          Create Post
        </Link>
        <button
          onClick={handleLogout}
          className="text-white font-semibold hover:text-gray-300 text-lg px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
