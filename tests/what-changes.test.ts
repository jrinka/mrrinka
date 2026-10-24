import test from 'node:test';
import assert from 'node:assert/strict';
import { changeExercises, changeCategories, groupChangeExercises, changeExampleLabel } from '../lib/what-changes';
import { changeFeedbackRequest, getChangeFeedback } from '../lib/what-changes-feedback';
import { POST } from '../app/api/practice/what-changes/route';

test('bank offers varied complete comparisons with stable original IDs', () => {
 assert.equal(changeExercises.length,30);
 assert.equal(new Set(changeExercises.map(e=>e.id)).size,30);
 for(const id of ['one-verb','sentence-boundary','line-break','caption','hierarchy','order','described-design']) assert.ok(changeExercises.some(e=>e.id===id));
 for(const category of changeCategories) assert.ok(changeExercises.filter(e=>e.category===category).length>=4);
 for(const e of changeExercises){
  for(const field of ['context','a','b','prompt','feedback','complication','transfer'] as const)assert.ok(e[field].trim(),`${e.id}: ${field}`);
  if(e.kind!=='hierarchy')assert.notEqual(e.a,e.b);
 }
});
const input={exerciseId:'one-verb',draft:'Invaded suggests that the official is unwelcome.'};
const feedback={response:'You connect the changed verb with an attitude.',possibility:'“Invaded” may suggest intrusion, but it could reflect the narrator’s resentment.',question:'What can you infer about the narrator rather than the official?'};
test('request rejects short, oversized, or extra private payloads',()=>{
 assert.ok(changeFeedbackRequest.safeParse(input).success);
 for(const value of [{...input,draft:' '},{...input,draft:'x'.repeat(6001)},{...input,revision:'not for transmission'},{...input,exercise:{a:'override'}}]) assert.ok(!changeFeedbackRequest.safeParse(value).success);
});
test('feedback uses canonical comparison and releases only reviewed output',async()=>{
 const calls:{system:string;material:unknown}[]=[];
 const replies=['{"allowed":true}',JSON.stringify(feedback),'{"allowed":true}'];
 const result=await getChangeFeedback(input,async(system,material)=>{calls.push({system,material});return replies.shift()!;});
 assert.deepEqual(result,{refused:false,feedback});
 assert.equal(calls.length,3);
 assert.equal((calls[0].material as {exercise:{a:string}}).exercise.a,'The official entered the room.');
 assert.match(calls[1].system,/not a single correct answer/);
});
test('scope refusal never requests generated feedback',async()=>{
 let calls=0;const result=await getChangeFeedback(input,async()=>{calls++;return '{"allowed":false}';});
 assert.equal(result.refused,true);assert.equal(calls,1);
});
test('unsafe or malformed output fails closed',async()=>{
 const replies=['{"allowed":true}',JSON.stringify(feedback),'{"allowed":false}'];
 assert.equal((await getChangeFeedback(input,async()=>replies.shift()!)).refused,true);
 await assert.rejects(()=>getChangeFeedback(input,async()=> 'not JSON'));
 const malformed=['{"allowed":true}','{"response":"only one field"}'];
 await assert.rejects(()=>getChangeFeedback(input,async()=>malformed.shift()!));
 let called=false;
 await assert.rejects(()=>getChangeFeedback({...input,exerciseId:'unknown'},async()=>{called=true;return '{}';}));
 assert.equal(called,false);
});
test('route validates input before provider use and disables caching',async()=>{
 const response=await POST(new Request('http://localhost/api/practice/what-changes',{method:'POST',body:JSON.stringify({...input,exerciseId:'unknown'})}));
 assert.equal(response.status,400);assert.equal(response.headers.get('cache-control'),'no-store');
 const old=process.env.FIREWORKS_API_KEY;delete process.env.FIREWORKS_API_KEY;
 try{const unavailable=await POST(new Request('http://localhost/api/practice/what-changes',{method:'POST',body:JSON.stringify(input)}));assert.equal(unavailable.status,503);assert.match((await unavailable.json()).error,/authored/);}finally{if(old!==undefined)process.env.FIREWORKS_API_KEY=old;}
});

test('visual comparisons supply neutral presentation evidence to every model stage',async()=>{
 const replies=['{"allowed":true}',JSON.stringify(feedback),'{"allowed":true}'];
 await getChangeFeedback({...input,exerciseId:'hierarchy'},async(_system,material)=>{
  assert.match((material as {presentation:string}).presentation,/In A, FREE ENTRY is the largest, bold line/);
  assert.match((material as {presentation:string}).presentation,/In B, Community reading night/);
  return replies.shift()!;
 });
});

test('display labels restart in each group without changing canonical IDs',()=>{
 const groups=groupChangeExercises();
 assert.deepEqual(groups.map(g=>g.category),[...changeCategories]);
 assert.deepEqual(groups.map(g=>g.number),[1,2,3,4,5]);
 assert.equal(groups.flatMap(g=>g.examples).length,changeExercises.length);
 for(const group of groups){
  assert.equal(group.examples[0].label,'A');
  assert.deepEqual(group.examples.map(e=>e.exercise),changeExercises.filter(e=>e.category===group.category));
  assert.equal(new Set(group.examples.map(e=>e.label)).size,group.examples.length);
 }
 assert.equal(groups[0].examples[0].exercise.id,'one-verb');
 assert.equal(groups[0].examples[1].label,'B');
});
test('inserting an example only relabels its own category',()=>{
 const before=groupChangeExercises();
 const added={...changeExercises[0],id:'synthetic-new-example'};
 const after=groupChangeExercises([added,...changeExercises]);
 assert.equal(after[0].examples[0].label,'A');
 assert.equal(after[0].examples[1].exercise.id,'one-verb');
 assert.equal(after[0].examples[1].label,'B');
 assert.deepEqual(after.slice(1),before.slice(1));
 assert.deepEqual(changeExercises.map(e=>e.id),before.flatMap(g=>g.examples).map(e=>e.exercise.id).sort((a,b)=>changeExercises.findIndex(e=>e.id===a)-changeExercises.findIndex(e=>e.id===b)));
});
test('letters continue beyond Z without duplicate or invalid labels',()=>{
 assert.deepEqual([0,25,26,27,51,52].map(changeExampleLabel),['A','Z','AA','AB','AZ','BA']);
});
