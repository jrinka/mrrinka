import test from "node:test";
import assert from "node:assert/strict";
import {cycleDates, defaultCalendarDate, publicationEnd} from "../lib/cycle";

test("publication cutoff remains October 30 with no invented later assignments", () => {
  assert.equal(publicationEnd, "2026-10-30");
  assert.equal(cycleDates.at(-1)?.date, publicationEnd);
  assert.equal(defaultCalendarDate("2026-10-30"), "2026-10-30");
});

for (const date of ["2026-10-31", "2026-11-01", "2026-11-02", "2026-11-05", "2026-11-06", "2027-01-11"]) {
  test(`no past schedule is selected by default on ${date}`, () => {
    assert.equal(defaultCalendarDate(date), "");
    assert.equal(cycleDates.find(day => day.date === date), undefined);
  });
}

test("within the window, weekends and fall break still select the next published day", () => {
  assert.equal(defaultCalendarDate("2026-10-24"), "2026-10-26");
  assert.equal(defaultCalendarDate("2026-09-25"), "2026-10-06");
});
