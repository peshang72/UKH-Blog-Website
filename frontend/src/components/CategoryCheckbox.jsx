import React from "react";

function CategoryCheckbox({ children, className }) {
  return (
    <div className={`${className}`}>
      <label class="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
        <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-600" />
        <span>{children}</span>
      </label>
    </div>
  );
}

export default CategoryCheckbox;
