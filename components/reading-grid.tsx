"use client";
import ExportFormatSelect from "./export-format";
import type {ExportFormat} from "@/lib/practice-record";
import { useEffect, useState } from "react";
import styles from "./reading-grid.module.css";
import { downloadRecord } from "@/lib/practice-record";
import { readingMethods, type ReadingMethod } from "@/lib/reading-methods";
export default function ReadingGrid({method}:{method:ReadingMethod}) {
 const [exportFormat,setExportFormat]=useState<ExportFormat>("docx");
 const guide=readingMethods[method];
 const [notes,setNotes]=useState<string[]>(guide.steps.map(()=>""));
 const [text,setText]=useState("");
 const [contents,setContents]=useState<'blank'|'notes'>('blank');
 const [ready,setReady]=useState(false);
 const [saved,setSaved]=useState(false);
 const [exporting,setExporting]=useState(false);
 const key=`mrrinka:reading-grid:v1:${method}`;
 useEffect(()=>{
  try {
   const raw=localStorage.getItem(key);
   if(raw){const data=JSON.parse(raw);if(typeof data.text==='string'&&Array.isArray(data.notes)&&data.notes.length===guide.steps.length&&data.notes.every((n:unknown)=>typeof n==='string')){setText(data.text);setNotes(data.notes);}}
   setSaved(true);
  }catch{setSaved(false);}
  setReady(true);
 },[key,guide.steps.length]);
 function saveLocal(nextText:string,nextNotes:string[]){
  setText(nextText);setNotes(nextNotes);
  try{localStorage.setItem(key,JSON.stringify({text:nextText,notes:nextNotes}));setSaved(true);}catch{setSaved(false);}
 }
 async function saveNotes() {
  const blank=contents==='blank';
  const record = { title: `${guide.title} reading worksheet`, blank, text: blank ? '' : text || guide.work, rows: guide.steps.map((step, i) => ({ title: step.title, prompt: step.prompt, notes: blank ? '' : notes[i] })) };
  const content = `${record.title}\nText / author: ${record.text}\n\n${record.rows.map(row => `${row.title}\n${row.prompt}\n\n${row.notes || (blank ? '' : '(Not yet written)')}`).join("\n\n")}`;
  setExporting(true);
  await downloadRecord(content, `${method}-${blank?'worksheet':'notes'}`, exportFormat, record);
  setExporting(false);
 }
 return <section className="reading-workshop">
  <div className={styles.export}>
   <label className="export-format">Download contents<select aria-label="Download contents" value={contents} onChange={e=>setContents(e.target.value as 'blank'|'notes')}><option value="blank">Blank worksheet</option><option value="notes">My completed notes</option></select></label>
   <ExportFormatSelect value={exportFormat} onChange={setExportFormat}/>
   <button className="button" type="button" disabled={!ready||exporting} onClick={saveNotes}>{exporting?'Preparing download…':'Download worksheet'}</button>
   <p>Word stays editable. PDF keeps the two-column worksheet layout for reading and printing. Completed notes include your writing and the prompts; worked examples stay on this page.</p>
  </div>
  <p className="hint" role="status">{!ready?'Loading your notes…':saved?'Saved in this browser on this device. Download a copy to keep; these notes are not uploaded or sent to your teacher.':'This browser could not save your notes. Download a copy before leaving.'}</p>
  <label className="field">Your text and author (if trying a different text)<input disabled={!ready} value={text} onChange={e=>saveLocal(e.target.value,notes)} maxLength={300}/></label>
  <div className="reading-grid-head mono"><span>READING MOVE</span><span>WORKED EXAMPLE / {guide.work}</span><span>YOUR NOTES</span></div>
  {guide.steps.map((step,i)=><section className="reading-grid-row" key={step.title}><div><span className="method-letter" aria-hidden="true">{step.letter}</span><h2>{step.title}</h2><p>{step.prompt}</p></div><div className="reading-model"><span className="mono">WORKED EXAMPLE</span><p>{step.example}</p></div><label className="field">Your notes: {step.title}<textarea rows={4} disabled={!ready} value={notes[i]} onChange={e=>saveLocal(text,notes.map((n,index)=>index===i?e.target.value:n))}/></label></section>)}
  <div className={styles.export}><button className="button" type="button" disabled={!ready||exporting} onClick={saveNotes}>Download {contents==='blank'?'blank worksheet':'my notes'} ({exportFormat.toUpperCase()})</button><p>Uses the contents and format selected above. <a href={`/downloads/${method}-grid.html`} download>Download an offline browser worksheet ↗</a></p></div>
  <aside className="lens-intro"><h2>Turn the grid into an argument</h2><p>{guide.bridge}</p><a href="/resources/observation-to-analysis">Practice moving from observation to analysis →</a></aside>
 </section>;
}
