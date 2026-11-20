import { Download } from "lucide-react";
import type { CourseItem } from "@/lib/schema";

export default function AssessmentRubrics({ files }: { files: CourseItem["rubrics"] }) {
  if (!files?.length) return null;
  return (
    <section className="assessment-rubrics" id="assessment-rubrics" tabIndex={-1} aria-labelledby="rubrics-title">
      <h2 id="rubrics-title">Rubric downloads</h2>
      <ul>
        {files.map(file => {
          const format = file.url.split(".").pop()!.toLowerCase();
          const title = file.title.replace(/\.(pdf|docx)$/i, "");
          const filename = title.replace(/[<>:"/\\|?*]/g, "-").trim() || "Assessment rubric";
          return (
            <li key={file.id}>
              <a href={file.url} download={`${filename}.${format}`}>
                <Download size={17} aria-hidden="true" />
                <span>Download {title || "rubric"}</span>
                <span className="mono rubric-format">{format === "pdf" ? "Printable PDF" : "Editable Word"}</span>
              </a>
              {file.description && <p>{file.description}</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
