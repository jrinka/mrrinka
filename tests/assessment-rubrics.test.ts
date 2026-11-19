import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AssessmentRubrics from "../components/assessment-rubrics";
import { itemSchema } from "../lib/schema";
import { publicCourse } from "../lib/content";

const paper = publicCourse("literature").items.find(item => item.title === "Paper 1")!;
const pdf = { id: crypto.randomUUID(), title: "Paper 1 rubric", url: "/rubrics/literature/paper-1.pdf", description: "Print copy" };
const word = { ...pdf, id: crypto.randomUUID(), title: "Editable rubric.docx", url: "/rubrics/paper-1.docx", description: "" };

test("assessments without attached files show no rubric panel", () => {
  for (const files of [undefined, []]) {
    assert.ok(itemSchema.safeParse({ ...paper, rubrics: files }).success);
    assert.equal(renderToStaticMarkup(createElement(AssessmentRubrics, { files })), "");
  }
});

test("rubrics render as named downloads and accept published PDF and Word files", () => {
  const uploaded = { ...pdf, url: `/rubrics/uploaded/${crypto.randomUUID()}.pdf` };
  assert.ok(itemSchema.safeParse({ ...paper, rubrics: [pdf, word, uploaded] }).success);
  const html = renderToStaticMarkup(createElement(AssessmentRubrics, { files: [pdf, word] }));
  assert.match(html, /href="\/rubrics\/literature\/paper-1.pdf" download="Paper 1 rubric.pdf"/);
  assert.match(html, /href="\/rubrics\/paper-1.docx" download="Editable rubric.docx"/);
  assert.match(html, /Print copy/);
  assert.match(html, /Printable PDF/);
  assert.match(html, /Editable Word/);
  for (const url of ["/rubrics/paper-1", "/rubrics/../report.pdf", "https://example.com/document"]) {
    assert.equal(itemSchema.safeParse({ ...paper, rubrics: [{ ...pdf, url }] }).success, false);
  }
});
