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
  assert.match(html, /addEventListener\(["']click["']/);
  for(const format of ['txt','md','pdf','docx']) assert.ok(html.includes(`value="${format}"`));
  assert.ok(html.includes('id="text-title"'));assert.ok(html.includes('id="text-author"'));
  assert.ok(!html.includes('<script src='));
 }
});

test("PDF and Word downloads are real documents, not renamed plain text", async () => {
 const {createRecordBlob} = await import('../lib/practice-record');
 const content='Student draft\n\n“Café” — £5 and αβγ.\n  indentation\n**unfinished** <literal>\n\nAI feedback (not student-authored)\nKeep attribution.';
 const pdf=await createRecordBlob(content,'reading-notes.txt','pdf');
 assert.equal(pdf.filename,'reading-notes.pdf');
 const bytes=new Uint8Array(await pdf.blob.arrayBuffer());
 assert.equal(Buffer.from(bytes.subarray(0,5)).toString(),'%PDF-');
 assert.ok(Buffer.from(bytes).toString().includes('%%EOF'));
 const word=await createRecordBlob(content,'reading-notes.md','docx');
 assert.equal(word.filename,'reading-notes.docx');
 assert.equal(word.blob.type,'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
 const zip=new Uint8Array(await word.blob.arrayBuffer());
 assert.equal(Buffer.from(zip.subarray(0,2)).toString(),'PK');
});
