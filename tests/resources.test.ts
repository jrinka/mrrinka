import test from 'node:test';
import assert from 'node:assert/strict';
import {cycleDates,daySchedule} from '../lib/cycle';
import {comparisonPrompts,nextPrompt} from '../lib/comparison-prompts';
import {refineryRequest} from '../lib/feedback-service';

test('cycle pauses for fall break and resumes at D2',()=>{
 assert.equal(cycleDates.find(d=>d.date==='2026-09-24')?.cycleDay,1);
 assert.equal(cycleDates.find(d=>d.date==='2026-10-06')?.cycleDay,2);
 assert.equal(cycleDates.some(d=>d.date>='2026-09-25'&&d.date<='2026-10-05'),false);
});
test('Wednesday follows rotation, removes mentoring, and uses confirmed bell times',()=>{
 const regular=daySchedule(3);const wed=daySchedule(3,true);
 assert.deepEqual(wed.map(s=>s.course),regular.filter(s=>s.period!=='Mentoring').map(s=>s.course));
 assert.equal(wed.find(s=>s.period==='P2')?.time,'09:40–11:00');
 assert.equal(wed.find(s=>s.period==='P3')?.time,'11:05–12:25');
 assert.equal(regular.find(s=>s.period==='P3')?.time,'12:35–13:55');
 for(let day=1;day<=8;day++)assert.equal(daySchedule(day,true).some(s=>s.period==='Mentoring'),false);
});
test('assign prompt stays in the original bank and avoids immediate repeats',()=>{
 for(const current of comparisonPrompts){
  for(const random of [0,.5,.999999]){
   const next=nextPrompt(current,random);assert.notEqual(next,current);assert.ok(comparisonPrompts.includes(next));
  }
 }
});
test('comparison question is separate bounded context and does not bypass acknowledgment',()=>{
 const input={kind:'comparison',course:'literature',evidence:'Evidence from both works with precise details and context.',draft:'My own comparative claim with sufficient detail.',prompt:comparisonPrompts[0],acknowledged:true};
 assert.equal(refineryRequest.parse(input).prompt,comparisonPrompts[0]);
 assert.equal(refineryRequest.safeParse({...input,prompt:'x'.repeat(2001)}).success,false);
 assert.equal(refineryRequest.safeParse({...input,acknowledged:false}).success,false);
});
