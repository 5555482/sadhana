import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { TodayPage } from "./TodayPage";

const entries = [
  { practice: "Rounds", data_type: "Int" as const, dropdown_variants: null, value: { Int: 16 } },
  {
    practice: "Japa done",
    data_type: "Bool" as const,
    dropdown_variants: null,
    value: { Bool: true }
  },
  { practice: "Reading", data_type: "Text" as const, dropdown_variants: null, value: null }
];

describe("TodayPage", () => {
  it("uses the original Rust diary structure", () => {
    const { container } = render(
      <MemoryRouter>
        <TodayPage initialEntries={entries} />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Today" })).toHaveClass("sr-only");
    expect(screen.getByLabelText("Diary date strip")).toBeInTheDocument();
    expect(screen.queryByText("Daily entry")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Save changes" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Manage practices" })).not.toBeInTheDocument();

    expect(container.querySelector(".today-entry-grid")).toBeInTheDocument();
    expect(container.querySelector(".icon-rounds")).toBeTruthy();
    expect(container.querySelector(".icon-tick")).toBeTruthy();
    expect(container.querySelector(".icon-doc")).toBeTruthy();
  });

  it("keeps a useful empty state when no practices exist", () => {
    render(
      <MemoryRouter>
        <TodayPage />
      </MemoryRouter>
    );

    expect(screen.getByText("No practices yet")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Manage practices" })).not.toBeInTheDocument();
  });
});
