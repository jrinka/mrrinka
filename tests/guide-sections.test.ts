import test from "node:test";
import assert from "node:assert/strict";
import { isLongGuideSection, splitGuideSections } from "../lib/guide-sections";

test("US headings preserve existing shared links and source mappings", () => {
  const headings = ["Humor, irony and the argument", "Make divided attention recognizable", "Keep the hero recognizably human", "Sound, rhythm and meter", "Practice"];
  assert.deepEqual(splitGuideSections(headings.map(title => `## ${title}\nContent`).join("\n")).map(section => section.id), ["humour-irony-and-the-argument", "make-divided-attention-recognisable", "keep-the-hero-recognisably-human", "sound-rhythm-and-metre", "practise"]);
});
test("repeated headings retain distinct stable links", () => {
  assert.deepEqual(splitGuideSections("## Practice\nOne\n## Practice\nTwo").map(section => section.id), ["practise", "practise-2"]);
});

test("only sustained reading is collapsible, not short guidance or long link URLs", () => {
  assert.equal(isLongGuideSection(""), false);
  assert.equal(isLongGuideSection("word ".repeat(279)), false);
  assert.equal(isLongGuideSection("word ".repeat(280)), true);
  assert.equal(isLongGuideSection("[Source](https://example.org/" + "path/".repeat(400) + ")"), false);
});

test("sectioning preserves introductions, paragraphs, examples and nested headings", () => {
  const sections = splitGuideSections("Opening context\n\n## A section\nParagraph.\n\n### An example\nExample text.\n\n## Next\nLast paragraph.");
  assert.deepEqual(sections.map(section => section.body), ["Opening context", "Paragraph.\n\n### An example\nExample text.", "Last paragraph."]);
});
