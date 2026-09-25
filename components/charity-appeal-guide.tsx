"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Markdown from "./markdown";
import ExportFormatSelect from "./export-format";
import { downloadRecord, type ExportFormat } from "@/lib/practice-record";
import { splitGuideSections } from "@/lib/guide-sections";
import { charityAppealExample as example, charityReadingSections as reading, charityNoteFields as fields } from "@/lib/charity-appeal-example";
import styles from "./charity-appeal.module.css";

export default function CharityAppealGuide({ body, href }: { body: string; href: string }) {
  const sections = useMemo(() => splitGuideSections(body), [body]);
  const [activeIndex, setActiveIndex] = useState(0);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<HTMLElement>(null);
  const headings = useRef<(HTMLHeadingElement | null)[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const active = sections[activeIndex] ?? sections[0];
  const note = active ? reading[active.id] : undefined;
  const labelFor = (index: number) => reading[sections[index]?.id]?.label ?? sections[index]?.title;

  useEffect(() => {
    function readHash() {
      const index = sections.findIndex(section => section.id === window.location.hash.slice(1));
      setActiveIndex(Math.max(0, index));
    }
    readHash();
    window.addEventListener("popstate", readHash);
    window.addEventListener("hashchange", readHash);
    return () => { window.removeEventListener("popstate", readHash); window.removeEventListener("hashchange", readHash); };
  }, [sections]);

  function goTo(index: number) {
    if (!sections[index]) return;
    setActiveIndex(index);
    const url = `${href}?view=example&example=wwf#${sections[index].id}`;
    if (window.location.pathname + window.location.search + window.location.hash !== url) window.history.pushState(null, "", url);
    requestAnimationFrame(() => {
      headings.current[index]?.focus({ preventScroll: true });
      workspaceRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }

  if (!active) return <Markdown>{body}</Markdown>;
  return <div className="advertisement-guide">
    <p className="advertisement-question"><span className="mono">PRACTICE GUIDING QUESTION</span>{example.question}</p>
    <nav className="advertisement-reading-route" ref={routeRef} tabIndex={-1} aria-label="Worked example sections">
      {["Orient", "Analyse", "Write"].map(phase => <div key={phase}><span className="mono">{phase === "Analyse" ? "Analyze" : phase}</span><ol>
        {sections.map((section, index) => (reading[section.id]?.phase ?? "Analyse") === phase && <li key={section.id}>
          <a href={`${href}?view=example&example=wwf#${section.id}`} aria-current={activeIndex === index ? "step" : undefined} onClick={event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault(); goTo(index);
          }}><span className="mono">{String(index + 1).padStart(2, "0")}</span>{labelFor(index)}</a>
        </li>)}
      </ol></div>)}
    </nav>
    <div className="advertisement-reading-workspace" ref={workspaceRef}>
      <aside className={`advertisement-viewer ${styles.source}`} aria-label="WWF source and reading notes">
        <div className="text-type-example-head"><span className="mono">SOURCE / WWF-UK</span><a href={example.url} target="_blank" rel="noopener noreferrer">Read complete source ↗</a></div>
        <figure className={styles.figure}>
          <button type="button" aria-label="Enlarge opening image" onClick={() => dialogRef.current?.showModal()}><Image src={example.image} alt={example.imageAlt} width={950} height={432} unoptimized loading="eager" /><span>Enlarge opening image ↗</span></button>
          <figcaption>{example.imageCredit} <a href={example.url} target="_blank" rel="noopener noreferrer">Original source ↗</a></figcaption>
        </figure>
        <div className={styles.sourceNote}>
          <span className="mono">WHERE TO LOOK</span><h3>{note?.location ?? active.title}</h3><p>{note?.note ?? "Read this section alongside the complete WWF source."}</p>
          <p className="hint">These are teaching notes, not WWF’s wording. The walkthrough refers to the page checked on {example.checked}; the live page may change.</p>
        </div>
        <details className="advertisement-transcript"><summary>Practice guiding question</summary><p>{example.question}</p></details>
        <details className="advertisement-transcript"><summary>About the source excerpt</summary><p>The image preserves the opening photograph and headline at their original proportions. It omits the surrounding navigation, payment panel and body copy. Open the complete source to analyze those parts in context.</p></details>
      </aside>
      <div className="advertisement-analysis">
        <div className="advertisement-reader-progress"><span className="mono">SECTION {activeIndex + 1} / {sections.length}</span><button type="button" onClick={() => { routeRef.current?.focus({ preventScroll: true }); routeRef.current?.scrollIntoView({ block: "start", behavior: "instant" }); }}>All sections ↑</button></div>
        <nav className="advertisement-reader-pager advertisement-reader-pager-top" aria-label="Reading controls">
          <button type="button" disabled={activeIndex === 0} onClick={() => goTo(activeIndex - 1)}>← Previous</button>
          <button type="button" disabled={activeIndex === sections.length - 1} onClick={() => goTo(activeIndex + 1)}>Next: {labelFor(activeIndex + 1) ?? "Finished"} →</button>
        </nav>
        {sections.map((section, index) => <section className="advertisement-reading-section" key={section.id} hidden={activeIndex !== index} aria-labelledby={section.id}>
          <h2 id={section.id} tabIndex={-1} ref={element => { headings.current[index] = element; }}>{section.title}</h2>
          <Markdown>{section.body}</Markdown>
          {section.id === "practice-and-transfer" && <CharityNotes />}
        </section>)}
        <nav className="advertisement-reader-pager" aria-label="Continue reading">
          <button type="button" disabled={activeIndex === 0} onClick={() => goTo(activeIndex - 1)}>← {labelFor(activeIndex - 1) ?? "Previous"}</button>
          {activeIndex < sections.length - 1 ? <button type="button" onClick={() => goTo(activeIndex + 1)}>Next: {labelFor(activeIndex + 1)} →</button> : <button type="button" onClick={() => goTo(0)}>Return to the whole reading ↗</button>}
        </nav>
      </div>
    </div>
    <dialog ref={dialogRef} className={`advertisement-source-dialog ${styles.dialog}`} aria-labelledby="charity-source-title" onClick={event => { if (event.target === dialogRef.current) dialogRef.current?.close(); }}>
      <div className="advertisement-dialog-heading"><h2 id="charity-source-title">WWF — opening excerpt</h2><button type="button" autoFocus onClick={() => dialogRef.current?.close()}>Close ×</button></div>
      <figure className={styles.figure}><Image src={example.image} alt={example.imageAlt} width={950} height={432} unoptimized /><figcaption>{example.imageCredit} <a href={example.url} target="_blank" rel="noopener noreferrer">Read complete source ↗</a></figcaption></figure>
    </dialog>
  </div>;
}

function CharityNotes() {
  const [values, setValues] = useState({ audience: "", evidence: "", analysis: "" });
  const [format, setFormat] = useState<ExportFormat>("txt");
  return <section className="infographic-notes" aria-label="Charitable appeal analysis notebook">
    <h3>Try a connected reading</h3>
    {fields.map(field => <label className="field" key={field.key} htmlFor={`charity-${field.key}`}>{field.label}<span className="hint" id={`charity-${field.key}-hint`}>{field.hint}</span><textarea id={`charity-${field.key}`} aria-describedby={`charity-${field.key}-hint`} rows={field.key === "analysis" ? 6 : 3} maxLength={6000} value={values[field.key]} onChange={event => setValues(previous => ({ ...previous, [field.key]: event.target.value }))} /></label>)}
    <p className="hint">Your notes stay while you move between sections. Export before switching examples, leaving or refreshing. This exercise does not send writing to AI.</p>
    <div className="tool-actions"><ExportFormatSelect value={format} onChange={setFormat} /><button className="button secondary" type="button" onClick={() => downloadRecord(`Charitable appeal analysis notes\n\nSource: ${example.title}\n${example.url}\nSource checked: ${example.checked}\n\nPractice question: ${example.question}\n\n${fields.map(field => `${field.label}\n${values[field.key] || "(Not yet written)"}`).join("\n\n")}\n\nStudent-authored notes; no AI feedback.`, "charitable-appeal-notes.txt", format)}>Export my notes</button></div>
    <details className="infographic-self-check"><summary>Review your paragraph</summary><ul><li>Have I identified the contribution and supported my audience inference?</li><li>Have I connected specific choices to one meaning?</li><li>Have I explained a named emotion or a chain of reasoning, where relevant?</li><li>Have I checked the scope of the promise against the complete source?</li><li>Have I distinguished an intended response from a proven result?</li></ul></details>
  </section>;
}
