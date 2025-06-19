import { render, screen } from "@testing-library/react";
import ButtonSecondary from "./ButtonSecondary";
import { MemoryRouter } from "react-router-dom";

describe("ButtonSecondary Component", () => {
  it("renders as link with correct route", () => {
    render(
      <MemoryRouter>
        <ButtonSecondary route="/test">Click</ButtonSecondary>
      </MemoryRouter>
    );

    expect(screen.getByRole("link")).toHaveAttribute("href", "/test");
    expect(screen.getByText("Click")).toBeInTheDocument();
  });

  it("applies correct styling", () => {
    render(
      <MemoryRouter>
        <ButtonSecondary route="/">Test</ButtonSecondary>
      </MemoryRouter>
    );

    const button = screen.getByRole("link");
    expect(button).toHaveClass("bg-white");
    expect(button).toHaveClass("text-primary");
    expect(button).toHaveClass("rounded-full");
  });
});
