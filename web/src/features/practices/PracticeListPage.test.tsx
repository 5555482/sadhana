import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { PracticeListPage } from "./PracticeListPage";

describe("PracticeListPage", () => {
  it("renders a create practice action", () => {
    render(
      <MemoryRouter>
        <PracticeListPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Practices" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Add practice" })).toHaveAttribute(
      "href",
      "/user/practice/new"
    );
  });
});
