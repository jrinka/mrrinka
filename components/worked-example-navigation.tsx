"use client";

import { useRef, type ReactNode } from "react";

export function openSectionMap(route: HTMLElement | null) {
  const details = route?.closest("details");
  if (!details) return;
  details.open = true;
  details.querySelector("summary")?.focus({ preventScroll: true });
  details.scrollIntoView({ block: "start", behavior: "instant" });
}

export function NotesShortcut({ onSelect }: { onSelect: () => void }) {
  return <button type="button" className="notebook-shortcut" onClick={event => {
    const guide = event.currentTarget.closest(".advertisement-guide");
    onSelect();
    requestAnimationFrame(() => {
      const field = guide?.querySelector<HTMLTextAreaElement>(".advertisement-reading-section:not([hidden]) .infographic-notes textarea");
      field?.focus({ preventScroll: true });
      field?.closest(".infographic-notes")?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }}>My notes</button>;
}

export default function WorkedExampleNavigation({ children, current, total, hidden = false, showNotes = true, onNotes }: { children: ReactNode; current: number; total: number; hidden?: boolean; showNotes?: boolean; onNotes: () => void }) {
  const details = useRef<HTMLDetailsElement>(null);
  return <div className="worked-example-navigation" hidden={hidden}>
    <details ref={details} className="worked-example-sections" onClick={event => {
      if (event.target instanceof Element && event.target.closest("a") && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && details.current) details.current.open = false;
    }}>
      <summary>Sections in this example <span className="mono">{current} / {total}</span></summary>
      {children}
    </details>
    {showNotes && <NotesShortcut onSelect={onNotes} />}
  </div>;
}
