"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Markdown from "./markdown";
import ExportFormatSelect from "./export-format";
import { downloadRecord, type ExportFormat } from "@/lib/practice-record";
import { splitGuideSections } from "@/lib/guide-sections";
import { cartoonExample as example, cartoonReadingSections as reading, cartoonNoteFields as fields } from "@/lib/cartoon-example";
import styles from "./cartoon.module.css";

export default function CartoonGuide({ body, href }: { body: string; href: string }) {
  const sections = useMemo(() => splitGuideSections(body), [body]);
  const [activeIndex, setActiveIndex] = useState(0);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<HTMLElement>(null);
  const headings = useRef<(HTMLHeadingElement | null)[]>([]);
  const sourceRef = useRef<HTMLElement>(null);
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

  useEffect(() => { sourceRef.current?.scrollTo({ top: 0 }); }, [activeIndex]);

  function goTo(index: number) {
    if (!sections[index]) return;
    setActiveIndex(index);
    sourceRef.current?.scrollTo({ top: 0 });
    const url = `${href}?view=example#${sections[index].id}`;
    if (window.location.pathname + window.location.search + window.location.hash !== url) window.history.pushState(null, "", url);
    requestAnimationFrame(() => {
      headings.current[index]?.focus({ preventScroll: true });
      workspaceRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }

  if (!active) return <Markdown>{body}</Markdown>;
  return <div className="advertisement-guide">
    <p className="advertisement-question"><span className="mono">GUIDING QUESTION / SUPPLIED PAPER</span>{example.question}</p>
    <nav className="advertisement-reading-route" ref={routeRef} tabIndex={-1} aria-label="Worked example sections">
      {["Orient", "Analyse", "Write"].map(phase => <div key={phase}><span className="mono">{phase === "Analyse" ? "Analyze" : phase}</span><ol>
        {sections.map((section, index) => (reading[section.id]?.phase ?? "Analyse") === phase && <li key={section.id}>
          <a href={`${href}?view=example#${section.id}`} aria-current={activeIndex === index ? "step" : undefined} onClick={event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault(); goTo(index);
          }}><span className="mono">{String(index + 1).padStart(2, "0")}</span>{labelFor(index)}</a>
        </li>)}
      </ol></div>)}
    </nav>
    <div className="advertisement-reading-workspace" ref={workspaceRef}>
      <aside className={`advertisement-viewer ${styles.source}`} ref={sourceRef} tabIndex={0} aria-label="Cartoon source and reading notes">
        <div className="text-type-example-head"><span className="mono">SOURCE / ANDY SINGER</span><a href={example.url} target="_blank" rel="noopener noreferrer">Full-size cartoon ↗</a></div>
        <figure className={styles.figure}>
          <button type="button" aria-label="Enlarge cartoon" onClick={() => dialogRef.current?.showModal()}><Image src={example.image} alt={example.imageAlt} width={890} height={1142} unoptimized loading="eager" /><span>Enlarge cartoon ↗</span></button>
          <figcaption>{example.imageCredit} <a href={example.url} target="_blank" rel="noopener noreferrer">Supplied cartoon ↗</a></figcaption>
        </figure>
        <div className={styles.sourceNote}>
          <span className="mono">WHERE TO LOOK</span><h3>{note?.location ?? active.title}</h3><p>{note?.note ?? "Compare the two panels."}</p>
          <p className="hint">These prompts are teaching notes. The cartoon above preserves the supplied drawing and lettering.</p>
        </div>
        <details className="advertisement-transcript"><summary>Supplied guiding question</summary><p>{example.question}</p></details>
        <details className="advertisement-transcript"><summary>Transcript and image description</summary><p>Collection: NO EXIT. Credit: © Andy Singer. Title: THE HISTORY OF TECHNOLOGY. Left balloon: ME NOT HAPPY. Right balloon: STILL NOT HAPPY!</p><p>{example.imageAlt}</p><p>Only the cartoon is reproduced from the supplied exam page. Its drawing, lettering and attribution are unchanged.</p></details>
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
          {section.id === "practice-and-transfer" && <CartoonNotes />}
        </section>)}
        <nav className="advertisement-reader-pager" aria-label="Continue reading">
          <button type="button" disabled={activeIndex === 0} onClick={() => goTo(activeIndex - 1)}>← {labelFor(activeIndex - 1) ?? "Previous"}</button>
          {activeIndex < sections.length - 1 ? <button type="button" onClick={() => goTo(activeIndex + 1)}>Next: {labelFor(activeIndex + 1)} →</button> : <button type="button" onClick={() => goTo(0)}>Return to the whole reading ↗</button>}
        </nav>
      </div>
    </div>
    <dialog ref={dialogRef} className={`advertisement-source-dialog ${styles.dialog}`} aria-labelledby="cartoon-source-title" onClick={event => { if (event.target === dialogRef.current) dialogRef.current?.close(); }}>
      <div className="advertisement-dialog-heading"><h2 id="cartoon-source-title">The History of Technology — Andy Singer</h2><button type="button" autoFocus onClick={() => dialogRef.current?.close()}>Close ×</button></div>
      <figure className={styles.figure}><Image src={example.image} alt={example.imageAlt} width={890} height={1142} unoptimized /><figcaption>{example.imageCredit} <a href={example.url} target="_blank" rel="noopener noreferrer">Full-size cartoon ↗</a></figcaption></figure>
    </dialog>
  </div>;
}

function CartoonNotes() {
  const [values, setValues] = useState({ audience: "", evidence: "", analysis: "" });
  const [format, setFormat] = useState<ExportFormat>("txt");
  return <section className="infographic-notes" aria-label="Cartoon analysis notebook">
    <h3>Try a connected reading</h3>
    {fields.map(field => <label className="field" key={field.key} htmlFor={`cartoon-${field.key}`}>{field.label}<span className="hint" id={`cartoon-${field.key}-hint`}>{field.hint}</span><textarea id={`cartoon-${field.key}`} aria-describedby={`cartoon-${field.key}-hint`} rows={field.key === "analysis" ? 6 : 3} maxLength={6000} value={values[field.key]} onChange={event => setValues(previous => ({ ...previous, [field.key]: event.target.value }))} /></label>)}
    <p className="hint">Your notes stay here while this page is open. Export before leaving. This exercise does not send writing to AI.</p>
    <div className="tool-actions"><ExportFormatSelect value={format} onChange={setFormat} /><button className="button secondary" type="button" onClick={() => downloadRecord(`Cartoon analysis notes\n\nSource: ${example.title}\nhttps://mrrinka.com${example.url}\n\nQuestion from the supplied paper: ${example.question}\n\n${fields.map(field => `${field.label}\n${values[field.key] || "(Not yet written)"}`).join("\n\n")}\n\nStudent-authored notes; no AI feedback.`, "cartoon-analysis-notes.txt", format)}>Export my notes</button></div>
    <details className="infographic-self-check"><summary>Review your paragraph</summary><ul><li>Have I connected particular words with particular visual details?</li><li>Have I explained both change and continuity across the panels?</li><li>Does my account acknowledge that the first figure is also unhappy?</li><li>Have I distinguished the cartoon’s criticism from a universal claim about technology?</li></ul></details>
  </section>;
}
