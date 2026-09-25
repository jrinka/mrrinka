import bank from "./paper-two-questions.json";

export type QuestionPool = "recent" | "general" | "drama" | "poetry" | "fiction" | "nonfiction";
export type PaperTwoQuestion = {
  id: string; pool: QuestionPool; text: string;
  sources: { session: string; year: number; zone: string; course: string; number: number }[];
};
export const paperTwoQuestions = bank as PaperTwoQuestion[];
export const questionPools: { id: QuestionPool; label: string }[] = [
  { id: "recent", label: "Recent questions · 2023–2025" },
  { id: "general", label: "Earlier questions · General" },
  { id: "drama", label: "Earlier questions · Drama" },
  { id: "poetry", label: "Earlier questions · Poetry" },
  { id: "fiction", label: "Earlier questions · Prose fiction" },
  { id: "nonfiction", label: "Earlier questions · Prose non-fiction" },
];
export function questionSource(question: PaperTwoQuestion) {
  const source = question.sources[0];
  return `${source.session}${source.zone ? ` · ${source.zone}` : ""} · ${source.course} · Question ${source.number}`;
}
// Exhaust the chosen pool before repeating; never repeat the active question immediately.
export function drawQuestion(pool: QuestionPool, seen: string[], current?: string, random = Math.random()) {
  const candidates = paperTwoQuestions.filter(q => q.pool === pool && q.id !== current);
  const unseen = candidates.filter(q => !seen.includes(q.id));
  const choices = unseen.length ? unseen : candidates;
  const index = Math.min(choices.length - 1, Math.floor(Math.max(0, random) * choices.length));
  const question = choices[index];
  const poolIds = new Set(paperTwoQuestions.filter(q => q.pool === pool).map(q => q.id));
  return { question, seen: [...(unseen.length ? seen : seen.filter(id => !poolIds.has(id))), question.id] };
}
export const draftFields = [
  ["focus", "What the question asks"],
  ["workA", "Work A — title and author"], ["evidenceA", "Work A — evidence and choices"],
  ["workB", "Work B — title and author"], ["evidenceB", "Work B — evidence and choices"],
  ["thesis", "My comparative thesis"], ["revision", "My revised thesis"],
] as const;
export type PaperTwoDraft = Partial<Record<(typeof draftFields)[number][0], string>>;
export function hasDraft(draft: PaperTwoDraft) { return Object.values(draft).some(value => value?.trim()); }
export function formatPaperTwoNotes(drafts: Record<string, PaperTwoDraft>) {
  return Object.entries(drafts).filter(([,draft]) => hasDraft(draft)).map(([id, draft]) => {
    const question = paperTwoQuestions.find(q => q.id === id);
    if (!question) return "";
    return `PAPER 2 — QUESTION TO THESIS\n\n${questionSource(question)}\n${question.pool === "recent" ? "2023–2025 question" : "Earlier syllabus question — follow its stated requirements"}\n\n${question.text}\n\n${draftFields.map(([key, label]) => `${label}\n${draft[key]?.trim() || "—"}`).join("\n\n")}`;
  }).filter(Boolean).join("\n\n====================\n\n");
}
