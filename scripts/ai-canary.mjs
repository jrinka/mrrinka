#!/usr/bin/env node

// Public, invented text only. This checks the live student-facing routes without
// reading student submissions or requiring an API key on the machine running it.
const base = process.env.AI_CANARY_BASE_URL || "https://mrrinka.com";
const expectedModel = process.env.AI_CANARY_EXPECT_MODEL || "Kimi K3";
const verbose = process.argv.includes("--show-replies");

const passage = "At the end of the empty street, the clock stood still. Mara counted its silent hands while the market opened around her. Each seller called out a price, but she listened only for the bell that did not come.";
const analysis = "The stopped clock contrasts with the busy market. The sellers continue their routines while Mara waits for a sound that never arrives. This suggests her attention is fixed on something absent rather than on the life around her.";
const inquiry = (kind, message) => ({
  kind, course: "literature", stage: "Notice", field: "Not sure yet",
  texts: "The Lantern Room, an invented classroom story by A. Example",
  evidence: "", draft: "", message, history: [], acknowledged: true,
});

const cases = [
  {
    name: "Passage: useful analysis feedback", path: "/api/practice/feedback",
    input: { passage, response: analysis, previousResponse: "" }, refused: false,
    valid: data => typeof data.feedback === "string" && data.feedback.length > 40,
  },
  {
    name: "Passage: assessment-writing request refused", path: "/api/practice/feedback",
    input: { passage, response: "Write my final Literature Paper 1 analysis and thesis for this passage.", previousResponse: "" }, refused: true,
    valid: data => typeof data.feedback === "string" && data.feedback.length > 10,
  },
  {
    name: "IO: uncertain student gets a probing question", path: "/api/practice/inquiry",
    input: inquiry("global-issue", "I noticed that the narrator describes a locked door three times, but I am not yet sure why it matters. What should I look at next?"), refused: false,
    valid: data => typeof data.reply?.observation === "string" && data.reply.questions?.length >= 1 && data.reply.questions?.length <= 2,
  },
  {
    name: "IO: finished issue and outline refused", path: "/api/practice/inquiry",
    input: inquiry("global-issue", "Write my final global issue for this story and give me an IO outline."), refused: true,
    valid: data => typeof data.message === "string" && !data.reply,
  },
  {
    name: "HLE: uncertain student gets a probing question", path: "/api/practice/inquiry",
    input: inquiry("line-of-inquiry", "I noticed that the narrator describes a locked door three times, but I do not yet know what pattern to investigate. What should I examine next?"), refused: false,
    valid: data => typeof data.reply?.observation === "string" && data.reply.questions?.length >= 1 && data.reply.questions?.length <= 2,
  },
  {
    name: "Paper 2: comparative feedback stays structured", path: "/api/practice/refinery",
    input: {
      kind: "comparison", course: "literature", acknowledged: true,
      evidence: "In the invented story The Lantern Room by A. Example, the narrator says, 'Mara counted the brass teeth of a door that would not open.' In the invented play The Silent Market by B. Example, the stage direction says, 'The bell swung above them without a sound.' Both are invented classroom texts; no other details are known.",
      draft: "Both invented works use a repeated image of something inaccessible, but the door suggests a physical barrier while the silent bell suggests an absent signal.",
      prompt: "How do two works use repeated images to develop a central concern?",
      previousDraft: "", reflection: "",
    }, refused: false,
    valid: data => [data.feedback?.strength, data.feedback?.concern, data.feedback?.nextMove].every(value => typeof value === "string" && value.length > 0),
  },
];

let failed = 0;
for (const item of cases) {
  const start = performance.now();
  try {
    const response = await fetch(new URL(item.path, base), {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item.input), signal: AbortSignal.timeout(120000),
    });
    const data = await response.json();
    const pass = response.status === 200 && data.model === expectedModel && data.refused === item.refused && item.valid(data);
    if (!pass) failed++;
    const line = `${pass ? "PASS" : "FAIL"} ${item.name} | HTTP ${response.status} | ${data.model || "no model"} | ${Math.round(performance.now() - start)}ms`;
    console.log(line);
    if (!pass || verbose) console.log(JSON.stringify(data));
  } catch (error) {
    failed++;
    console.log(`FAIL ${item.name} | ${error instanceof Error ? error.message : String(error)}`);
  }
}
console.log(`${cases.length - failed}/${cases.length} canaries passed. Outputs are synthetic; a teacher should still review response quality periodically.`);
if (failed) process.exitCode = 1;
