"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Markdown from "./markdown";
import ExportFormatSelect from "./export-format";
import { downloadRecord, type ExportFormat } from "@/lib/practice-record";
import { splitGuideSections } from "@/lib/guide-sections";
import { blogExample as example } from "@/lib/blog-example";
import styles from "./elephant-appeal.module.css";
const reading: Record<string, {label:string;phase:string;view:number}> = example.sections;
const fields = [
 {key:"audience",label:"The post’s argument",hint:"How does the writer turn a shared difficulty into advice?"},
 {key:"evidence",label:"Connected words and images",hint:"Connect a precise phrase with an illustration or a later development in the post."},
 {key:"analysis",label:"Your analytical paragraph",hint:"Develop one claim about how the post persuades, with evidence and explanation."},
] as const;

export default function BlogGuide({ body, href }: { body: string; href: string }) {
  const sections = useMemo(() => splitGuideSections(body), [body]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewIndex, setViewIndex] = useState(0);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<HTMLElement>(null);
  const headings = useRef<(HTMLHeadingElement | null)[]>([]);
  const sourceRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const active = sections[activeIndex] ?? sections[0];

  const labelFor = (index: number) => reading[sections[index]?.id]?.label ?? sections[index]?.title;

  useEffect(() => {
    function readHash() {
      const index = sections.findIndex(section => section.id === window.location.hash.slice(1));
      setActiveIndex(Math.max(0, index));
      setViewIndex(reading[sections[Math.max(0, index)]?.id]?.view ?? 0);
    }
    readHash();
    window.addEventListener("popstate", readHash);
    window.addEventListener("hashchange", readHash);
    return () => { window.removeEventListener("popstate", readHash); window.removeEventListener("hashchange", readHash); };
  }, [sections]);

  useEffect(() => { sourceRef.current?.scrollTo({ top: 0 }); }, [activeIndex, viewIndex]);

  function goTo(index: number) {
    if (!sections[index]) return;
    setActiveIndex(index);
    setViewIndex(reading[sections[index].id]?.view ?? 0);
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
      <aside className={`advertisement-viewer ${styles.source}`} ref={sourceRef} tabIndex={0} aria-label="Blog post source views">
        <div className="text-type-example-head"><span className="mono">SOURCE / OLIVER EMBERTON</span><button type="button" onClick={() => dialogRef.current?.showModal()}>Enlarge source ↗</button></div>
        <SourceControls viewIndex={viewIndex} onChange={setViewIndex} />
        <div className={styles.screenSource}><SourceFigure viewIndex={viewIndex} /></div>
        <div className={styles.printSource}><SourceFigure viewIndex={0} /><SourceFigure viewIndex={1} /></div>
        <p className="advertisement-source-status" role="status">Showing: <strong>{example.views[viewIndex].label}</strong>. Change views to compare without leaving this section.</p>
        <details className="advertisement-transcript"><summary>Read the blog’s wording</summary><p className="hint">Source wording from the supplied exam version. Illustration labels are placed after the related paragraphs; typography and emphasis are normalized. Images preserve the original layout. Supplied explanations are summarized separately.</p><Markdown>{example.transcript}</Markdown></details>
        <details className="advertisement-transcript"><summary>Image descriptions and source notes</summary><p>{example.views[0].alt}</p><p>{example.views[1].alt}</p><p>Colorful cartoon bees give the argument a repeated visual comparison. In the third illustration, mathematical notation and a descending curve present an apparent relationship between divided effort and achievement. The second page uses bold numbered imperatives. Its final point allows compatible goals to support each other.</p><p>{example.credit}</p><p><a href={example.url} target="_blank" rel="noopener noreferrer">Read the current post on the author’s website ↗</a></p></details>
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
          {section.id === "practice-and-transfer" && <BlogNotes />}
        </section>)}
        <nav className="advertisement-reader-pager" aria-label="Continue reading">
          <button type="button" disabled={activeIndex === 0} onClick={() => goTo(activeIndex - 1)}>← {labelFor(activeIndex - 1) ?? "Previous"}</button>
          {activeIndex < sections.length - 1 ? <button type="button" onClick={() => goTo(activeIndex + 1)}>Next: {labelFor(activeIndex + 1)} →</button> : <button type="button" onClick={() => goTo(0)}>Return to the whole reading ↗</button>}
        </nav>
      </div>
    </div>
    <dialog ref={dialogRef} className={`advertisement-source-dialog ${styles.dialog}`} aria-labelledby="blog-source-title" onClick={event => { if (event.target === dialogRef.current) dialogRef.current?.close(); }}>
      <div className="advertisement-dialog-heading"><h2 id="blog-source-title">Emberton — source viewer</h2><button type="button" autoFocus onClick={() => dialogRef.current?.close()}>Close ×</button></div>
      <SourceControls viewIndex={viewIndex} onChange={setViewIndex} enlarged /><SourceFigure viewIndex={viewIndex} />
    </dialog>
  </div>;
}

