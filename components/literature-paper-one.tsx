"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import ExportFormatSelect from "./export-format";
import {ContinueToRefinery} from "./practice-transfer";
import {downloadRecord,type ExportFormat} from "@/lib/practice-record";
import {literatureExample as poem,literatureSteps,literatureNotes,literatureModel,literatureSourceText} from "@/lib/literature-example";

export function LiteratureCompanion({section,title}:{section:string;title:string}) {
 const [step,setStep]=useState(0);
 const [format,setFormat]=useState<ExportFormat>("txt");
 const panel=useRef<HTMLElement>(null);
 useEffect(()=>{panel.current?.scrollTo({top:0});},[section]);
 return <aside ref={panel} id="worked-example" className="p1-example literature-companion" aria-label="Worked example: Up-Hill by Christina Rossetti">
  <div className="p1-panel-heading"><span className="mono">WORKED EXAMPLE</span><span className="mono">THRESHOLD</span></div>
  <div className="p1-example-inner">
   <p className="p1-context">Alongside: <strong>{title}</strong></p>
   <p className="p1-question"><strong>Practice guiding question</strong>{poem.question}</p>
   <details key={section} open={section==="briefing"} className="lit-poem"><summary>Read “{poem.title}” · 16 lines</summary><h3>{poem.title}</h3><p className="lit-poet">{poem.author}</p>{poem.stanzas.map((stanza,s)=><p className="lit-stanza" key={s}>{stanza.map((line,i)=><span className={`lit-line ${i%2 ? "lit-answer" : ""}`} key={i}><span className="lit-line-number" aria-hidden="true">{s*4+i+1}</span><span>{line}</span></span>)}</p>)}</details>
   <p className="lit-source"><a href={poem.source} target="_blank" rel="noreferrer">Academy of American Poets ↗</a> · Public-domain text. Line numbers added for reference.</p>
   {section==="method"&&<><div className="p1-step-buttons" aria-label="Poem worked example steps">{literatureSteps.map((item,i)=><button type="button" key={item.title} aria-pressed={step===i} onClick={()=>setStep(i)}>{i+1} {item.title}</button>)}</div><section className="p1-step" aria-live="polite" aria-atomic="true"><span className="mono">LINES {literatureSteps[step].lines}</span><h3>{literatureSteps[step].title}</h3><p><strong>Notice:</strong> {literatureSteps[step].observation}</p><p><strong>Develop:</strong> {literatureSteps[step].interpretation}</p><p className="p1-evidence"><strong>Test:</strong> {literatureSteps[step].test}</p></section></>}
   <div className="p1-example-notes">{(literatureNotes[section]??[]).map(note=><section key={note.title}><h3>{note.title}</h3><p>{note.body}</p></section>)}</div>
   {section==="models"&&<section className="lit-model"><h3>One worked paragraph</h3><p>{literatureModel.map(part=>part.text).join(" ")}</p><details className="p1-model"><summary>Unpack the reasoning</summary>{literatureModel.map(part=><section key={part.label}><h4>{part.label}</h4><blockquote>{part.text}</blockquote><p>{part.note}</p></section>)}</details></section>}
   {section==="field-tools"&&<><div className="tool-actions"><ExportFormatSelect value={format} onChange={setFormat}/><button type="button" className="button secondary" onClick={()=>downloadRecord(`${literatureSourceText()}\n\nPractice guiding question\n${poem.question}`,"up-hill-practice-extract.txt",format)}>Download poem + question</button></div><p><Link href="/resources/reading-methods/tpcastt">Open the TPCASTT grid →</Link></p></>}
  </div>
 </aside>;
}

export function LiteraturePractice(){
 const [draft,setDraft]=useState("");const [revision,setRevision]=useState("");const [format,setFormat]=useState<ExportFormat>("txt");
 return <section className="lit-practice"><span className="mono">TRY IT / NO AI</span><h3>From “me” to “all”</h3><p>Write two or three sentences on the final question and answer. Explain how the wording develops the relationship between uncertainty and reassurance.</p><blockquote>Will there be beds for me and all who seek?<br/>Yea, beds for all who come.</blockquote>
 <label className="field">My first reading<textarea rows={5} maxLength={3500} value={draft} onChange={e=>setDraft(e.target.value)}/></label>
 <details className="p1-model"><summary>Self-check before revising</summary><ul><li>Have you explained the movement from an individual concern to a wider one?</li><li>What does the answer repeat, and what wording changes?</li><li>What earlier detail supports or qualifies your claim?</li><li>Are you describing the assurance the reply offers, or assuming an emotion every reader must feel?</li></ul></details>
 <label className="field">My revised reading <span className="hint">Keep your first attempt above. Refine the connection or qualify a claim in your own words.</span><textarea rows={5} maxLength={3500} value={revision} onChange={e=>setRevision(e.target.value)}/></label>
 <div className="tool-actions"><ExportFormatSelect value={format} onChange={setFormat}/><button type="button" className="button secondary" onClick={()=>downloadRecord(`${literatureSourceText()}\n\nPractice guiding question\n${poem.question}\n\nMy first reading\n${draft||"(Not yet written)"}\n\nMy revised reading\n${revision||"(Not yet written)"}`,"up-hill-reading-notes.txt",format)}>Export my readings</button></div><p className="hint">Save before leaving or refreshing. Your first and revised readings are both included; no AI is used in this workspace.</p>
 <ContinueToRefinery course="literature" kind="analysis" source="Literature Paper 1: Up-Hill" evidence={`${literatureSourceText()}\n\nGuiding question: ${poem.question}`} draft={revision.trim()?revision:draft} disabled={!draft.trim()&&!revision.trim()}/>
 </section>;
}
