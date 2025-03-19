import React from "react";
import CategoryCheckbox from "./CategoryCheckbox";

function Sidebar() {
  return (
    <div className="bg-gray-200 overflow-scroll">
      <h2 className="text-xl pt-6 pl-5 text-gray-800 font-semibold">
        Categories
      </h2>
      <ul className="ml-5 mt-3 flex flex-col gap-2">
        <li>
          <CategoryCheckbox>Peshang</CategoryCheckbox>
        </li>
        <li>
          <CategoryCheckbox>Anar</CategoryCheckbox>
        </li>
        <li>
          <CategoryCheckbox>Anar</CategoryCheckbox>
        </li>
        <li>
          <CategoryCheckbox>Anar</CategoryCheckbox>
        </li>
        <li>
          <CategoryCheckbox>Anar</CategoryCheckbox>
        </li>
        <li>
          <CategoryCheckbox>Anar</CategoryCheckbox>
        </li>
        <li>
          <CategoryCheckbox>Anar</CategoryCheckbox>
        </li>
        <li>
          <CategoryCheckbox>Anar</CategoryCheckbox>
        </li>
        <li>
          <CategoryCheckbox>Anar</CategoryCheckbox>
        </li>
        <li>
          <CategoryCheckbox>Anar</CategoryCheckbox>
        </li>
        <li>
          <CategoryCheckbox>Anar</CategoryCheckbox>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
