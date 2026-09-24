"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Markdown from "./markdown";
import ExportFormatSelect from "./export-format";
import { downloadRecord, type ExportFormat } from "@/lib/practice-record";
import { splitGuideSections } from "@/lib/guide-sections";
import { nonfictionExample as example, nonfictionReadingSections as reading, nonfictionNoteFields as fields, nonfictionPassages } from "@/lib/nonfiction-example";
import styles from "./drama.module.css";

export default function NonfictionGuide({ body, href }: { body: string; href: string }) {
  const sections = useMemo(() => splitGuideSections(body), [body]);
  const [activeIndex, setActiveIndex] = useState(0);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<HTMLElement>(null);
  const headings = useRef<(HTMLHeadingElement | null)[]>([]);
  const [wholeSource, setWholeSource] = useState(false);
  const sourceRef = useRef<HTMLElement>(null);
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
    const url = `${href}?view=example#${sections[index].id}`;
    if (window.location.pathname + window.location.search + window.location.hash !== url) window.history.pushState(null, "", url);
    requestAnimationFrame(() => {
      headings.current[index]?.focus({ preventScroll: true });
      workspaceRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }

  useEffect(() => { sourceRef.current?.scrollTo({ top: 0 }); }, [activeIndex]);

  if (!active) return <Markdown>{body}</Markdown>;
  return <div className="advertisement-guide">
    <p className="advertisement-question"><span className="mono">GUIDING QUESTION / SUPPLIED PAPER</span>{example.question}</p>
    <nav className="advertisement-reading-route" ref={routeRef} tabIndex={-1} aria-label="Worked example sections">
      {["Orient", "Analyse", "Write"].map(phase => <div key={phase}><span className="mono">{phase}</span><ol>
        {sections.map((section, index) => (reading[section.id]?.phase ?? "Analyse") === phase && <li key={section.id}>
          <a href={`${href}?view=example#${section.id}`} aria-current={activeIndex === index ? "step" : undefined} onClick={event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault(); goTo(index);
          }}><span className="mono">{String(index + 1).padStart(2, "0")}</span>{labelFor(index)}</a>
        </li>)}
      </ol></div>)}
    </nav>
    <div className="advertisement-reading-workspace" ref={workspaceRef}>
      <aside className={`advertisement-viewer ${styles.source}`} ref={sourceRef} tabIndex={0} aria-label="Memoir extract: The Gastronomical Me">
        <div className="text-type-example-head"><span className="mono">SOURCE / M. F. K. FISHER</span><a href={example.source} target="_blank" rel="noopener noreferrer">Original exam page ↗</a></div>
        <p className={styles.context}>{example.context}</p>
        <div className={styles.controls} role="group" aria-label="Extract view">
          <button type="button" aria-pressed={!wholeSource} onClick={() => { setWholeSource(false); sourceRef.current?.scrollTo({ top: 0 }); }}>Follow the reading</button>
          <button type="button" aria-pressed={wholeSource} onClick={() => { setWholeSource(true); sourceRef.current?.scrollTo({ top: 0 }); }}>Whole extract</button>
        </div>
        <div className={styles.transcript}>
          {nonfictionPassages.map((passage, index) => <section className={styles.passage} key={passage.title} hidden={!wholeSource && note?.passage != null && note.passage !== index}>
            <h3>{passage.title}</h3>
            {passage.paragraphs.map((paragraph, i) => <p className={styles.speech} key={i}>{paragraph}</p>)}
          </section>)}
        </div>
        <p className={styles.context}><strong>Source footnotes:</strong> winily: she has had wine to drink; surfeit: excess.</p>
        <p className={styles.credit}>{example.credit} Reading groups and paragraph numbers are editorial aids. Typography is normalised; the original exam page preserves the layout and footnote markers.</p>
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
          {section.id === "practice-and-transfer" && <NonfictionNotes />}
        </section>)}
        <nav className="advertisement-reader-pager" aria-label="Continue reading">
          <button type="button" disabled={activeIndex === 0} onClick={() => goTo(activeIndex - 1)}>← {labelFor(activeIndex - 1) ?? "Previous"}</button>
          {activeIndex < sections.length - 1 ? <button type="button" onClick={() => goTo(activeIndex + 1)}>Next: {labelFor(activeIndex + 1)} →</button> : <button type="button" onClick={() => goTo(0)}>Return to the whole reading ↗</button>}
        </nav>
      </div>
    </div>

  </div>;
}

function NonfictionNotes() {
  const [values, setValues] = useState({ contrast: "", evidence: "", analysis: "" });
  const [format, setFormat] = useState<ExportFormat>("txt");
  return <section className="infographic-notes" aria-label="Prose non-fiction analysis notebook">
    <h3>Try a connected reading</h3>
    {fields.map(field => <label className="field" key={field.key} htmlFor={`nonfiction-${field.key}`}>{field.label}<span className="hint" id={`nonfiction-${field.key}-hint`}>{field.hint}</span><textarea id={`nonfiction-${field.key}`} aria-describedby={`nonfiction-${field.key}-hint`} rows={field.key === "analysis" ? 6 : 3} maxLength={6000} value={values[field.key]} onChange={event => setValues(previous => ({ ...previous, [field.key]: event.target.value }))} /></label>)}
    <p className="hint">Your notes stay here while this page is open. Export before leaving. This exercise does not send writing to AI.</p>
    <div className="tool-actions"><ExportFormatSelect value={format} onChange={setFormat} /><button className="button secondary" type="button" onClick={() => downloadRecord(`Prose non-fiction analysis notes\n\nSource: ${example.title}\nhttps://mrrinka.com${example.source}\n\nQuestion from the supplied paper: ${example.question}\n\n${fields.map(field => `${field.label}\n${values[field.key] || "(Not yet written)"}`).join("\n\n")}\n\nStudent-authored notes; no AI feedback.`, "prose-nonfiction-notes.txt", format)}>Export my notes</button></div>
    <details className="infographic-self-check"><summary>Review your paragraph</summary><ul><li>Have I kept the diner and waitress in relation to each other?</li><li>Have I explained how the narrator’s perspective shapes the contrast?</li><li>Have I distinguished comic imagery from literal events?</li><li>Have I accounted for the diner’s continuing praise of the food?</li></ul></details>
  </section>;
}
