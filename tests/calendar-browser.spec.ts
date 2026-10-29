import {test, expect} from "@playwright/test";

for (const [instant, expired] of [
  ["2026-10-30T15:59:00Z", false],
  ["2026-10-30T16:00:00Z", true],
  ["2026-11-02T04:00:00Z", true],
  ["2026-11-05T04:00:00Z", true],
  ["2026-11-06T04:00:00Z", true],
] as const) {
  test(`calendar publication state at ${instant}`, async ({page}) => {
    await page.clock.setFixedTime(new Date(instant));
    await page.goto("http://127.0.0.1:3000/calendar");
    const picker = page.getByLabel("Choose a date");
    const selected = page.locator(".calendar-selected");
    await expect(page.getByRole("status")).toContainText("October 30, 2026");
    await expect(picker).toHaveAttribute("max", "2026-10-30");
    if (expired) {
      await expect(page.getByRole("status")).toContainText("No current schedule is available");
      await expect(picker).toHaveValue("");
      await expect(selected.locator(".schedule-list")).toHaveCount(0);
      await picker.fill("2026-10-30");
      await expect(selected).toContainText("Past published schedule · not the current schedule");
      await expect(selected.locator(".schedule-list")).toBeVisible();
      await expect(page.getByRole("status")).toContainText("No current schedule is available");
      await picker.fill("");
      await expect(selected).toContainText("Choose a published date");
      await expect(selected).not.toContainText("Loading");
    } else {
      await expect(picker).toHaveValue("2026-10-30");
      await expect(selected.locator(".schedule-list")).toBeVisible();
      await expect(page.getByRole("status")).not.toContainText("expired");
    }
    await page.setViewportSize({width:390,height:844});
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
