import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LanguagePage } from "./LanguagePage";

describe("LanguagePage", () => {
  it("renders all three supported languages", () => {
    render(<LanguagePage />);

    expect(screen.getByRole("radio", { name: "English" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Russian" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Ukrainian" })).toBeInTheDocument();
  });
});
