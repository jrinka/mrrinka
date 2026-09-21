export type PracticeRecord = {
  createdAt: string; model: string; policyVersion: string;
  tool: string; course?: string; evidence: string; draft: string;
  reflection?: string; feedback: string; refused: boolean;
};
export function formatPracticeRecord(records: PracticeRecord[]) {
  return records.map((r, index) => `${r.tool} — attempt ${index + 1}\n\nDate: ${r.createdAt}\nModel: ${r.model}\nGuidance version: ${r.policyVersion}\n${r.course ? `Course: ${r.course}\n` : ""}Outcome: ${r.refused ? "Scope redirect" : "Feedback"}\n\nSource / supporting evidence\n\n${r.evidence}\n\nStudent draft\n\n${r.draft}\n\nStudent revision note\n\n${r.reflection || "Not provided"}\n\nAI feedback (not student-authored)\n\n${r.feedback}`).join("\n\n---\n\n");
}
export type ExportFormat = "txt" | "md";
export function prepareRecordDownload(content:string,filename:string,format:ExportFormat="txt") {
  const base=filename.replace(/\.(txt|md)$/i,"");
  return {content:format==="md" ? `# ${base.replace(/-/g," ")}\n\n${content}` : content,filename:`${base}.${format}`,mime:format==="md"?"text/markdown;charset=utf-8":"text/plain;charset=utf-8"};
}
export function downloadRecord(content: string, filename: string, format:ExportFormat="txt") {
  const record=prepareRecordDownload(content,filename,format);
  const url = URL.createObjectURL(new Blob([record.content], {type:record.mime}));
  const a = document.createElement("a"); a.href=url; a.download=record.filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
