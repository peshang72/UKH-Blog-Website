import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminLogin from "./AdminLogin";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import * as routerDom from "react-router-dom";

vi.mock("axios");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("AdminLogin Component", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    routerDom.useNavigate.mockImplementation(() => mockNavigate);
  });

  it("renders login form correctly", () => {
    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    );

    expect(screen.getByText("Admin Portal")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("admin@ukh.edu.krd")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign In as Admin/ })
    ).toBeInTheDocument();
    expect(screen.getByText("Student Login")).toBeInTheDocument();
  });

  it("handles successful admin login", async () => {
    const mockResponse = {
      data: {
        token: "admin-token",
        user: {
          id: 1,
          role: "admin",
          firstName: "Admin",
          lastName: "User",
        },
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("admin@ukh.edu.krd"), {
      target: { value: "admin@ukh.edu.krd" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "admin-password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In as Admin/ }));

    // Check if loading state appears
    await waitFor(() => {
      expect(screen.getByText(/Authenticating/)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(localStorage.getItem("authToken")).toBe("admin-token");
      expect(localStorage.getItem("userData")).toBe(
        JSON.stringify(mockResponse.data.user)
      );
      expect(mockNavigate).toHaveBeenCalledWith("/admin/dashboard");
    });
  });

  it("rejects non-admin users", async () => {
    const mockResponse = {
      data: {
        token: "user-token",
        user: {
          id: 2,
          role: "user",
          firstName: "Regular",
          lastName: "User",
        },
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("admin@ukh.edu.krd"), {
      target: { value: "user@ukh.edu.krd" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "user-password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In as Admin/ }));

    expect(
      await screen.findByText("Access denied. Admin privileges required.")
    ).toBeInTheDocument();
    expect(localStorage.getItem("authToken")).toBeNull();
  });

  it("handles invalid credentials", async () => {
    axios.post.mockRejectedValue({
      response: { data: { message: "Invalid credentials" } },
    });

    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("admin@ukh.edu.krd"), {
      target: { value: "admin@ukh.edu.krd" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "wrong-password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In as Admin/ }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });

  it("handles network errors", async () => {
    axios.post.mockRejectedValue({
      request: {}, // Simulate network error
    });

    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("admin@ukh.edu.krd"), {
      target: { value: "admin@ukh.edu.krd" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "admin-password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In as Admin/ }));

    expect(
      await screen.findByText("Network error. Please try again.")
    ).toBeInTheDocument();
  });

  it("redirects to student login", async () => {
    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    );

    const studentLoginLink = screen.getByText("Student Login");
    expect(studentLoginLink).toHaveAttribute("href", "/login");
  });
});
