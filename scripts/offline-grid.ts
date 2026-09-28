import { downloadRecord, type ExportFormat } from "../lib/practice-record";
const button = document.getElementById("export-notes") as HTMLButtonElement;
button.addEventListener("click", async () => {
  const format = (document.getElementById("export-format") as HTMLSelectElement).value as ExportFormat;
  const title = document.querySelector("h1")!.innerText;
  const parts = [title, "Text: " + (document.getElementById("text-title") as HTMLInputElement).value + "\nAuthor: " + (document.getElementById("text-author") as HTMLInputElement).value];
  const rows: { title: string; prompt: string; notes: string }[] = [];
  document.querySelectorAll("tbody tr").forEach(row => {
    rows.push({ title: row.querySelector("strong")!.innerText, prompt: (row.querySelector(".note") as HTMLElement).innerText, notes: (row.querySelector(".writing") as HTMLElement).innerText });
    parts.push(row.querySelector("strong")!.innerText + "\n\n" + (row.querySelector(".note") as HTMLElement).innerText + "\n\n" + ((row.querySelector(".writing") as HTMLElement).innerText || "(Not yet written)"));
  });
  const filename = title.toLowerCase().startsWith("tpcastt") ? "tpcastt-notes" : "soapstone-notes";
  button.disabled = true;
  const succeeded = await downloadRecord(parts.join("\n\n"), filename, format, { title, text: [(document.getElementById("text-title") as HTMLInputElement).value, (document.getElementById("text-author") as HTMLInputElement).value].filter(Boolean).join(" — "), rows });
  document.getElementById("export-status")!.textContent = succeeded ? `Exported as .${format}` : "Export failed. Your notes are still here.";
  button.disabled = false;
});
