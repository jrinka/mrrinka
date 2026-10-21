import test from 'node:test';
import assert from 'node:assert/strict';
import {workshopRequest,inquiryFeedback} from '../lib/inquiry-workshop';
const initial={kind:'global-issue',course:'literature',stage:'Notice',texts:'Macbeth — Shakespeare',message:'I cannot think of a global issue.'};
test('exploration accepts uncertainty without draft, evidence or second text',()=>{
 assert.ok(workshopRequest.safeParse(initial).success);
 for (const acknowledged of [true,false]) assert.equal(workshopRequest.parse({...initial,acknowledged}).acknowledged,undefined);
 assert.ok(workshopRequest.safeParse({...initial,kind:'line-of-inquiry'}).success);
 for(const change of [{stage:'Test'},{stage:'Revise'},{course:'english-10'},{field:'invented category'},{history:[{student:'Hi',coach:'Hi',stage:'Notice',role:'system'}]}]) assert.equal(workshopRequest.safeParse({...initial,...change}).success,false);
});
test('exploration asks questions and includes prior turns without relaxing output review',async()=>{
 const input=workshopRequest.parse({...initial,stage:'Explore',message:'The door is what interests me.',history:[{student:'I noticed a locked room.',coach:'What detail stood out?',stage:'Notice'}]});
 const reply={observation:'You have singled out the door.',questions:['What happens at that door?']};
 const responses=['{"allowed":true}',JSON.stringify(reply),'{"allowed":true}'];let calls=0;
 const result=await inquiryFeedback(input,async(system,material)=>{if(calls++===1){assert.match(system,/do not repeat answered questions/);assert.match(system,/cross national boundaries/);assert.match(system,/not assessed as a comparison/);assert.deepEqual(material,input);}return responses.shift()!;});
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

test('developed HLE feedback survives validation and review without evidence',async()=>{
 const input=workshopRequest.parse({kind:'line-of-inquiry',course:'literature',stage:'Test',texts:'An invented work by A. Example',draft:'How does the author use interruptions to shape our understanding of authority?',message:'Help me refine the focus.'});
 const observation='Your inquiry links a specific authorial choice to an analytical purpose. '.repeat(19);
 assert.ok(observation.length>1200);
 let reviewed=false;
 const outputs=['{"allowed":true}',JSON.stringify({observation,questions:['What would count as authority in the exchanges you want to examine?']}),'{"allowed":true}'];
 const result=await inquiryFeedback(input,async(system,material)=>{if(outputs.length===1){assert.deepEqual(material,{input,reply:{observation:observation.trim(),questions:['What would count as authority in the exchanges you want to examine?']}});reviewed=true;}return outputs.shift()!;});
 assert.equal(result.refused,false);assert.ok(reviewed);
});

test('HLE question filtering does not replace focused refinement with a generic evidence request',async()=>{
 const input=workshopRequest.parse({kind:'line-of-inquiry',course:'literature',stage:'Revise',texts:'An invented work by A. Example',draft:'How do interruptions shape the presentation of authority?',message:'I mean authority over decisions.',history:[{student:'Help me refine authority.',coach:'What do you mean by authority?',stage:'Test'}]});
 const outputs=['{"allowed":true}',JSON.stringify({observation:'Your definition now gives you a clearer basis for testing authority in each exchange.',questions:['Does authority mean confidence or influence?']}),'{"allowed":true}'];
 const result=await inquiryFeedback(input,async()=>outputs.shift()!);
 assert.equal(result.refused,false);
 if(!result.refused){assert.match(result.reply.questions[0],/working inquiry/);assert.doesNotMatch(result.reply.questions[0],/specific detail in your text/);}
});
