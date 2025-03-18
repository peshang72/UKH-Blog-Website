import React from "react";

function ButtonPrimary({ children }) {
  return (
    <a
      href="#"
      className="bg-primary visited:bg-primary text-white rounded-full text-xl font-semibold py-3 px-5 hover:bg-primary-400 active:bg-primary-400 transition-all duration-300 truncate"
    >
      {children}
    </a>
  );
}

export default ButtonPrimary;
