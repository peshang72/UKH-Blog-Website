import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import * as routerDom from "react-router-dom";

vi.mock("axios");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(() => ({
      state: { from: { pathname: "/protected" } },
    })),
  };
});

describe("Login Component", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    routerDom.useNavigate.mockImplementation(() => mockNavigate);
  });

  it("renders login form correctly", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Use regex for partial text matching
    expect(screen.getByText(/Welcome Back/)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("student@ukh.edu.krd")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/ })).toBeInTheDocument();
  });

  it("validates email format", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("student@ukh.edu.krd");

    // Test invalid email
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    expect(emailInput).toBeInvalid();
    expect(emailInput.validationMessage).not.toBe("");

    // Test valid email
    fireEvent.change(emailInput, { target: { value: "valid@ukh.edu.krd" } });
    expect(emailInput).toBeValid();
  });

  it("handles successful login", async () => {
    const mockResponse = {
      data: {
        token: "test-token",
        user: { id: 1, name: "Test User" },
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("student@ukh.edu.krd"), {
      target: { value: "valid@ukh.edu.krd" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/ }));

    // Check if loading state appears
    await waitFor(() => {
      expect(screen.getByText(/Authenticating/)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(localStorage.getItem("authToken")).toBe("test-token");
      expect(localStorage.getItem("userData")).toBe(
        JSON.stringify(mockResponse.data.user)
      );
      expect(mockNavigate).toHaveBeenCalledWith("/protected", {
        replace: true,
      });
    });
  });

  it("handles login errors", async () => {
    axios.post.mockRejectedValue({
      response: { data: { message: "Invalid credentials" } },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("student@ukh.edu.krd"), {
      target: { value: "valid@ukh.edu.krd" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "wrong-password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/ }));

    // Check if error message appears
    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();

    // Loading state should disappear
    expect(screen.queryByText(/Authenticating/)).not.toBeInTheDocument();
  });
});
