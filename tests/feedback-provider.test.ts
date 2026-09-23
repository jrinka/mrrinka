import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { askModel, feedbackProvider } from "../lib/feedback-service";

const previousFireworks = process.env.FIREWORKS_API_KEY;
const previousMiniMax = process.env.MINIMAX_APIKEY;
const originalFetch = globalThis.fetch;

afterEach(() => {
  if (previousFireworks === undefined) delete process.env.FIREWORKS_API_KEY;
  else process.env.FIREWORKS_API_KEY = previousFireworks;
  if (previousMiniMax === undefined) delete process.env.MINIMAX_APIKEY;
  else process.env.MINIMAX_APIKEY = previousMiniMax;
  globalThis.fetch = originalFetch;
});

test("a Fireworks key selects K3 and sends the key only to the server-side endpoint", async () => {
  process.env.FIREWORKS_API_KEY = "test-fireworks-key";
  process.env.MINIMAX_APIKEY = "test-minimax-key";
  let called = false;
  globalThis.fetch = async (url, init) => {
    called = true;
    assert.equal(url, "https://api.fireworks.ai/inference/v1/chat/completions");
    assert.equal((init?.headers as Record<string, string>).Authorization, "Bearer test-fireworks-key");
    const body = JSON.parse(String(init?.body));
    assert.equal(body.model, "accounts/fireworks/models/kimi-k3");
    assert.equal(body.messages[0].role, "system");
    return Response.json({ choices: [{ message: { content: '{"allowed":true}' }, finish_reason: "stop" }] });
  };
  assert.deepEqual(feedbackProvider(), { model:"accounts/fireworks/models/kimi-k3", name:"Kimi K3", disclosure:"Kimi K3, developed by Moonshot AI and hosted by Fireworks" });
  assert.equal(await askModel("scope", { draft:"test" }), '{"allowed":true}');
  assert.ok(called);
});

test("without a Fireworks key the existing MiniMax path still works", async () => {
  delete process.env.FIREWORKS_API_KEY;
  process.env.MINIMAX_APIKEY = "test-minimax-key";
  globalThis.fetch = async (url, init) => {
    assert.equal(url, "https://api.minimax.chat/v1/text/chatcompletion_v2");
    assert.equal((init?.headers as Record<string, string>).Authorization, "Bearer test-minimax-key");
    assert.equal(JSON.parse(String(init?.body)).model, "MiniMax-M3");
    return Response.json({ choices: [{ messages: [{ content: "Feedback" }] }] });
  };
  assert.deepEqual(feedbackProvider(), { model:"MiniMax-M3", name:"M3", disclosure:"M3, developed and hosted by MiniMax" });
  assert.equal(await askModel("coach", { draft:"test" }), "Feedback");
});

test("truncated Fireworks responses fail closed", async () => {
  process.env.FIREWORKS_API_KEY = "test-fireworks-key";
  globalThis.fetch = async () => Response.json({ choices: [{ message: { content: "partial" }, finish_reason: "length" }] });
  await assert.rejects(() => askModel("coach", { draft:"test" }), /truncated/);
});
