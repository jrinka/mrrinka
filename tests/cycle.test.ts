import test from "node:test";
import assert from "node:assert/strict";
import {cycleDates, defaultCalendarDate, publicationEnd, daySchedule, calendarClosures} from "../lib/cycle";

test("November preserves the rotation across PTC, PD, and holiday closures", () => {
  assert.equal(publicationEnd, "2026-11-30");
  assert.deepEqual(cycleDates.filter(day => day.date >= "2026-11-01").map(day => [day.date, day.cycleDay]), [
    ["2026-11-02",5],["2026-11-03",6],["2026-11-04",7],
    ["2026-11-09",8],["2026-11-10",1],["2026-11-11",2],["2026-11-12",3],["2026-11-13",4],
    ["2026-11-16",5],["2026-11-17",6],["2026-11-18",7],
    ["2026-11-23",8],["2026-11-24",1],["2026-11-25",2],["2026-11-26",3],["2026-11-27",4],["2026-11-30",5],
  ]);
  for (const date of Object.keys(calendarClosures)) assert.equal(cycleDates.find(day => day.date === date), undefined);
  for (let i=1; i<cycleDates.length; i++) assert.equal(cycleDates[i].cycleDay, cycleDates[i-1].cycleDay % 8 + 1);
  assert.equal(cycleDates.find(day => day.date === "2026-10-30")?.cycleDay, 4);
  assert.equal(cycleDates.filter(day => day.date < "2026-11-01").length, 52);
});

test("defaults advance across closures and stop after the new publication endpoint", () => {
  for (const [date, next] of [
    ["2026-10-24","2026-10-26"],["2026-09-25","2026-10-06"],
    ["2026-10-31","2026-11-02"],["2026-11-05","2026-11-09"],["2026-11-06","2026-11-09"],
    ["2026-11-19","2026-11-23"],["2026-11-20","2026-11-23"],["2026-11-30","2026-11-30"],
    ["2026-12-01",""],["2027-01-11",""],
  ]) assert.equal(defaultCalendarDate(date), next);
  assert.equal(cycleDates.at(-1)?.date, publicationEnd);
});

test("November Wednesdays retain early bells and omit mentoring", () => {
  for (const date of ["2026-11-04","2026-11-11","2026-11-18","2026-11-25"]) {
    const entry = cycleDates.find(day => day.date === date)!;
    const slots = daySchedule(entry.cycleDay, true);
    assert.equal(slots.some(slot => slot.period === "Mentoring"), false);
    if (entry.cycleDay === 2) assert.equal(slots.find(slot => slot.period === "P2")?.time, "09:40–11:00");
    else assert.equal(slots.find(slot => slot.period === "P3")?.time, "11:05–12:25");
  }
});
