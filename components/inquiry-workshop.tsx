"use client";
import { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { fieldsOfInquiry, inquiryStages } from "@/lib/inquiry-options";
import { refineries, ibAiPolicy } from "@/lib/refineries";
import { downloadRecord, formatPracticeRecord, type PracticeRecord } from "@/lib/practice-record";
type Stage=typeof inquiryStages[number];
type Turn={student:string;coach:string;stage:Stage;refused:boolean};
export default function InquiryWorkshop({kind}:{kind:"global-issue"|"line-of-inquiry"}){
 const [course,setCourse]=useState("");
 const [mode,setMode]=useState<"explore"|"refine">("explore");
 const [stage,setStage]=useState<Stage>("Notice");
 const [field,setField]=useState<string>(fieldsOfInquiry[0]);
 const [texts,setTexts]=useState("");const [evidence,setEvidence]=useState("");
 const [draft,setDraft]=useState("");const [message,setMessage]=useState("");
 const [ack,setAck]=useState(false);const [busy,setBusy]=useState(false);const [error,setError]=useState("");
 const [turns,setTurns]=useState<Turn[]>([]);const [records,setRecords]=useState<PracticeRecord[]>([]);
 const testing=mode==="refine";
 const exhausted=turns.length>=12;
 async function submit(event:React.FormEvent){
  event.preventDefault();setBusy(true);setError("");
  const student=message.trim()||(testing?"Please test my working idea against the details I supplied.":"");
  const requestStage:Stage=testing ? (turns.some(t=>t.stage==="Test"||t.stage==="Revise") ? "Revise" : "Test") : (turns.length ? "Explore" : "Notice");
  setStage(requestStage);
  try{
   const response=await fetch("/api/practice/inquiry",{method:"POST",headers:{"Content-Type":"application/json"},signal:AbortSignal.timeout(115000),body:JSON.stringify({kind,course,stage:requestStage,field,texts,evidence,draft,message:student,history:turns.map(({student,coach,stage})=>({student,coach,stage})),acknowledged:ack})});
   const data=await response.json();if(!response.ok)throw new Error(data.error||"Feedback could not be completed.");
   const coach=data.refused?data.message:[data.reply.observation,...data.reply.questions].join("\n\n");
   setTurns(current=>[...current,{student,coach,stage:requestStage,refused:data.refused}]);
   setRecords(current=>[...current,{tool:refineries[kind].title,course,evidence:`Texts: ${texts}\nField: ${field}\nDetails: ${evidence||"Not yet supplied"}`,draft,reflection:`Stage: ${requestStage}\nStudent message: ${student}`,feedback:coach,refused:data.refused,model:data.model,policyVersion:data.policyVersion,createdAt:data.createdAt}]);setMessage("");
  }catch(error){setError(error instanceof Error&&error.name!=="TimeoutError"?error.message:"The response took too long. Your writing is still here; please try again.");}
  finally{setBusy(false);}
 }
 function save(){downloadRecord(`${formatPracticeRecord(records)}\n\nIB policy: ${ibAiPolicy}\n\nCurrent working notes (student-authored)\n\nTexts: ${texts}\nField: ${field}\nStage: ${stage}\n\n${evidence}\n\nWorking idea: ${draft}\n\nUnsent message: ${message}`,`${kind}-workshop-record.txt`);}
 return <div className="refinery-workspace">
  <aside className="refinery-boundary"><h2>Your thinking, your decisions</h2><p>You can begin uncertain. Guardrails informed by the IB academic integrity policy keep the guidance focused on your own thinking. This workshop asks questions to help you develop your own direction; you choose the text and write the issue or inquiry. It cannot supply or rewrite assessed work.</p><p>Follow your teacher’s and school’s rules. Acknowledge AI material used in assessed work; citing it does not make it your own. <a href={ibAiPolicy} target="_blank" rel="noreferrer">IB academic integrity policy — AI guidance ↗</a></p></aside>
  {kind==="global-issue"&&<aside className="lens-intro"><h2>What makes an issue global?</h2><p>Its significance extends widely, crosses national boundaries, and affects everyday life in local settings. Choose a specific issue you can explore through authorial choices in your texts.</p><p>The IO is not a comparative task. Explore how each text presents the same issue, giving both balanced attention; you do not need a compare-and-contrast argument.</p><a href="https://ibo.org/globalassets/new-structure/university-admission/pdfs/subject-guides/language-a-language-literature-guide.pdf">IB guide: determining the global issue ↗</a></aside>}
  <fieldset className="inquiry-start" disabled={busy}><legend>What would help right now?</legend><button type="button" className="button secondary" onClick={()=>setMode("explore")} aria-pressed={mode==="explore"}>Help me find a direction</button><button type="button" className="button secondary" onClick={()=>setMode("refine")} aria-pressed={mode==="refine"}>Refine my working idea</button></fieldset>
  <p className="inquiry-mode-note">{testing ? "Add your provisional idea, then ask for feedback. Reply to the questions below and revise your idea as the conversation develops." : "Start with a text and something you noticed—or tell us where you are stuck. Reply to the guidance to keep exploring. No finished issue or inquiry is required."}</p>
  <details className="inquiry-explainer"><summary>What is sent, and what do the boxes do?</summary><p>Each message sends your current texts, field (for IO), evidence and working idea, together with the earlier conversation. Editing a box alone does not request AI feedback. Use the starred button to send.</p><p>Exploring invites questions about your observations; refining asks for feedback on the idea you wrote. You can switch without losing this page’s notes. Nothing fills in your idea for you, and refreshing or leaving the page clears the conversation.</p></details>
  <form onSubmit={submit}>
   <fieldset className="refinery-fields" disabled={busy}>
    <label className="field">Course<select required value={course} disabled={turns.length>0} onChange={e=>setCourse(e.target.value)}><option value="" disabled>Choose your course</option><option value="language-literature">IB Language &amp; Literature</option><option value="literature">IB Literature</option></select></label>
    {kind==="global-issue"&&<label className="field">Field of inquiry <span className="hint">An optional starting point, not your global issue. You can change this as your thinking develops.</span><select value={field} onChange={e=>setField(e.target.value)}>{fieldsOfInquiry.map(value=><option key={value}>{value}</option>)}</select></label>}
    <label className="field">Texts you are considering<span className="hint">Titles and authors are enough to start. {kind==="global-issue"?"One text is fine for now; bring in the second as your idea develops.":"List one or several studied works. You make the final choice."}</span><textarea required minLength={2} maxLength={2000} rows={2} value={texts} onChange={e=>setTexts(e.target.value)}/></label>
    <details className="inquiry-evidence"><summary>Textual details and evidence (optional to begin)</summary><label className="field">Details to keep in view<span className="hint">Add moments, quotations or authorial choices as you find them. Explain unfamiliar context; the AI should not guess.</span><textarea maxLength={6000} rows={4} value={evidence} onChange={e=>setEvidence(e.target.value)}/></label></details>
    <div className="inquiry-columns">
     <section className="inquiry-conversation"><h2>Conversation <span className="mono">{turns.length}/12</span></h2>{!turns.length&&<p>Start with something you noticed—or simply explain where you are stuck. A polished idea is not required.</p>}<div aria-live="polite" aria-relevant="additions">{turns.map((turn,index)=><article className="inquiry-turn" key={index}><span className="mono">{turn.stage==="Test"||turn.stage==="Revise"?"REFINING":"EXPLORING"} / {String(index+1).padStart(2,"0")}</span><h3>You</h3><p>{turn.student}</p><h3><Sparkles size={15} aria-hidden="true"/> {turn.refused?"Scope reminder":"AI guidance"}</h3><p>{turn.coach}</p></article>)}</div>
      <label className="field">{turns.length?"Your reply or question":"What caught your attention—or where are you stuck?"}<textarea required={!testing} minLength={2} maxLength={3000} rows={4} value={message} onChange={e=>setMessage(e.target.value)} placeholder={kind==="global-issue"?"I’m not sure how to move from what I noticed to a global issue…":"I have a text in mind, but I’m not sure what I want to investigate…"}/></label>
     </section>
     <section className="inquiry-draft"><h2>My working idea</h2><p>You write this. It is included as context whenever you send a message. Leave it empty while exploring if you are not ready.</p><label className="field">{kind==="global-issue"?"My provisional global issue":"My provisional line of inquiry"}<textarea required={testing} minLength={testing?10:undefined} maxLength={3000} rows={7} value={draft} onChange={e=>setDraft(e.target.value)}/></label><p className="hint">To focus feedback here, choose “Refine my working idea” above, then send. Keep your own wording as you revise.</p></section>
    </div>
    <label className="refinery-ack"><input type="checkbox" required checked={ack} onChange={e=>setAck(e.target.checked)}/> I am sharing my own thinking, and my teacher permits this use of AI.</label>
    <button className="button" disabled={busy||exhausted||!course||!ack||texts.trim().length<2||(testing?draft.trim().length<10:message.trim().length<2)}>{busy?<><RefreshCw className="spin" size={16}/> Thinking and checking…</>:<><Sparkles size={16}/>{turns.length?"Send reply":testing?"Review my idea":"Start exploring"}</>}</button>
   </fieldset>
  </form>
  {busy&&<p role="status">M3 is reading the conversation and checking its response. This can take up to a minute.</p>}
  {error&&<p role="alert" className="error">{error}</p>}
  {exhausted&&<p role="status">You have reached 12 exchanges. Save your record and take stock before starting a fresh conversation.</p>}
  <p className="passage-privacy">Entries are sent to MiniMax and processed by M3. Do not include names, contact details, student IDs or other personally identifiable information. This site does not store the conversation; leaving or refreshing clears it. AI can be mistaken—check its questions against your texts. Records are not sent to your teacher automatically.</p>
  <div className="refinery-save"><button type="button" className="button secondary" disabled={busy||(!turns.length&&!draft&&!message&&!texts)} onClick={save}>Save record for teacher review (.txt)</button><p className="hint">Includes every exchange, draft snapshots, your current notes, dates and model details.</p></div>
 </div>;
}
