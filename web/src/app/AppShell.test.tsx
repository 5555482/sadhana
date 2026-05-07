import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("renders a sidebar calendar icon and settings menu at the bottom", async () => {
    render(
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>
    );
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByLabelText("Diary date strip")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sadhana Pro" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Today" })).toHaveAttribute("href", "/");
    expect(screen.queryByText("Today")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Today" }).querySelector(".icon-home-solid")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Manage practices" })).toHaveAttribute(
      "href",
      "/user/practices"
    );
    expect(screen.getByRole("link", { name: "Manage practices" }).querySelector(".icon-bars")).toBeTruthy();
    const calendarButton = screen.getByRole("button", { name: "Calendar" });
    expect(calendarButton.querySelector(".icon-calendar")).toBeTruthy();
    fireEvent.click(calendarButton);
    expect(screen.getByRole("dialog", { name: "Calendar" })).toBeInTheDocument();
    const settingsButton = within(screen.getByLabelText("Sidebar footer")).getByRole("button", {
      name: "Settings"
    });
    fireEvent.click(settingsButton);
    expect(screen.getByRole("menu", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "User details" })).toHaveAttribute(
      "href",
      "/settings/edit-user"
    );
    expect(screen.getByRole("menuitemcheckbox", { name: "Dark mode" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sadhana Pro" }).querySelector(".sidebar-logo")).toHaveAttribute(
      "src",
      "/images/logo.png"
    );
  });
});
