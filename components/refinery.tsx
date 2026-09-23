"use client";
import ExportFormatSelect from "./export-format";
import type {ExportFormat} from "@/lib/practice-record";
import { nextPrompt } from "@/lib/comparison-prompts";
import {ImportPractice} from "./practice-transfer";
import RefineryBoundary from "./refinery-boundary";
import { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { refineries, type RefineryKind } from "@/lib/refineries";
import { downloadRecord, formatPracticeRecord, type PracticeRecord } from "@/lib/practice-record";
import SiteFeedback from "./site-feedback";

type Result = {refused:boolean; message?:string; feedback?:{strength:string; concern:string; nextMove:string}; model:string; policyVersion:string; createdAt:string};
export default function Refinery({kind,initialCourse="",transferId="",provider}: {kind:RefineryKind;initialCourse?:string;transferId?:string;provider:{name:string;disclosure:string}}) {
 const [exportFormat,setExportFormat]=useState<ExportFormat>("txt");
  const config = refineries[kind];
  const [prompt,setPrompt] = useState("");
  const [course,setCourse] = useState(initialCourse);
  const [evidence,setEvidence] = useState("");
  const [draft,setDraft] = useState("");
  const [reflection,setReflection] = useState("");
  const [acknowledged,setAcknowledged] = useState(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const [result,setResult] = useState<Result|null>(null);
  const [records,setRecords] = useState<PracticeRecord[]>([]);
  const previous = records.findLast(r => !r.refused && r.course === course && r.evidence === (prompt ? `Question: ${prompt}\n\n${evidence}` : evidence));
  async function submit(event:React.FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setResult(null);
    try {
      const response = await fetch("/api/practice/refinery", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({kind,course,evidence,draft,prompt,reflection,previousDraft:previous?.draft ?? "",acknowledged})});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResult(data);
      const feedback = data.refused ? data.message : `What holds up\n${data.feedback.strength}\n\nWhat needs testing\n${data.feedback.concern}\n\nYour next move\n${data.feedback.nextMove}`;
      setRecords(current => [...current,{tool:config.title,course,evidence:prompt ? `Question: ${prompt}\n\n${evidence}` : evidence,draft,reflection,feedback,refused:data.refused,model:data.model,modelDisclosure:provider.disclosure,policyVersion:data.policyVersion,createdAt:data.createdAt}]);
    } catch { setError("Feedback could not be completed. Your writing is still here; try again."); }
    finally {setBusy(false);}
  }
  return <div className="refinery-workspace">
    <RefineryBoundary/>
    <ImportPractice disabled={busy} id={transferId} kind={kind} onImport={value=>{setPrompt(value.prompt);setEvidence(value.evidence);setDraft(value.draft);setResult(null);setReflection("");}}/>
    <form onSubmit={submit}>
      <fieldset disabled={busy} className="refinery-fields">
        <label className="field">Course<select required value={course} onChange={e => {setCourse(e.target.value);setResult(null);}}><option value="" disabled>Choose your course</option><option value="language-literature">IB Language & Literature</option><option value="literature">IB Literature</option>{kind === "analysis" && <option value="english-10">General English</option>}</select></label>
        {kind === "comparison" && <section className="comparison-prompt"><label className="field">Your Paper 2 question<span className="hint">Paste your question or assign an original practice prompt. Your draft stays when the prompt changes; check that it still answers the question.</span><textarea rows={3} maxLength={2000} value={prompt} onChange={e=>{setPrompt(e.target.value);setResult(null);}}/></label><button type="button" className="button secondary" onClick={()=>{setPrompt(nextPrompt(prompt));setResult(null);}}>Assign prompt</button><p className="hint">Original classroom practice prompts, not past IB examination questions. <a href="/resources/unpacking-questions#paper-2">How to unpack the question →</a></p></section>}
        <label className="field">Source and supporting evidence<span className="hint">{config.evidence}</span><textarea required minLength={40} maxLength={10000} rows={7} value={evidence} onChange={e => {setEvidence(e.target.value);setResult(null);}} /></label>
        <label className="field">{config.draft}<textarea required minLength={20} maxLength={8000} rows={6} value={draft} onChange={e => {setDraft(e.target.value);setResult(null);}} /></label>
        {previous && <label className="field">What did you change, and why?<span className="hint">Revise your draft above, then explain the decision you made.</span><textarea maxLength={2000} rows={3} value={reflection} onChange={e => setReflection(e.target.value)} /></label>}
        <label className="refinery-ack"><input type="checkbox" required checked={acknowledged} onChange={e=>setAcknowledged(e.target.checked)} /> I am submitting my own thinking for feedback, and my teacher permits this use of AI.</label>
        <button className="button" disabled={!course || !acknowledged || draft.trim().length < 20 || evidence.trim().length < 40}>{busy ? <><RefreshCw className="spin" size={16} aria-hidden="true" /> Checking your work…</> : <><Sparkles size={16} aria-hidden="true" />{previous ? "Request revision feedback" : "Request feedback"}</>}</button>
      </fieldset>
    </form>
    <p className="passage-privacy">Your entries are processed by {provider.disclosure}. Do not include names, contact details, student IDs or other personally identifiable information. Entries are not saved on this site’s server. Keep a record before leaving this page; it is not sent to your teacher automatically.</p>
    {error && <p role="alert" className="error">{error}</p>}
    <div aria-live="polite" aria-busy={busy}>{result && <section className="passage-feedback"><span className="mono">FEEDBACK / {records.length.toString().padStart(2,"0")}</span>{result.refused ? <p>{result.message}</p> : <>{[["What holds up",result.feedback?.strength],["What needs testing",result.feedback?.concern],["Your next move",result.feedback?.nextMove]].map(([heading,text])=><section key={heading}><h2>{heading}</h2><p>{text}</p></section>)}</>}<small>AI feedback can be mistaken. Check it against your texts and discuss uncertainties with your teacher.</small></section>}</div>
    {result && <SiteFeedback target={`${kind}-refinery`} />}
    <div className="refinery-save"><ExportFormatSelect value={exportFormat} onChange={setExportFormat}/><button type="button" className="button secondary" disabled={(!records.length && !draft && !evidence && !prompt && !reflection) || busy} onClick={()=>downloadRecord(`${formatPracticeRecord(records)}\n\nCurrent working notes (may not have feedback)\n\nQuestion: ${prompt || "Not provided"}\n\nEvidence: ${evidence}\n\nDraft: ${draft}\n\nRevision note: ${reflection || "Not provided"}`,`${kind}-refinery-record.txt`,exportFormat)}>Save record for teacher review</button><p className="hint">Downloads your current notes and any feedback from this visit, with dates and model details for completed requests.</p></div>
  </div>;
}
