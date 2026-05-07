import { expect, test } from "@playwright/test";

test("home page renders the React today view", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
});
