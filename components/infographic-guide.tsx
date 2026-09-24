"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Markdown from "./markdown";
import ExportFormatSelect from "./export-format";
import { downloadRecord, type ExportFormat } from "@/lib/practice-record";
import { infographicExample as example, infographicViews, infographicNoteFields } from "@/lib/infographic-example";

export default function InfographicGuide({ body }: { body: string }) {
  const sections = body.split(/^## /m).filter(Boolean).map(part => {
    const [title, ...text] = part.split("\n");
    return { title, id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, ""), text: text.join("\n") };
  });
  const [open, setOpen] = useState<string[]>([sections[0]?.id ?? "start-here"]);

  useEffect(() => {
    function reveal(id: string) {
      if (id && document.getElementById(id)?.classList.contains("infographic-section")) {
        setOpen(previous => previous.includes(id) ? previous : [...previous, id]);
      }
    }
    function revealHash() { reveal(window.location.hash.slice(1)); }
    function revealLink(event: MouseEvent) {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      reveal(anchor?.getAttribute("href")?.slice(1) ?? "");
    }
    revealHash();
    window.addEventListener("hashchange", revealHash);
    document.addEventListener("click", revealLink);
    return () => {
      window.removeEventListener("hashchange", revealHash);
      document.removeEventListener("click", revealLink);
    };
  }, []);

  return <>
    <nav className="infographic-jump" aria-label="Infographic guide sections">
      <span className="mono">ON THIS PAGE</span>
      {sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
    </nav>
    <div className="text-type-guide infographic-guide">
      <div className="p1-guidance">
        <div className="p1-panel-heading"><span className="mono">READ · INTERPRET · TRANSFER</span><button type="button" onClick={() => setOpen(open.length === sections.length ? [] : sections.map(section => section.id))}>{open.length === sections.length ? "Collapse all" : "Expand all"}</button></div>
        {sections.map((section, index) => <section className="p1-section infographic-section" id={section.id} key={section.id}>
          <h2><button type="button" aria-expanded={open.includes(section.id)} aria-controls={`${section.id}-body`} onClick={() => setOpen(previous => previous.includes(section.id) ? previous.filter(id => id !== section.id) : [...previous, section.id])}>
            <span className="mono">{String(index + 1).padStart(2, "0")}</span>{section.title}<span className="p1-toggle" aria-hidden="true">{open.includes(section.id) ? "−" : "+"}</span>
          </button></h2>
          <div id={`${section.id}-body`} className="p1-section-body" hidden={!open.includes(section.id)}>
            <a className="p1-companion-jump" href="#infographic-source">View the infographic ↓</a>
            <Markdown>{section.text}</Markdown>
            {section.id === "practice-and-transfer" && <InfographicNotes />}
          </div>
        </section>)}
      </div>
      <InfographicSource />
    </div>
  </>;
}

