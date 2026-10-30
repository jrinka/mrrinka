import {test, expect} from "@playwright/test";

for (const [instant, expired] of [
  ["2026-11-30T15:59:00Z", false],
  ["2026-11-30T16:00:00Z", true],
  ["2026-12-02T04:00:00Z", true],
] as const) {
  test(`calendar publication state at ${instant}`, async ({page}) => {
    await page.clock.setFixedTime(new Date(instant));
    await page.goto("http://127.0.0.1:3000/calendar");
    const picker = page.getByLabel("Choose a date");
    const selected = page.locator(".calendar-selected");
    await expect(page.getByRole("status")).toContainText("November 30, 2026");
    await expect(picker).toHaveAttribute("max", "2026-11-30");
    if (expired) {
      await expect(page.getByRole("status")).toContainText("No current schedule is available");
      await expect(picker).toHaveValue("");
      await expect(selected.locator(".schedule-list")).toHaveCount(0);
      await picker.fill("2026-11-30");
      await expect(selected).toContainText("Past published schedule · not the current schedule");
      await expect(selected.locator(".schedule-list")).toBeVisible();
      await expect(page.getByRole("status")).toContainText("No current schedule is available");
      await picker.fill("");
      await expect(selected).toContainText("Choose a published date");
      await expect(selected).not.toContainText("Loading");
    } else {
      await expect(picker).toHaveValue("2026-11-30");
      await expect(selected.locator(".schedule-list")).toBeVisible();
      await expect(page.getByRole("status")).not.toContainText("expired");
    }
    await page.setViewportSize({width:390,height:844});
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

for (const [today, next] of [["2026-10-31","2026-11-02"],["2026-11-05","2026-11-09"],["2026-11-06","2026-11-09"],["2026-11-19","2026-11-23"],["2026-11-20","2026-11-23"]]) {
  test(`next school day on ${today}`, async ({page}) => {
    await page.clock.setFixedTime(new Date(`${today}T04:00:00Z`));
    await page.goto("http://127.0.0.1:3000/calendar");
    await expect(page.getByLabel("Choose a date")).toHaveValue(next);
    await expect(page.getByRole("status")).not.toContainText("expired");
  });
}

test("navigate from October through November, inspect closures and Wednesday bells", async ({page}) => {
  await page.clock.setFixedTime(new Date("2026-10-30T04:00:00Z"));
  await page.goto("http://127.0.0.1:3000/calendar");
  const picker = page.getByLabel("Choose a date");
  const selected = page.locator(".calendar-selected");
  await expect(picker).toHaveValue("2026-10-30");
  for (const [date, day] of [["2026-11-02",5],["2026-11-04",7],["2026-11-09",8],["2026-11-23",8],["2026-11-30",5]] as const) {
    await picker.fill(date);
    await expect(selected).toContainText(`DAY ${day} ·`);
    await expect(selected.locator(".schedule-list")).toBeVisible();
  }
  for (const [date, label] of [["2026-11-05","Parent-teacher conferences"],["2026-11-06","Parent-teacher conferences"],["2026-11-19","Staff professional day"],["2026-11-20","School holiday"]]) {
    await picker.fill(date);
    await expect(selected).toContainText(label);
    await expect(selected).toContainText("No classes");
    await expect(selected.locator(".schedule-list")).toHaveCount(0);
  }
  await picker.fill("2026-11-11");
  await expect(selected).toContainText("P2 · 09:40–11:00");
  await expect(selected.locator(".schedule-list")).not.toContainText("Mentoring");
  await page.setViewportSize({width:390,height:844});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
