"use client";

import { cycleDates, cycleDays } from "@/lib/cycle";

function localIso() {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const part = (type: string) => parts.find((x) => x.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export default function CycleStatus() {
  const today = localIso();
  const exact = cycleDates.find((entry) => entry.date === today);
  const next = exact ?? cycleDates.find((entry) => entry.date > today);
  const schedule = next ? cycleDays.find((entry) => entry.day === next.cycleDay) : undefined;
  return (
    <section className="cycle-status" aria-live="polite">
      <span className="mono">{exact ? "TODAY" : "NEXT SCHOOL DAY"}</span>
      {next ? <><div className="cycle-status-day">D{next.cycleDay}</div><div><strong>{next.parity} DAY</strong><time dateTime={next.date}>{new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "long", month: "long", day: "numeric" }).format(new Date(`${next.date}T12:00:00Z`))}</time><p>{schedule?.classes.join(" · ")}</p></div></> : <p>The published cycle currently ends October 30.</p>}
    </section>
  );
}
