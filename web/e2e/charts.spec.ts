import { expect, test } from "@playwright/test";

test("reports page renders chart controls and actions", async ({ page }) => {
  await page.goto("/charts");

  await expect(page.getByRole("heading", { name: "Reports" })).toBeVisible();
  await expect(page.getByLabel("Report", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Duration", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "New report" })).toBeVisible();
});

test("shared reports route renders public chart view", async ({ page }) => {
  await page.goto("/shared/demo-user");

  await expect(page.getByRole("heading", { name: "Shared reports" })).toBeVisible();
  await expect(page.getByLabel("Report", { exact: true })).toBeVisible();
});
