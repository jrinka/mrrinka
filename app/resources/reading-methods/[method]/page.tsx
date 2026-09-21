import { notFound } from "next/navigation";
import Link from "next/link";
import GlobalShell from "@/components/global-shell";
import { GuidePlate } from "@/components/archive-art";
import ReadingGrid from "@/components/reading-grid";
import { readingMethods, type ReadingMethod } from "@/lib/reading-methods";
type Props={params:Promise<{method:string}>};
export function generateStaticParams(){return Object.keys(readingMethods).map(method=>({method}));}
export async function generateMetadata({params}:Props){const {method}=await params;return {title:readingMethods[method as ReadingMethod]?.title??"Reading methods"};}
export default async function Page({params}:Props){
 const {method}=await params;if(!Object.hasOwn(readingMethods,method))notFound();const guide=readingMethods[method as ReadingMethod];
 return <GlobalShell><Link className="back" href="/resources">← Skills &amp; Methods</Link><div className="illustrated-guide-head"><div className="global-page-head"><span className="mono">ALTERNATIVE METHOD / PAPER 1</span><h1>{guide.title}</h1><p>{guide.subtitle}. Use it when you need help getting started; follow the text and guiding question when you build your response.</p></div><GuidePlate kind="methods"/></div><section className="lens-intro"><h2>{guide.work}</h2><p>{guide.note}</p><a href={guide.source} target="_blank" rel="noreferrer">{guide.sourceLabel} ↗</a>{method==="soapstone"&&<p className="hint"><a href="https://www.loc.gov/exhibits/gettysburg-address/">Historical context and manuscript versions · Library of Congress ↗</a></p>}</section><ReadingGrid method={method as ReadingMethod}/><p><Link href="/resources/analytical-language">Tone words, analysis verbs and sentence stems →</Link></p></GlobalShell>;
}
