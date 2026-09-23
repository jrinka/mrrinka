export type PracticeRecord = {
  createdAt: string; model: string; policyVersion: string;
  modelDisclosure?: string;
  tool: string; course?: string; evidence: string; draft: string;
  reflection?: string; feedback: string; refused: boolean;
};
export function formatPracticeRecord(records: PracticeRecord[]) {
  if (!records.length) return "";
  const attempts = records.map((r, index) => `${r.tool} — attempt ${index + 1}\n\nDate: ${r.createdAt}\nModel: ${r.model}\nGuidance version: ${r.policyVersion}\n${r.course ? `Course: ${r.course}\n` : ""}Outcome: ${r.refused ? "Scope redirect" : "Feedback"}\n\nSource / supporting evidence\n\n${r.evidence}\n\nStudent draft\n\n${r.draft}\n\nStudent revision note\n\n${r.reflection || "Not provided"}\n\nAI feedback (not student-authored)\n\n${r.feedback}\n\nAI feedback source: Mr. Rinka's Class (${r.tool}); ${r.modelDisclosure || r.model}; generated ${r.createdAt} in response to the student input above.`).join("\n\n---\n\n");
  return `${attempts}\n\nAI use note: This record identifies feedback; it is not a citation for assessed writing. If AI-generated wording is included in assessed work, cite that use and its prompt according to your school's required style. IB guidance: https://www.ibo.org/globalassets/new-structure/programmes/shared-resources/pdfs/academic-integrity-policy-en.pdf`;
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
