"use client";
import { useState } from "react";
export default function Practice({
  kind,
}: {
  kind: "paragraph" | "close-reading";
}) {
  const prompts =
    kind === "paragraph"
      ? [
          {
            key: "claim",
            label: "Your claim",
            hint: "What does this passage suggest? Make a focused interpretation.",
          },
          {
            key: "evidence",
            label: "Your evidence",
            hint: "Choose a short quotation or a precise detail.",
          },
          {
            key: "analysis",
            label: "Your analysis",
            hint: "Explain how the choice creates meaning and supports your claim.",
          },
          {
            key: "connection",
            label: "Your connection",
            hint: "Connect the analysis back to the question or the wider text.",
          },
        ]
      : [
          {
            key: "detail",
            label: "Notice a detail",
            hint: "Record a word, image, pattern, or structural choice.",
          },
          {
            key: "effect",
            label: "Explore its effect",
            hint: "How does the choice shape your response?",
          },
          {
            key: "meaning",
            label: "Develop an interpretation",
            hint: "What meaning does this detail suggest in context?",
          },
          {
            key: "alternative",
            label: "Consider another reading",
            hint: "How might someone interpret the detail differently?",
          },
        ];
  const [values, setValues] = useState<Record<string, string>>({});
  const [review, setReview] = useState(false);
  const [copied, setCopied] = useState(false);
  const result = prompts
    .map((p) => values[p.key]?.trim())
    .filter(Boolean)
    .join(kind === "paragraph" ? " " : "\n\n");
  function download() {
    const a = document.createElement("a");
    const url = URL.createObjectURL(new Blob([result], { type: "text/plain" }));
    a.href = url;
    a.download = `${kind}-notes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <section className="practice-box">
      <div className="section-heading">
        <h2>Your workspace</h2>
        <span className="mono">
          {Object.values(values).filter((v) => v.trim()).length} / 4 STEPS
        </span>
      </div>
      <p className="muted">
        Your writing stays in this tab. Download it before leaving; it isn’t
        submitted or saved to the site.
      </p>
      {prompts.map((p, i) => (
        <label className="field" key={p.key}>
          <span>
            <small className="mono">0{i + 1}</small> {p.label}
          </span>
          <span className="hint">{p.hint}</span>
          <textarea
            rows={3}
            value={values[p.key] || ""}
            onChange={(e) => {
              setValues({ ...values, [p.key]: e.target.value });
              setReview(false);
            }}
          />
        </label>
      ))}
      <button
        className="button"
        disabled={!result}
        onClick={() => setReview(true)}
      >
        Review my writing
      </button>
      {review && (
        <div className="practice-result" aria-live="polite">
          <h3>
            {kind === "paragraph"
              ? "Your assembled paragraph"
              : "Your reading notes"}
          </h3>
          <p className="preserve">{result}</p>
          <h4>Before you finish</h4>
          <ul>
            <li>Is the interpretation specific to this text?</li>
            <li>Have you explained the evidence rather than repeated it?</li>
            <li>
              Is there a choice or alternative reading worth exploring further?
            </li>
          </ul>
          <div className="actions">
            <button className="button secondary" onClick={download}>
              Download writing
            </button>
            <button
              className="button secondary"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(result);
                  setCopied(true);
                } catch {
                  setCopied(false);
                }
              }}
            >
              {copied ? "Copied" : "Copy text"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
