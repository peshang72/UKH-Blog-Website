import { render, screen, waitFor } from "@testing-library/react";
import BrowseBlogs from "./BrowseBlogs";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

vi.mock("axios");

describe("BrowseBlogs Component", () => {
  const mockPosts = [
    { _id: "1", title: "Test Blog 1" },
    { _id: "2", title: "Test Blog 2" },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockPosts });
  });

  it("loads and displays blogs", async () => {
    render(
      <MemoryRouter>
        <BrowseBlogs />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Blog 1")).toBeInTheDocument();
    });
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("shows loading state", async () => {
    render(
      <MemoryRouter>
        <BrowseBlogs />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading blogs...")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Loading blogs...")).not.toBeInTheDocument();
    });
  });

  it("handles API errors", async () => {
    axios.get.mockRejectedValue(new Error("Network Error"));
    render(
      <MemoryRouter>
        <BrowseBlogs />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading blogs/)).toBeInTheDocument();
    });
  });
});
