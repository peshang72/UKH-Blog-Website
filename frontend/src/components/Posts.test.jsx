import { render, screen } from "@testing-library/react";
import Posts from "./Posts";
import { MemoryRouter } from "react-router-dom"; // Add this import

describe("Posts Component", () => {
  const mockPosts = [
    { _id: "1", title: "Post 1" },
    { _id: "2", title: "Post 2" },
    { _id: "3", title: "Post 3" }, // Add third post for proper divider test
  ];

  it("shows loading state", () => {
    render(<Posts loading={true} />);
    expect(screen.getByText("Loading blogs...")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<Posts posts={[]} loading={false} />);
    expect(screen.getByText("No blogs found.")).toBeInTheDocument();
  });

  it("renders blog cards", () => {
    render(
      <MemoryRouter>
        {" "}
        {/* Wrap with MemoryRouter */}
        <Posts posts={mockPosts} loading={false} />
      </MemoryRouter>
    );
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 2")).toBeInTheDocument();
  });

  it("renders correct number of dividers", () => {
    render(
      <MemoryRouter>
        {" "}
        {/* Wrap with MemoryRouter */}
        <Posts posts={mockPosts} loading={false} />
      </MemoryRouter>
    );
    const dividers = screen.getAllByRole("separator");
    expect(dividers).toHaveLength(mockPosts.length - 1); // Correct number of dividers
  });
});