function BlogNotes() {
  const [values, setValues] = useState({ audience: "", evidence: "", analysis: "" });
  const [format, setFormat] = useState<ExportFormat>("txt");
  return <section className="infographic-notes" aria-label="Blog post analysis notebook">
    <h3>Try a connected reading</h3>
    {fields.map(field => <label className="field" key={field.key} htmlFor={`blog-${field.key}`}>{field.label}<span className="hint" id={`blog-${field.key}-hint`}>{field.hint}</span><textarea id={`blog-${field.key}`} aria-describedby={`blog-${field.key}-hint`} rows={field.key === "analysis" ? 6 : 3} maxLength={6000} value={values[field.key]} onChange={event => setValues(previous => ({ ...previous, [field.key]: event.target.value }))} /></label>)}
    <p className="hint">Your notes stay while you move between sections. Export before switching examples, leaving or refreshing. This exercise does not send writing to AI.</p>
    <div className="tool-actions"><ExportFormatSelect value={format} onChange={setFormat} /><button className="button secondary" type="button" onClick={() => downloadRecord(`Blog post analysis notes\n\nSource: ${example.title}\nhttps://mrrinka.com${example.views[0].image}\nhttps://mrrinka.com${example.views[1].image}\n\nQuestion from the supplied paper: ${example.question}\n\n${fields.map(field => `${field.label}\n${values[field.key] || "(Not yet written)"}`).join("\n\n")}\n\nStudent-authored notes; no AI feedback.`, "blog-post-notes.txt", format)}>Export my notes</button></div>
    <details className="infographic-self-check"><summary>Review your paragraph</summary><ul><li>Have I connected precise evidence with the post’s persuasive purpose?</li><li>Have I explained how the writer’s relationship with the reader develops?</li><li>Have I noticed qualifications as well as confident claims?</li><li>Have I distinguished the graph’s persuasive effect from proof of its equation?</li></ul></details>
  </section>;
}

function SourceControls({viewIndex,onChange,enlarged=false}:{viewIndex:number;onChange:(index:number)=>void;enlarged?:boolean}) {
 return <div className="advertisement-view-controls" role="group" aria-label={enlarged ? "Enlarged source views" : "Source views"}>{example.views.map((view,index)=><button type="button" key={view.label} aria-pressed={viewIndex===index} onClick={()=>onChange(index)}>{view.label}</button>)}</div>;
}
function SourceFigure({viewIndex}:{viewIndex:number}) {
 const view=example.views[viewIndex];
 return <figure className={styles.figure}><Image src={view.image} alt={view.alt} width={view.width} height={view.height} unoptimized /><figcaption>{view.label} · Oliver Emberton, oliveremberton.com. Supplied exam version. <a href={view.image} target="_blank" rel="noopener noreferrer">Full-size source image ↗</a></figcaption></figure>;
}
