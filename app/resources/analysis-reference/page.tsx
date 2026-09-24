import Link from "next/link";
import GlobalShell from "@/components/global-shell";
import banks from "@/lib/analysis-reference.json";

export const metadata = { title: "Terms for analysis" };
const anchor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");

export default function Page() {
  return <GlobalShell>
    <div className="global-page-head"><span className="mono">LANGUAGE & REFERENCE</span><h1>Terms for analysis</h1><p>Definitions, examples and possible analysis for literary, rhetorical and visual choices.</p><p>Common effects are starting points. A low angle often empowers a subject—but that power may be heroic, threatening or ironic. Use the surrounding details to explain what the choice does in this particular text.</p><Link href="/resources/analytical-language">Tone words, analysis verbs, transitions and sentence stems ↗</Link></div>
    <nav className="reference-jumps" aria-label="Reference categories">{banks.map((bank,i)=><div key={bank.title}><strong>{bank.title}</strong>{bank.groups.map(group=><a key={group.title} href={`#bank-${i}-${anchor(group.title)}`}>{group.title}</a>)}</div>)}</nav>
    {banks.map((bank,i)=><section key={bank.title} className="reference-bank"><h2>{bank.title}</h2>{bank.groups.map(group=><section key={group.title} id={`bank-${i}-${anchor(group.title)}`}><h3>{group.title}</h3>{group.entries.map(entry=><details className="reference-term" id={`bank-${i}-${anchor(entry.term)}`} key={entry.term}><summary>{entry.term}</summary><div><p>{entry.definition}</p>{entry.example && <p><strong>Example</strong> {entry.example}</p>}<p><strong>Possible analysis</strong> {entry.analysis}</p></div></details>)}</section>)}</section>)}
  </GlobalShell>;
}
