import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {Rehearsal, getSections, formatTime, ENDPOINTS, LENGTHS} from '../src/rehearsal.mjs';

test('the existing model has six exact budgets and five intermediate transitions', () => {
  assert.deepEqual(LENGTHS,[30,135,135,135,135,30]);
  assert.deepEqual(ENDPOINTS,[30,165,300,435,570,600]);
  assert.equal(LENGTHS.reduce((a,b)=>a+b),600);
  assert.equal(formatTime(630),'10:30');
});

test('elapsed time catches up after delayed callbacks and excludes paused time', () => {
  let clock=0; const timer=new Rehearsal(()=>clock);
  assert.equal(timer.transition(),false); assert.equal(timer.finish(),false);
  timer.start(); clock=45730; assert.equal(timer.elapsed(),45.73);
  timer.pause(); clock=999999; assert.equal(timer.elapsed(),45.73);
  assert.equal(timer.transition(),false);
  timer.start(); clock+=2345; assert.equal(timer.elapsed(),48.075);
  timer.finish(); clock+=50000; assert.equal(timer.elapsed(),48.075);
  assert.equal(timer.start(),false);
});

test('recommended checkpoints do not force transitions, stop timing, or trigger a penalty state', () => {
  let clock=0; const timer=new Rehearsal(()=>clock); timer.start();
  for (const second of [...ENDPOINTS,630,700]) {
    clock=second*1000; assert.equal(timer.elapsed(),second); assert.equal(timer.state,'running'); assert.deepEqual(timer.ends,[]);
  }
  timer.finish(); assert.equal(timer.review()[0].duration,700); assert.equal(timer.review()[1].duration,null);
});

test('actual transition marks determine section lengths and complete review', () => {
  let clock=0; const timer=new Rehearsal(()=>clock); timer.start();
  const ends=[40,180,305,450,585];
  ends.forEach(end=>{clock=end*1000;assert.equal(timer.transition(),true);});
  assert.equal(timer.transition(),false); clock=621000; timer.finish();
  assert.deepEqual(timer.review().map(x=>x.duration),[40,140,125,145,135,36]);
  assert.deepEqual(timer.review().map(x=>x.end),[...ends,621]);
  timer.reset(); assert.equal(timer.state,'ready'); assert.equal(timer.elapsed(),0); assert.equal(timer.review(),null); assert.deepEqual(timer.ends,[]);
});

test('course and whole-first options preserve course distinctions and budgets', () => {
  assert.match(getSections('langlit')[4].title,/Body of work/);
  assert.match(getSections('literature')[4].title,/Work as a whole/);
  assert.match(getSections('literature',true)[1].title,/Work as a whole/);
  assert.match(getSections('langlit',true)[3].title,/Body of work/);
  assert.equal(getSections('literature',true).length,6);
});

