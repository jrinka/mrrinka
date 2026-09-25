"use client";
import { magicSentenceExamples } from "@/lib/magic-sentence-examples";
import ExportFormatSelect from "./export-format";
import type {ExportFormat} from "@/lib/practice-record";
import {ContinueToRefinery} from "./practice-transfer";
import { useState } from "react";
import { downloadRecord } from "@/lib/practice-record";
const fields=[
 ["writer","Writer","Who constructs the passage? Distinguish the writer from the speaker."],
 ["verb","Analytical verb","What does the writer do? For example: contrasts, personifies, frames."],
 ["choice","Technique or choice","Name the precise choice, not just a device category."],
 ["quotation","Selected words","Copy a short, exact selection from the extract. Quotation marks are added below."],
 ["purpose","Purpose or meaning","Complete ‘to…’: what does this choice invite us to understand?"],
 ["explanation","Explain the connection","How do the selected words support that meaning? Do not just restate your claim."],
] as const;
type Key=typeof fields[number][0];
const emptyValues: Record<Key,string> = {writer:"",verb:"",choice:"",quotation:"",purpose:"",explanation:""};
export default function MagicSentence(){
 const [selected,setSelected]=useState(0);
 const [drafts,setDrafts]=useState<Record<string,Record<Key,string>>>({});
 const example=magicSentenceExamples[selected];
 const excerpt=example.excerpt;
 const sourceUrl=example.source.startsWith("/") ? `https://mrrinka.com${example.source}` : example.source;
 const values=drafts[example.id] ?? emptyValues;
 const setValues=(next:Record<Key,string>)=>setDrafts(current=>({...current,[example.id]:next}));
 const [exportFormat,setExportFormat]=useState<ExportFormat>("txt");
 const [checked,setChecked]=useState(false);
 const sentence=`${values.writer||"[writer]"} ${values.verb||"[verb]"} ${values.choice||"[choice]"} in “${values.quotation||"[selected words]"}” to ${values.purpose.replace(/^to\s+/i,"")||"[meaning / purpose]"}. ${values.explanation||"[Explain how the detail supports the interpretation.]"}`;
 const quote=values.quotation.trim().replace(/^[“"]|[”"]$/g,"");
 const missing=fields.filter(([key])=>!values[key].trim());
 return <section className="sentence-lab" id="sentence-lab"><span className="mono">TRY IT / NO AI</span><h2>Build the connection</h2><p>Choose a passage and try your own explanation before opening the worked reading. You can switch examples without losing your drafts during this visit.</p><label className="field">Practice passage<select value={selected} onChange={event=>{setSelected(Number(event.target.value));setChecked(false);}}>{magicSentenceExamples.map((item,index)=><option value={index} key={item.id}>{item.label}</option>)}</select></label><p>{example.context}</p><blockquote style={{whiteSpace:"pre-line"}}>{excerpt}</blockquote><p className="hint">{example.author}, <em>{example.title}</em> · <a href={example.source} target="_blank" rel="noreferrer">{example.sourceLabel} ↗</a></p><div className="sentence-fields sentence-builder-fields">{fields.map(([key,label,hint],index)=><label className="field" key={key}><span className="mono">0{index+1}</span>{label}<span className="hint">{hint}</span><textarea rows={3} maxLength={1500} value={values[key]} onChange={e=>{setValues({...values,[key]:e.target.value});setChecked(false);}}/></label>)}</div><section className="sentence-preview"><h3>Your assembled draft</h3><p>{sentence}</p><p className="hint">This is a scaffold, not a compulsory sentence shape. Adjust the grammar, divide it into two sentences, and remove the frame when you no longer need it.</p></section><div className="tool-actions"><ExportFormatSelect value={exportFormat} onChange={setExportFormat}/><button className="button secondary" type="button" onClick={()=>setChecked(true)}>Check the parts</button><button className="button secondary" type="button" onClick={()=>downloadRecord(`Magic sentence practice\n${example.author} — ${example.title}\n${sourceUrl}\n\n${excerpt}\n\n${fields.map(([key,label])=>`${label}: ${values[key]}`).join("\n\n")}\n\nAssembled draft:\n${sentence}`,"analysis-sentence.txt",exportFormat)}>Save my work</button></div>{checked&&<aside className="lens-intro" role="status"><h3>Check, then judge for yourself</h3><ul>{missing.length>0?<li>Still to complete: {missing.map(([,label])=>label).join(", ")}.</li>:<li>Every part is present. That does not yet establish a convincing interpretation.</li>}{quote&&!excerpt.toLowerCase().includes(quote.toLowerCase())&&<li>The selected words do not match a continuous phrase in the extract. Check accuracy; mark deliberate omissions with an ellipsis.</li>}{example.checks.map(check=><li key={check}>{check}</li>)}</ul><p className="hint">This checks completion and a simple quotation match. It does not grade your analysis or send your writing to AI.</p></aside>}<ContinueToRefinery kind="analysis" source="Observation to analysis workshop" evidence={`${example.author}, ${example.title}. ${example.context}\n\n${excerpt}\n\n${sourceUrl}`} draft={sentence} disabled={missing.length>0}/><details key={example.id} className="lens-section"><summary><span>After trying: inspect one worked reading</span></summary><div className="lens-body"><p>{example.reading}</p><p><strong>Why it works:</strong> {example.explanation} This is one supported reading, not wording you need to copy.</p></div></details></section>;
}
