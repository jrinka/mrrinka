import test from "node:test";
import assert from "node:assert/strict";
import { paperTwoQuestions, questionPools, drawQuestion, formatPaperTwoNotes } from "../lib/paper-two-practice";

test("catalogue keeps unique questions, all source references and earlier genre limits", () => {
  assert.equal(paperTwoQuestions.length, 506);
  assert.equal(new Set(paperTwoQuestions.map(q => q.id)).size, 506);
  assert.equal(paperTwoQuestions.reduce((sum,q) => sum + q.sources.length, 0), 510);
  assert.equal(paperTwoQuestions.filter(q => q.pool === "recent").length, 44);
  assert.equal(paperTwoQuestions.find(q => q.id === "2010m-tz1-lit-3")?.pool, "poetry");
  assert.equal(paperTwoQuestions.find(q => q.id === "2010m-tz1-lit-9")?.pool, "general");
  assert.equal(paperTwoQuestions.find(q => q.id === "2020n-all-lit-3")?.pool, "drama");
  for (const q of paperTwoQuestions) {
    assert.ok(q.text.trim().length > 30);
    assert.ok(q.sources.every(s => (s.year >= 2023) === (q.pool === "recent")));
  }
});
test("draw exhausts each bank without immediate repeats and preserves other banks' history", () => {
  let seen: string[] = [], current: string | undefined;
  for (const pool of questionPools) {
    const expected = paperTwoQuestions.filter(q => q.pool === pool.id).length;
    const drawn = new Set<string>();
    for (let n = 0; n < expected; n++) {
      const next = drawQuestion(pool.id, seen, current, n % 2 ? 0.9999 : 0);
      assert.equal(next.question.pool, pool.id);
      assert.notEqual(next.question.id, current);
      assert.ok(!drawn.has(next.question.id));
      drawn.add(next.question.id); seen = next.seen; current = next.question.id;
    }
    const otherIds = seen.filter(id => !drawn.has(id));
    const next = drawQuestion(pool.id, seen, current, 0);
    assert.notEqual(next.question.id, current);
    assert.ok(otherIds.every(id => next.seen.includes(id)));
    seen = next.seen; current = next.question.id;
  }
});
test("planning export keeps question attribution and both thesis versions together", () => {
  const [one,two] = paperTwoQuestions;
  const notes = formatPaperTwoNotes({[one.id]: {workA:"A — Writer A",workB:"B — Writer B",thesis:"Original claim",revision:"Qualified claim"},[two.id]:{focus:"A different task"}});
  for (const expected of [one.text,two.text,"May 2025","Question 1","A — Writer A","Original claim","Qualified claim","A different task"]) assert.ok(notes.includes(expected));
  assert.equal(formatPaperTwoNotes({[one.id]:{thesis:"   "}}), "");
});
