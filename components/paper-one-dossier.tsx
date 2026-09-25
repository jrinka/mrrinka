"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {LiteratureCompanion,LiteraturePractice} from "./literature-paper-one";
import RefineryLinks from "./refinery-links";
import type { RefineryKind } from "@/lib/refineries";
import Markdown from "./markdown";
import dynamic from "next/dynamic";
const PaperTwoPractice = dynamic(() => import("./paper-two-practice"));

const steps = [
  { title: "Orient", text: "This is a CDC public-health advertisement addressing people who smoke. The direct address invites the reader to imagine sharing Becky’s situation. The purpose is to encourage quitting, with a free telephone service offered as the next action.", evidence: "Start with the campaign badge, the second-person headline, and the contact details. These establish speaker, audience, and purpose without inventing a publication context." },
  { title: "Survey", text: "The large upper photograph introduces Becky beside oxygen equipment. The headline crosses this image; below it, the layout divides into explanatory copy and a closer view of her body and tubing. One possible reading path moves from personal encounter to warning, then to explanation and help.", evidence: "Describe a plausible reading path, not a universal one: the layout guides attention, but readers may enter the page at different points." },
  { title: "Select", text: "Focus on the double meaning of “attached.” The reader’s attachment to cigarettes is emotional or habitual; Becky’s connection to the oxygen equipment is physical. The visible tubing makes the verbal warning concrete. The body copy’s “chained” extends the same idea of restricted freedom.", evidence: "Word → visual detail → pattern → meaning. These connected choices make a stronger paragraph than a list of unrelated devices." },
  { title: "Construct", text: "Possible thesis: The CDC advertisement connects the headline’s idea of attachment with Becky’s oxygen tubing to present smoking as a threat to independence. Its offer of free help then gives readers a way to act on that warning.", evidence: "Build around two ideas: dependence made visible; agency offered through support. Each idea can bring language, image, and layout into the same paragraph." },
  { title: "Verify", text: "Check each claim against the advertisement. The tubing supports an interpretation of dependence; the quitline supports the idea of available help. Neither proves that every viewer will feel fear or stop smoking. Use “invites,” “positions,” or “suggests” where the response cannot be guaranteed.", evidence: "Revision: “This scares everyone into quitting” becomes “The pairing invites smokers to reconsider attachment as a possible loss of independence.”" },
];
const source = "https://www.cdc.gov/tobacco/campaign/tips/resources/ads/pdf-print-ads/beckys-tip-print-ad-7x10.pdf";

