"use client";
import { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { refineries, ibAiPolicy, type RefineryKind } from "@/lib/refineries";
import { downloadRecord, formatPracticeRecord, type PracticeRecord } from "@/lib/practice-record";

type Result = {refused:boolean; message?:string; feedback?:{strength:string; concern:string; nextMove:string}; model:string; policyVersion:string; createdAt:string};
export default function Refinery({kind}: {kind:RefineryKind}) {
  const config = refineries[kind];
  const [course,setCourse] = useState("");
  const [evidence,setEvidence] = useState("");
  const [draft,setDraft] = useState("");
  const [reflection,setReflection] = useState("");
  const [acknowledged,setAcknowledged] = useState(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const [result,setResult] = useState<Result|null>(null);
  const [records,setRecords] = useState<PracticeRecord[]>([]);
  const previous = records.findLast(r => !r.refused && r.course === course && r.evidence === evidence);
  async function submit(event:React.FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setResult(null);
    try {
      const response = await fetch("/api/practice/refinery", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({kind,course,evidence,draft,reflection,previousDraft:previous?.draft ?? "",acknowledged})});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResult(data);
      const feedback = data.refused ? data.message : `What holds up\n${data.feedback.strength}\n\nWhat needs testing\n${data.feedback.concern}\n\nYour next move\n${data.feedback.nextMove}`;
      setRecords(current => [...current,{tool:config.title,course,evidence,draft,reflection,feedback,refused:data.refused,model:data.model,policyVersion:data.policyVersion,createdAt:data.createdAt}]);
    } catch { setError("Feedback could not be completed. Your writing is still here; try again."); }
    finally {setBusy(false);}
  }
  return <div className="refinery-workspace">
    <aside className="refinery-boundary">
      <h2>Your thinking, your decisions</h2>
      <p>Bring your own attempt. This tool asks questions and identifies what to test; it does not write or rewrite assessed work, choose your argument, or predict marks.</p>
      <p>Follow your teacher’s and school’s rules for the assessment. AI-generated material used in assessed work needs acknowledgment; citing AI does not make its work your own. <a href={ibAiPolicy} target="_blank" rel="noreferrer">IB academic integrity policy — AI guidance ↗</a></p>
    </aside>
    <form onSubmit={submit}>
      <fieldset disabled={busy} className="refinery-fields">
        <label className="field">Course<select required value={course} onChange={e => {setCourse(e.target.value);setResult(null);}}><option value="" disabled>Choose your course</option><option value="language-literature">IB Language & Literature</option><option value="literature">IB Literature</option>{kind === "analysis" && <option value="english-10">English 10</option>}</select></label>
        <label className="field">Source and supporting evidence<span className="hint">{config.evidence}</span><textarea required minLength={40} maxLength={10000} rows={7} value={evidence} onChange={e => {setEvidence(e.target.value);setResult(null);}} /></label>
        <label className="field">{config.draft}<textarea required minLength={20} maxLength={8000} rows={6} value={draft} onChange={e => {setDraft(e.target.value);setResult(null);}} /></label>
        {previous && <label className="field">What did you change, and why?<span className="hint">Revise your draft above, then explain the decision you made.</span><textarea maxLength={2000} rows={3} value={reflection} onChange={e => setReflection(e.target.value)} /></label>}
        <label className="refinery-ack"><input type="checkbox" required checked={acknowledged} onChange={e=>setAcknowledged(e.target.checked)} /> I am submitting my own thinking for feedback, and my teacher permits this use of AI.</label>
        <button className="button" disabled={!course || !acknowledged || draft.trim().length < 20 || evidence.trim().length < 40}>{busy ? <><RefreshCw className="spin" size={16} aria-hidden="true" /> Checking your work…</> : <><Sparkles size={16} aria-hidden="true" />{previous ? "Request revision feedback" : "Request feedback"}</>}</button>
      </fieldset>
    </form>
    <p className="passage-privacy">Your entries are sent to MiniMax for feedback. This site does not store them. Keep a record before leaving this page; it is not sent to your teacher automatically.</p>
    {error && <p role="alert" className="error">{error}</p>}
    <div aria-live="polite" aria-busy={busy}>{result && <section className="passage-feedback"><span className="mono">FEEDBACK / {records.length.toString().padStart(2,"0")}</span>{result.refused ? <p>{result.message}</p> : <>{[["What holds up",result.feedback?.strength],["What needs testing",result.feedback?.concern],["Your next move",result.feedback?.nextMove]].map(([heading,text])=><section key={heading}><h2>{heading}</h2><p>{text}</p></section>)}</>}<small>AI feedback can be mistaken. Check it against your texts and discuss uncertainties with your teacher.</small></section>}</div>
    <div className="refinery-save"><button type="button" className="button secondary" disabled={!records.length || busy} onClick={()=>downloadRecord(`${formatPracticeRecord(records)}\n\nIB policy: ${ibAiPolicy}\n\n## Current working draft (may not have feedback)\n\n${draft}\n\nRevision note: ${reflection || "Not provided"}`,`${kind}-refinery-record.md`)}>Save record for teacher review</button><p className="hint">Downloads all attempts and AI feedback from this visit, with dates, source details, and model information.</p></div>
  </div>;
}
