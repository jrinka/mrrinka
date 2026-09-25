"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import Markdown from "./markdown";
import ExportFormatSelect from "./export-format";
import { downloadRecord, type ExportFormat } from "@/lib/practice-record";
import { splitGuideSections } from "@/lib/guide-sections";
import { advertisementExample as example, advertisementViews as views, advertisementNoteFields as fields } from "@/lib/advertisement-example";

const readingSections: Record<string, { label: string; phase: string; source: string }> = {
  "start-with-the-whole-advertisement": { label: "Start with the whole ad", phase: "Orient", source: "whole" },
  "audience-and-purpose": { label: "Audience & purpose", phase: "Orient", source: "whole" },
  "1-the-image-creates-the-problem": { label: "Image", phase: "Analyse", source: "syringe" },
  "2-the-headline-supplies-the-distinction": { label: "Headline", phase: "Analyse", source: "headline" },
  "3-the-copy-gives-reassurance-a-rationale": { label: "Body copy", phase: "Analyse", source: "copy" },
  "4-the-product-and-slogan-resolve-the-contrast": { label: "Product & slogan", phase: "Analyse", source: "product" },
  "build-an-analytical-response": { label: "Build a response", phase: "Write", source: "whole" },
  "avoid-and-revise": { label: "Avoid & revise", phase: "Write", source: "whole" },
  "practice-and-transfer": { label: "Practice & transfer", phase: "Write", source: "copy" },
};

