import assert from 'node:assert/strict';
import test from 'node:test';
import {createCardPdf} from '../dist/export-client.mjs';
import {getSections} from '../src/rehearsal.mjs';
import {getBulletGroups} from '../src/outline.mjs';
test('bundled PDF export creates a real PDF locally for either course and order',async()=>{
  for(const course of ['langlit','literature']) for(const wholeFirst of [false,true]) {
    const notes=Array.from({length:10},(_,i)=>`Cue ${i+1}: author’s choice <evidence> & meaning.`);
    const blob=await createCardPdf(course,getSections(course,wholeFirst),notes,getBulletGroups(wholeFirst));
    assert.equal(blob.type,'application/pdf');
    const bytes=new Uint8Array(await blob.arrayBuffer());
    assert.equal(new TextDecoder().decode(bytes.slice(0,5)),'%PDF-');assert.ok(blob.size>1000);
  }
});