function InfographicSource() {
  const [viewIndex, setViewIndex] = useState(0);
  const view = infographicViews[viewIndex];
  return <aside id="infographic-source" className="text-type-example infographic-source" aria-label="Source infographic and close-up views">
    <div className="text-type-example-head"><span className="mono">SOURCE / {example.year}</span><span className="mono">DHSC · UK</span></div>
    <div className="infographic-view-controls" role="group" aria-label="Choose a source view">
      {infographicViews.map((item, index) => <button type="button" key={item.id} aria-pressed={viewIndex === index} aria-controls="infographic-view" onClick={() => setViewIndex(index)}>{item.label}</button>)}
    </div>
    <figure>
      <a href={example.image} target="_blank" rel="noopener noreferrer" aria-label="Open the complete infographic at full resolution in a new tab">
        <div id="infographic-view" className="infographic-crop" style={{ aspectRatio: `${1819 * view.width} / ${2573 * view.height}` }}>
          <Image src={example.image} width={1819} height={2573} loading="eager" unoptimized
            alt={view.id === "whole" ? example.alt : `${view.label} detail of ${example.title}. ${view.note}`}
            style={{ width: `${10000 / view.width}%`, left: `${-100 * view.x / view.width}%`, top: `${-100 * view.y / view.height}%` }} />
        </div>
      </a>
      <figcaption><a href={example.image} target="_blank" rel="noopener noreferrer">Open full-size image ↗</a> · <a href={example.pdf} download>Download original PDF ↓</a></figcaption>
    </figure>
    <div className="text-type-example-note" aria-live="polite" aria-atomic="true"><h2>{view.term}</h2><p>{view.note}</p></div>
    <p className="text-type-example-source">
      <a href={example.context} target="_blank" rel="noopener noreferrer" title="Department of Health and Social Care · UK Chief Medical Officers’ Physical Activity Guidelines">Department of Health and Social Care ↗</a><br />
      © Crown copyright 2019 · <a href={example.license} target="_blank" rel="noopener noreferrer">Open Government Licence v3.0 ↗</a><br />
      <a href={example.source} target="_blank" rel="noopener noreferrer">2019 original preserved by Cumbria Council ↗</a>. Historical text for analysis; GOV.UK now provides revised guidance.
    </p>
    <details className="infographic-transcript"><summary>Read the infographic as text</summary><div>
      <h3>Physical activity for early years (birth–5 years)</h3>
      <p>Active children are healthy, happy, school ready and sleep better.</p>
      <ul><li>Builds relationships &amp; social skills</li><li>Maintains health &amp; weight</li><li>Contributes to brain development &amp; learning</li><li>Improves sleep</li><li>Develops muscles &amp; bones</li><li>Encourages movement &amp; co-ordination</li></ul>
      <p><strong>Every movement counts.</strong></p>
      <p>Aim for at least 180 minutes per day for children 1–5 years. Under-1s: at least 30 minutes across the day.</p>
      <p>Activity labels: playground; jump; climb; messy play; throw/catch; skip; object play; dance; games; play; tummy time; swim; walk; scoot; bike.</p>
      <p>Get Strong. Move More. Break up inactivity.</p>
      <p>UK Chief Medical Officers’ Physical Activity Guidelines, 2019.</p>
    </div></details>
  </aside>;
}

function InfographicNotes() {
  const [values, setValues] = useState({ audience: "", evidence: "", analysis: "" });
  const [format, setFormat] = useState<ExportFormat>("txt");
  return <div className="infographic-notes">
    <h3>Try a connected reading</h3>
    <p>Choose the activity tiles or the closing instructions. Use your audience inference to explain why the choices matter.</p>
    {infographicNoteFields.map(field => <label className="field" key={field.key} htmlFor={`infographic-${field.key}`}>{field.label}<span className="hint" id={`infographic-${field.key}-hint`}>{field.hint}</span>
      <textarea id={`infographic-${field.key}`} aria-describedby={`infographic-${field.key}-hint`} rows={field.key === "analysis" ? 6 : 3} maxLength={6000} value={values[field.key]} onChange={event => setValues(previous => ({ ...previous, [field.key]: event.target.value }))} />
    </label>)}
    <p className="hint">Your notes stay here while this page is open. Export before leaving. This exercise does not send writing to AI.</p>
    <div className="tool-actions"><ExportFormatSelect value={format} onChange={setFormat} /><button className="button secondary" type="button" onClick={() => downloadRecord(`Infographic analysis notes\n\nSource: ${example.title} (${example.year}), Department of Health and Social Care\n${example.source}\n© Crown copyright. Open Government Licence v3.0.\n\nPractice question: ${example.question}\n\n${infographicNoteFields.map(field => `${field.label}\n${values[field.key] || "(Not yet written)"}`).join("\n\n")}\n\nStudent-authored notes; no AI feedback.`, "infographic-analysis-notes.txt", format)}>Export my notes</button></div>
    <details className="infographic-self-check"><summary>Review your paragraph</summary><ul>
      <li>Did I distinguish the people shown or discussed from the people being addressed?</li>
      <li>Can I point to every word or visual detail I claim is there?</li>
      <li>Have I connected words and design rather than writing two separate lists?</li>
      <li>Does my explanation say why this choice suits this audience and purpose?</li>
      <li>Have I described a possible effect without claiming to know every reader’s reaction?</li>
    </ul></details>
  </div>;
}
