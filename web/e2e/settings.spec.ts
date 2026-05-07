import { expect, test } from "@playwright/test";

test("settings page keeps account actions in one list", async ({ page }) => {
  await page.goto("/settings");

  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  await expect(page.getByRole("link", { name: /User details/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Language/ })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: /Dark mode/ })).toBeVisible();
});

test("sidebar settings button opens a visible menu", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Settings" }).click();

  const menu = page.getByRole("menu", { name: "Settings" });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "User details" })).toBeVisible();

  const box = await menu.boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(box?.x).toBeGreaterThanOrEqual(0);
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(viewport?.width ?? 1280);
});
