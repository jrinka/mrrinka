'use client';
import {useRef,useState} from 'react';
import {Sparkles} from 'lucide-react';
import type {ChangeFeedback} from '@/lib/what-changes-feedback';
import AiModelInfo from './ai-model-info';
import Image from 'next/image';
import Link from 'next/link';
import {changeExercises,groupChangeExercises,type ChangeCategory} from '@/lib/what-changes';
import ExportFormatSelect from './export-format';
import {downloadRecord,type ExportFormat} from '@/lib/practice-record';
import styles from './what-changes.module.css';
type AiResult={draft:string;feedback?:ChangeFeedback;message?:string;model?:string};
const groups=groupChangeExercises();
type Response={observation:string;revision:string;revealed:boolean;ai?:AiResult};
export default function WhatChanges({provider}:{provider:{name:string;disclosure:string}}){
 const [selectedIds,setSelectedIds]=useState<Partial<Record<ChangeCategory,string>>>({});const [responses,setResponses]=useState<Record<string,Response>>({});const [format,setFormat]=useState<ExportFormat>('docx');
 const [category,setCategory]=useState<ChangeCategory>('Word choice');
 const [pending,setPending]=useState<string|null>(null);const busy=useRef(false);
 const [errors,setErrors]=useState<Record<string,string>>({});
 const group=groups.find(item=>item.category===category)!;
 const selected=group.examples.find(item=>item.exercise.id===selectedIds[category])??group.examples[0];
 const position=group.examples.indexOf(selected);
 const exercise=selected.exercise;
 const answer=responses[exercise.id]??{observation:'',revision:'',revealed:false};
 function selectExample(id:string){setSelectedIds(previous=>({...previous,[category]:id}));}
 function move(direction:number){const next=group.examples[position+direction];if(next)selectExample(next.exercise.id);}
 function update(patch:Partial<Response>){setResponses(previous=>({...previous,[exercise.id]:{...(previous[exercise.id]??{observation:'',revision:'',revealed:false}),...patch}}));}
 async function requestFeedback(){
  if(busy.current||answer.observation.trim().length<20)return;
  const id=exercise.id,draft=answer.observation;
  busy.current=true;setPending(id);setErrors(previous=>({...previous,[id]:''}));
  try{
   const result=await fetch('/api/practice/what-changes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({exerciseId:id,draft}),signal:AbortSignal.timeout(115000)});
   const data=await result.json();
   if(!result.ok)throw new Error(data.error||'AI feedback could not be completed. Try again or use the authored reading.');
   if(!data.refused&&(!data.feedback||typeof data.feedback.response!=='string'||typeof data.feedback.possibility!=='string'||typeof data.feedback.question!=='string'))throw new Error('AI feedback could not be read. Try again or use the authored reading.');
   setResponses(previous=>({...previous,[id]:{...previous[id],ai:{draft,feedback:data.feedback,message:data.message,model:data.model}}}));
  }catch(error){setErrors(previous=>({...previous,[id]:error instanceof Error&&error.name!=='TimeoutError'?error.message:'AI feedback timed out. Your notes are still here; try again or use the authored reading.'}));}
  finally{busy.current=false;setPending(null);}
 }
 function exportWork(){const text=groups.flatMap(group=>group.examples.filter(({exercise})=>responses[exercise.id]).map(({exercise:e,label})=>{const r=responses[e.id];return `Group ${group.number} · ${group.category}\nExample ${label} · ${e.title}\n\nContext: ${e.context}\nVersion A: ${e.a}${e.kind==='hierarchy'?' [FREE ENTRY is the largest, bold line.]':''}\nVersion B: ${e.b}${e.kind==='hierarchy'?' [Community reading night is the largest, bold line.]':''}\n\nQuestion: ${e.prompt}\nMy first reading:\n${r.observation}\n\n${r.revealed?`Authored guidance (not student writing):\n${e.feedback}\n${e.complication}\n\n`:''}Transfer question: ${e.transfer}\nMy further thinking:\n${r.revision}\n\n${r.ai?`AI feedback (${r.ai.model??'model not specified'}; not student writing):\nSubmitted first reading:\n${r.ai.draft}\n${r.ai.feedback?`${r.ai.feedback.response}\nPossible interpretation: ${r.ai.feedback.possibility}\nQuestion: ${r.ai.feedback.question}`:r.ai.message}`:''}`;})).join('\n\n---\n\n');downloadRecord(`What changes?\nOriginal classroom practice examples. Student notes, authored guidance, and any requested AI feedback are labeled separately.\n${location.origin}/practice/what-changes\n\n${text}\n\nImage exercise: Wellcome Collection, Hands showing the sign language alphabet. Public Domain Mark. https://wellcomecollection.org/works/awq9wceu`,'what-changes-notes',format);}
 return <div className={styles.workshop}>
 <div className={styles.browse}><p className="mono" id="change-groups-label">Choose a practice group</p><nav className={styles.groups} aria-labelledby="change-groups-label">{groups.map(item=><button key={item.category} aria-pressed={category===item.category} onClick={()=>setCategory(item.category)}><span>{item.number} · {item.category}</span><small>{item.examples.length} examples</small></button>)}</nav><p className="hint">{changeExercises.length} comparisons across {groups.length} groups. Choose any starting point; letters start at A within each group.</p></div>
 <h2 className={styles.groupTitle} id="change-group-title">{group.number} · {group.category}</h2>
 <nav className={styles.choices} aria-label={`Examples in ${category}`}>{group.examples.map(({exercise:e,label})=><button key={e.id} aria-pressed={exercise.id===e.id} onClick={()=>selectExample(e.id)}>{label} · {e.title}{responses[e.id]?.revealed?<><span aria-hidden="true"> ✓</span><span className={styles.srOnly}> — guidance opened</span></>:''}</button>)}</nav>
 <section aria-labelledby="comparison-title"><span className="mono">{group.number} · {group.category} / EXAMPLE {selected.label} · {position+1} OF {group.examples.length} IN THIS GROUP</span><h2 id="comparison-title">{exercise.title}</h2><p>{exercise.context}</p>
 <div className={styles.pair}>{(['a','b'] as const).map(version=><figure key={version}><figcaption>Version {version.toUpperCase()}</figcaption>{exercise.kind==='caption'&&<div className={styles.image}><Image src="/archive/sign-alphabet.jpg" alt="Historical engraved chart of hand signs representing letters" fill sizes="(max-width:700px) 90vw, 40vw"/></div>}{exercise.kind==='hierarchy'?<div className={styles.notice}>{exercise[version].split('\n').map((line,i)=><p key={line} className={i===(version==='a'?0:1)?styles.emphasis:undefined}>{line}</p>)}</div>:<p className={styles.sample}>{exercise[version]}</p>}</figure>)}</div>
 {exercise.kind==='caption'&&<p className={styles.credit}><a href="https://wellcomecollection.org/works/awq9wceu">Image: Wellcome Collection ↗</a> · Public Domain Mark. Practice captions are original.</p>}
 <label className={styles.field} htmlFor="change-observation"><strong>{exercise.prompt}</strong><span>Point to the changed detail and explain a possible effect. A precise explanation matters more than naming a term.</span><textarea id="change-observation" rows={4} maxLength={6000} value={answer.observation} onChange={e=>update({observation:e.target.value})}/></label>
 {!answer.revealed&&<><button className="button" disabled={!answer.observation.trim()} onClick={()=>update({revealed:true})}>Compare with a possible reading</button><p className="hint">Write a first thought to reveal the guidance.</p></>}
 {answer.revealed&&<div className={styles.feedback}><h3>A possible reading</h3><p>{exercise.feedback}</p><h3>What could complicate it?</h3><p>{exercise.complication}</p><p>Useful terms: {exercise.terms.map((term,i)=><span key={term}>{i>0?' · ':''}<Link href={`/resources/analysis-reference#${term}`} target="_blank" rel="noopener noreferrer">{term.replace(/-/g,' ')} ↗</Link></span>)}</p><label className={styles.field} htmlFor="change-revision"><strong>Try it another way</strong><span>{exercise.transfer}</span><textarea id="change-revision" rows={3} maxLength={6000} value={answer.revision} onChange={e=>update({revision:e.target.value})}/></label></div>}
 <details className={styles.ai}>
 <summary><Sparkles size={17} aria-hidden="true"/> Optional AI feedback on my first reading</summary>
 <p>Request another possible interpretation and a question to test your thinking. AI can be mistaken; this is not a score or an answer key.</p>
 <AiModelInfo provider={provider}/>
 <p className="hint">Only clicking the button below sends this comparison and your first reading to the AI provider. Further thinking and other notes are not sent. Do not include names or private information. This site does not save your writing on the server.</p>
 <button className="button secondary" disabled={pending!==null||answer.observation.trim().length<20} onClick={requestFeedback}><Sparkles size={17} aria-hidden="true"/> {pending===exercise.id?'Getting feedback…':'Send my first reading for AI feedback'}</button>
 <p className="hint">Write at least 20 characters of your own explanation. Authored guidance above works without AI.</p>
 <div role="status" aria-live="polite">{pending&&<p>{pending===exercise.id?'Reading this comparison…':'Feedback is running for another comparison; you can keep writing here.'}</p>}</div>
 {errors[exercise.id]&&<p role="alert">{errors[exercise.id]}</p>}
 {answer.ai&&<div className={styles.feedback}><h3>AI feedback</h3><p className="hint">{answer.ai.model} · Feedback on the first reading submitted below.</p><details><summary>View the submitted reading</summary><p className={styles.submitted}>{answer.ai.draft}</p></details>{answer.ai.draft!==answer.observation&&<p className="hint">Your first reading has changed since this request. Request feedback again to include those changes.</p>}{answer.ai.feedback?<><p>{answer.ai.feedback.response}</p><h3>One possible interpretation</h3><p>{answer.ai.feedback.possibility}</p><h3>Test your reading</h3><p>{answer.ai.feedback.question}</p></>:<p>{answer.ai.message}</p>}</div>}
 </details>
 </section>
 <div className={styles.footer}><button className="button secondary" disabled={position===0} onClick={()=>move(-1)}>← Previous example</button><button className="button secondary" disabled={position===group.examples.length-1} onClick={()=>move(1)}>Next example →</button><ExportFormatSelect value={format} onChange={setFormat}/><button className="button secondary" disabled={!Object.keys(responses).length} onClick={exportWork}>Download all my notes</button></div>
 {position===group.examples.length-1&&<p className="hint">End of {category}. Choose another practice group above, or revisit an example in this group.</p>}
 <p className="hint">Switching examples or groups keeps your notes while this page is open. Download before leaving or reloading. Nothing is sent to AI unless you request feedback; notes are not saved on the server. A check mark means guidance was opened, not that an answer was correct.</p>
 <p><Link href="/resources/analysis-reference">← Browse terms for analysis</Link></p>
 </div>;
}
