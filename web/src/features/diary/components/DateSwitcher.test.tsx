import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DateSwitcher } from "./DateSwitcher";

describe("DateSwitcher", () => {
  it("renders the old weekly calendar strip around the selected date", () => {
    render(<DateSwitcher value="2026-05-06" onChange={vi.fn()} />);

    expect(screen.getByText("Wednesday, 6 May 2026")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Select Wednesday, 6 May 2026" })).toHaveClass(
      "is-selected"
    );
    expect(screen.getAllByRole("button", { name: /^Select / })).toHaveLength(9);
  });
});
