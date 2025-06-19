import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BlogPost from "./BlogPost";
import axios from "axios";
import {
  MemoryRouter,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import "quill/dist/quill.snow.css";
import { vi } from "vitest";

// Mock image imports
vi.mock("../assets/programming-img.jpg", () => ({
  default: "programming-img.jpg",
}));

vi.mock("../assets/avatar.jpg", () => ({
  default: "avatar.jpg",
}));

// Create a mock navigate function we can track
const mockNavigate = vi.fn();

// Mock components
vi.mock("../components/Navbar", () => ({
  default: () => <div>Navbar Mock</div>,
}));

vi.mock("../components/BackButton", () => ({
  default: ({ route }) => (
    <button onClick={() => mockNavigate(route)}>Back Button</button>
  ),
}));

vi.mock("../components/BlogCard", () => ({
  default: ({ blog }) => <div>{blog.title}</div>,
}));

// Mock dependencies
vi.mock("axios");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(() => mockNavigate),
  };
});

describe("BlogPost Component", () => {
  const mockBlog = {
    _id: "123",
    title: "Test Blog Post",
    category: "Technology",
    blogDescription: "This is a test blog description",
    content: "<p>This is the blog content</p>",
    author: {
      firstName: "John",
      lastName: "Doe",
    },
    createdAt: "2023-01-01T00:00:00Z",
    coverImage: {
      data: "base64imagedata",
      contentType: "image/jpeg",
    },
    imgCaption: "Test image caption",
  };

  const mockRelatedBlogs = [
    {
      _id: "456",
      title: "Related Blog 1",
      category: "Technology",
      blogDescription: "Related blog description",
      author: { firstName: "Jane", lastName: "Smith" },
      createdAt: "2023-01-02T00:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({ id: "123" });

    axios.get.mockImplementation((url) => {
      if (url.includes("/123")) {
        return Promise.resolve({ data: mockBlog });
      }
      if (url.endsWith("/api/blogs")) {
        return Promise.resolve({ data: mockRelatedBlogs });
      }
      return Promise.reject(new Error("API not mocked"));
    });
  });

  it("shows loading state", () => {
    axios.get.mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={["/blog-post/123"]}>
        <Routes>
          <Route path="/blog-post/:id" element={<BlogPost />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Loading blog...")).toBeInTheDocument();
  });

  it("handles error state", async () => {
    axios.get.mockRejectedValueOnce(new Error("Blog not found"));

    render(
      <MemoryRouter initialEntries={["/blog-post/123"]}>
        <Routes>
          <Route path="/blog-post/:id" element={<BlogPost />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Blog not found|Failed to fetch blog/)
      ).toBeInTheDocument();
    });
  });

  it("displays blog content successfully", async () => {
    render(
      <MemoryRouter initialEntries={["/blog-post/123"]}>
        <Routes>
          <Route path="/blog-post/:id" element={<BlogPost />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Blog Post")).toBeInTheDocument();
    });

    expect(screen.getByText("Technology")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test blog description")
    ).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("January 1, 2023")).toBeInTheDocument();
    expect(screen.getByText("Test image caption")).toBeInTheDocument();
    expect(screen.getByText("Related Posts")).toBeInTheDocument();
  });

  it("uses default avatar when no author image", async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes("/123")) {
        return Promise.resolve({
          data: {
            ...mockBlog,
            author: null,
          },
        });
      }
      return Promise.resolve({ data: mockRelatedBlogs });
    });

    render(
      <MemoryRouter initialEntries={["/blog-post/123"]}>
        <Routes>
          <Route path="/blog-post/:id" element={<BlogPost />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const avatarImg = screen.getByAltText("Profile image");
      expect(avatarImg).toHaveAttribute("src", "avatar.jpg");
    });
  });

  it("uses default cover image when no cover image data", async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes("/123")) {
        return Promise.resolve({
          data: {
            ...mockBlog,
            coverImage: null,
            imgCaption: null,
          },
        });
      }
      return Promise.resolve({ data: mockRelatedBlogs });
    });

    render(
      <MemoryRouter initialEntries={["/blog-post/123"]}>
        <Routes>
          <Route path="/blog-post/:id" element={<BlogPost />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const coverImg = screen.getByAltText("Blog cover image");
      expect(coverImg).toHaveAttribute("src", "programming-img.jpg");
    });
  });

  it("handles back button navigation", async () => {
    render(
      <MemoryRouter initialEntries={["/blog-post/123"]}>
        <Routes>
          <Route path="/blog-post/:id" element={<BlogPost />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for content to load
    await screen.findByText("Test Blog Post");

    fireEvent.click(screen.getByText("Back Button"));
    expect(mockNavigate).toHaveBeenCalledWith("/browse-blogs");
  });

  it("displays unknown author when no author info", async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes("/123")) {
        return Promise.resolve({
          data: {
            ...mockBlog,
            author: null,
          },
        });
      }
      return Promise.resolve({ data: mockRelatedBlogs });
    });

    render(
      <MemoryRouter initialEntries={["/blog-post/123"]}>
        <Routes>
          <Route path="/blog-post/:id" element={<BlogPost />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Unknown Author")).toBeInTheDocument();
    });
  });
});
