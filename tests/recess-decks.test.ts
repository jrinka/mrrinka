import test from 'node:test';
import assert from 'node:assert/strict';
import {drawFromBank} from '../recess/decks';
import {words,anagrams,ladders,definitions,debates} from '../recess/challenges';
import {masterpieces,blobPrompts} from '../recess/mini-game-data';
import {twentyFourBanks,matchPuzzles} from '../recess/math/data';

const storage = new Map<string,string>();
Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:(key:string)=>storage.get(key)||null,setItem:(key:string,value:string)=>storage.set(key,value)}});

test('every bank item is dealt before any repeats, including across refill boundaries',()=>{
  const bank=['A','B','C','D','E'];
  const first=Array.from({length:5},()=>drawFromBank('cycle',bank)[0]);
  assert.equal(new Set(first).size,5);
  const second=Array.from({length:5},()=>drawFromBank('cycle',bank)[0]);
  assert.equal(new Set(second).size,5);
  assert.notEqual(first.at(-1),second[0]);
});
test('saved rotation is read again on the next draw, including last-round avoidance',()=>{
  const bank=['A','B','C'];drawFromBank('saved',bank);
  const key='brain-break-deck-v1:saved';const record=JSON.parse(storage.get(key)!);
  storage.set(key,JSON.stringify({...record,remaining:[2],last:[0]}));
  assert.deepEqual(drawFromBank('saved',bank),['C']);
  const next=drawFromBank('saved',bank)[0];assert.notEqual(next,'C');
});
test('batch rounds contain unique items and exhaust the bank before repeating',()=>{
  const bank=Array.from({length:32},(_,i)=>i);
  const rounds=Array.from({length:4},()=>drawFromBank('memory-test',bank,8));
  assert.equal(new Set(rounds.flat()).size,32);
  const fifth=drawFromBank('memory-test',bank,8);
  assert.equal(new Set(fifth).size,8);
  assert.equal(fifth.some(i=>rounds[3].includes(i)),false);
});
test('changed banks, corrupt storage and unavailable storage remain playable',()=>{
  drawFromBank('change',['A','B','C']);
  assert.ok(['X','Y','Z'].includes(drawFromBank('change',['X','Y','Z'])[0]));
  storage.set('brain-break-deck-v1:broken','not JSON');assert.equal(drawFromBank('broken',['A'])[0],'A');
  const original=globalThis.localStorage;
  Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw new Error('blocked');}});
  try{assert.equal(new Set(Array.from({length:3},()=>drawFromBank('no-storage',['A','B','C'])[0])).size,3);}finally{Object.defineProperty(globalThis,'localStorage',{configurable:true,value:original});}
});
test('expanded banks have unique entries and usable words',()=>{
  assert.ok(words.length>=600);assert.ok(words.every(word=>/^[A-Z]{5}$/.test(word)));
  assert.ok(anagrams.length>=80);assert.ok(anagrams.every(word=>/^[A-Z]{6,24}$/.test(word)));
  for(const bank of [words,anagrams,ladders,definitions,debates,masterpieces,blobPrompts,twentyFourBanks.warmup,twentyFourBanks.stretch,matchPuzzles])assert.equal(new Set(bank.map(item=>JSON.stringify(item))).size,bank.length);
});
