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

const requiredEntries = [
  {
    practice: "Rounds",
    data_type: "Int" as const,
    dropdown_variants: null,
    is_required: true,
    value: null
  },
  {
    practice: "Reading",
    data_type: "Text" as const,
    dropdown_variants: null,
    is_required: false,
    value: null
  }
];

describe("TodayPage", () => {
  it("uses the original Rust diary structure", () => {
    const { container } = render(
      <MemoryRouter>
        <TodayPage initialEntries={entries} />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Today" })).toHaveClass("sr-only");
    expect(screen.queryByText("Daily entry")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Save changes" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Manage practices" })).not.toBeInTheDocument();

    expect(container.querySelector(".today-entry-grid")).toBeInTheDocument();
    expect(container.querySelector(".icon-rounds")).toBeTruthy();
    expect(container.querySelector(".icon-tick")).toBeTruthy();
    expect(container.querySelector(".icon-doc")).toBeTruthy();
  });

  it("shows core default practice fields when no entries are provided", () => {
    render(
      <MemoryRouter>
        <TodayPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText("Total Rounds")).toBeInTheDocument();
    expect(screen.getByLabelText("Rounds by 7am")).toBeInTheDocument();
    expect(screen.getByLabelText("Wake up time")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to sleep time")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Manage practices" })).not.toBeInTheDocument();
  });

  it("marks required missing practices as incomplete for past diary dates", () => {
    render(
      <MemoryRouter>
        <TodayPage initialEntries={requiredEntries} initialSelectedDate="2026-05-06" />
      </MemoryRouter>
    );

    const rounds = screen.getByLabelText("Rounds");
    expect(rounds).toHaveAttribute("aria-invalid", "true");
    expect(rounds.closest(".practice-field")).toHaveClass("is-incomplete");
    expect(screen.getByLabelText("Reading").closest(".practice-field")).not.toHaveClass(
      "is-incomplete"
    );
  });

  it("does not mark required missing practices incomplete for today", () => {
    render(
      <MemoryRouter>
        <TodayPage initialEntries={requiredEntries} initialSelectedDate="2026-05-07" />
      </MemoryRouter>
    );

    expect(screen.getByLabelText("Rounds")).not.toHaveAttribute("aria-invalid", "true");
  });
});
