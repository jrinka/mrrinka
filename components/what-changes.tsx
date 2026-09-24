'use client';
import {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {changeExercises} from '@/lib/what-changes';
import ExportFormatSelect from './export-format';
import {downloadRecord,type ExportFormat} from '@/lib/practice-record';
import styles from './what-changes.module.css';
type Response={observation:string;revision:string;revealed:boolean};
export default function WhatChanges(){
 const [index,setIndex]=useState(0);const [responses,setResponses]=useState<Record<string,Response>>({});const [format,setFormat]=useState<ExportFormat>('txt');
 const exercise=changeExercises[index];const answer=responses[exercise.id]??{observation:'',revision:'',revealed:false};
 function update(patch:Partial<Response>){setResponses(previous=>({...previous,[exercise.id]:{...(previous[exercise.id]??{observation:'',revision:'',revealed:false}),...patch}}));}
 function exportWork(){const text=changeExercises.filter(e=>responses[e.id]).map(e=>{const r=responses[e.id];return `${e.title}\n\nContext: ${e.context}\nVersion A: ${e.a}${e.kind==='hierarchy'?' [FREE ENTRY is the largest, bold line.]':''}\nVersion B: ${e.b}${e.kind==='hierarchy'?' [Community reading night is the largest, bold line.]':''}\n\nQuestion: ${e.prompt}\nMy first reading:\n${r.observation}\n\n${r.revealed?`Authored guidance (not student writing):\n${e.feedback}\n${e.complication}\n\n`:''}Transfer question: ${e.transfer}\nMy further thinking:\n${r.revision}`;}).join('\n\n---\n\n');downloadRecord(`What changes?\nOriginal classroom practice examples. No AI feedback.\n${location.origin}/practice/what-changes\n\n${text}\n\nImage exercise: Wellcome Collection, Hands showing the sign language alphabet. Public Domain Mark. https://wellcomecollection.org/works/awq9wceu`,'what-changes-notes',format);}
 return <div className={styles.workshop}>
 <nav className={styles.choices} aria-label="Choose a comparison">{changeExercises.map((e,i)=><button key={e.id} aria-pressed={index===i} onClick={()=>setIndex(i)}>{String(i+1).padStart(2,'0')} · {e.title}{responses[e.id]?.revealed?' ✓':''}</button>)}</nav>
 <section aria-labelledby="comparison-title"><span className="mono">COMPARE / {index+1} OF {changeExercises.length}</span><h2 id="comparison-title">{exercise.title}</h2><p>{exercise.context}</p>
 <div className={styles.pair}>{(['a','b'] as const).map(version=><figure key={version}><figcaption>Version {version.toUpperCase()}</figcaption>{exercise.kind==='caption'&&<div className={styles.image}><Image src="/archive/sign-alphabet.jpg" alt="Historical engraved chart of hand signs representing letters" fill sizes="(max-width:700px) 90vw, 40vw"/></div>}{exercise.kind==='hierarchy'?<div className={styles.notice}>{exercise[version].split('\n').map((line,i)=><p key={line} className={i===(version==='a'?0:1)?styles.emphasis:undefined}>{line}</p>)}</div>:<p className={styles.sample}>{exercise[version]}</p>}</figure>)}</div>
 {exercise.kind==='caption'&&<p className={styles.credit}><a href="https://wellcomecollection.org/works/awq9wceu">Image: Wellcome Collection ↗</a> · Public Domain Mark. Practice captions are original.</p>}
 <label className={styles.field} htmlFor="change-observation"><strong>{exercise.prompt}</strong><span>Point to the changed detail and explain a possible effect. A precise explanation matters more than naming a term.</span><textarea id="change-observation" rows={4} maxLength={6000} value={answer.observation} onChange={e=>update({observation:e.target.value})}/></label>
 {!answer.revealed&&<><button className="button" disabled={!answer.observation.trim()} onClick={()=>update({revealed:true})}>Compare with a possible reading</button><p className="hint">Write a first thought to reveal the guidance. This is a comparison, not a marked answer.</p></>}
 {answer.revealed&&<div className={styles.feedback}><h3>A possible reading</h3><p>{exercise.feedback}</p><h3>What could complicate it?</h3><p>{exercise.complication}</p><p>Useful terms: {exercise.terms.map((term,i)=><span key={term}>{i>0?' · ':''}<Link href={`/resources/analysis-reference#${term}`} target="_blank" rel="noopener noreferrer">{term.replace(/-/g,' ')} ↗</Link></span>)}</p><label className={styles.field} htmlFor="change-revision"><strong>Try it another way</strong><span>{exercise.transfer}</span><textarea id="change-revision" rows={3} maxLength={6000} value={answer.revision} onChange={e=>update({revision:e.target.value})}/></label></div>}
 </section>
 <div className={styles.footer}><button className="button secondary" onClick={()=>setIndex((index+1)%changeExercises.length)}>Next comparison →</button><ExportFormatSelect value={format} onChange={setFormat}/><button className="button secondary" disabled={!Object.keys(responses).length} onClick={exportWork}>Export all my notes</button></div>
 <p className="hint">Notes stay with you when switching comparisons in this page. Export before leaving or refreshing. No writing is sent to AI or saved on the server. A check mark means guidance was opened, not that an answer was correct.</p>
 <p><Link href="/resources/analysis-reference">← Browse terms for analysis</Link></p>
 </div>;
}
