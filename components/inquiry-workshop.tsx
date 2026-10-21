"use client";
import FieldRequirement from "./field-requirement";
import ExportFormatSelect from "./export-format";
import type {ExportFormat} from "@/lib/practice-record";
import RefineryBoundary from "./refinery-boundary";
import { useRef, useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { fieldsOfInquiry, inquiryStages } from "@/lib/inquiry-options";
import { refineries } from "@/lib/refineries";
import { downloadRecord, formatPracticeRecord, type PracticeRecord } from "@/lib/practice-record";
import SiteFeedback from "./site-feedback";
type Stage=typeof inquiryStages[number];
type Turn={student:string;coach:string;stage:Stage;refused:boolean};
export default function InquiryWorkshop({kind,initialCourse="",provider}:{kind:"global-issue"|"line-of-inquiry";initialCourse?:string;provider:{name:string;disclosure:string}}){
 const [exportFormat,setExportFormat]=useState<ExportFormat>("docx");
 const [course,setCourse]=useState(initialCourse);
 const startRef=useRef<HTMLFieldSetElement>(null);
 const [confirmReset,setConfirmReset]=useState(false);
 const [mode,setMode]=useState<"explore"|"refine">("explore");
 const [stage,setStage]=useState<Stage>("Notice");
 const [field,setField]=useState<string>(fieldsOfInquiry[0]);
 const [texts,setTexts]=useState("");const [evidence,setEvidence]=useState("");
 const [draft,setDraft]=useState("");const [message,setMessage]=useState("");
 const [busy,setBusy]=useState(false);const [error,setError]=useState("");
 const [turns,setTurns]=useState<Turn[]>([]);const [records,setRecords]=useState<PracticeRecord[]>([]);
 const testing=mode==="refine";
 const exhausted=turns.length>=12;
 async function submit(event:React.FormEvent){
  event.preventDefault();setBusy(true);setError("");
  const student=message.trim()||(testing?"Please test my working idea against the details I supplied.":"");
  const requestStage:Stage=testing ? (turns.some(t=>t.stage==="Test"||t.stage==="Revise") ? "Revise" : "Test") : (turns.length ? "Explore" : "Notice");
  setStage(requestStage);
  try{
   const response=await fetch("/api/practice/inquiry",{method:"POST",headers:{"Content-Type":"application/json"},signal:AbortSignal.timeout(115000),body:JSON.stringify({kind,course,stage:requestStage,field,texts,evidence,draft,message:student,history:turns.map(({student,coach,stage})=>({student,coach,stage}))})});
   const data=await response.json();if(!response.ok)throw new Error(data.error||"Feedback could not be completed.");
   const coach=data.refused?data.message:[data.reply.observation,...data.reply.questions].join("\n\n");
   setTurns(current=>[...current,{student,coach,stage:requestStage,refused:data.refused}]);
   setRecords(current=>[...current,{tool:refineries[kind].title,course,evidence:`Texts: ${texts}\nField: ${field}\nDetails: ${evidence||"Not yet supplied"}`,draft,reflection:`Stage: ${requestStage}\nStudent message: ${student}`,feedback:coach,refused:data.refused,model:data.model,modelDisclosure:provider.disclosure,policyVersion:data.policyVersion,createdAt:data.createdAt}]);setMessage("");
  }catch(error){setError(error instanceof Error&&error.name!=="TimeoutError"?error.message:"The response took too long. Your writing is still here; please try again.");}
  finally{setBusy(false);}
 }
 function save(){downloadRecord(`${formatPracticeRecord(records)}\n\nCurrent working notes (student-authored)\n\nTexts: ${texts}\nField: ${field}\nStage: ${stage}\n\n${evidence}\n\nWorking idea: ${draft}\n\nUnsent message: ${message}`,`${kind}-workshop-record.txt`,exportFormat);}
 return <div className="refinery-workspace">
  <RefineryBoundary/>
  <fieldset ref={startRef} tabIndex={-1} className="inquiry-start" disabled={busy}><legend>What would help right now?</legend><button type="button" className="button secondary" onClick={()=>setMode("explore")} aria-pressed={mode==="explore"}>Help me find a direction</button><button type="button" className="button secondary" onClick={()=>setMode("refine")} aria-pressed={mode==="refine"}>Refine my working idea</button></fieldset>
  <p className="inquiry-mode-note">{testing ? "Test an idea you have already written. You can switch modes without losing your notes." : "Explore an observation or explain where you are stuck. No finished idea is needed."}</p>
  {kind==="global-issue"&&<details className="inquiry-explainer"><summary>What makes an issue global? · The IO is not a comparison</summary><p>Its significance extends widely, crosses national boundaries, and affects everyday life in local settings. Choose a specific issue you can explore through authorial choices in your texts.</p><p>The IO is not a comparative task. Explore how each text presents the same issue, giving both balanced attention; you do not need a compare-and-contrast argument.</p><a href="https://ibo.org/globalassets/new-structure/university-admission/pdfs/subject-guides/language-a-language-literature-guide.pdf">IB guide: determining the global issue ↗</a></details>}
  <form onSubmit={submit}>
   <fieldset className="refinery-fields" disabled={busy}>
    <div className="inquiry-setup"><div><label className="field"><span className="field-label">Practice course<FieldRequirement/></span><select required value={course} disabled={turns.length>0} onChange={e=>setCourse(e.target.value)}><option value="" disabled>Choose your course</option><option value="language-literature">IB Language &amp; Literature</option><option value="literature">IB Literature</option></select></label>
    {kind==="global-issue"&&<label className="field"><span className="field-label">Field of inquiry <FieldRequirement required={false}/></span><span className="hint">A starting area, not your global issue.</span><select value={field} onChange={e=>setField(e.target.value)}>{fieldsOfInquiry.map(value=><option key={value}>{value}</option>)}</select></label>}
    </div><label className="field"><span className="field-label">Texts you are considering<FieldRequirement/></span><span className="hint">Titles and authors are enough to start. {kind==="global-issue"?"One text is fine for now; bring in the second as your idea develops.":"List one or several studied works. You make the final choice."}</span><textarea required minLength={2} maxLength={2000} rows={2} value={texts} onChange={e=>setTexts(e.target.value)}/></label>
    </div><details className="inquiry-evidence" open={kind==="line-of-inquiry" ? true : undefined}><summary>Textual details and evidence (optional)</summary><label className="field"><span className="field-label">Details to keep in view<FieldRequirement required={false}/></span><span className="hint">Add moments, quotations or authorial choices as you find them. You can also include these in your conversation reply. Without details, feedback can address your idea’s wording and scope but cannot verify its textual support.</span><textarea maxLength={6000} rows={4} value={evidence} onChange={e=>setEvidence(e.target.value)}/></label></details>
    <div className="inquiry-columns">
     <section className="inquiry-conversation"><h2>Conversation <span className="mono">{turns.length}/12</span></h2><div aria-live="polite" aria-relevant="additions">{turns.map((turn,index)=><article className="inquiry-turn" key={index}><span className="mono">{turn.stage==="Test"||turn.stage==="Revise"?"REFINING":"EXPLORING"} / {String(index+1).padStart(2,"0")}</span><h3>You</h3><p>{turn.student}</p><h3><Sparkles size={15} aria-hidden="true"/> {turn.refused?"Scope reminder":"AI guidance"}</h3><p>{turn.coach}</p></article>)}</div>
      <label className="field"><span className="field-label">{turns.length?"Your reply or question":"What caught your attention—or where are you stuck?"}<FieldRequirement required={!testing}/></span><textarea required={!testing} minLength={2} maxLength={3000} rows={4} value={message} onChange={e=>setMessage(e.target.value)} placeholder={kind==="global-issue"?"I’m not sure how to move from what I noticed to a global issue…":"I have a text in mind, but I’m not sure what I want to investigate…"}/></label>
     </section>
     <section className="inquiry-draft"><h2>My working idea</h2><p>{testing ? "Write at least 10 characters. A separate message is optional." : "Leave this empty until you have an idea to test. Choose “Refine my working idea” when you are ready."}</p><label className="field"><span className="field-label">{kind==="global-issue"?"My provisional global issue":"My provisional line of inquiry"}<FieldRequirement required={testing}/></span><textarea required={testing} minLength={testing?10:undefined} maxLength={3000} rows={7} value={draft} onChange={e=>setDraft(e.target.value)}/></label></section>
    </div>
    <p className="inquiry-send-mode"><strong>{testing ? "Refining your working idea" : "Exploring a direction"}</strong> · Your current notes and conversation are included with this message.</p>
    <p className="hint">Start with your own thinking. Use the feedback to question and develop your ideas.</p>
    <button className="button" disabled={busy||exhausted||!course||texts.trim().length<2||(testing?draft.trim().length<10:message.trim().length<2)}>{busy?<><RefreshCw className="spin" size={16}/> Thinking and checking…</>:<><Sparkles size={16}/>{testing?"Get feedback on this idea":turns.length?"Send reply":"Start exploring"}</>}</button>
   </fieldset>
  </form>
  {busy&&<p role="status">{provider.name} is reading the conversation and checking its response. This can take up to a minute.</p>}
  {error&&<p role="alert" className="error">{error}</p>}
  {exhausted&&<p role="status">You have reached 12 exchanges. Download your record and take stock before starting a fresh conversation.</p>}
  {turns.length > 0 && <SiteFeedback target={`${kind}-refinery`} />}

  <details className="inquiry-explainer"><summary>What is sent for feedback?</summary><p>Your texts, field of inquiry (for IO), evidence, working idea, and earlier conversation are sent only when you press the feedback or reply button. Editing a field does not send it.</p></details>
  <p className="passage-privacy">Entries are processed by {provider.disclosure}. Do not include names, contact details, student IDs or other personally identifiable information. This site does not store the conversation. AI can be mistaken—check its questions against your texts. Records are not sent to your teacher automatically.</p>
  <div className="refinery-save"><ExportFormatSelect value={exportFormat} onChange={setExportFormat}/><button type="button" className="button secondary" disabled={busy||(!turns.length&&!draft&&!message&&!texts&&!evidence)} onClick={save}>Download record</button><p className="hint">Includes every exchange, draft snapshots, your current notes, dates and model details.</p></div>
  {(turns.length>0||texts||draft||message||evidence)&&<div className="inquiry-reset">{confirmReset?<><p>Start fresh? This clears your texts, working notes and conversation. Download your record first if you want to keep it.</p><div className="tool-actions"><button type="button" className="button secondary" disabled={busy} onClick={()=>{setTexts("");setEvidence("");setDraft("");setMessage("");setTurns([]);setRecords([]);setField(fieldsOfInquiry[0]);setStage("Notice");setMode("explore");setError("");setConfirmReset(false);startRef.current?.focus();}}>Clear and start fresh</button><button type="button" className="button secondary" onClick={()=>setConfirmReset(false)}>Keep working</button></div></>:<button type="button" className="button secondary" disabled={busy} onClick={()=>setConfirmReset(true)}>Start a fresh conversation</button>}</div>}
 </div>;
}
