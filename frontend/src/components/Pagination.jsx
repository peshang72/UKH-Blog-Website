import React from "react";

function Pagination({ postsPerPage, totalPosts, paginate }) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  console.log(pageNumbers);

  return (
    <nav className="flex justify-center items-center mt-10 my-16 gap-6">
      <a
        href=""
        className="bg-primary visited:bg-primary hover:bg-primary-300 active:bg-primary-300 flex justify-center items-center size-10 rounded-full"
      >
        <span className="material-symbols-outlined text-white ">
          chevron_left
        </span>
      </a>
      <ul className="flex justify-center items-center">
        {pageNumbers.map((number) => (
          <li key={number}>
            <a
              href="#"
              onClick={() => paginate(number)}
              className={`size-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-800 text-lg focus:bg-primary focus:text-white`}
            >
              {number}
            </a>
          </li>
        ))}
      </ul>

      <a
        href=""
        className="bg-primary visited:bg-primary hover:bg-primary-300 active:bg-primary-300 flex justify-center items-center size-10 rounded-full"
      >
        <span className="material-symbols-outlined text-white">
          chevron_right
        </span>
      </a>
    </nav>
  );
}

export default Pagination;
