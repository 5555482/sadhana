import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("renders a sidebar with calendar and settings at the bottom", () => {
    render(
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>
    );
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByLabelText("Diary date strip")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Today" })).toHaveAttribute("href", "/");
    expect(
      screen.getByRole("link", { name: "Today" }).querySelector(".icon-home-solid")
    ).toBeTruthy();
    expect(
      within(screen.getByLabelText("Sidebar footer")).getByRole("link", { name: "Settings" })
    ).toHaveAttribute("href", "/settings");
    expect(screen.getByAltText("Sadhana Pro")).toHaveAttribute("src", "/images/logo.png");
  });
});
