import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {prepareRecordDownload} from "../lib/practice-record";
test("plain text is the default and preserves unfinished student writing exactly",()=>{
 const content='My note\n\n“quoted text” **unfinished**\n  two spaces';
 assert.deepEqual(prepareRecordDownload(content,'reading-notes.txt'),{content,filename:'reading-notes.txt',mime:'text/plain;charset=utf-8'});
 const markdown=prepareRecordDownload(content,'reading-notes.txt','md');
 assert.equal(markdown.filename,'reading-notes.md');assert.equal(markdown.mime,'text/markdown;charset=utf-8');assert.equal(markdown.content,`# reading notes\n\n${content}`);
});
test("downloadable editable grids include self-contained export controls",()=>{
 for(const method of ['tpcastt','soapstone']){
  const html=readFileSync(`public/downloads/${method}-grid.html`,'utf8');
  assert.ok(html.includes('id="export-notes"'));
  assert.ok(html.includes("addEventListener('click'"));
  assert.ok(html.includes('value="txt"'));assert.ok(html.includes('value="md"'));
  assert.ok(html.includes('id="text-title"'));assert.ok(html.includes('id="text-author"'));
  assert.ok(!html.includes('<script src='));
 }
});
