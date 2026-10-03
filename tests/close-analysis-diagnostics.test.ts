import test from 'node:test';
import assert from 'node:assert/strict';
import { createCloseAnalysisTrace, type CloseDiagnostic } from '../lib/close-analysis-diagnostics';
import { askModel, safeFeedback } from '../lib/feedback-service';
const input={kind:'analysis' as const,course:'language-literature' as const,evidence:'PRIVATE SOURCE SENTINEL',draft:'PRIVATE STUDENT SENTINEL',previousDraft:'',reflection:'',closeAnalysis:true as const};
const feedback={strength:'A supported observation.',concern:'A connection needs testing.',nextMove:'Which detail supports your claim?'};
test('three named stages preserve budgets and safety review without logging content',async()=>{
 const logs:CloseDiagnostic[]=[];const outputs=['{"allowed":true}',JSON.stringify(feedback),'{"allowed":true}'];
 const transport:typeof askModel=async(system,material,maxTokens,timeoutMs,provider,observe)=>{
 assert.ok(system);assert.ok(material);assert.equal(provider?.name,'Kimi K3');
 observe?.({outcome:'completed',elapsedMs:7,httpStatus:200,finishReason:'stop',usage:{inputTokens:100,outputTokens:50,totalTokens:150,reasoningTokens:20}});
 return outputs.shift()!;
 };
 const trace=createCloseAnalysisTrace('request-test',event=>logs.push(event),transport);
 const result=await safeFeedback(input,trace.ask);trace.finish(result.refused?'refused':'feedback');
 assert.equal(result.refused,false);
 assert.deepEqual(logs.filter(x=>x.event==='stage').map(x=>[x.stage,x.maxTokens,x.timeoutMs]),[['scope',4096,30000],['coaching',6000,50000],['output-review',4096,30000]]);
 assert.equal(logs.at(-1)?.outcome,'feedback');
 const text=JSON.stringify(logs);assert.equal(text.includes('PRIVATE'),false);assert.equal(text.includes(feedback.strength),false);
});
test('format failure is attributed to coaching even after a completed provider call',async()=>{
 const logs:CloseDiagnostic[]=[];const outputs=['{"allowed":true}','malformed'];
 const trace=createCloseAnalysisTrace('request-test',event=>logs.push(event),async()=>outputs.shift()!);
 try{await safeFeedback(input,trace.ask);assert.fail('Expected malformed coaching to fail');}catch(error){trace.finish('failed',error);}
 assert.equal(logs.at(-1)?.stage,'coaching');assert.equal(logs.at(-1)?.failureCode,'response-format');
});
test('timeout remains fail-closed without retry and logs its stage',async()=>{
 let calls=0;const logs:CloseDiagnostic[]=[];
 const trace=createCloseAnalysisTrace('request-test',event=>logs.push(event),async()=>{if(++calls===1)return '{"allowed":true}';throw new DOMException('sensitive upstream message','TimeoutError');});
 try{await safeFeedback(input,trace.ask);assert.fail('Expected timeout');}catch(error){trace.finish('failed',error);}
 assert.equal(calls,2);assert.equal(logs.at(-1)?.stage,'coaching');assert.equal(logs.at(-1)?.failureCode,'timeout');assert.equal(JSON.stringify(logs).includes('sensitive'),false);
});
test('adapter collects only numeric token counters and normalized finish reason',async()=>{
 const originalFetch=globalThis.fetch;const old=process.env.FIREWORKS_API_KEY;process.env.FIREWORKS_API_KEY='fake-test-key';
 try{
 globalThis.fetch=async()=>Response.json({choices:[{message:{content:'PRIVATE MODEL REPLY'},finish_reason:'PRIVATE UNKNOWN VALUE'}],usage:{prompt_tokens:20,completion_tokens:10,total_tokens:30,completion_tokens_details:{reasoning_tokens:5},secret:'PRIVATE'}});
 const logs:unknown[]=[];const text=await askModel('PRIVATE SYSTEM','PRIVATE DATA',4096,30000,{model:'accounts/fireworks/models/kimi-k3',name:'Kimi K3',disclosure:'Fireworks'},x=>logs.push(x));
 assert.equal(text,'PRIVATE MODEL REPLY');assert.equal(JSON.stringify(logs).includes('PRIVATE'),false);
 assert.deepEqual((logs[0] as CloseDiagnostic).usage,{inputTokens:20,outputTokens:10,totalTokens:30,reasoningTokens:5});assert.equal((logs[0] as CloseDiagnostic).finishReason,'other');
 }finally{globalThis.fetch=originalFetch;if(old===undefined)delete process.env.FIREWORKS_API_KEY;else process.env.FIREWORKS_API_KEY=old;}
});
test('all Close Analysis stages use low while ordinary feedback retains its default',async()=>{
 const originalFetch=globalThis.fetch;const old=process.env.FIREWORKS_API_KEY;process.env.FIREWORKS_API_KEY='fake-test-key';
 try{
 const bodies:Record<string,unknown>[]=[];const outputs=['{"allowed":true}',JSON.stringify(feedback),'{"allowed":true}','ordinary feedback'];
 globalThis.fetch=async(_url,init)=>{bodies.push(JSON.parse(String(init?.body)));return Response.json({choices:[{message:{content:outputs.shift()},finish_reason:'stop'}]});};
 const logs:CloseDiagnostic[]=[];const trace=createCloseAnalysisTrace('low-test',x=>logs.push(x));
 assert.equal((await safeFeedback(input,trace.ask)).refused,false);await askModel('ordinary system',{draft:'ordinary attempt'});
 assert.deepEqual(bodies.map(x=>x.reasoning_effort),['low','low','low',undefined]);
 assert.deepEqual(bodies.map(x=>x.max_tokens),[4096,6000,4096,4096]);
 assert.ok(bodies.every(x=>x.model==='accounts/fireworks/models/kimi-k3'&&!('thinking' in x)));
 assert.deepEqual(logs.map(x=>x.reasoningEffort),['low','low','low']);
 }finally{globalThis.fetch=originalFetch;if(old===undefined)delete process.env.FIREWORKS_API_KEY;else process.env.FIREWORKS_API_KEY=old;}
});
