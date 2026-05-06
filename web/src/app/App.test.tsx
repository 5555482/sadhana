import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppRouter } from "./AppRouter";

describe("AppRouter", () => {
  it("renders the today route as the first app screen", () => {
    render(<AppRouter />);
    expect(screen.getByRole("heading", { name: "Today" })).toBeInTheDocument();
  });
});
