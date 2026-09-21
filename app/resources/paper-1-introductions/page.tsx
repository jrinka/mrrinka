import Link from "next/link";
import GlobalShell from "@/components/global-shell";
import Markdown from "@/components/markdown";
import IntroductionExamples from "@/components/introduction-examples";
import sections from "@/lib/introduction-guide.json";
export const metadata={title:"Paper 1: Introductions & thesis statements"};
export default async function Introductions({searchParams}:{searchParams:Promise<{example?:string|string[]}>}){
 const query=await searchParams;
 const example=query.example==="language-literature"?"language-literature":"literature";
 return <GlobalShell>
  <Link className="back" href="/resources">← Skills &amp; Methods</Link>
  <div className="global-page-head"><span className="mono">PAPER 1 / SHARED METHOD</span><h1>Introductions &amp; thesis statements</h1><p>Establish the text, develop a reading, and give your response a direction.</p></div>
  <div className="lens-intro prose"><p>Your introduction should explain which text you are analysing, what matters about it, and what your response will argue. This is a flexible method, not a compulsory sentence formula.</p><a href="#worked-examples">Jump to the worked examples ↓</a></div>
  <section aria-label="Step-by-step introduction guide">{sections.slice(0,6).map((section,index)=><details className="lens-section" key={section.title} open={index===0}><summary><span>{section.title}</span></summary><div className="lens-body"><Markdown>{section.body}</Markdown></div></details>)}</section>
  <IntroductionExamples key={example} initialExample={example}/>
  {sections.slice(6).map(section=><section className="lens-intro" key={section.title}><h2>{section.title}</h2><Markdown>{section.body}</Markdown></section>)}
  <aside className="intro-sources prose"><h2>Sources &amp; further guidance</h2><p>Informed by David Giles and Andrew Cohen (IB English Guys), <em>Teaching Paper 1</em>, especially “Rudimentary Outline and Thesis” and “Teaching the Introduction.” This sequence and the worked introductions are newly written adaptations. The optional-hook advice and distinctions between the courses are editorial choices for this guide.</p><p><a href="https://ibenglishguys.com/paper-one/">IB English Guys · Paper One resources ↗</a> — see “Master Class – Introductions and Conclusions” and the accompanying sample.</p></aside>
 </GlobalShell>;
}