export default function PaperOneDossier({ body, workedExample = true, literatureExample = false, refinery, paperTwo = false }: { body: string; workedExample?: boolean; literatureExample?:boolean; refinery?:RefineryKind; paperTwo?:boolean }) {
  const sections = body.split(/^## /m).filter(Boolean).map((part) => {
    const [title, ...text] = part.split("\n");
    return { title, id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, ""), text: text.join("\n") };
  });
  const [open, setOpen] = useState<string[]>(["briefing"]);
  const [step, setStep] = useState(0);
  const [active, setActive] = useState("briefing");
  useEffect(() => {
    function revealHash() {
      const id = window.location.hash.slice(1);
      if (id && document.getElementById(id)?.classList.contains("p1-section")) { setOpen((previous) => previous.includes(id) ? previous : [...previous, id]); setActive(id); }
    }
    revealHash();
    function revealLink(event: MouseEvent) {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      const id = anchor?.getAttribute("href")?.slice(1);
      if (id && document.getElementById(id)?.classList.contains("p1-section")) { setOpen(previous => previous.includes(id) ? previous : [...previous, id]); setActive(id); }
    }
    window.addEventListener("hashchange", revealHash);
    document.addEventListener("click", revealLink);
    return () => {
      window.removeEventListener("hashchange", revealHash);
      document.removeEventListener("click", revealLink);
    };
  }, []);
  return (
    <div className={`p1-workbench ${workedExample || literatureExample ? "" : "p1-guidance-only"}`}>
      <div className="p1-guidance">
        <div className="p1-panel-heading"><span className="mono">ASSESSMENT GUIDE</span><button type="button" onClick={() => setOpen(open.length === sections.length ? [] : sections.map(s => s.id))}>{open.length === sections.length ? "Collapse all" : "Expand all"}</button></div>
        {sections.map((section, index) => (
          <section className="p1-section" id={section.id} key={section.id}>
            <h2><button type="button" aria-expanded={open.includes(section.id)} aria-controls={`${section.id}-body`} onClick={() => { setActive(section.id); setOpen(previous => previous.includes(section.id) ? previous.filter(id => id !== section.id) : [...previous, section.id]); }}><span className="mono">{String(index + 1).padStart(2, "0")}</span>{section.title}<span className="p1-toggle" aria-hidden="true">{open.includes(section.id) ? "−" : "+"}</span></button></h2>
            <div id={`${section.id}-body`} hidden={!open.includes(section.id)} className="p1-section-body">
              {(workedExample || literatureExample) && <a className="p1-companion-jump" href="#worked-example" onClick={() => setActive(section.id)}>See this in the {literatureExample ? "poem" : "advertisement"} ↓</a>}
              <Markdown>{section.text}</Markdown>
              {section.id === "practice" && literatureExample && <LiteraturePractice/>}
              {section.id === "practice" && paperTwo && <PaperTwoPractice/>}
              {section.id === "practice" && refinery && !literatureExample && !paperTwo && <RefineryLinks kind={refinery} />}
            </div>
          </section>
        ))}
      </div>
      {literatureExample && <LiteratureCompanion section={active} title={sections.find(s=>s.id===active)?.title??"Briefing"}/>}
      {workedExample && <aside id="worked-example" className="p1-example" aria-label="Worked example: Becky’s CDC advertisement">
        <div className="p1-panel-heading"><span className="mono">WORKED EXAMPLE</span><span className="mono">CDC · BECKY</span></div>
        <div className="p1-example-inner">
          <p className="p1-context">Alongside: <strong>{sections.find(s => s.id === active)?.title ?? "Briefing"}</strong></p>
          <p className="p1-question"><strong>Practice guiding question</strong>How do language and image work together to persuade the audience to quit smoking?</p>
          <figure className="p1-ad">
            <a href={source} target="_blank" rel="noopener noreferrer" aria-label="Open Becky’s full-size CDC advertisement in a new tab"><Image src="/examples/cdc-becky.jpg" width={1120} height={1600} sizes="(max-width: 1050px) 90vw, 420px" alt="CDC advertisement showing Becky seated beside oxygen equipment. The headline connects attachment to cigarettes with an oxygen tank; below are explanatory text, a quitline, and a close-up of her scar and tubing." /></a>
            <figcaption><a href={source} target="_blank" rel="noopener noreferrer">CDC · Tips From Former Smokers · Open full-size ad ↗</a></figcaption>
          </figure>
          {active === "method" && <><div className="p1-step-buttons" aria-label="Worked example steps">{steps.map((item, index) => <button type="button" key={item.title} aria-pressed={step === index} onClick={() => setStep(index)}>{`${index + 1} ${item.title}`}</button>)}</div>
          <div className="p1-step" aria-live="polite" aria-atomic="true"><h3>{steps[step].title}</h3><p>{steps[step].text}</p><p className="p1-evidence">{steps[step].evidence}</p></div>
          </>}
          <ExampleNotes section={active} />
          {active === "models" && <details open className="p1-model"><summary>See a worked analytical paragraph</summary><p>The headline gives “attached” two connected meanings. It first refers to a smoker’s dependence on cigarettes, then to Becky’s physical connection to oxygen equipment. The tubing across her body makes this second meaning visible. Read together, the headline and photograph suggest that smoking can lead to a loss of independence. The later offer of free help gives readers a possible response to the warning: they can seek support to quit.</p><p className="hint"><strong>What the paragraph does:</strong> identifies a precise choice, links it to visible evidence, develops an interpretation, and connects that interpretation to the ad’s purpose. This is one defensible reading, not an official marked response.</p></details>}
          {active === "practice" && <details className="p1-model"><summary>Try the same method with Amanda or Brian</summary><p><strong>Amanda:</strong> trace how the headline’s reference to size works with the photograph of the baby and the incubator. What relationship does the ad construct between physical smallness and emotional significance?</p><p><strong>Brian:</strong> connect the military vocabulary with the contrast between the upright portrait and the hospital photograph. How does that sequence complicate the idea of strength?</p><a href="https://cdc.gov/tobacco/campaign/tips/resources/ads/index.html" target="_blank" rel="noopener noreferrer">Explore the original CDC print ads ↗</a></details>}
        </div>
      </aside>}
    </div>
  );
}


