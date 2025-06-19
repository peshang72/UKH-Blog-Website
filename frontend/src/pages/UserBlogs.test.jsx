import { render, screen, waitFor, within } from "@testing-library/react";
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

    // Get all stat boxes
    const statBoxes = await screen.findAllByRole("heading", {
      name: /(Total Posts|Published|Pending)/,
    });

    // Verify stats by checking each box individually
    const totalPostsBox = statBoxes[0].closest("div");
    expect(within(totalPostsBox).getByText("2")).toBeInTheDocument();

    const publishedBox = statBoxes[1].closest("div");
    expect(within(publishedBox).getByText("1")).toBeInTheDocument();

    const pendingBox = statBoxes[2].closest("div");
    expect(within(pendingBox).getByText("1")).toBeInTheDocument();

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
