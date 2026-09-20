"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Markdown from "./markdown";

const steps = [
  { title: "Orient", text: "This is a CDC public-health advertisement addressing people who smoke. The direct address invites the reader to imagine sharing Becky’s situation. The purpose is to encourage quitting, with a free telephone service offered as the next action.", evidence: "Start with the campaign badge, the second-person headline, and the contact details. These establish speaker, audience, and purpose without inventing a publication context." },
  { title: "Survey", text: "The large upper photograph introduces Becky beside oxygen equipment. The headline crosses this image; below it, the layout divides into explanatory copy and a closer view of her body and tubing. One possible reading path moves from personal encounter to warning, then to explanation and help.", evidence: "Describe a plausible reading path, not a universal one: the layout guides attention, but readers may enter the page at different points." },
  { title: "Select", text: "Focus on the double meaning of “attached.” The reader’s attachment to cigarettes is emotional or habitual; Becky’s connection to the oxygen equipment is physical. The visible tubing makes the verbal warning concrete. The body copy’s “chained” extends the same idea of restricted freedom.", evidence: "Word → visual detail → pattern → meaning. These connected choices make a stronger paragraph than a list of unrelated devices." },
  { title: "Construct", text: "Possible thesis: By turning attachment into a visible physical constraint, the CDC advertisement presents smoking as a threat to independence, then offers quitting as an achievable response through its direct invitation to seek help.", evidence: "Build around two ideas: dependence made visible; agency offered through support. Each idea can bring language, image, and layout into the same paragraph." },
  { title: "Verify", text: "Check each claim against the advertisement. The tubing supports an interpretation of dependence; the quitline supports the idea of available help. Neither proves that every viewer will feel fear or stop smoking. Use “invites,” “positions,” or “suggests” where the response cannot be guaranteed.", evidence: "Revision: “This scares everyone into quitting” becomes “The pairing invites smokers to reconsider attachment as a possible loss of independence.”" },
];
const source = "https://www.cdc.gov/tobacco/campaign/tips/resources/ads/pdf-print-ads/beckys-tip-print-ad-7x10.pdf";

export default function PaperOneDossier({ body }: { body: string }) {
  const sections = body.split(/^## /m).filter(Boolean).map((part) => {
    const [title, ...text] = part.split("\n");
    return { title, id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, ""), text: text.join("\n") };
  });
  const [open, setOpen] = useState<string[]>(["briefing"]);
  const [step, setStep] = useState(0);
  useEffect(() => {
    function revealHash() {
      const id = window.location.hash.slice(1);
      if (id) setOpen((previous) => previous.includes(id) ? previous : [...previous, id]);
    }
    revealHash();
    function revealLink(event: MouseEvent) {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      const id = anchor?.getAttribute("href")?.slice(1);
      if (id) setOpen(previous => previous.includes(id) ? previous : [...previous, id]);
    }
    window.addEventListener("hashchange", revealHash);
    document.addEventListener("click", revealLink);
    return () => {
      window.removeEventListener("hashchange", revealHash);
      document.removeEventListener("click", revealLink);
    };
  }, []);
  return (
    <div className="p1-workbench">
      <div className="p1-guidance">
        <div className="p1-panel-heading"><span className="mono">01 / THE METHOD</span><button type="button" onClick={() => setOpen(open.length === sections.length ? [] : sections.map(s => s.id))}>{open.length === sections.length ? "Collapse all" : "Expand all"}</button></div>
        {sections.map((section, index) => (
          <section className="p1-section" id={section.id} key={section.id}>
            <h2><button type="button" aria-expanded={open.includes(section.id)} aria-controls={`${section.id}-body`} onClick={() => setOpen(previous => previous.includes(section.id) ? previous.filter(id => id !== section.id) : [...previous, section.id])}><span className="mono">{String(index + 1).padStart(2, "0")}</span>{section.title}<span className="p1-toggle" aria-hidden="true">{open.includes(section.id) ? "−" : "+"}</span></button></h2>
            <div id={`${section.id}-body`} hidden={!open.includes(section.id)} className="p1-section-body">
              <Markdown>{section.text}</Markdown>
            </div>
          </section>
        ))}
      </div>
      <aside className="p1-example" aria-label="Worked example: Becky’s CDC advertisement">
        <div className="p1-panel-heading"><span className="mono">02 / UNDER THE LENS</span><span className="mono">CDC · BECKY</span></div>
        <div className="p1-example-inner">
          <p className="p1-question"><strong>Practice guiding question</strong>How do language and image work together to persuade the audience to quit smoking?</p>
          <figure className="p1-ad">
            <a href={source} target="_blank" rel="noopener noreferrer" aria-label="Open Becky’s full-size CDC advertisement in a new tab"><Image src="/examples/cdc-becky.jpg" width={1120} height={1600} sizes="(max-width: 1050px) 90vw, 420px" alt="CDC advertisement showing Becky seated beside oxygen equipment. The headline connects attachment to cigarettes with an oxygen tank; below are explanatory text, a quitline, and a close-up of her scar and tubing." /></a>
            <figcaption><a href={source} target="_blank" rel="noopener noreferrer">CDC · Tips From Former Smokers · Open full-size ad ↗</a></figcaption>
          </figure>
          <div className="p1-step-buttons" aria-label="Worked example steps">{steps.map((item, index) => <button type="button" key={item.title} aria-pressed={step === index} onClick={() => setStep(index)}>{index + 1} {item.title}</button>)}</div>
          <div className="p1-step" aria-live="polite" aria-atomic="true"><h3>{steps[step].title}</h3><p>{steps[step].text}</p><p className="p1-evidence">{steps[step].evidence}</p></div>
          <details className="p1-model"><summary>See a worked analytical paragraph</summary><p>The headline gives “attached” a double meaning: a smoker’s habitual attachment to cigarettes becomes a physical connection to oxygen equipment. The tubing visible across Becky’s body makes that second meaning concrete, so the warning depends on the interaction of words and photograph. This pairing invites the audience to reconsider smoking as a potential loss of independence. The later offer of free help gives the reader a possible action in response to that warning.</p><p className="hint"><strong>What the paragraph does:</strong> identifies a precise choice, links it to visible evidence, develops an interpretation, and connects that interpretation to the ad’s purpose. This is one defensible reading, not an official marked response.</p></details>
          <details className="p1-model"><summary>Try the same method with Amanda or Brian</summary><p><strong>Amanda:</strong> trace how the headline’s reference to size works with the photograph of the baby and the incubator. What relationship does the ad construct between physical smallness and emotional significance?</p><p><strong>Brian:</strong> connect the military vocabulary with the contrast between the upright portrait and the hospital photograph. How does that sequence complicate the idea of strength?</p><a href="https://cdc.gov/tobacco/campaign/tips/resources/ads/index.html" target="_blank" rel="noopener noreferrer">Explore the original CDC print ads ↗</a></details>
        </div>
      </aside>
    </div>
  );
}
