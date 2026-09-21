import test from 'node:test';
import assert from 'node:assert/strict';
import {workshopRequest,inquiryFeedback} from '../lib/inquiry-workshop';
const initial={kind:'global-issue',course:'literature',stage:'Notice',texts:'Macbeth — Shakespeare',message:'I cannot think of a global issue.',acknowledged:true};
test('exploration accepts uncertainty without draft, evidence or second text',()=>{
 assert.ok(workshopRequest.safeParse(initial).success);
 assert.ok(workshopRequest.safeParse({...initial,kind:'line-of-inquiry'}).success);
 for(const change of [{stage:'Test'},{stage:'Revise'},{acknowledged:false},{course:'english-10'},{field:'invented category'},{history:[{student:'Hi',coach:'Hi',stage:'Notice',role:'system'}]}]) assert.equal(workshopRequest.safeParse({...initial,...change}).success,false);
});
test('exploration asks questions and includes prior turns without relaxing output review',async()=>{
 const input=workshopRequest.parse({...initial,stage:'Explore',message:'The door is what interests me.',history:[{student:'I noticed a locked room.',coach:'What detail stood out?',stage:'Notice'}]});
 const reply={observation:'You have singled out the door.',questions:['What happens at that door?']};
 const responses=['{"allowed":true}',JSON.stringify(reply),'{"allowed":true}'];let calls=0;
 const result=await inquiryFeedback(input,async(system,material)=>{if(calls++===1){assert.match(system,/do not repeat answered questions/);assert.deepEqual(material,input);}return responses.shift()!;});
 assert.equal(result.refused,false);assert.equal(calls,3);
});
test('requests for supplied assessment work stop at scope gate',async()=>{
 let calls=0;const result=await inquiryFeedback(workshopRequest.parse({...initial,message:'Write my global issue for me.'}),async()=>{calls++;return '{"allowed":false}';});
 assert.equal(result.refused,true);assert.equal(calls,1);assert.equal('reply' in result,false);
});
test('unsafe or malformed coaching is never released',async()=>{
 const responses=['{"allowed":true}',JSON.stringify({observation:'Here is your inquiry.',questions:['How does the author use X to reveal Y?']}),'{"allowed":false}'];
 const result=await inquiryFeedback(workshopRequest.parse(initial),async()=>responses.shift()!);
 assert.equal(result.refused,true);assert.equal('reply' in result,false);
 const malformed=['{"allowed":true}','{"observation":"ok","questions":[]}'];
 await assert.rejects(()=>inquiryFeedback(workshopRequest.parse(initial),async()=>malformed.shift()!));
});
test('answer options inside questions are replaced before output review',async()=>{
 const responses=['{"allowed":true}',JSON.stringify({observation:'You have a starting observation.',questions:['Is the outcome destruction, awakening, or self-deception?']}),'{"allowed":true}'];
 const result=await inquiryFeedback(workshopRequest.parse({...initial,stage:'Explore'}),async()=>responses.shift()!);
 assert.equal(result.refused,false);
 if(!result.refused){assert.equal(result.reply.questions.length,1);assert.doesNotMatch(result.reply.questions[0],/destruction|awakening|self-deception/);}
});

test('one malformed format retries, then guidance still requires output review',async()=>{
 const outputs=['{"allowed":true}','not JSON',JSON.stringify({observation:'You noticed a locked door.',questions:['What words describe it?']}),'{"allowed":true}'];
 let calls=0;
 const result=await inquiryFeedback(workshopRequest.parse(initial),async(system)=>{calls++;assert.match(system,/matching this schema/);return outputs.shift()!;});
 assert.equal(result.refused,false);assert.equal(calls,4);
});
test('format retry budget is shared and never bypasses output review',async()=>{
 const outputs=['bad scope','{"allowed":true}',JSON.stringify({observation:'A starting point.',questions:['What did you notice?']}),'bad review'];let calls=0;
 await assert.rejects(()=>inquiryFeedback(workshopRequest.parse(initial),async()=>{calls++;return outputs.shift()!;}),/output-review/);
 assert.equal(calls,4);
});
