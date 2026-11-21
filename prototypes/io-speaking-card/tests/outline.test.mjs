import assert from 'node:assert/strict';
import test from 'node:test';
import {countWords,parseOutline,formatCard,getBulletGroups,buildDocument} from '../src/outline.mjs';
import {getSections} from '../src/rehearsal.mjs';

test('word counts use whitespace with no minimum or enforced maximum',()=>{
  assert.equal(countWords(''),0);assert.equal(countWords('  evidence\tchoice\nmeaning  '),3);
  assert.equal(countWords(Array(40).fill('word').join(' ')),40);
  assert.equal(countWords('作者’s choice — meaning'),4);
});
test('plain-text import preserves ten cues, Unicode, and continuation lines atomically',()=>{
  const text=Array.from({length:10},(_,i)=>`${i+1}. Cue ${i+1} — choice`).join('\r\n');
  assert.equal(parseOutline('\uFEFF'+text)[9],'Cue 10 — choice');
  assert.equal(parseOutline(text,true)[3],'Cue 2 — choice');
  assert.equal(parseOutline(text.replace('1. Cue 1 — choice','1. Cue 1 — choice\n   continued'))[0],'Cue 1 — choice\ncontinued');
  assert.throws(()=>parseOutline(text+'\n11. Extra'),/Found 11/);
  assert.throws(()=>parseOutline('Too few'),/Found 1/);
  assert.throws(()=>parseOutline(text+'\nUnmarked extra'),/No notes were changed/);
});
test('Markdown round trips all ten slots for each course and ordering',()=>{
  for (const course of ['langlit','literature']) for (const wholeFirst of [false,true]) {
    const notes=Array.from({length:10},(_,i)=>i===5?'':`Cue ${i} <choice> & reasoning\ncontinued`);
    const data={course,wholeFirst,notes,sections:getSections(course,wholeFirst)};
    assert.deepEqual(parseOutline(formatCard(data,true),wholeFirst),notes);
    assert.match(formatCard(data),course==='literature'?/Two literary works/:/non-literary body of work/);
  }
});
test('reordering moves the corresponding analytical bullets, preserving the ten slots',()=>{
  assert.deepEqual(getBulletGroups().map(x=>x.length),[1,2,2,2,2,1]);
  assert.deepEqual(getBulletGroups(true),[[0],[3,4],[1,2],[7,8],[5,6],[9]]);
  assert.deepEqual(getBulletGroups(true).flat().sort((a,b)=>a-b),Array.from({length:10},(_,i)=>i));
});
test('Word exports are real ZIP packages, escape user text, and include the correct requested content',()=>{
  const notes=Array.from({length:10},(_,i)=>`Note ${i+1} <choice> & meaning`);
  const data={course:'langlit',sections:getSections(),notes};
  const bytes=buildDocument(data);assert.equal(new DataView(bytes.buffer).getUint32(0,true),0x04034b50);
  const text=new TextDecoder().decode(bytes);assert.match(text,/word\/numbering.xml/);assert.match(text,/&lt;choice&gt; &amp; meaning/);
  assert.equal((text.match(/<w:numPr>/g)||[]).length,10);assert.doesNotMatch(text,/Rehearsal duration:/);
  assert.throws(()=>buildDocument({...data,notes:['bad']}));
  assert.doesNotThrow(()=>buildDocument({...data,notes:Array(10).fill(Array(40).fill('word').join(' '))}));
  const review=Array.from({length:6},(_,i)=>({end:i===0?32:null,duration:i===0?32:null,marked:i===0}));
  const record=new TextDecoder().decode(buildDocument({...data,review,elapsed:'10:12',reflection:'Try a clearer connection <next time>.'}));
  assert.match(record,/Rehearsal duration: 10:12/);assert.match(record,/Actual length: 0:32/);assert.match(record,/Try a clearer connection &lt;next time&gt;/);
  assert.match(record,/Actual timing: not reached \/ unmarked/);
});
