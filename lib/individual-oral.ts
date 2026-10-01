export type IOCourse = "language-literature" | "literature";
export type IOOrder = "extract-first" | "whole-first" | "extract-whole-whole-extract";
export const ioOrders: { id: IOOrder; title: string }[] = [
  { id: "extract-first", title: "Extract first for both selections" },
  { id: "whole-first", title: "Work as a whole first for both selections" },
  { id: "extract-whole-whole-extract", title: "Extract first / work as a whole first" },
];
export type IOMode = "full" | "section" | "short" | "questions";
export type IOStage = { title: string; duration: number; start: number; end: number; purpose: string };
export const ioModes: { id: IOMode; title: string; seconds: number }[] = [
  { id: "full", title: "Full oral · 10:00", seconds: 600 },
  { id: "section", title: "One analytical section · 2:15", seconds: 135 },
  { id: "short", title: "One explanation · 1:00", seconds: 60 },
  { id: "questions", title: "Teacher questions · 5:00", seconds: 300 },
];
export function ioSelections(course: IOCourse) {
  return course === "literature" ? ["Work originally in English", "Work in translation"] : ["Literary work", "Non-literary body of work"];
}
export function ioWholeLabel(course: IOCourse, index: number) {
  return course === "language-literature" && index === 1 ? "body of work" : "work as a whole";
}
export function ioStages(course: IOCourse, order: IOOrder): IOStage[] {
  const rows = [{ title: "Introduction", duration: 30, purpose: "Name the issue and selections; establish your analytical focus." }];
  ioSelections(course).forEach((selection, index) => {
    const close = { title: `${selection}: extract`, duration: 135, purpose: "Explain precise choices in the extract and their relevance to the issue." };
    const wide = { title: `${selection}: ${ioWholeLabel(course, index)}`, duration: 135, purpose: "Develop the reading through specific choices beyond the extract." };
    const extractFirst = order === "extract-first" || (order === "extract-whole-whole-extract" && index === 0);
    rows.push(...(extractFirst ? [close, wide] : [wide, close]));
  });
  rows.push({ title: "Conclusion", duration: 30, purpose: "State what the analysis has established. Bring the discussion to a close." });
  let start = 0;
  return rows.map(row => { const stage = { ...row, start, end: start + row.duration }; start = stage.end; return stage; });
}
export function ioClock(seconds: number) {
  const value = Math.max(0, Math.floor(seconds));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}
export function ioStageAt(stages: IOStage[], elapsed: number) {
  return stages.find(stage => elapsed >= stage.start && elapsed < stage.end);
}
export const ioLegacyAnchors: Record<string, string> = {
  "what-is-the-io": "briefing", "prepare-your-analysis": "method", "avoid-common-problems": "avoid",
  "practice-speaking": "practice", "analysis-planning-sheets": "field-tools", "learn-from-a-short-example": "models",
};
