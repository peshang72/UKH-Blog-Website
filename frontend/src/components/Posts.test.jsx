// Posts.test.jsx
import { render, screen } from "@testing-library/react";
import Posts from "./Posts";

describe("Posts Component", () => {
  const mockPosts = [
    { _id: "1", title: "Post 1" },
    { _id: "2", title: "Post 2" },
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
    render(<Posts posts={mockPosts} loading={false} />);
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 2")).toBeInTheDocument();
  });

  it("renders correct number of dividers", () => {
    render(<Posts posts={mockPosts} loading={false} />);
    const dividers = screen.getAllByRole("separator");
    expect(dividers).toHaveLength(1); // Only between posts
  });
});
