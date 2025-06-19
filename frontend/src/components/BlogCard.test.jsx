// BlogCard.test.jsx
import { render, screen } from "@testing-library/react";
import BlogCard from "./BlogCard";
import { MemoryRouter } from "react-router-dom";

describe("BlogCard Component", () => {
  const mockBlog = {
    _id: "123",
    title: "Test Blog",
    blogDescription: "Test description",
    content: "<p>Test content</p>",
    author: {
      firstName: "John",
      lastName: "Doe",
    },
    category: "Technology",
    createdAt: "2023-01-01T00:00:00Z",
  };

  it("renders with default props", () => {
    render(
      <MemoryRouter>
        <BlogCard />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Programming is Hard But Designing is Harder")
    ).toBeInTheDocument();
    expect(screen.getByText("Author Name")).toBeInTheDocument();
  });

  it("renders with blog data", () => {
    render(
      <MemoryRouter>
        <BlogCard blog={mockBlog} />
      </MemoryRouter>
    );

    expect(screen.getByText("Test Blog")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Technology")).toBeInTheDocument();
  });

  it("strips HTML from content", () => {
    render(
      <MemoryRouter>
        <BlogCard blog={{ ...mockBlog, blogDescription: undefined }} />
      </MemoryRouter>
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("formats date correctly", () => {
    render(
      <MemoryRouter>
        <BlogCard blog={mockBlog} />
      </MemoryRouter>
    );

    expect(screen.getByText("JAN 1, 2023")).toBeInTheDocument();
  });

  it("conditionally renders divider", () => {
    const { rerender } = render(
      <MemoryRouter>
        <BlogCard blog={mockBlog} dividerDown={true} />
      </MemoryRouter>
    );
    expect(screen.getByRole("separator")).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <BlogCard blog={mockBlog} dividerDown={false} />
      </MemoryRouter>
    );
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
  });
});
