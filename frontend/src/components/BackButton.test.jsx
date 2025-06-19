import { render, screen } from "@testing-library/react";
import BackButton from "./BackButton";
import { MemoryRouter } from "react-router-dom";

describe("BackButton Component", () => {
  it("renders link with correct route", () => {
    render(
      <MemoryRouter>
        <BackButton route="/home" />
      </MemoryRouter>
    );

    expect(screen.getByRole("link")).toHaveAttribute("href", "/home");
    expect(screen.getByText("arrow_back")).toBeInTheDocument();
  });

  it("applies custom classes", () => {
    render(
      <MemoryRouter>
        <BackButton className="custom-class" route="/" />
      </MemoryRouter>
    );

    expect(screen.getByRole("link")).toHaveClass("custom-class");
  });
});
