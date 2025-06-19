import { render, screen, fireEvent } from "@testing-library/react";
import ButtonPrimary from "./ButtonPrimary";
import { MemoryRouter } from "react-router-dom"; // Add MemoryRouter

describe("ButtonPrimary Component", () => {
  it("renders as link when route is provided", () => {
    render(
      <MemoryRouter>
        {" "}
        {/* Wrap in MemoryRouter */}
        <ButtonPrimary route="/test">Click me</ButtonPrimary>
      </MemoryRouter>
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/test");
  });

  it("renders as button when no route", () => {
    const handleClick = vi.fn();
    render(<ButtonPrimary onClick={handleClick}>Click me</ButtonPrimary>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalled();
  });

  it("shows disabled state", () => {
    render(<ButtonPrimary disabled={true}>Disabled</ButtonPrimary>);
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveClass("opacity-50");
    expect(screen.getByRole("button")).toHaveClass("cursor-not-allowed");
  });

  it("applies custom classes to link", () => {
    render(
      <MemoryRouter>
        {" "}
        {/* Wrap in MemoryRouter */}
        <ButtonPrimary route="/" className="custom-class">
          Test
        </ButtonPrimary>
      </MemoryRouter>
    );
    expect(screen.getByRole("link")).toHaveClass("custom-class");
  });

  it("applies custom classes to button", () => {
    render(<ButtonPrimary className="custom-class">Test</ButtonPrimary>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });
});
