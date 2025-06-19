import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "./Register";
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

describe("Register Component", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    routerDom.useNavigate.mockImplementation(() => mockNavigate);
  });

  const fillForm = () => {
    fireEvent.change(screen.getByPlaceholderText("John"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Doe"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("johndoe"), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByPlaceholderText("student@ukh.edu.krd"), {
      target: { value: "john@ukh.edu.krd" },
    });

    // Get password inputs by their labels
    const passwordInputs = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(passwordInputs[0], {
      target: { value: "password123" },
    });
    fireEvent.change(passwordInputs[1], {
      target: { value: "password123" },
    });
  };

  it("renders registration form correctly", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByText(/Join/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("John")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("johndoe")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("student@ukh.edu.krd")
    ).toBeInTheDocument();

    // Verify both password fields exist
    const passwordInputs = screen.getAllByPlaceholderText("••••••••");
    expect(passwordInputs.length).toBe(2);

    expect(
      screen.getByRole("button", { name: /Create Account/ })
    ).toBeInTheDocument();
  });

  it("validates password match", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // Fill all required fields
    fireEvent.change(screen.getByPlaceholderText("John"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Doe"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("johndoe"), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByPlaceholderText("student@ukh.edu.krd"), {
      target: { value: "john@ukh.edu.krd" },
    });

    // Get password inputs by index
    const passwordInputs = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(passwordInputs[0], {
      target: { value: "password123" },
    });
    fireEvent.change(passwordInputs[1], {
      target: { value: "different" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create Account/ }));

    // Check if error message appears
    expect(
      await screen.findByText("Passwords do not match")
    ).toBeInTheDocument();
  });

  it("validates email format", () => {
    render(
      <MemoryRouter>
        <Register />
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

  it("handles successful registration", async () => {
    const mockResponse = {
      data: {
        token: "test-token",
        user: { id: 1, name: "Test User" },
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fillForm();

    fireEvent.click(screen.getByRole("button", { name: /Create Account/ }));

    // Check if loading state appears
    await waitFor(() => {
      expect(screen.getByText(/Creating Account/)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(localStorage.getItem("authToken")).toBe("test-token");
      expect(localStorage.getItem("userData")).toBe(
        JSON.stringify(mockResponse.data.user)
      );
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("handles registration errors", async () => {
    axios.post.mockRejectedValue({
      response: { data: { message: "Email already exists" } },
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fillForm();

    fireEvent.click(screen.getByRole("button", { name: /Create Account/ }));

    // Check if error message appears
    expect(await screen.findByText("Email already exists")).toBeInTheDocument();

    // Loading state should disappear
    expect(screen.queryByText(/Creating Account/)).not.toBeInTheDocument();
  });

  it("shows network errors", async () => {
    axios.post.mockRejectedValue({
      request: {}, // Simulate network error
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fillForm();

    fireEvent.click(screen.getByRole("button", { name: /Create Account/ }));

    // Check for network error message
    expect(
      await screen.findByText("Network error. Please try again.")
    ).toBeInTheDocument();
  });
});
