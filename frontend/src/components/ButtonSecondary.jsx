import React from "react";
import { Link } from "react-router-dom";

function ButtonSecondary({ children, route }) {
  return (
    <Link
      to={route}
      href="#"
      className="bg-white visited:bg-white text-primary rounded-full text-xl font-semibold py-3 px-5 hover:bg-gray-300 active:bg-gray-100 transition-all duration-300 truncate"
    >
      {children}
    </Link>
  );
}

export default ButtonSecondary;
