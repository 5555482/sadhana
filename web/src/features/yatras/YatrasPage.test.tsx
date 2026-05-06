import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { YatrasPage } from "./YatrasPage";

describe("YatrasPage", () => {
  it("renders the original yatra grid workflow", () => {
    render(
      <MemoryRouter>
        <YatrasPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Yatras" })).toBeInTheDocument();
    expect(screen.getByLabelText("Yatra")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Sadhaka" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
      "href",
      "/yatra/morning-japa/settings"
    );
    expect(screen.getByRole("button", { name: "Create yatra" })).toBeInTheDocument();
  });
});
