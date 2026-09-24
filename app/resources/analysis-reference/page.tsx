import Link from "next/link";
import GlobalShell from "@/components/global-shell";
import TerminologyBrowser from "@/components/terminology-browser";
export const metadata = { title: "Terms for analysis" };
export default function Page() {
 return <GlobalShell><div className="global-page-head"><span className="mono">LANGUAGE & REFERENCE</span><h1>Terms for analysis</h1><p>Find a choice, understand it, then test what it does in context. Browse by what you are examining, or search definitions when you cannot remember the term.</p><p>Possible analysis offers starting points—not fixed effects. The same choice can work differently in another text.</p><Link className="button secondary" href="/practice/what-changes">Try What changes? →</Link><p><Link href="/resources/analytical-language">Tone words, analysis verbs, transitions and sentence stems ↗</Link></p></div><TerminologyBrowser/></GlobalShell>;
}
