import { useRef } from "react";
import { Plus, Upload, X } from "lucide-react";
import type { CourseItem } from "@/lib/schema";

type Files = CourseItem["links"];
type Props = {
  collection: "links" | "rubrics";
  files: Files;
  onChange: (files: Files) => void;
  onUpload: (file: File) => void;
  preview: boolean;
};

export default function CourseFileEditor({ collection, files, onChange, onUpload, preview }: Props) {
  const picker = useRef<HTMLInputElement>(null);
  const rubric = collection === "rubrics";
  function edit(id: string, field: "title" | "url" | "description", value: string) {
    onChange(files.map(file => file.id === id ? { ...file, [field]: value } : file));
  }
  return (
    <section className="editor-details" aria-label={rubric ? "Rubric downloads" : "Materials and links"}>
      <h2>{rubric ? "Rubric downloads" : "Materials & links"}</h2>
      <p className="muted">
        {rubric
          ? "Upload a rubric PDF or enter the path to a PDF or Word file already on the site. Use the title to distinguish versions, such as SL and HL."
          : "Link to a reading, shared document, or an external practice tool. Uploaded files become public. Only upload material you can share."}
      </p>
      {files.map(file => (
        <div className="link-editor" key={file.id}>
          <label className="field">
            <span>{rubric ? "Rubric title" : "Link title"}</span>
            <input value={file.title} maxLength={120} onChange={e => edit(file.id, "title", e.target.value)} />
          </label>
          <label className="field">
            <span>{rubric ? "File path" : "URL"}</span>
            <input value={file.url} placeholder={rubric ? "/rubrics/paper-2.pdf" : undefined} onChange={e => edit(file.id, "url", e.target.value)} />
          </label>
          <label className="field">
            <span>{rubric ? "Description (optional)" : "Description"}</span>
            <input value={file.description} maxLength={400} onChange={e => edit(file.id, "description", e.target.value)} />
          </label>
          <button className="text-button" type="button" onClick={() => onChange(files.filter(entry => entry.id !== file.id))}>
            <X size={14} aria-hidden="true" /> {rubric ? "Remove rubric" : "Remove link"}
          </button>
        </div>
      ))}
      <div className="actions">
        <button type="button" className="button secondary" onClick={() => onChange([...files, { id: crypto.randomUUID(), title: "", url: "", description: "" }])}>
          <Plus size={16} aria-hidden="true" /> {rubric ? "Add rubric from site files" : "Add link"}
        </button>
        <button type="button" className="button secondary" disabled={preview} onClick={() => picker.current?.click()}>
          <Upload size={16} aria-hidden="true" /> {rubric ? "Upload rubric PDF" : "Upload file"}
        </button>
        <input hidden ref={picker} type="file" accept={rubric ? ".pdf" : ".pdf,.png,.jpg,.jpeg,.webp,.txt"} onChange={event => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = "";
          if (file) onUpload(file);
        }} />
      </div>
      <small className="hint">
        {rubric ? "Uploads are public immediately. The download appears on the assessment after you save." : "PDF, images, or plain text · Up to 50 MB. Use a shared-document link for larger files."}
      </small>
    </section>
  );
}
