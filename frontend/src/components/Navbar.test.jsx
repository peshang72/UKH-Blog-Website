// Navbar.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";
import { BrowserRouter } from "react-router-dom";

describe("Navbar Component", () => {
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
    const navigate = vi.fn();
    vi.mock("react-router-dom", async () => ({
      ...(await vi.importActual("react-router-dom")),
      useNavigate: () => navigate,
    }));

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Logout"));
    expect(localStorage.removeItem).toHaveBeenCalledWith("authToken");
    expect(localStorage.removeItem).toHaveBeenCalledWith("userData");
    expect(navigate).toHaveBeenCalledWith("/login", { replace: true });
  });
});
