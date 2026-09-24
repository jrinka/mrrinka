'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {categories,terms,legacyGroups,matchesTerm,type Category} from '@/lib/terminology';
import styles from './terminology.module.css';
export default function TerminologyBrowser(){
 const [category,setCategory]=useState<Category|'all'>('all');const [query,setQuery]=useState('');const [open,setOpen]=useState<string[]>([]);
 useEffect(()=>{const reveal=()=>{const hash=decodeURIComponent(location.hash.slice(1));const term=terms.find(t=>t.id===hash||t.aliases.includes(hash));const group=legacyGroups[hash];if(term||group){setCategory('all');setQuery('');setOpen(x=>term?[...new Set([...x,term.id])]:x);requestAnimationFrame(()=>document.getElementById(term?.id??group[0])?.scrollIntoView());}};reveal();window.addEventListener('hashchange',reveal);return()=>window.removeEventListener('hashchange',reveal);},[]);
 const visible=terms.filter(t=>(category==='all'||t.categories.includes(category))&&matchesTerm(t,query));
 return <div className={styles.browser}>
 <div className={styles.grid} aria-label="Term categories">{categories.map(c=><button key={c.id} aria-pressed={category===c.id} onClick={()=>setCategory(category===c.id?'all':c.id)}><strong>{c.title}</strong><span>{c.hint}</span><small>{terms.filter(t=>t.categories.includes(c.id)).length} terms</small></button>)}</div>
 <div className={styles.search}><label htmlFor="term-search">Find a term or describe a choice<input id="term-search" type="search" value={query} onChange={e=>{setQuery(e.target.value);setCategory('all');}} placeholder="Try ‘caption’, ‘sentence’, or ‘sound’"/></label><button type="button" onClick={()=>{setCategory('all');setQuery('');}}>Show all terms</button></div>
 <div className={styles.actions}><p role="status">{visible.length} terms{category!=='all'?` · ${categories.find(c=>c.id===category)?.title}`:''}</p><button onClick={()=>setOpen(visible.every(t=>open.includes(t.id))?[]:visible.map(t=>t.id))}>{visible.length>0&&visible.every(t=>open.includes(t.id))?'Collapse results':'Expand results'}</button></div>
 {!visible.length&&<p>No matching terms. Try a shorter phrase or show all terms.</p>}
 {visible.map(term=><details className={styles.term} id={term.id} key={term.id} open={open.includes(term.id)} onToggle={e=>{const isOpen=e.currentTarget.open;setOpen(x=>isOpen?x.includes(term.id)?x:[...x,term.id]:x.filter(id=>id!==term.id));}}><summary>{term.term}</summary><div>{term.readings.map(r=><section key={r.context}>{term.readings.length>1&&<h3>{r.context}</h3>}<p>{r.definition}</p>{r.example&&<p><strong>Example:</strong> {r.example}</p>}<p><strong>Possible analysis:</strong> {r.analysis}</p></section>)}<a href={`#${term.id}`}>Link to this term</a> · <Link href="/practice/what-changes">Try What changes? →</Link></div></details>)}
 </div>;
}
