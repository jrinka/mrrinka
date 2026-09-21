import Link from "next/link";
import {Sparkles,ArrowUpRight} from "lucide-react";
import {refineryKinds,refineries,type RefineryKind} from "@/lib/refineries";
export const refineryApplications:Record<RefineryKind,string>={analysis:"GENERAL ANALYSIS · PAPER 1",comparison:"PAPER 2","global-issue":"INDIVIDUAL ORAL","line-of-inquiry":"HIGHER LEVEL ESSAY"};
export default function RefineryLinks({kind}:{kind?:RefineryKind}){return <div className="refinery-links">{(kind?[kind]:refineryKinds).map(key=><Link href={`/practice/refineries/${key}`} key={key}><span className="mono ai-label"><Sparkles size={15} aria-hidden="true"/> AI GUIDANCE</span><strong>{refineries[key].title}</strong><span>{refineries[key].description}</span><span className="mono">{refineryApplications[key]}</span><small>Your thinking · Save a record <ArrowUpRight size={14} aria-hidden="true"/></small></Link>)}</div>;}
