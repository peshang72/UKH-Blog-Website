import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";
import { BrowserRouter, useNavigate } from "react-router-dom";

// Mock localStorage
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key]),
    setItem: vi.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock useNavigate while preserving other exports
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("Navbar Component", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders navigation links", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText("My Blogs")).toHaveAttribute("href", "/my-blogs");
    expect(screen.getByText("Create Post")).toHaveAttribute(
      "href",
      "/post-blog"
    );
  });

  it("has logout functionality", () => {
    // Create a mock navigate function
    const mockNavigate = vi.fn();

    // Override useNavigate mock for this test
    vi.mocked(useNavigate).mockImplementation(() => mockNavigate);

    // Set auth data
    window.localStorage.setItem("authToken", "test-token");
    window.localStorage.setItem("userData", "{}");

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Logout"));
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("authToken");
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("userData");
    expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
  });
});
