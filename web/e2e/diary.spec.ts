import { expect, test } from "@playwright/test";

test("today page renders the diary-first workflow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
  await expect(page.getByLabel("Diary date strip")).toBeVisible();
  await expect(page.getByRole("link", { name: "Manage practices" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Save changes" })).toBeVisible();
});
