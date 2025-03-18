import React from "react";

function ButtonSecondary({ children }) {
  return (
    <a
      href="#"
      className="bg-white visited:bg-white text-primary rounded-full text-xl font-semibold py-3 px-5 hover:bg-gray-300 active:bg-gray-100 transition-all duration-300 truncate"
    >
      {children}
    </a>
  );
}

export default ButtonSecondary;
