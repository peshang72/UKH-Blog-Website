import React from "react";
import { Link } from "react-router-dom";

function ButtonPrimary({
  children,
  route,
  type,
  disabled,
  className,
  onClick,
  ...props
}) {
  const baseClasses =
    "bg-primary visited:bg-primary text-white rounded-full text-xl font-semibold py-3 px-5 hover:bg-primary-400 active:bg-primary-400 transition-all duration-300 truncate";
  const finalClasses = className ? `${baseClasses} ${className}` : baseClasses;

  // If route is provided, render as Link
  if (route) {
    return (
      <Link to={route} className={finalClasses} {...props}>
        {children}
      </Link>
    );
  }

  // Otherwise, render as button
  return (
    <button
      type={type || "button"}
      disabled={disabled}
      onClick={onClick}
      className={`${finalClasses} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

export default ButtonPrimary;
