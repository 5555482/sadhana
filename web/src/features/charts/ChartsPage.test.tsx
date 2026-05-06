import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { ChartsPage } from "./ChartsPage";

describe("ChartsPage", () => {
  it("renders the reports controls with the original chart actions", () => {
    render(
      <MemoryRouter>
        <ChartsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Reports" })).toBeInTheDocument();
    expect(screen.getByLabelText("Report")).toBeInTheDocument();
    expect(screen.getByLabelText("Duration")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "New report" })).toHaveAttribute(
      "href",
      "/charts/new"
    );
    expect(screen.getByRole("button", { name: "Download CSV" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Share reports link" })).toBeInTheDocument();
  });
});
