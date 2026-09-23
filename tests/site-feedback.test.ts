import test from "node:test";
import assert from "node:assert/strict";
import { feedbackKey, feedbackRequest } from "../lib/site-feedback";
import { POST } from "../app/api/site-feedback/route";

test("feedback accepts only listed pages and fixed choices", () => {
  assert.ok(feedbackRequest.safeParse({ target: "comparison-refinery", choice: "too-leading" }).success);
  assert.ok(feedbackRequest.safeParse({ target: "introductions-guide", choice: "broken-link" }).success);
  for (const value of [
    { target: "comparison-refinery", choice: "broken-link" },
    { target: "introductions-guide", choice: "too-leading" },
    { target: "/admin", choice: "useful" },
    { target: "observation-guide", choice: "useful", note: "unrestricted text" },
    { target: "observation-guide", choice: "useful", trap: "bot" },
  ]) assert.equal(feedbackRequest.safeParse(value).success, false);
});

test("one browser has one storage slot per page per day", () => {
  const day = new Date("2026-09-23T02:00:00Z");
  const key = feedbackKey(day, "analysis-refinery", "visitor-a", "test-secret");
  assert.equal(key, feedbackKey(new Date("2026-09-23T23:00:00Z"), "analysis-refinery", "visitor-a", "test-secret"));
  assert.notEqual(key, feedbackKey(new Date("2026-09-24T00:00:00Z"), "analysis-refinery", "visitor-a", "test-secret"));
  assert.notEqual(key, feedbackKey(day, "comparison-refinery", "visitor-a", "test-secret"));
  assert.notEqual(key, feedbackKey(day, "analysis-refinery", "visitor-b", "test-secret"));
  assert.ok(!key.includes("visitor-a"));
});

test("public route refuses cross-site and malformed requests before storage", async () => {
  const crossSite = await POST(new Request("https://mrrinka.com/api/site-feedback", {
    method: "POST", headers: { origin: "https://other.example", "content-type": "application/json" },
    body: JSON.stringify({ target: "passage-practice", choice: "helpful" }),
  }));
  assert.equal(crossSite.status, 403);
  const invalid = await POST(new Request("https://mrrinka.com/api/site-feedback", {
    method: "POST", headers: { origin: "https://mrrinka.com", "content-type": "application/json" },
    body: JSON.stringify({ target: "passage-practice", choice: "helpful", note: "student text" }),
  }));
  assert.equal(invalid.status, 400);
});
