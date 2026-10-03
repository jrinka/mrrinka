import catalog from "@/content/close-analysis.json";
import { closeRequest, type CloseSource } from "./close-analysis";
import { closeSourceTypes } from "./close-analysis-metadata";
export const closeSources = ():CloseSource[] => catalog.map(source => {
 const id = closeRequest.shape.sourceId.parse(source.id);
 return {...source, id, typeLabel: closeSourceTypes[id]};
});
export function closeAnalysisLiveEnabled() {
 return Boolean(process.env.FIREWORKS_API_KEY?.trim()) && (process.env.NODE_ENV === "production" || process.env.LOCAL_CLOSE_ANALYSIS_LIVE === "1");
}
