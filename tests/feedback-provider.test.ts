import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { askModel, feedbackProvider, askCloseAnalysisModel, closeAnalysisProvider } from "../lib/feedback-service";

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

test("a Fireworks key selects DeepSeek and sends the key only to the server-side endpoint", async () => {
  process.env.FIREWORKS_API_KEY = "test-fireworks-key";
  process.env.MINIMAX_APIKEY = "test-minimax-key";
  let called = false;
  globalThis.fetch = async (url, init) => {
    called = true;
    assert.equal(url, "https://api.fireworks.ai/inference/v1/chat/completions");
    assert.equal((init?.headers as Record<string, string>).Authorization, "Bearer test-fireworks-key");
    const body = JSON.parse(String(init?.body));
    assert.equal(body.model, "accounts/fireworks/models/deepseek-v4p1-flash-1017");
    assert.equal(body.messages[0].role, "system");
    assert.equal(body.reasoning_effort, "low");
    return Response.json({ choices: [{ message: { content: '{"allowed":true}' }, finish_reason: "stop" }] });
  };
  assert.deepEqual(feedbackProvider(), { model:"accounts/fireworks/models/deepseek-v4p1-flash-1017", name:"DeepSeek V4.1 Flash 1017", disclosure:"DeepSeek V4.1 Flash 1017, developed by DeepSeek and hosted by Fireworks" });
  assert.equal(await askModel("scope", { draft:"test" }), '{"allowed":true}');
  assert.ok(called);
});

test("all AI tools require Fireworks and never silently fall back to MiniMax", async () => {
  delete process.env.FIREWORKS_API_KEY;
  process.env.MINIMAX_APIKEY = "test-minimax-key";
  globalThis.fetch = async () => { assert.fail("Missing Fireworks key must not send a request"); };
  const { hleProvider, passagePracticeProvider } = await import("../lib/feedback-service");
  for (const provider of [feedbackProvider, closeAnalysisProvider, hleProvider, passagePracticeProvider]) {
    assert.equal(provider().name, "DeepSeek V4.1 Flash 1017");
    await assert.rejects(() => askModel("coach", {draft:"synthetic"},4096,30000,provider()), /not configured/);
  }
});

test("truncated Fireworks responses fail closed", async () => {
  process.env.FIREWORKS_API_KEY = "test-fireworks-key";
  globalThis.fetch = async () => Response.json({ choices: [{ message: { content: "partial" }, finish_reason: "length" }] });
  await assert.rejects(() => askModel("coach", { draft:"test" }), /truncated/);
});

test("Close Analysis uses DeepSeek V4.1 Flash 1017 only and never falls back to MiniMax",async()=>{
 delete process.env.FIREWORKS_API_KEY;
 process.env.MINIMAX_APIKEY="test-minimax-key";
 globalThis.fetch=async()=>{assert.fail("Missing Fireworks key must not make any request");};
 assert.equal(closeAnalysisProvider().name,"DeepSeek V4.1 Flash 1017");
 await assert.rejects(()=>askCloseAnalysisModel("coach",{draft:"synthetic"}),/not configured/);
 process.env.FIREWORKS_API_KEY="test-fireworks-key";
 globalThis.fetch=async(url,init)=>{
 assert.equal(url,"https://api.fireworks.ai/inference/v1/chat/completions");
 assert.equal(JSON.parse(String(init?.body)).model,"accounts/fireworks/models/deepseek-v4p1-flash-1017");
 return Response.json({choices:[{message:{content:"Synthetic diagnostic feedback"},finish_reason:"stop"}]});
 };
 assert.equal(await askCloseAnalysisModel("coach",{draft:"synthetic"}),"Synthetic diagnostic feedback");
});

test("Passage Practice routes every feedback stage to its credited DeepSeek V4.1 Flash 1017 provider", async () => {
  const { POST } = await import("../app/api/practice/feedback/route");
  const { passagePracticeProvider, askPassagePracticeModel } = await import("../lib/feedback-service");
  delete process.env.FIREWORKS_API_KEY;
  process.env.MINIMAX_APIKEY = "test-minimax-key";
  globalThis.fetch = async () => { assert.fail("Missing Fireworks key must not fall back to MiniMax"); };
  assert.equal(passagePracticeProvider().name, "DeepSeek V4.1 Flash 1017");
  await assert.rejects(() => askPassagePracticeModel("coach", { draft: "synthetic" }), /not configured/);
  process.env.FIREWORKS_API_KEY = "test-fireworks-key";
  let calls = 0;
  globalThis.fetch = async (url, init) => {
    assert.equal(url, "https://api.fireworks.ai/inference/v1/chat/completions");
    assert.equal(JSON.parse(String(init?.body)).model, passagePracticeProvider().model);
    calls++;
    return Response.json({ choices: [{ message: { content: calls === 2 ? "Which detail supports your reading?" : '{"allowed":true}' }, finish_reason: "stop" }] });
  };
  const result = await POST(new Request("http://localhost/api/practice/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ passage: "The empty room grew darker as the last light faded from the window.", response: "The fading light creates an uncertain mood." }) }));
  assert.equal(result.status, 200);
  assert.equal((await result.json()).model, passagePracticeProvider().name);
  assert.equal(calls, 3);
});

test("HLE uses one DeepSeek call through Fireworks and credits the actual provider", async () => {
 const { POST } = await import("../app/api/practice/inquiry/route");
 const { hleProvider } = await import("../lib/feedback-service");
 process.env.FIREWORKS_API_KEY = "test-fireworks-key";
 process.env.MINIMAX_APIKEY = "test-minimax-key";
 let calls=0;
 globalThis.fetch=async(url,init)=>{
  calls++; assert.equal(url,"https://api.fireworks.ai/inference/v1/chat/completions");
  assert.equal((init?.headers as Record<string,string>).Authorization,"Bearer test-fireworks-key");
  const body=JSON.parse(String(init?.body)); assert.equal(body.model,hleProvider().model); assert.equal(body.reasoning_effort,"low");
  return Response.json({choices:[{message:{content:JSON.stringify({observation:"A focused inquiry can stay unchanged.",questions:[]})},finish_reason:"stop"}]});
 };
 const response=await POST(new Request("http://localhost/api/practice/inquiry",{method:"POST",body:JSON.stringify({kind:"line-of-inquiry",course:"literature",stage:"Test",texts:"An invented work",draft:"How do interruptions present authority?",message:"Is this workable?"})}));
 assert.equal(response.status,200);const body=await response.json();assert.equal(body.model,hleProvider().name);assert.equal(body.policyVersion,"2026-10-21-hle-coaching-2");assert.equal(calls,1);
 delete process.env.FIREWORKS_API_KEY;
 await assert.rejects(()=>askModel("coach",{},4096,25000,hleProvider()),/not configured/);assert.equal(calls,1);
});
