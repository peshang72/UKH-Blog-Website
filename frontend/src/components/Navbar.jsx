import React from "react";
import logo from "../assets/logo.png";
import Search from "./Search";

function Navbar() {
  return (
    <header className="bg-primary px-6 h-16 flex items-center justify-between shadow-xl">
      <img
        src={logo}
        alt="Logo of University of Kurdistan Hewler"
        className="py-1 w-1/24"
      />
      <Search />
      <a
        href="#"
        className="text-white font-semibold my-auto hover:text-gray-300"
      >
        Create Posts
      </a>
    </header>
  );
}

export default Navbar;
