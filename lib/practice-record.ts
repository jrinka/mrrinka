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
export type ExportFormat = "txt" | "md" | "pdf" | "docx";
export const exportFormats: {value:ExportFormat; label:string}[] = [
  {value:"pdf",label:"PDF (.pdf) — for reading and annotation"},
  {value:"docx",label:"Word (.docx) — editable document"},
  {value:"txt",label:"Plain text (.txt)"},
  {value:"md",label:"Markdown (.md) — for Markdown apps"},
];
export function prepareRecordDownload(content:string,filename:string,format:"txt"|"md"="txt") {
  const base=filename.replace(/\.(txt|md|pdf|docx)$/i,"");
  return {content:format==="md" ? `# ${base.replace(/-/g," ")}\n\n${content}` : content,filename:`${base}.${format}`,mime:format==="md"?"text/markdown;charset=utf-8":"text/plain;charset=utf-8"};
}
export async function createRecordBlob(content: string, filename: string, format: ExportFormat) {
  const base = filename.replace(/\.(txt|md|pdf|docx)$/i, "");
  if (format === "pdf" || format === "docx") {
    const { createPdf, createDocx } = await import("./document-export");
    return { blob: await (format === "pdf" ? createPdf(content, filename) : createDocx(content, filename)), filename: `${base}.${format}` };
  }
  const record = prepareRecordDownload(content, filename, format);
  return { blob: new Blob([record.content], { type: record.mime }), filename: record.filename };
}
let exporting = false;
let statusTimer: ReturnType<typeof setTimeout> | undefined;
function exportStatus(message: string, error = false) {
  let status = document.getElementById("record-export-status");
  if (!status) {
    status = document.createElement("div");
    status.id = "record-export-status";
    status.style.cssText = "position:fixed;bottom:20px;right:20px;z-index:9999;max-width:min(440px,calc(100vw - 40px));padding:16px 20px;background:#25282b;color:#fff;border-left:4px solid #d8ed61;box-shadow:0 3px 15px #0003;font:15px/1.5 sans-serif;display:flex;align-items:center;gap:16px;";
    const text = document.createElement("span");
    text.setAttribute("role", "status"); text.setAttribute("aria-live", "polite");
    const close = document.createElement("button"); close.type = "button"; close.textContent = "×"; close.setAttribute("aria-label", "Dismiss export message");
    close.style.cssText = "background:transparent;color:white;border:0;font-size:24px;cursor:pointer;padding:4px;";
    close.onclick = () => { status!.hidden = true; status!.style.display = "none"; };
    status.append(text, close); document.body.append(status);
  }
  clearTimeout(statusTimer); status.hidden = false; status.style.display = "flex";
  status.firstElementChild!.textContent = message;
  if (!error && !exporting) statusTimer = setTimeout(() => { status!.hidden = true; status!.style.display = "none"; }, 6000);
}
export async function downloadRecord(content: string, filename: string, format:ExportFormat="txt"): Promise<boolean> {
  if (exporting) return false;
  exporting = true;
  exportStatus(`Preparing ${format.toUpperCase()}…`);
  try {
    const record = await createRecordBlob(content, filename, format);
    const url = URL.createObjectURL(record.blob);
    const a = document.createElement("a"); a.href = url; a.download = record.filename;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    exporting = false;
    exportStatus(`${format.toUpperCase()} download ready.`);
    return true;
  } catch {
    exporting = false;
    exportStatus("Couldn’t create the file. Your writing is still here. Try again, or choose plain text.", true);
    return false;
  }
}
