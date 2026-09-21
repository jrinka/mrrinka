"use client";
import { useState } from "react";
import { Download } from "lucide-react";
import { downloadRecord } from "@/lib/practice-record";
import { readingMethods, type ReadingMethod } from "@/lib/reading-methods";
export default function ReadingGrid({method}:{method:ReadingMethod}) {
 const guide=readingMethods[method];
 const [notes,setNotes]=useState<string[]>(guide.steps.map(()=>""));
 const [text,setText]=useState("");
 return <section className="reading-workshop">
  <div className="tool-actions"><a className="button secondary" href={`/downloads/${method}-grid.html`} download><Download size={16}/> Download blank grid (.html)</a><button className="button secondary" type="button" onClick={()=>downloadRecord(`${guide.title} reading notes\nText: ${text}\n\n${guide.steps.map((s,i)=>`${s.title}\n${notes[i]||"(Not yet recorded)"}`).join("\n\n")}`,`${method}-notes.txt`)}>Save my notes (.txt)</button></div>
  <p className="hint">The download opens in a browser for printing or offline use. Notes typed here stay on this page only; save them before leaving. No AI is used.</p>
  <label className="field">Your text and author (if trying a different text)<input value={text} onChange={e=>setText(e.target.value)} maxLength={300}/></label>
  <div className="reading-grid-head mono"><span>READING MOVE</span><span>WORKED EXAMPLE / {guide.work}</span><span>YOUR NOTES</span></div>
  {guide.steps.map((step,i)=><section className="reading-grid-row" key={step.title}><div><span className="method-letter" aria-hidden="true">{step.letter}</span><h2>{step.title}</h2><p>{step.prompt}</p></div><div className="reading-model"><span className="mono">WORKED EXAMPLE</span><p>{step.example}</p></div><label className="field">Your notes: {step.title}<textarea rows={4} maxLength={2500} value={notes[i]} onChange={e=>setNotes(current=>current.map((n,index)=>index===i?e.target.value:n))}/></label></section>)}
  <aside className="lens-intro"><h2>Turn the grid into an argument</h2><p>{guide.bridge}</p><a href="/resources/observation-to-analysis">Practise moving from observation to analysis →</a></aside>
 </section>;
}
