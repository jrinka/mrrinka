"use client";
import ExportFormatSelect from "./export-format";
import type {ExportFormat} from "@/lib/practice-record";
import {ContinueToRefinery} from "./practice-transfer";
import {useState} from "react";
import {nextPrompt,comparisonPrompts} from "@/lib/comparison-prompts";
import {downloadRecord} from "@/lib/practice-record";
export default function PromptWorkshop(){
 const [exportFormat,setExportFormat]=useState<ExportFormat>("txt");
 const [prompt,setPrompt]=useState<string>(comparisonPrompts[0]);
 const [allNotes,setAllNotes]=useState<Record<string,Record<string,string>>>({});
 const notes=allNotes[prompt]||{};
 return <section className="sentence-lab"><span className="mono">PAPER 2 / TRY IT</span><h2>Unpack a new question</h2><button className="button secondary" type="button" onClick={()=>setPrompt(nextPrompt(prompt))}>Assign prompt</button><p className="hint">Randomly selected original practice questions. These are not past IB exam questions. Notes are kept separately for each question during this visit. Save your planning before assigning another.</p><blockquote aria-live="polite">{prompt}</blockquote><div className="sentence-fields">{["Task and command","Key terms to define","What must my answer address?","Choices and effects to examine","Evidence from work one","Evidence from work two","My comparative claim"].map(label=><label className="field" key={label}>{label}{label==="What must my answer address?"&&<span className="hint">Note requirements such as two works, a particular relationship, or a focus on endings.</span>}<textarea rows={3} maxLength={2000} value={notes[label]||""} onChange={e=>setAllNotes({...allNotes,[prompt]:{...notes,[label]:e.target.value}})}/></label>)}</div><ExportFormatSelect value={exportFormat} onChange={setExportFormat}/><button className="button secondary" type="button" onClick={()=>downloadRecord(`Paper 2 question planning\nOriginal practice prompt: ${prompt}\n\n${Object.entries(notes).map(([k,v])=>`${k}\n${v}`).join("\n\n")}`,"paper-2-question-notes.txt",exportFormat)}>Save my planning</button><ContinueToRefinery kind="comparison" source="Paper 2 question workshop" prompt={prompt} evidence={Object.entries(notes).filter(([key,value])=>key!=="My comparative claim"&&value.trim()).map(([key,value])=>`${key}: ${value}`).join("\n\n")} draft={notes["My comparative claim"]||""}/></section>;
}