export default function AdvertisementGuide({ body, href }: { body: string; href: string }) {
  const sections = useMemo(() => splitGuideSections(body), [body]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewIndex, setViewIndex] = useState(0);
  const sourceRef = useRef<HTMLElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const headingRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const active = sections[activeIndex] ?? sections[0];

  function selectSection(index: number, focus = true) {
    const section = sections[index];
    if (!section) return;
    setActiveIndex(index);
    setViewIndex(Math.max(0, views.findIndex(view => view.id === (readingSections[section.id]?.source ?? "whole"))));
    if (focus) requestAnimationFrame(() => {
      headingRefs.current[index]?.focus({ preventScroll: true });
      workspaceRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }

  useEffect(() => {
    function readHash() {
      const hash = window.location.hash.slice(1);
      const sourceIndex = views.findIndex(view => `ad-view-${view.id}` === hash);
      const sectionId = sourceIndex >= 0 ? views[sourceIndex].section : hash;
      const index = sections.findIndex(section => section.id === sectionId);
      if (index >= 0) {
        setActiveIndex(index);
        setViewIndex(sourceIndex >= 0 ? sourceIndex : Math.max(0, views.findIndex(view => view.id === (readingSections[sectionId]?.source ?? "whole"))));
      } else if (!hash) {
        setActiveIndex(0);
        setViewIndex(0);
      }
    }
    readHash();
    window.addEventListener("hashchange", readHash);
    window.addEventListener("popstate", readHash);
    return () => { window.removeEventListener("hashchange", readHash); window.removeEventListener("popstate", readHash); };
  }, [sections]);

  function goToSection(index: number) {
    if (!sections[index]) return;
    selectSection(index);
    const url = `${href}?view=example#${sections[index].id}`;
    if (window.location.pathname + window.location.search + window.location.hash !== url) window.history.pushState(null, "", url);
  }

  function followZoom(event: MouseEvent<HTMLDivElement>) {
    const anchor = event.target instanceof Element ? event.target.closest("a") : null;
    const href = anchor?.getAttribute("href");
    if (!href?.startsWith("#ad-view-") || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const index = views.findIndex(item => item.id === href.slice("#ad-view-".length));
    if (index < 0) return;
    event.preventDefault();
    setViewIndex(index);
    if (window.matchMedia("(max-width: 850px)").matches) {
      sourceRef.current?.focus({ preventScroll: true });
      sourceRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
    }
  }

  if (!active) return <Markdown>{body}</Markdown>;
  const labelFor = (index: number) => readingSections[sections[index]?.id]?.label ?? sections[index]?.title;

  return <div className="advertisement-guide" onClick={followZoom}>
    <p className="advertisement-question"><span className="mono">PRACTICE GUIDING QUESTION</span>{example.question}</p>
    <nav className="advertisement-reading-route" id="advertisement-reading-route" tabIndex={-1} aria-label="Worked example sections">
      {["Orient", "Analyse", "Write"].map(phase => <div key={phase}><span className="mono">{phase === "Analyse" ? "Analyze" : phase}</span><ol>
        {sections.map((section, index) => (readingSections[section.id]?.phase ?? "Analyse") === phase && <li key={section.id}>
          <a href={`${href}?view=example#${section.id}`} aria-current={activeIndex === index ? "step" : undefined} onClick={event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            goToSection(index);
          }}><span className="mono">{String(index + 1).padStart(2, "0")}</span>{labelFor(index)}</a>
        </li>)}
      </ol></div>)}
    </nav>
    <div className="advertisement-reading-workspace" ref={workspaceRef}>
      <section className="advertisement-viewer" id="advertisement-source" ref={sourceRef} tabIndex={-1} aria-label="FIJI Water source and close-up views">
        <div className="text-type-example-head"><span className="mono">SOURCE / FIJI WATER</span><button type="button" onClick={() => dialogRef.current?.showModal()}>Enlarge source ↗</button></div>
        <SourceControls viewIndex={viewIndex} onChange={setViewIndex} scope="inline" />
        <SourceFigure viewIndex={viewIndex} />
        <p className="advertisement-source-status" role="status">Showing: <strong>{views[viewIndex].label.replace(/^\d+ · /, "")}</strong>. Switch views to compare without leaving this section.</p>
        <details className="advertisement-transcript"><summary>Practice guiding question</summary><p>{example.question}</p></details>
        <details className="advertisement-transcript"><summary>Read the ad’s wording</summary>
          <p className="hint">The advertiser’s wording, transcribed from this scan. Tiny packaging text is not fully legible.</p>
          {example.transcript.map(part => <div key={part.title}><h3>{part.title}</h3><p>{part.text}</p></div>)}
        </details>
      </section>
      <div className="advertisement-analysis">
        <div className="advertisement-reader-progress"><span className="mono">SECTION {activeIndex + 1} / {sections.length}</span><button type="button" onClick={() => { const route = document.getElementById("advertisement-reading-route"); route?.focus({ preventScroll: true }); route?.scrollIntoView({ block: "start", behavior: "instant" }); }}>All sections ↑</button></div>
        <nav className="advertisement-reader-pager advertisement-reader-pager-top" aria-label="Reading controls">
          <button type="button" disabled={activeIndex === 0} onClick={() => goToSection(activeIndex - 1)}>← Previous</button>
          <button type="button" disabled={activeIndex === sections.length - 1} onClick={() => goToSection(activeIndex + 1)}>Next: {labelFor(activeIndex + 1) ?? "Finished"} →</button>
        </nav>
        {sections.map((section, index) => <section className="advertisement-reading-section" key={section.id} hidden={activeIndex !== index} aria-labelledby={section.id}>
          <h2 id={section.id} tabIndex={-1} ref={element => { headingRefs.current[index] = element; }}>{section.title.replace(/^\d+\.\s+/, "")}</h2>
          <Markdown>{section.body}</Markdown>
          {section.id === "practice-and-transfer" && <AdvertisementNotes />}
        </section>)}
        <nav className="advertisement-reader-pager" aria-label="Continue reading">
          <button type="button" disabled={activeIndex === 0} onClick={() => goToSection(activeIndex - 1)}>← {labelFor(activeIndex - 1) ?? "Previous"}</button>
          {activeIndex < sections.length - 1 ? <button type="button" onClick={() => goToSection(activeIndex + 1)}>Next: {labelFor(activeIndex + 1)} →</button> : <a href={`${href}?view=example#start-with-the-whole-advertisement`} onClick={event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            goToSection(0);
          }}>Return to the whole reading ↗</a>}
        </nav>
      </div>
    </div>
    <dialog className="advertisement-source-dialog" ref={dialogRef} aria-labelledby="advertisement-source-dialog-title" onClick={event => { if (event.target === dialogRef.current) dialogRef.current?.close(); }}>
      <div className="advertisement-dialog-heading"><h2 id="advertisement-source-dialog-title">FIJI Water — source viewer</h2><button type="button" autoFocus onClick={() => dialogRef.current?.close()}>Close ×</button></div>
      <SourceControls viewIndex={viewIndex} onChange={setViewIndex} scope="enlarged" />
      <SourceFigure viewIndex={viewIndex} enlarged />
    </dialog>
  </div>;
}

function SourceControls({ viewIndex, onChange, scope }: { viewIndex: number; onChange: (index: number) => void; scope: "inline" | "enlarged" }) {
  return <div className="advertisement-view-controls" role="group" aria-label={scope === "inline" ? "Choose a source view" : "Choose an enlarged source view"}>
    {views.map((item, index) => <button key={item.id} type="button" aria-pressed={index === viewIndex} onClick={() => onChange(index)}>{item.label.replace(/^\d+ · /, "")}</button>)}
  </div>;
}

function SourceFigure({ viewIndex, enlarged = false }: { viewIndex: number; enlarged?: boolean }) {
  const view = views[viewIndex];
  const ratio = (example.width * view.width) / (example.height * view.height);
  return <figure className="advertisement-source-figure">
    <div className="advertisement-image-stage"><div className="advertisement-crop" style={{ aspectRatio: ratio, width: `min(100%, calc(var(--ad-crop-height) * ${ratio}))` }}>
      <Image src={example.image} alt={view.alt} width={example.width} height={example.height} unoptimized loading={enlarged ? "lazy" : "eager"}
        style={{ width: `${100 / view.width}%`, left: `${-view.x / view.width * 100}%`, top: `${-view.y / view.height * 100}%` }} />
    </div></div>
    <figcaption>{example.credit} <a href={example.image} target="_blank" rel="noopener noreferrer">Open complete source image ↗</a></figcaption>
  </figure>;
}

function AdvertisementNotes() {
  const [values, setValues] = useState({ audience: "", evidence: "", analysis: "" });
  const [format, setFormat] = useState<ExportFormat>("txt");
  return <section className="infographic-notes" aria-label="Advertisement analysis notebook">
    <h3>Try a connected reading</h3>
    <p>Work with the body copy or closing slogan. Connect what it says with how the product is presented.</p>
    {fields.map(field => <label className="field" key={field.key} htmlFor={`advertisement-${field.key}`}>{field.label}<span className="hint" id={`advertisement-${field.key}-hint`}>{field.hint}</span>
      <textarea id={`advertisement-${field.key}`} aria-describedby={`advertisement-${field.key}-hint`} rows={field.key === "analysis" ? 6 : 3} maxLength={6000} value={values[field.key]} onChange={event => setValues(previous => ({ ...previous, [field.key]: event.target.value }))} />
    </label>)}
    <p className="hint">Your notes stay here while this page is open. Export before leaving. This exercise does not send writing to AI.</p>
    <div className="tool-actions"><ExportFormatSelect value={format} onChange={setFormat} /><button className="button secondary" type="button" onClick={() => downloadRecord(`Advertisement analysis notes\n\nSource: ${example.title}\n${example.credit}\nhttps://mrrinka.com${example.image}\n\nPractice question: ${example.question}\n\n${fields.map(field => `${field.label}\n${values[field.key] || "(Not yet written)"}`).join("\n\n")}\n\nStudent-authored notes; no AI feedback.`, "advertisement-analysis-notes.txt", format)}>Export my notes</button></div>
    <details className="infographic-self-check"><summary>Review your paragraph</summary><ul>
      <li>Have I supported my audience inference with details from the ad?</li>
      <li>Have I connected a verbal choice with a visual choice?</li>
      <li>Does the paragraph develop one interpretation rather than list techniques?</li>
      <li>Have I distinguished a product claim or suggestion from established fact?</li>
      <li>Have I returned to the whole spread to check the relationship?</li>
    </ul></details>
  </section>;
}
