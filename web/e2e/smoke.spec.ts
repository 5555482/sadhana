import { expect, test } from "@playwright/test";

test("home page renders the React today view", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByLabel("Diary date strip")).toBeVisible();
  await expect(page.getByRole("link", { name: "Manage practices" })).toBeVisible();
});
