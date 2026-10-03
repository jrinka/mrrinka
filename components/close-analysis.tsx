"use client";
import { useEffect, useState } from "react";
import { closeRequest, wordCount, type CloseSource } from "@/lib/close-analysis";
import { downloadRecord, formatPracticeRecord, type PracticeRecord } from "@/lib/practice-record";

type Work={area:string;feature:string;evidence:string;draft:string;reflection:string;records:PracticeRecord[]};
const empty=():Work=>({area:"",feature:"",evidence:"",draft:"",reflection:"",records:[]});
const storageKey="close-analysis-local-v1";
export default function CloseAnalysis({sources,provider,live}:{sources:CloseSource[];provider:{name:string;disclosure:string};live:boolean}){
 const [selected,setSelected]=useState(sources[0].id);
 const [works,setWorks]=useState<Record<string,Work>>({});
 const [ready,setReady]=useState(false),[saved,setSaved]=useState(false);
 const [zoom,setZoom]=useState(100),[page,setPage]=useState(0);
 const [busy,setBusy]=useState(false),[error,setError]=useState("");
 const source=sources.find(s=>s.id===selected)!;
 const work=works[selected]??empty();
 useEffect(()=>{try{const value=JSON.parse(sessionStorage.getItem(storageKey)??"{}");
 const restored:Record<string,Work>={};
 for(const s of sources){const w=value[s.id];if(w && ["area","feature","evidence","draft","reflection"].every(k=>typeof w[k]==="string") && Array.isArray(w.records)) restored[s.id]=w;}
 setWorks(restored);
 }catch{} setReady(true);},[sources]);
 useEffect(()=>{if(!ready)return;try{sessionStorage.setItem(storageKey,JSON.stringify(works));setSaved(true);}catch{setSaved(false);}},[works,ready]);
 function update(value:Partial<Work>){setWorks(current=>({...current,[selected]:{...(current[selected]??empty()),...value}}));setError("");}
 const evidence=`${source.credit}\nSelected area: ${work.area}\nFeature: ${work.feature}\nStudent evidence: ${work.evidence}`;
 const previous=work.records.findLast(r=>!r.refused && r.evidence===evidence);
 const latest=work.records.at(-1);
 const count=wordCount(work.draft);
 async function submit(e:React.FormEvent){e.preventDefault();setError("");
 const input={sourceId:selected,area:work.area,feature:work.feature,evidence:work.evidence,draft:work.draft,reflection:work.reflection,previousDraft:previous?.draft??""};
 if(!closeRequest.safeParse(input).success){setError("Choose one feature, add precise evidence, and keep your own response to one short paragraph (180 words maximum).");return;}
 setBusy(true);
 const controller=new AbortController();
 const deadline=setTimeout(()=>controller.abort(),130000);
 try{const response=await fetch("/api/practice/close-analysis",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(input),signal:controller.signal});const data=await response.json();if(!response.ok)throw new Error(data.error);
 const feedback=data.refused?data.message:`What holds up\n${data.feedback.strength}\n\nWhat needs testing\n${data.feedback.concern}\n\nYour next move\n${data.feedback.nextMove}`;
 update({records:[...work.records,{tool:"Close Analysis",course:"language-literature",evidence,draft:work.draft,reflection:work.reflection,feedback,refused:data.refused,model:data.model,modelDisclosure:provider.disclosure,policyVersion:data.policyVersion,createdAt:data.createdAt}]});
 }catch(err){setError(controller.signal.aborted?"Feedback took too long. Your writing is still here. You can download it or try again when you’re ready.":err instanceof Error?err.message:"Feedback is unavailable. Your writing is still here.");}finally{clearTimeout(deadline);setBusy(false);}}
 return <div className="close-analysis">
 <nav className="close-source-list" aria-label="Choose a source">{sources.map((s,i)=><button type="button" disabled={busy} key={s.id} aria-pressed={s.id===selected} onClick={()=>{setSelected(s.id);setPage(0);setZoom(100);setError("");}}><span className="mono">{String.fromCharCode(65+i)} / {s.typeLabel}</span><strong>{s.title}</strong></button>)}</nav>
 <p className="close-save-status" role="status">{!ready?"Opening your workspace…":saved?"Saved in this tab’s session. Switching sources keeps your work; download before closing the tab.":"Browser saving is unavailable. Download your work before leaving."}</p>
 <div className="close-columns">
 <section className="close-source" aria-label="Source workspace"><span className="mono">01 / READ THE SOURCE</span><h2>{source.title}</h2><p>{source.context}</p><p className="hint"><a href={source.url} target="_blank" rel="noreferrer">{source.credit} ↗</a></p>
 <div className="close-toolbar"><label>Source page <select aria-label="Source page" value={page} onChange={e=>setPage(Number(e.target.value))}>{source.images.map((_,i)=><option key={i} value={i}>{i+1} of {source.images.length}</option>)}</select></label><label>Zoom <select aria-label="Source zoom" value={zoom} onChange={e=>setZoom(Number(e.target.value))}>{[100,150,200].map(n=><option key={n} value={n}>{n===100?"Fit width":`${n}%`}</option>)}</select></label><a href={`/close-analysis/${source.images[page]}`} target="_blank" rel="noreferrer">Open full size ↗</a></div>
 <p className="hint">Scroll inside the source to read the whole page. Zoom or open full size for smaller print.</p>
 <div className="close-image-scroll" tabIndex={0} aria-label="Source image; scroll to inspect at chosen zoom">
 {/* Source document image: native img preserves readable full-resolution zoom. */}
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img style={{width:`${zoom}%`,maxWidth:"none"}} src={`/close-analysis/${source.images[page]}`} alt={`${source.credit} Source page ${page+1}. A text version is available immediately below.`}/></div>
 <details className="close-transcript"><summary>Read text / neutral visual description</summary><p className="hint">Prepared from the supplied adapted source. Line wrapping differs from the image. Check visual details against the source above.</p><div>{source.transcript}</div></details>
 </section>
 <section className="close-writing" aria-label="Your response"><span className="mono">02 / ONE FEATURE, ONE PARAGRAPH</span><h2>What is this choice doing?</h2><p>{source.prompt}</p><p className="hint">Aim for about 80–150 words. A shorter, precise explanation can work. Length is not a measure of quality; this workspace caps responses at 180 words to keep the task small.</p>
 <form onSubmit={submit}><fieldset disabled={busy||!ready} className="refinery-fields">
 <label className="field">Your focus<span className="hint">A word or phrase is enough: text, image, headline, or a paragraph.</span><input required maxLength={100} value={work.area} onChange={e=>update({area:e.target.value})}/></label>
 <label className="field">One feature or choice<input required minLength={3} maxLength={200} value={work.feature} onChange={e=>update({feature:e.target.value})}/></label>
 <label className="field">Precise evidence<span className="hint">Use one or two brief quotations, or describe an exact visual detail and where it appears.</span><textarea required minLength={10} maxLength={700} rows={3} value={work.evidence} onChange={e=>update({evidence:e.target.value})}/></label>
 <label className="field">Your short response<span className="hint">Explain how your chosen detail supports an effect or function in this particular context.</span><textarea required minLength={20} maxLength={1800} rows={8} value={work.draft} onChange={e=>update({draft:e.target.value})}/></label><p className={count>180?"error":"hint"} aria-live="polite">{count} words · one paragraph</p>
 {previous&&<label className="field">Revision note: what did you change, and why?<textarea rows={2} maxLength={500} value={work.reflection} onChange={e=>update({reflection:e.target.value})}/></label>}
 <details><summary>Check your own explanation</summary><ul><li>Can I point to the exact detail behind my claim?</li><li>Have I explained how the choice works, rather than only naming it?</li><li>Does the proposed effect fit this audience and context?</li></ul><p>Revise this same paragraph. You decide which feedback is supported by the source.</p></details>
 <p className="hint">Feedback uses the Analysis Refinery’s text-based coaching. It receives the source transcript or neutral description and your entries; it cannot inspect the image. Feedback is diagnostic only: no scores, grades, or predicted IB results. AI feedback may be mistaken.</p>
 {!live&&<p className="close-local-note">AI feedback is currently unavailable. Writing, self-review, and downloads still work.</p>}
 <button className="button" disabled={count>180||!work.draft.trim()||!work.evidence.trim()||!work.feature.trim()||!work.area}>{busy?"Checking your response…":previous?"Get feedback on this revision":"Get feedback on this paragraph"}</button>
 </fieldset></form>
 <p className="hint">When enabled, feedback sends your entries and source text to {provider.disclosure}. Do not include personal information. Nothing is submitted to a teacher.</p>
 {error&&<p role="alert" className="error">{error}</p>}
 <div aria-live="polite" aria-busy={busy}>{latest&&<section className="passage-feedback"><span className="mono">03 / {latest.refused?"FEEDBACK NOT PROVIDED":"FEEDBACK → REVISE THE SAME RESPONSE"}</span><p style={{whiteSpace:"pre-line"}}>{latest.feedback}</p><p className="hint">Feedback applies to the saved attempt below{latest.draft!==work.draft||latest.evidence!==evidence?", not your current edits":""}.</p><details><summary>View the submitted attempt</summary><p style={{whiteSpace:"pre-line"}}>{latest.evidence}</p><p>{latest.draft}</p></details></section>}</div>
 <div className="refinery-save"><button type="button" className="button secondary" disabled={busy||!ready} onClick={()=>downloadRecord(`Close Analysis — practice record\n${source.credit}\n${source.url}\nTask: ${source.prompt}\n\n${formatPracticeRecord(work.records)}\n\nCurrent working response (may not have feedback)\n${evidence}\n\n${work.draft}\n\nRevision note: ${work.reflection}`,`close-analysis-${selected}.txt`,"txt")}>Download this source’s record</button><p className="hint">Includes your current notes and all feedback attempts for this source. Source scans and the full transcript are not included.</p></div>
 </section></div></div>;
}
