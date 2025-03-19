import React from "react";

function Search({ className }) {
  return (
    <div
      className={`flex items-center rounded-3xl p-2 bg-gray-200 text-gray-900 gap-4 w-lg focus-within:ring-2 focus-within:ring-gray-500 transition-all duration-300 ${className}`}
    >
      <span className="material-symbols-outlined text-gray-500">search</span>
      <input
        type="search"
        name=""
        id=""
        placeholder="Search Blogs..."
        className="text-lg outline-none bg-transparent flex-1 placeholder:text-gray-500"
      />
    </div>
  );
}

export default Search;