test('visible controls drive start, pause, resume, transition, review, course selection, and reset', async () => {
  // DOM harness exercises the actual application listeners without claiming browser layout QA.
  const ids=new Map(); let clock=0; let renderTick; const registrations=[]; const downloads=[]; const blobs=[];
  class Element {
    constructor(tag='div'){this.tagName=tag;this.children=[];this.listeners={};this.attributes={};this.style={};this.hidden=false;this.disabled=false;this.checked=false;this.value='';this._text='';}
    set id(value){this._id=value;ids.set(value,this);} get id(){return this._id;}
    set textContent(value){this._text=String(value);this.children=[];} get textContent(){return this._text+this.children.map(x=>x.textContent??String(x)).join('');}
    append(...children){this.children.push(...children);} replaceChildren(...children){this._text='';this.children=children;}
    setAttribute(k,v){this.attributes[k]=v;} removeAttribute(k){delete this.attributes[k];}
    addEventListener(event,fn){this.listeners[event]=fn;} focus(){this.focused=true;}
    showModal(){this.open=true;} close(){this.open=false;}
    click(){if(this.tagName==='a'){downloads.push(this.download);return;}if(!this.disabled)return this.listeners.click?.();} remove(){}
  }
  const html=readFileSync(new URL('../src/index.html',import.meta.url),'utf8');
  for(const match of html.matchAll(/<([a-z]+)[^>]*\bid="([^"]+)"[^>]*>/g)){const el=new Element(match[1]);el.id=match[2];el.disabled=/\bdisabled\b/.test(match[0]);}
  ids.get('course').value='langlit';
  globalThis.performance={now:()=>clock};
  globalThis.document={body:new Element('body'),getElementById:id=>{assert.ok(ids.has(id),`Missing actual HTML id ${id}`);return ids.get(id);},createElement:tag=>new Element(tag),addEventListener(){},modelContext:{registerTool(tool){registrations.push(tool);}}};
  globalThis.URL.createObjectURL=blob=>{blobs.push(blob);return 'blob:local-test';};globalThis.URL.revokeObjectURL=()=>{};
  globalThis.window={setInterval(fn){renderTick=fn;},setTimeout(){},addEventListener(){}};
  await import('../src/app.mjs');
  const el=id=>ids.get(id);
  assert.equal(el('elapsed').textContent,'00:00');assert.equal(el('finish').disabled,true);
  assert.equal([...ids.keys()].filter(id=>/^bullet-\d+$/.test(id)).length,10);
  el('bullet-1').value='Evidence <choice> & global issue';el('bullet-1').listeners.input();
  el('bullet-0').value=Array.from({length:40},(_,i)=>`word${i}`).join(' ');el('bullet-0').listeners.input();
  assert.equal(el('bullet-0').value.split(' ').length,40);assert.match(el('bullet-count-0').textContent,/40 words.*optional/);
  el('export-outline').click();assert.deepEqual(downloads,['IO_Ten_Bullet_Outline.docx']);assert.ok(blobs[0].size>1000);
  el('export-markdown').click();assert.equal(downloads[1],'IO_Ten_Bullet_Outline.md');
  const prior=el('bullet-1').value;
  el('import-outline').files=[{size:20,text:async()=> 'too few'}];
  await el('import-outline').listeners.change();assert.match(el('import-status').textContent,/Found 1/);assert.equal(el('bullet-1').value,prior);
  const imported=Array.from({length:10},(_,i)=>`Imported ${i}`).join('\n');
  el('import-outline').files=[{size:100,text:async()=>imported}];await el('import-outline').listeners.change();
  assert.equal(el('import-dialog').open,true);el('cancel-import').click();assert.equal(el('bullet-1').value,prior);
  await el('import-outline').listeners.change();el('confirm-import').click();assert.equal(el('bullet-1').value,'Imported 1');
  // Restore a recognizable cue for the rest of the existing rehearsal flow.
  el('bullet-1').value=prior;el('bullet-1').listeners.input();
  el('course').value='literature';el('course').listeners.change();
  el('whole-first').checked=true;el('whole-first').listeners.change();assert.match(el('route-1').textContent,/Work as a whole/);assert.equal(el('bullet-1').value,'Evidence <choice> & global issue');
  el('toggle-run').click();assert.equal(el('run-status').textContent,'Running');assert.equal(el('course').disabled,true);
  clock=30000;renderTick();assert.equal(el('elapsed').textContent,'00:30');assert.equal(el('current-title').textContent,'Introduction');
  el('mark-transition').click();assert.match(el('current-title').textContent,/Work as a whole/);
  el('toggle-run').click();clock=300000;renderTick();assert.equal(el('run-status').textContent,'Paused');assert.equal(el('elapsed').textContent,'00:30');assert.equal(el('mark-transition').disabled,true);
  el('toggle-run').click();clock+=575000;renderTick();assert.equal(el('elapsed').textContent,'10:05');assert.equal(el('run-status').textContent,'Running');assert.match(el('target-note').textContent,/past the target/);
  el('finish').click();assert.equal(el('practice-view').hidden,true);assert.equal(el('review-view').hidden,false);assert.equal(el('review-elapsed').textContent,'10:05');assert.match(el('review-summary').textContent,/1 of 5/);assert.equal(el('review-rows').children.length,6);
  assert.match(el('review-outline').textContent,/Evidence <choice> & global issue/);
  el('export-rehearsal').click();assert.equal(downloads[2],'IO_Rehearsal_Record.docx');
  el('reflection').value='Use more precise evidence.';el('new-rehearsal').click();assert.equal(el('reset-dialog').open,true);
  el('cancel-reset').click();assert.equal(el('reset-dialog').open,false);assert.equal(el('review-view').hidden,false);
  el('new-rehearsal').click();el('confirm-reset').click();assert.equal(el('elapsed').textContent,'00:00');assert.equal(el('reflection').value,'');assert.equal(el('review-view').hidden,true);assert.equal(el('bullet-1').value,'Evidence <choice> & global issue');
  el('toggle-run').click();clock+=5000;renderTick();el('reset').click();el('confirm-reset').click();assert.equal(el('run-status').textContent,'Ready');
  // Registration/action contracts are tested in a mock, not a native supported WebMCP browser.
  assert.deepEqual(registrations.map(x=>x.name),['read_io_rehearsal','control_io_rehearsal']);
  const control=registrations[1];assert.throws(()=>control.execute({action:'pause'}));assert.equal(el('run-status').textContent,'Ready');
  assert.throws(()=>control.execute({action:'start',extra:true}));
  assert.equal(control.execute({action:'start'}).state,'running');clock+=3000;
  assert.equal(registrations[0].execute({}).state,'running');assert.equal(control.execute({action:'finish'}).state,'review');
  assert.throws(()=>control.execute({action:'resume'}));
  el('reflection').value='Private reflection';
  await import('../src/app.mjs?fresh-page');
  assert.equal(el('bullet-1').value,'');assert.equal(el('reflection').value,'');assert.equal(el('elapsed').textContent,'00:00');
});

test('published surface has local assets, privacy copy, and semantic controls', () => {
  const html=readFileSync(new URL('../src/index.html',import.meta.url),'utf8');
  assert.match(html,/name="viewport"/);assert.match(html,/name="robots" content="noindex, nofollow"/);
  assert.match(html,/not required section lengths/);assert.match(html,/No audio is recorded/);
  assert.match(html,/Refreshing or closing it clears them/);assert.match(html,/<dialog[^>]*aria-labelledby/);
  for(const m of html.matchAll(/(?:src|href)="([^"#][^"]*)"/g))if(!m[1].startsWith('data:'))assert.doesNotThrow(()=>readFileSync(new URL('../src/'+m[1],import.meta.url)));
  const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
  for(const name of ['app.mjs','outline.mjs','rehearsal.mjs']) {
    const source=readFileSync(new URL('../src/'+name,import.meta.url),'utf8');
    assert.doesNotMatch(source,/\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|indexedDB|getUserMedia|MediaRecorder)\b/);
  }
  assert.match(html,/optional drafting guidance, not an IB requirement/);
  assert.match(html,/separate from the detailed preparation worksheet/);
  assert.doesNotMatch(app,/innerHTML/);
});