function ExampleNotes({ section }: { section: string }) {
  if (section === "method") return null;
  const notes: Record<string, { title: string; body: string }[]> = {
    briefing: [
      { title: "A direction for the reading", body: "The ad presents smoking as a threat to independence. Test that reading through the relationship between the headline, the oxygen tubing, and the offer of help. The question asks how these choices work together." },
    ],
    avoid: [
      { title: "A weak claim", body: "“The oxygen tank grabs attention and makes everyone want to stop smoking.” This names a generic effect and assumes a response from every viewer." },
      { title: "A supported revision", body: "“The tubing makes the headline’s idea of attachment physically visible, inviting smokers to consider how dependence could restrict their freedom.” The revision connects a visible detail to the wording and limits the claim to what the ad invites." },
      { title: "Another trap: retelling", body: "“Becky sits next to an oxygen tank” records content. Ask why that equipment is prominent beside her and how it changes the meaning of the headline." },
    ],
    criteria: [
      { title: "A · From observation to inference", body: "Observation: the photograph shows Becky connected to oxygen equipment. Inference: the combination of the tubing and the headline presents dependence as a restriction on independence. The inference goes beyond what is literally pictured, but remains grounded in the text." },
      { title: "B · From analysis to evaluation", body: "Analysis: “attached” has both a habitual and a physical meaning. Evaluation: making the second meaning visible gives the warning particular force; the reader is invited to reinterpret a familiar attachment as a constraint. This explains why the interaction of word and image matters to the ad’s purpose." },
      { title: "What the level 4 descriptor asks for", body: "Criterion B looks for appropriate analysis with moments of insight and good evaluation of how choices shape meaning. The move above illustrates that development; one sentence cannot establish the mark for a whole response." },
      { title: "C and D · Connect and clarify", body: "Organize a paragraph around dependence, bringing the headline and photograph together. Prefer a precise analytical verb such as “recasts” to inflated language that obscures the point." },
    ],
    practice: [
      { title: "Try before reading on", body: "Explain the movement from the headline’s warning to the offer of free help in two sentences. Use one exact detail from each part and connect them to the audience’s possible response." },
      { title: "Self-check", body: "Did you explain the relationship between warning and support, or only identify two tones? Did you distinguish an invitation to act from proof that a reader will act?" },
    ],
    "field-tools": [
      { title: "A three-column annotation", body: "Detail: the oxygen tubing. Choice: a visible physical connection beside the language of attachment. Meaning: dependence presented as a restriction. Repeat that sequence with the direct address or the help offered in the lower panel." },
      { title: "SOAPSTone in use", body: "Separate the CDC as publisher from Becky as the personal voice. Identify the audience from the address to smokers. Notice how the warning tone gives way to encouragement. Use those notes to support a reading of the choices." },
    ],
    models: [
      { title: "Read for the reasoning", body: "In the paragraph below, notice the sequence: a verbal choice, a visual detail, an interpretation, and a connection to purpose. Its value is in those connections, not in a sentence pattern to copy." },
    ],
  };
  return <div className="p1-example-notes" aria-live="polite">{(notes[section] ?? notes.briefing).map(note => <section key={note.title}><h3>{note.title}</h3><p>{note.body}</p></section>)}</div>;
}
