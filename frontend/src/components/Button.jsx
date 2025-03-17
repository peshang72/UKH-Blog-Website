import React from "react";

function ButtonPrimary({ children, bgColor, bgHover, textColor }) {
  console.log(bgColor, bgHover);

  return (
    <button
      className={`bg-${bgColor} text-${textColor} rounded-full text-xl font-semibold py-3 px-5 hover:bg-${bgHover} transition-all duration-300`}
    >
      {children}
    </button>
  );
}

export default ButtonPrimary;
