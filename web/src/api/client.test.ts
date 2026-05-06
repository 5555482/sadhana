import { describe, expect, it } from "vitest";

import { getStoredToken, setStoredToken } from "./client";

describe("token storage", () => {
  it("uses the legacy yew.token key", () => {
    setStoredToken("abc");

    expect(localStorage.getItem("yew.token")).toBe("abc");
    expect(getStoredToken()).toBe("abc");
  });
});
