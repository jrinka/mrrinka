"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import Markdown from "./markdown";
import ExportFormatSelect from "./export-format";
import { downloadRecord, type ExportFormat } from "@/lib/practice-record";
import { splitGuideSections } from "@/lib/guide-sections";
import type { LiteraryReading } from "@/lib/literary-reading";
import styles from "./drama.module.css";

export default function LiteraryReadingGuide({ body, href, example, exampleHref }: { body: string; href: string; example: LiteraryReading; exampleHref?: string }) {
  const reading = example.sections;
  const readingHref = exampleHref ?? `${href}?view=example`;
  const [firstReading, setFirstReading] = useState("");
  const [showFirstReading, setShowFirstReading] = useState(false);
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
    const url = `${readingHref}#${sections[index].id}`;
    if (window.location.pathname + window.location.search + window.location.hash !== url) window.history.pushState(null, "", url);
    requestAnimationFrame(() => {
      headings.current[index]?.focus({ preventScroll: true });
      workspaceRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }

  useEffect(() => { sourceRef.current?.scrollTo({ top: 0 }); }, [activeIndex]);

  if (!active) return <Markdown>{body}</Markdown>;
  return <div className="advertisement-guide">
    <p className="advertisement-question"><span className="mono">{example.questionCredit}</span>{example.question}</p>
    <nav className="advertisement-reading-route" ref={routeRef} tabIndex={-1} aria-label="Worked example sections">
      {["Orient", "Analyse", "Write"].map(phase => <div key={phase}><span className="mono">{phase === "Analyse" ? "Analyze" : phase}</span><ol>
        {sections.map((section, index) => (reading[section.id]?.phase ?? "Analyse") === phase && <li key={section.id}>
          <a href={`${readingHref}#${section.id}`} aria-current={activeIndex === index ? "step" : undefined} onClick={event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault(); goTo(index);
          }}><span className="mono">{String(index + 1).padStart(2, "0")}</span>{labelFor(index)}</a>
        </li>)}
      </ol></div>)}
    </nav>
    <div className="advertisement-reading-workspace" ref={workspaceRef}>
      <aside className={`advertisement-viewer ${styles.source}`} ref={sourceRef} tabIndex={0} aria-label={`Source: ${example.title}`}>
        <div className="text-type-example-head"><span className="mono">SOURCE / {example.author}</span><span>{example.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 12 }}>{source.label} ↗</a>)}</span></div>
        <p className={styles.context}>{example.context}</p>
        <div className={styles.controls} role="group" aria-label={example.poem ? "Poem view" : "Extract view"}>
          <button type="button" aria-pressed={!wholeSource} onClick={() => { setWholeSource(false); sourceRef.current?.scrollTo({ top: 0 }); }}>Follow the reading</button>
          <button type="button" aria-pressed={wholeSource} onClick={() => { setWholeSource(true); sourceRef.current?.scrollTo({ top: 0 }); }}>{example.wholeLabel ?? (example.poem ? "Whole poem" : "Whole extract")}</button>
        </div>
        {example.image && <details className={styles.sourceLayout}><summary>See original page layout</summary><figure><Image src={example.image.url} width={example.image.width} height={example.image.height} alt={example.image.alt} unoptimized /><figcaption>{example.credit}</figcaption></figure></details>}
        <div className={styles.transcript}>
          {example.passages.map((passage, index) => <section className={styles.passage} key={passage.title} hidden={!wholeSource && note?.passage != null && note.passage !== index}>
            <h3>{passage.title}</h3>
            {example.poem ? <p className={styles.poemStanza}>{passage.paragraphs.map((line, i) => <span className={example.poemAlternatingIndent && i % 2 ? styles.poemAnswer : styles.poemLine} key={i}><span className={styles.lineNumber} aria-hidden="true">{example.passages.slice(0, index).reduce((count, previous) => count + previous.paragraphs.length, 0) + i + 1}</span>{line}</span>)}</p> : passage.paragraphs.map((paragraph, i) => <ReactMarkdown key={i} components={{ p: ({ children }) => <p className={styles.speech}>{children}</p> }}>{paragraph}</ReactMarkdown>)}
          </section>)}
        </div>
        {example.footnotes && <p className={styles.context}><strong>Source footnotes:</strong> {example.footnotes}</p>}
        <p className={styles.credit}>{example.credit}</p>
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
          {index === 0 && example.firstReading && <section className="infographic-notes" aria-label="First reading before the commentary">
            <h3>Try a first reading</h3>
            <label className="field" htmlFor="literary-first-reading">Your provisional reading<span className="hint" id="literary-first-reading-hint">{example.firstReading.prompt}</span><textarea id="literary-first-reading" aria-describedby="literary-first-reading-hint" rows={5} maxLength={6000} value={firstReading} onChange={event => setFirstReading(event.target.value)} /></label>
            <p className="hint">Write an idea before opening the guidance. Your first reading is included when you export your notebook in Practice &amp; transfer. Export before leaving this page.</p>
            <button className="button secondary" type="button" disabled={!firstReading.trim()} aria-expanded={showFirstReading} aria-controls="literary-first-reading-response" onClick={() => setShowFirstReading(previous => !previous)}>{showFirstReading ? "Hide the possible reading" : "Compare with a possible reading"}</button>
            <div id="literary-first-reading-response" hidden={!showFirstReading}>
              <h4>A possible reading</h4><p>{example.firstReading.model}</p>
              <h4>A complication to keep in view</h4><p>{example.firstReading.complication}</p>
              <p className="hint">This is a reading to test against the poem, not a score or a judgment of your writing.</p>
            </div>
          </section>}
          {section.id === "practice-and-transfer" && <LiteraryNotes example={example} firstReading={firstReading} />}
        </section>)}
        <nav className="advertisement-reader-pager" aria-label="Continue reading">
          <button type="button" disabled={activeIndex === 0} onClick={() => goTo(activeIndex - 1)}>← {labelFor(activeIndex - 1) ?? "Previous"}</button>
          {activeIndex < sections.length - 1 ? <button type="button" onClick={() => goTo(activeIndex + 1)}>Next: {labelFor(activeIndex + 1)} →</button> : <button type="button" onClick={() => goTo(0)}>Return to the whole reading ↗</button>}
        </nav>
      </div>
    </div>

  </div>;
}

