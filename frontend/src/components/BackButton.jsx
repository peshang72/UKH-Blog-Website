import React from "react";

function BackButton({ className }) {
  return (
    <a
      className={`cursor-pointer flex items-center justify-center bg-primary visited:bg-primary rounded-full h-10 w-10 hover:bg-primary-300 active:bg-primary-300 transition-all duration-300 ${className}`}
    >
      <span className="material-symbols-outlined text-white ">arrow_back</span>
    </a>
  );
}

export default BackButton;
