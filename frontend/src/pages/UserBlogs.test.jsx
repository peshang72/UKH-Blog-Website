// UserBlogs.test.jsx
import { render, screen, waitFor } from "@testing-library/react";
import UserBlogs from "./UserBlogs";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

vi.mock("axios");

describe("UserBlogs Component", () => {
  const mockUserBlogs = [
    {
      _id: "1",
      title: "My Blog 1",
      status: "approved",
      category: "Technology",
      blogDescription: "Description 1",
      createdAt: "2023-01-01T00:00:00Z",
    },
    {
      _id: "2",
      title: "My Blog 2",
      status: "pending",
      category: "Design",
      blogDescription: "Description 2",
      createdAt: "2023-01-02T00:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("authToken", "user-token");
    axios.get.mockResolvedValue({ data: mockUserBlogs });
  });

  it("displays user-specific blogs", async () => {
    render(
      <MemoryRouter>
        <UserBlogs />
      </MemoryRouter>
    );

    // Wait for the main heading to appear
    await waitFor(() => {
      expect(screen.getByText("My Blog Posts")).toBeInTheDocument();
    });

    // Verify stats using text patterns
    const totalPostsText = await screen.findByText(/Total Posts\s*2/);
    expect(totalPostsText).toBeInTheDocument();

    const publishedText = await screen.findByText(/Published\s*1/);
    expect(publishedText).toBeInTheDocument();

    const pendingText = await screen.findByText(/Pending\s*1/);
    expect(pendingText).toBeInTheDocument();

    // Verify blog list
    expect(await screen.findByText("My Blog 1")).toBeInTheDocument();
    expect(screen.getByText("My Blog 2")).toBeInTheDocument();
  });

  it("shows empty state when no blogs", async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <UserBlogs />
      </MemoryRouter>
    );

    // Wait for empty state to appear
    expect(await screen.findByText("No blog posts yet")).toBeInTheDocument();
    expect(screen.getByText("Create Your First Blog")).toBeInTheDocument();
  });
});
