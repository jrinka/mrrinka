import Link from "next/link";
import GlobalShell from "@/components/global-shell";
import CloseAnalysis from "@/components/close-analysis";
import { closeAnalysisLiveEnabled, closeSources } from "@/lib/close-analysis-sources";
import { closeAnalysisProvider } from "@/lib/feedback-service";
export const dynamic = "force-dynamic";
export const metadata = {title:"Close Analysis"};
export default async function Page(){
 return <GlobalShell><Link className="back" href="/practice">← Practice</Link><div className="global-page-head"><span className="mono">LANGUAGE &amp; LITERATURE · ONE FEATURE, ONE PARAGRAPH</span><h1>Close Analysis</h1><p>One feature. One paragraph. Read closely, explain what a choice does, then revise the same response.</p></div><CloseAnalysis sources={await closeSources()} provider={closeAnalysisProvider()} live={closeAnalysisLiveEnabled()}/></GlobalShell>;
}
