import React from "react";
import { Link } from "react-router-dom";

function ButtonPrimary({ children, route }) {
  return (
    <Link
      to={route}
      href="#"
      className="bg-primary visited:bg-primary text-white rounded-full text-xl font-semibold py-3 px-5 hover:bg-primary-400 active:bg-primary-400 transition-all duration-300 truncate"
    >
      {children}
    </Link>
  );
}

export default ButtonPrimary;
