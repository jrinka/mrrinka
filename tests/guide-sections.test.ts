import test from "node:test";
import assert from "node:assert/strict";
import { splitGuideSections } from "../lib/guide-sections";

test("US headings preserve existing shared links and source mappings", () => {
  const headings = ["Humor, irony and the argument", "Make divided attention recognizable", "Keep the hero recognizably human", "Sound, rhythm and meter", "Practice"];
  assert.deepEqual(splitGuideSections(headings.map(title => `## ${title}\nContent`).join("\n")).map(section => section.id), ["humour-irony-and-the-argument", "make-divided-attention-recognisable", "keep-the-hero-recognisably-human", "sound-rhythm-and-metre", "practise"]);
});
test("repeated headings retain distinct stable links", () => {
  assert.deepEqual(splitGuideSections("## Practice\nOne\n## Practice\nTwo").map(section => section.id), ["practise", "practise-2"]);
});
