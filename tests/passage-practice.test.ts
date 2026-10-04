import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import PassagePractice, { formatOfflineWriting } from "../components/passage-practice";

test("offline writing exports omit an empty revision and preserve existing writing", () => {
  const draft = "  My unfinished analysis\n\nA second observation.";
  for (const revision of ["", " \n "]) {
    assert.equal(formatOfflineWriting(draft, revision), `Your analysis\n${draft}`);
  }
  assert.equal(formatOfflineWriting("", ""), "Your analysis\n(No analysis written)");
  const revision = "  My revised analysis\n";
  assert.equal(formatOfflineWriting(draft, revision), `Your analysis\n${draft}\n\nYour revision\n${revision}`);
});

test("passage practice presents the teacher-review path before AI feedback", () => {
  const html = renderToStaticMarkup(createElement(PassagePractice, {
    provider: { name: "Test", disclosure: "Test provider" },
  }));
  assert.match(html, /AI feedback is optional\./);
  assert.match(html, /AI feedback is optional\. Save your passage and writing to discuss with your teacher\./);
  for (const label of ["Save passage", "Save my writing", "Save passage + writing"]) {
    assert.ok(html.includes(`>${label}</button>`));
  }
  assert.ok(html.indexOf("AI feedback is optional.") < html.indexOf("Request feedback"));
  assert.match(html, /nothing is sent to your teacher automatically\./);
});
