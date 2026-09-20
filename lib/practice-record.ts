export type PracticeRecord = {
  createdAt: string; model: string; policyVersion: string;
  tool: string; course?: string; evidence: string; draft: string;
  reflection?: string; feedback: string; refused: boolean;
};
export function formatPracticeRecord(records: PracticeRecord[]) {
  return records.map((r, index) => `# ${r.tool} — attempt ${index + 1}\n\nDate: ${r.createdAt}\nModel: ${r.model}\nGuidance version: ${r.policyVersion}\n${r.course ? `Course: ${r.course}\n` : ""}Outcome: ${r.refused ? "Scope redirect" : "Feedback"}\n\n## Source / supporting evidence\n\n${r.evidence}\n\n## Student draft\n\n${r.draft}\n\n## Student revision note\n\n${r.reflection || "Not provided"}\n\n## AI feedback (not student-authored)\n\n${r.feedback}`).join("\n\n---\n\n");
}
export function downloadRecord(content: string, filename: string) {
  const url = URL.createObjectURL(new Blob([content], {type:"text/markdown;charset=utf-8"}));
  const a = document.createElement("a"); a.href=url; a.download=filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
