import { notFound } from "next/navigation";
import Link from "next/link";
import GlobalShell from "@/components/global-shell";
import InquiryWorkshop from "@/components/inquiry-workshop";
import Refinery from "@/components/refinery";
import { refineries, refineryKinds, type RefineryKind } from "@/lib/refineries";
type Props = {params:Promise<{kind:string}>;searchParams:Promise<{course?:string;transfer?:string}>};
export async function generateMetadata({params}:Props) {
  const {kind}=await params;
  return {title:refineries[kind as RefineryKind]?.title ?? "Refinery"};
}
export default async function RefineryPage({params,searchParams}:Props) {
  const {kind}=await params;
  if (!(refineryKinds as readonly string[]).includes(kind)) notFound();
  const type=kind as RefineryKind;
  const query=await searchParams;
  const course=query.course === "literature" || query.course === "language-literature" ? query.course : "";
  const transfer=typeof query.transfer === "string" && /^[a-zA-Z0-9-]{1,64}$/.test(query.transfer) ? query.transfer : "";
  return <GlobalShell><Link className="back" href="/practice">← Practice</Link><div className="global-page-head refinery-page-head"><span className="mono">DRAFT / QUESTION / REFINE</span><h1>{refineries[type].title}</h1><p>{refineries[type].description}</p></div>{type === "global-issue" || type === "line-of-inquiry" ? <InquiryWorkshop key={`${type}-${course}`} kind={type} initialCourse={course} /> : <Refinery key={`${type}-${course}-${transfer}`} kind={type} initialCourse={course} transferId={transfer} />}</GlobalShell>;
}
