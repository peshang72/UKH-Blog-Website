// Pagination.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./Pagination";

describe("Pagination Component", () => {
  const mockPaginate = vi.fn();

  it("does not render when totalPages <= 1", () => {
    render(
      <Pagination
        postsPerPage={10}
        totalPosts={5}
        paginate={mockPaginate}
        currentPage={1}
      />
    );
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("renders correctly with more than 1 page", () => {
    render(
      <Pagination
        postsPerPage={5}
        totalPosts={25}
        paginate={mockPaginate}
        currentPage={1}
      />
    );

    expect(screen.getByLabelText("Previous page")).toBeInTheDocument();
    expect(screen.getByLabelText("Next page")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("disables previous button on first page", () => {
    render(
      <Pagination
        postsPerPage={5}
        totalPosts={25}
        paginate={mockPaginate}
        currentPage={1}
      />
    );

    expect(screen.getByLabelText("Previous page")).toBeDisabled();
  });

  it("disables next button on last page", () => {
    render(
      <Pagination
        postsPerPage={5}
        totalPosts={25}
        paginate={mockPaginate}
        currentPage={5}
      />
    );

    expect(screen.getByLabelText("Next page")).toBeDisabled();
  });

  it("calls paginate with correct page number", () => {
    render(
      <Pagination
        postsPerPage={5}
        totalPosts={25}
        paginate={mockPaginate}
        currentPage={1}
      />
    );

    fireEvent.click(screen.getByText("3"));
    expect(mockPaginate).toHaveBeenCalledWith(3);
  });

  it("renders ellipsis correctly for large page counts", () => {
    render(
      <Pagination
        postsPerPage={5}
        totalPosts={100}
        paginate={mockPaginate}
        currentPage={10}
      />
    );

    const ellipses = screen.getAllByText("...");
    expect(ellipses.length).toBe(2); // Updated: expect 2 ellipses

    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });
});
