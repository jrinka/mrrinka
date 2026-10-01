"use client";

import { useEffect, useRef } from "react";
import styles from "./individual-oral.module.css";

const previousSections: Record<string, string> = {
  "practice-speaking": "personal-preparation-tools",
  "reflect-on-your-rehearsal": "personal-preparation-tools",
  "practice": "personal-preparation-tools",
  "planning-and-reflection-sheets": "analysis-planning-sheets",
};

export default function IOSectionControls() {
  const controls = useRef<HTMLDivElement>(null);
  function sections() {
    return controls.current?.closest("[data-io-guide]")?.querySelectorAll<HTMLDetailsElement>("details[data-io-section]") ?? [];
  }
  useEffect(() => {
    const root = controls.current?.closest("[data-io-guide]");
    if (!root) return;
    function reveal(hash: string, scroll: boolean) {
      let id: string;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
      const target = document.getElementById(previousSections[id] ?? id);
      if (!target || !root?.contains(target)) return;
      const details = target.closest<HTMLDetailsElement>("details") ?? target.querySelector<HTMLDetailsElement>("details[data-io-section]") ?? target.parentElement?.querySelector<HTMLDetailsElement>("details[data-io-section]");
      if (details) details.open = true;
      if (scroll) target.scrollIntoView({ block: "start" });
    }
    const onHash = () => reveal(window.location.hash, true);
    const onClick = (event: Event) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href^='#']");
      if (link && root.contains(link)) reveal(link.hash, false);
    };
    let printState: { element: HTMLDetailsElement; open: boolean }[] = [];
    const beforePrint = () => {
      printState = [...root.querySelectorAll<HTMLDetailsElement>("details")].map(element => ({ element, open: element.open }));
      printState.forEach(({ element }) => { element.open = true; });
    };
    const afterPrint = () => printState.forEach(({ element, open }) => { element.open = open; });
    onHash();
    root.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    return () => {
      root.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);
  return <div ref={controls} className={styles.sectionControls} aria-label="Guide sections">
    <p>Open a section to read it, or expand the full guide.</p>
    <div className={styles.controls}>
      <button className="button secondary" onClick={() => { for (const section of sections()) section.open = true; }}>Expand all</button>
      <button className="button secondary" onClick={() => { for (const section of sections()) section.open = false; }}>Collapse all</button>
    </div>
  </div>;
}
