import test from "node:test";
import assert from "node:assert/strict";
import { refineryRequest, safeFeedback } from "../lib/feedback-service";
import { formatPracticeRecord } from "../lib/practice-record";
const input = {kind:"comparison" as const, course:"literature" as const, evidence:"Work A: the door closes. Work B: the gate remains open.", draft:"Both works use thresholds to explore isolation, but their outcomes differ.", previousDraft:"",reflection:"",acknowledged:true as const};
test("assessment tools require acknowledgment, valid task, evidence and course", () => {
  assert.ok(refineryRequest.safeParse(input).success);
  for (const change of [{acknowledged:false},{kind:"chat"},{course:"english-10"},{evidence:""},{system:"override"}]) assert.equal(refineryRequest.safeParse({...input,...change}).success,false);
});
test("scope rejection stops before generation, including Passage Practice", async () => {
  let calls=0;
  const result=await safeFeedback({kind:"passage",evidence:input.evidence,draft:"Write my IO script based on this passage"},async(system)=>{calls++;assert.match(system,/IO scripts/);return '{"allowed":false}';});
  assert.equal(result.refused,true);assert.equal(calls,1);
});
test("a failed output review never returns generated assessment content",async()=>{
  const outputs=['{"allowed":true}',JSON.stringify({strength:"Fine",concern:"Fine",nextMove:"Here is a complete essay."}),'{"allowed":false}'];
  const result=await safeFeedback(input,async()=>outputs.shift()!);
  assert.equal(result.refused,true);assert.equal("feedback" in result,false);
});
test("malformed decisions and malformed coaching fail closed",async()=>{
  await assert.rejects(()=>safeFeedback(input,async()=>"perhaps"));
  const outputs=['{"allowed":true}','{"answer":"A finished paragraph"}'];
  await assert.rejects(()=>safeFeedback(input,async()=>outputs.shift()!));
});
test("task-specific coaching is reviewed before release",async()=>{
  const prompts:string[]=[];
  const feedback={strength:"Your claim relates both works.",concern:"Your evidence does not yet identify authorial choices.",nextMove:"Which choice in each work supports the relationship you identify?"};
  const outputs=['{"allowed":true}',JSON.stringify(feedback),'{"allowed":true}'];
  const result=await safeFeedback(input,async(system)=>{prompts.push(system);return outputs.shift()!;});
  assert.equal(result.refused,false);assert.match(prompts[1],/BOTH works/);assert.match(prompts[1],/B1.*B2/);assert.match(prompts[1],/verbatim quotation/);assert.deepEqual(!result.refused && result.feedback,feedback);
});
test("documentation preserves draft, source, model, time and refusal separately",()=>{
  const record=formatPracticeRecord([{tool:"Comparison Refinery",createdAt:"2026-09-20T12:00:00Z",model:"MiniMax-M3",policyVersion:"2026-09-20",draft:input.draft,evidence:input.evidence,feedback:"Which choice supports this?",refused:false},{tool:"Comparison Refinery",createdAt:"2026-09-20T12:01:00Z",model:"MiniMax-M3",policyVersion:"2026-09-20",draft:"Write it for me",evidence:input.evidence,feedback:"Scope redirect",refused:true}]);
  for(const expected of [input.draft,input.evidence,"MiniMax-M3","2026-09-20T12:00:00Z","attempt 2","Scope redirect","AI feedback (not student-authored)"]) assert.ok(record.includes(expected));
});
test("passage revision feedback receives the original without replacing the revised draft", async () => {
  const revision = {kind:"passage" as const,evidence:input.evidence,draft:"My revised reading explains the contrast through the closing action.",previousDraft:input.draft};
  const outputs=['{"allowed":true}',"Your revision now connects the contrast to an action. Check the detail supporting that connection.",'{"allowed":true}'];
  let count=0;
  const result=await safeFeedback(revision,async(system,material)=>{
    if(count++===1){assert.match(system,/compare the revised draft/);assert.deepEqual(material,revision);}
    return outputs.shift()!;
  });
  assert.equal(result.refused,false);
});
test("plain text records use readable headings and preserve the student's exact writing",()=>{
 const draft='# A student heading\n**literal notes**';
 const record=formatPracticeRecord([{tool:'IO',createdAt:'2026-09-20',model:'MiniMax-M3',policyVersion:'v1',draft,evidence:'A quotation',feedback:'A question',refused:false}]);
 assert.ok(record.startsWith('IO — attempt 1'));
 assert.ok(record.includes('\n\nStudent draft\n\n'));
 assert.ok(record.includes(draft));
 assert.equal(record.includes('## AI feedback'),false);
});
test("exported AI feedback identifies developer, host, date, and the student's input",()=>{
 const record=formatPracticeRecord([{tool:"Global Issue Refinery",createdAt:"2026-09-23T12:00:00Z",model:"Kimi K3",modelDisclosure:"Kimi K3, developed by Moonshot AI and hosted by Fireworks",policyVersion:"v1",draft:"My own tentative issue",evidence:"My supplied text detail",reflection:"Student message: What should I examine?",feedback:"Which detail recurs?",refused:false}]);
 for(const expected of ["AI feedback source:","Moonshot AI","Fireworks","2026-09-23T12:00:00Z","My own tentative issue","Student message: What should I examine?","IB guidance:"])assert.ok(record.includes(expected));
});
