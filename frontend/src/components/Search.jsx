import React from "react";

function Search() {
  return (
    <div className="max-w-max flex items-center rounded-3xl p-3 bg-gray-200 text-gray-900 gap-4 w-9xl">
      <span className="material-symbols-outlined">search</span>
      <input
        type="search"
        name=""
        id=""
        placeholder="Search..."
        className="text-lg outline-none bg-transparent flex-1"
      />
    </div>
  );
}

export default Search;
