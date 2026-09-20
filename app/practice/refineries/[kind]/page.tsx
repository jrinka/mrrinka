import { notFound } from "next/navigation";
import Link from "next/link";
import GlobalShell from "@/components/global-shell";
import Refinery from "@/components/refinery";
import { refineries, refineryKinds, type RefineryKind } from "@/lib/refineries";
type Props = {params:Promise<{kind:string}>};
export async function generateMetadata({params}:Props) {
  const {kind}=await params;
  return {title:refineries[kind as RefineryKind]?.title ?? "Refinery"};
}
export default async function RefineryPage({params}:Props) {
  const {kind}=await params;
  if (!(refineryKinds as readonly string[]).includes(kind)) notFound();
  const type=kind as RefineryKind;
  return <GlobalShell><Link className="back" href="/practice">← Practice</Link><div className="global-page-head"><span className="mono">DRAFT / QUESTION / REFINE</span><h1>{refineries[type].title}</h1><p>{refineries[type].description}</p></div><Refinery kind={type} /></GlobalShell>;
}
