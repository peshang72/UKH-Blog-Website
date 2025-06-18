import React from "react";

function Pagination({ postsPerPage, totalPosts, paginate, currentPage }) {
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Don't show pagination if there's only one page or no posts
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      // If 7 or fewer pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 4) {
        // Current page is near the beginning
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Current page is near the end
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Current page is in the middle
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePrevious = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  const handlePageClick = (e, number) => {
    e.preventDefault();
    if (typeof number === "number") {
      paginate(number);
    }
  };

  return (
    <nav className="flex justify-center items-center mt-10 my-16 gap-6">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`flex justify-center items-center size-10 rounded-full transition-colors ${
          currentPage === 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-primary hover:bg-primary-300 active:bg-primary-300"
        }`}
      >
        <span className="material-symbols-outlined text-white">
          chevron_left
        </span>
      </button>

      <ul className="flex justify-center items-center">
        {pageNumbers.map((number, index) => (
          <li key={index}>
            {number === "..." ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <button
                onClick={(e) => handlePageClick(e, number)}
                className={`size-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-lg transition-colors ${
                  currentPage === number
                    ? "bg-primary text-white"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                {number}
              </button>
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`flex justify-center items-center size-10 rounded-full transition-colors ${
          currentPage === totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-primary hover:bg-primary-300 active:bg-primary-300"
        }`}
      >
        <span className="material-symbols-outlined text-white">
          chevron_right
        </span>
      </button>
    </nav>
  );
}

export default Pagination;
