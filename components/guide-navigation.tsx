"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";

/** Keep native disclosures usable with copied links, history and printing. */
export default function GuideNavigation({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  function reveal(hash: string) {
    let id: string;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return false; }
    const heading = document.getElementById(id);
    if (!heading || !root.current?.contains(heading)) return false;
    const disclosure = heading.closest("details");
    if (disclosure) disclosure.open = true;
    const target = disclosure?.querySelector("summary") ?? heading;
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "start" });
    return true;
  }

  useEffect(() => {
    const revealHash = () => reveal(window.location.hash);
    let closedForPrint: HTMLDetailsElement[] = [];
    const beforePrint = () => {
      closedForPrint = Array.from(root.current?.querySelectorAll<HTMLDetailsElement>("details:not([open])") ?? []);
      closedForPrint.forEach(detail => { detail.open = true; });
    };
    const afterPrint = () => {
      closedForPrint.forEach(detail => { detail.open = false; });
      closedForPrint = [];
    };
    revealHash();
    window.addEventListener("hashchange", revealHash);
    window.addEventListener("popstate", revealHash);
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    return () => {
      window.removeEventListener("hashchange", revealHash);
      window.removeEventListener("popstate", revealHash);
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);

  function followSection(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
    if (!reveal(url.hash)) return;
    event.preventDefault();
    if (url.hash !== location.hash) window.history.pushState(null, "", url);
  }

  return <div ref={root} className="advertisement-overview-layout" onClick={followSection}>{children}</div>;
}
