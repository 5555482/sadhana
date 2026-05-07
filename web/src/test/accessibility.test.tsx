import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { TodayPage } from "../features/diary/TodayPage";

describe("TodayPage accessibility", () => {
  it("renders a single h1 and a save button", () => {
    const { container } = render(
      <MemoryRouter>
        <TodayPage />
      </MemoryRouter>
    );

    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(container.querySelector('button[type="button"]')).not.toBeNull();
  });
});
