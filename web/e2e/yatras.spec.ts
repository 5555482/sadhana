import { expect, test } from "@playwright/test";

test("yatras page renders the shared practice grid", async ({ page }) => {
  await page.goto("/yatras");
  const yatras = page.getByRole("region", { name: "Yatras" });

  await expect(page.getByRole("heading", { name: "Yatras" })).toBeVisible();
  await expect(page.getByLabel("Yatra", { exact: true })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Sadhaka" })).toBeVisible();
  await expect(yatras.getByRole("link", { name: "Settings" })).toBeVisible();
});
