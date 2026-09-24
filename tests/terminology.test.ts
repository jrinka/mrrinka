import test from 'node:test';
import assert from 'node:assert/strict';
import banks from '../lib/analysis-reference.json';
import {terms,matchesTerm} from '../lib/terminology';
import {changeExercises} from '../lib/what-changes';
test('unified reference retains every source reading without duplicate canonical IDs',()=>{
 assert.equal(new Set(terms.map(t=>t.id)).size,terms.length);
 assert.equal(terms.reduce((n,t)=>n+t.readings.length,0),banks.reduce((n,b)=>n+b.groups.reduce((s,g)=>s+g.entries.length,0),0));
 assert.equal(terms.find(t=>t.id==='juxtaposition')?.readings.length,2);
 assert.equal(terms.find(t=>t.id==='juxtaposition')?.aliases.length,2);
});
test('search supports descriptions, not only term names',()=>{
 assert.ok(matchesTerm(terms.find(t=>t.id==='anchorage')!,'text explaining an image'));
 assert.ok(!matchesTerm(terms.find(t=>t.id==='anchorage')!,'alliteration'));
});
test('every exercise vocabulary link resolves to a canonical entry',()=>{
 for(const e of changeExercises)for(const id of e.terms)assert.ok(terms.some(t=>t.id===id),`${e.id}: ${id}`);
});
