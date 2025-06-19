// ButtonPrimary.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import ButtonPrimary from "./ButtonPrimary";

describe("ButtonPrimary Component", () => {
  it("renders as link when route is provided", () => {
    render(<ButtonPrimary route="/test">Click me</ButtonPrimary>);
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
  });

  it("applies custom classes", () => {
    render(<ButtonPrimary className="custom-class">Test</ButtonPrimary>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });
});
