import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TodayPage } from "./TodayPage";

describe("TodayPage", () => {
  it("shows the quick entry heading and save button", () => {
    render(<TodayPage />);

    expect(screen.getByRole("heading", { name: "Today" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });
});
