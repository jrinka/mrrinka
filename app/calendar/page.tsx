import type { Metadata } from "next";
import GlobalShell from "@/components/global-shell";
import CycleStatus from "@/components/cycle-status";
import { cycleDays, cycleDates } from "@/lib/cycle";

export const metadata: Metadata = { title: "My calendar" };

export default function CalendarPage() {
  return (
    <GlobalShell>
      <div className="global-page-head">
        <span className="mono">SYSTEM / CALENDAR</span>
        <h1>My calendar</h1>
        <p>An eight-day cycle for August 11 through October 30, 2026.</p>
      </div>
      <CycleStatus />
      <section className="cycle-grid-section">
        <div className="landing-section-label"><span className="mono">CYCLE MAP / D1—D8</span><p>Course rotation</p></div>
        <div className="cycle-grid">
          {cycleDays.map((entry) => (
            <article className="cycle-card" key={entry.day}>
              <div><strong>D{entry.day}</strong><span>{entry.parity}</span></div>
              <ul>{entry.classes.map((course) => <li key={course}>{course}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>
      <section className="upcoming-cycle">
        <div className="landing-section-label"><span className="mono">DATES / PUBLISHED WINDOW</span><p>September–October</p></div>
        <div className="date-tape">
          {cycleDates.filter((x) => x.date >= "2026-09-01").map((entry) => (
            <div className="date-tape-cell" key={entry.date}>
              <time dateTime={entry.date}>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${entry.date}T12:00:00Z`))}</time>
              <strong>D{entry.cycleDay}</strong><span>{entry.parity}</span>
            </div>
          ))}
        </div>
      </section>
    </GlobalShell>
  );
}
