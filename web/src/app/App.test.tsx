import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppRouter } from "./AppRouter";

describe("AppRouter", () => {
  it("renders the application loading shell", () => {
    render(<AppRouter />);
    expect(screen.getByText("Loading Sadhana Pro")).toBeInTheDocument();
  });
});
