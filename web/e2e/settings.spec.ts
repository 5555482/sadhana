import { expect, test } from "@playwright/test";

test("settings page keeps account actions in one list", async ({ page }) => {
  await page.goto("/settings");

  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  await expect(page.getByRole("link", { name: /User details/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Language/ })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: /Dark mode/ })).toBeVisible();
});
