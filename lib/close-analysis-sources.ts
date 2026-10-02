import catalog from "@/content/close-analysis.json";
import type { CloseSource } from "./close-analysis";
export const closeSources = ():CloseSource[] => catalog;
export function closeAnalysisLiveEnabled() {
 return Boolean(process.env.FIREWORKS_API_KEY?.trim()) && (process.env.NODE_ENV === "production" || process.env.LOCAL_CLOSE_ANALYSIS_LIVE === "1");
}
