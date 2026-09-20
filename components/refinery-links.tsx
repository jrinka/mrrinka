import Link from "next/link";
import { refineryKinds, refineries, type RefineryKind } from "@/lib/refineries";
export default function RefineryLinks({kind}: {kind?:RefineryKind}) {
  return <div className="refinery-links">{(kind ? [kind] : refineryKinds).map(key=><Link key={key} href={`/practice/refineries/${key}`}><span className="mono">AI COACHING</span><strong>{refineries[key].title}</strong><span>{refineries[key].description}</span><small>Bring your own draft · Keep a record ↗</small></Link>)}</div>;
}
