"use client";

import { useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import Markdown from "./markdown";
import ExportFormatSelect from "./export-format";
import { downloadRecord, type ExportFormat } from "@/lib/practice-record";
import { advertisementExample as example, advertisementViews as views, advertisementNoteFields as fields } from "@/lib/advertisement-example";

export default function AdvertisementGuide({ body }: { body: string }) {
  const [viewIndex, setViewIndex] = useState(0);
  const sourceRef = useRef<HTMLElement>(null);
  const view = views[viewIndex];
  const ratio = (example.width * view.width) / (example.height * view.height);

  function followZoom(event: MouseEvent<HTMLDivElement>) {
    const anchor = event.target instanceof Element ? event.target.closest("a") : null;
    const href = anchor?.getAttribute("href");
    if (!href?.startsWith("#ad-view-") || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const index = views.findIndex(item => item.id === href.slice("#ad-view-".length));
    if (index < 0) return;
    event.preventDefault();
    setViewIndex(index);
    sourceRef.current?.focus({ preventScroll: true });
    sourceRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  }

  return <div className="advertisement-guide" onClick={followZoom}>
    <section className="advertisement-viewer" id="advertisement-source" ref={sourceRef} tabIndex={-1} aria-label="FIJI Water source and close-up views">
      <div className="text-type-example-head"><span className="mono">EXAMINE THE SOURCE</span><span className="mono">FIJI WATER / PRINT AD</span></div>
      <div className="advertisement-view-controls" role="group" aria-label="Choose a source view">
        {views.map((item, index) => <button id={`ad-view-${item.id}`} key={item.id} type="button" aria-pressed={index === viewIndex} aria-controls="advertisement-crop advertisement-view-notes" onClick={() => setViewIndex(index)}>{item.label}</button>)}
      </div>
      <div className="advertisement-view-layout">
        <figure>
          <div className="advertisement-image-stage">
            <div id="advertisement-crop" className="advertisement-crop" style={{ aspectRatio: ratio, width: `min(100%, ${500 * ratio}px)` }}>
              <Image src={example.image} alt={view.alt} width={example.width} height={example.height} unoptimized loading="eager"
                style={{ width: `${100 / view.width}%`, left: `${-view.x / view.width * 100}%`, top: `${-view.y / view.height * 100}%` }} />
            </div>
          </div>
          <figcaption>{example.credit} <a href={example.image} target="_blank" rel="noopener noreferrer">Open complete source image ↗</a></figcaption>
        </figure>
        <div className="advertisement-view-notes" id="advertisement-view-notes">
          <div aria-live="polite" aria-atomic="true"><span className="mono">{viewIndex === 0 ? "WHOLE COMPOSITION" : `DETAIL / 0${viewIndex}`}</span><h3>{view.title}</h3><p>{view.prompt}</p></div>
          <Link className="advertisement-analysis-link" href={`?view=example#${view.section}`}>Read the analysis ↓</Link>
          <div className="advertisement-step-controls">
            <button type="button" disabled={viewIndex === 0} onClick={() => setViewIndex(index => index - 1)}>← Previous</button>
            <button type="button" disabled={viewIndex === views.length - 1} onClick={() => setViewIndex(index => index + 1)}>Next detail →</button>
          </div>
          {viewIndex > 0 && <button className="advertisement-reset" type="button" onClick={() => setViewIndex(0)}>Return to whole ad</button>}
          <p className="hint">Close-ups use the same scan. Return to the whole ad to check size, placement and contrast.</p>
        </div>
      </div>
      <details className="advertisement-transcript"><summary>Read the ad’s wording</summary>
        <p className="hint">Transcription of the displayed scan; line breaks are joined. These are the advertiser’s claims. Tiny packaging text is not fully legible.</p>
        {example.transcript.map(part => <div key={part.title}><h3>{part.title}</h3><p>{part.text}</p></div>)}
      </details>
    </section>
    <div className="advertisement-analysis"><Markdown>{body}</Markdown><AdvertisementNotes /></div>
  </div>;
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