function LiteraryNotes({ example, firstReading }: { example: LiteraryReading; firstReading: string }) {
  const fields = example.fields;
  const [values, setValues] = useState({ contrast: "", evidence: "", analysis: "" });
  const [format, setFormat] = useState<ExportFormat>("txt");
  return <section className="infographic-notes" aria-label={`${example.title} analysis notebook`}>
    <h3>Try a connected reading</h3>
    {example.firstReading && <div><h4>Your first reading</h4><p style={{ whiteSpace: "pre-wrap" }}>{firstReading || "You have not written a first reading yet. You can return to the opening section at any time."}</p></div>}
    {fields.map(field => <label className="field" key={field.key} htmlFor={`literary-${field.key}`}>{field.label}<span className="hint" id={`literary-${field.key}-hint`}>{field.hint}</span><textarea id={`literary-${field.key}`} aria-describedby={`literary-${field.key}-hint`} rows={field.key === "analysis" ? 6 : 3} maxLength={6000} value={values[field.key]} onChange={event => setValues(previous => ({ ...previous, [field.key]: event.target.value }))} /></label>)}
    <p className="hint">Your notes stay here while this page is open. Export before leaving. This exercise does not send writing to AI.</p>
    <div className="tool-actions"><ExportFormatSelect value={format} onChange={setFormat} /><button className="button secondary" type="button" onClick={() => downloadRecord(`${example.title} analysis notes\n\nSource: ${example.title}\n${example.sources.map(source => source.url.startsWith("/") ? `https://mrrinka.com${source.url}` : source.url).join("\n")}\n\n${example.questionCredit}: ${example.question}\n\n${example.firstReading ? `First reading\n${firstReading || "(Not yet written)"}\n\n` : ""}${fields.map(field => `${field.label}\n${values[field.key] || "(Not yet written)"}`).join("\n\n")}\n\nStudent-authored notes; no AI feedback.`, `${example.filename}.txt`, format)}>Export my notes</button></div>
    <details className="infographic-self-check"><summary>Review your paragraph</summary><ul>{example.checks.map(check => <li key={check}>{check}</li>)}</ul></details>
  </section>;
}
