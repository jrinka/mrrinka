export const cycleDays = [
  { day: 1, parity: "ODD", classes: ["English 10.4", "IB Literature", "English 10.5"] },
  { day: 2, parity: "EVEN", classes: ["English 10.6", "IB Language & Literature"] },
  { day: 3, parity: "ODD", classes: ["English 10.5", "IB Literature", "English 10.4"] },
  { day: 4, parity: "EVEN", classes: ["IB Language & Literature", "English 10.6"] },
  { day: 5, parity: "ODD", classes: ["IB Literature", "English 10.4", "English 10.5"] },
  { day: 6, parity: "EVEN", classes: ["IB Language & Literature", "English 10.6"] },
  { day: 7, parity: "ODD", classes: ["English 10.5", "English 10.4", "IB Literature"] },
  { day: 8, parity: "EVEN", classes: ["English 10.6", "IB Language & Literature"] },
] as const;

const start = "2026-08-11";
const end = "2026-10-30";
const breakStart = "2026-09-25";
const breakEnd = "2026-10-05";

function iso(date: Date) { return date.toISOString().slice(0, 10); }
function isSchoolDay(date: Date) {
  const value = iso(date);
  const day = date.getUTCDay();
  return day >= 1 && day <= 5 && !(value >= breakStart && value <= breakEnd);
}

export type CycleDate = { date: string; cycleDay: number; parity: "ODD" | "EVEN" };

export const cycleDates: CycleDate[] = (() => {
  const result: CycleDate[] = [];
  let index = 0;
  for (let date = new Date(`${start}T12:00:00Z`); iso(date) <= end; date = new Date(date.getTime() + 86_400_000)) {
    if (!isSchoolDay(date)) continue;
    const cycleDay = (index % 8) + 1;
    result.push({ date: iso(date), cycleDay, parity: cycleDay % 2 ? "ODD" : "EVEN" });
    index += 1;
  }
  return result;
})();
