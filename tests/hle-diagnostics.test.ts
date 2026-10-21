import test from 'node:test';
import assert from 'node:assert/strict';
import { hleFeedback, type HleDiagnostic } from '../lib/hle-coaching';
import { workshopRequest } from '../lib/inquiry-workshop';
const input = workshopRequest.parse({kind:'line-of-inquiry',course:'literature',stage:'Notice',texts:'PRIVATE TITLE',message:'PRIVATE WRITING'});
const reply = JSON.stringify({observation:'PRIVATE FEEDBACK',questions:[]});
test('HLE records timings and tokens across a format retry without writing', async()=>{
 const events:HleDiagnostic[]=[];let calls=0;
 await hleFeedback(input, async (_system,_material,maxTokens,timeout,_provider,observe)=>{
  assert.equal(timeout,40000);assert.equal(maxTokens,4096);
  observe?.({elapsedMs:12,outcome:'completed',httpStatus:200,finishReason:'stop',usage:{inputTokens:100,outputTokens:40,totalTokens:140,reasoningTokens:10}});
  return ++calls===1?'PRIVATE MALFORMED':reply;
 },event=>events.push(event));
 assert.deepEqual(events.map(e=>[e.event,e.attempt,e.outcome]),[['attempt',1,'response-format'],['attempt',2,'completed'],['request',2,'feedback']]);
 assert.equal(new Set(events.map(e=>e.requestId)).size,1);
 assert.equal(events[1].usage?.reasoningTokens,10);
 assert.ok(events.every(e=>Number.isFinite(e.elapsedMs)&&e.elapsedMs>=0));
 assert.doesNotMatch(JSON.stringify(events),/PRIVATE/);
});
test('HLE records timeout once without retrying or logging error text',async()=>{
 const events:HleDiagnostic[]=[];let calls=0;
 await assert.rejects(()=>hleFeedback(input,async()=>{calls++;throw new DOMException('PRIVATE ERROR','TimeoutError');},event=>events.push(event)),{name:'TimeoutError'});
 assert.equal(calls,1);assert.deepEqual(events.map(e=>e.failureCode),['timeout','timeout']);
 assert.doesNotMatch(JSON.stringify(events),/PRIVATE/);
});
test('HLE logging failure cannot break feedback and final format failure is classified',async()=>{
 assert.equal((await hleFeedback(input,async()=>reply,()=>{throw Error('logger offline');})).refused,false);
 const events:HleDiagnostic[]=[];
 await assert.rejects(()=>hleFeedback(input,async()=>'{broken',event=>events.push(event)),SyntaxError);
 assert.equal(events.at(-1)?.failureCode,'response-format');assert.equal(events.at(-1)?.attempt,2);
});
