import test from "node:test";
import assert from "node:assert/strict";
import { ioStages, ioStageAt, ioModes, ioOrders, ioWholeLabel, type IOCourse } from "../lib/individual-oral";
import { publicCourse } from "../lib/content";
import { splitGuideSections } from "../lib/guide-sections";

test("IO routes protect all four 2:15 sections within ten minutes", () => {
  for (const course of ["literature", "language-literature"] as IOCourse[]) for (const { id: order } of ioOrders) {
    const stages = ioStages(course, order);
    assert.deepEqual(stages.map(stage => stage.end), [30, 165, 300, 435, 570, 600]);
    assert.deepEqual(stages.map(stage => stage.duration), [30, 135, 135, 135, 135, 30]);
    const first = ioWholeLabel(course, 0), second = ioWholeLabel(course, 1);
    const expected = order === "whole-first" ? [first, "extract", second, "extract"] : order === "extract-first" ? ["extract", first, "extract", second] : ["extract", first, second, "extract"];
    assert.deepEqual(stages.slice(1, 5).map(stage => stage.title.split(": ")[1]), expected);
    for (let i = 0; i < stages.length; i++) {
      assert.equal(ioStageAt(stages, stages[i].start), stages[i]);
      assert.equal(ioStageAt(stages, stages[i].end - 0.01), stages[i]);
    }
    assert.equal(ioStageAt(stages, 600), undefined);
  }
  assert.equal(ioModes.find(mode => mode.id === "section")?.seconds, 135);
});

test("Literature IO inherits editable canonical teaching and all tool sections", () => {
  const ll = publicCourse("language-literature").items.find(item => item.title === "Individual Oral")!;
  const lit = publicCourse("literature").items.find(item => item.title === "Individual Oral")!;
  assert.equal(lit.body, ll.body);
  const ids = splitGuideSections(ll.body).map(section => section.id);
  for (const id of ["structure-and-timing", "analysis-planning-sheets", "personal-preparation-tools", "learn-from-a-short-example", "find-and-test-a-global-issue"]) assert.ok(ids.includes(id));
  assert.doesNotMatch(ll.body, /\bscripts?\b/i);
  assert.match(ll.body, /watch or listen to a rehearsal/);
  assert.doesNotMatch(ll.body, /## Practice speaking|## Reflect on your rehearsal|Mini-IO/i);
});
