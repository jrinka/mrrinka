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
  for(const format of ['md','pdf','docx']) assert.ok(html.includes(`value="${format}"`));
  assert.ok(!html.includes('value="txt"'));
  assert.match(html, /<option value="docx" selected>/);
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

test("shared export menu offers Word, PDF, and Markdown and every caller selects Word initially", async () => {
 const {createElement}=await import('react');
 const {renderToStaticMarkup}=await import('react-dom/server');
 const {default:ExportFormatSelect}=await import('../components/export-format');
 const {exportFormats}=await import('../lib/practice-record');
 const {readdirSync}=await import('node:fs');
 assert.deepEqual(exportFormats.map(format=>format.value),['pdf','docx','md']);
 const html=renderToStaticMarkup(createElement(ExportFormatSelect,{value:'docx',onChange:()=>{}}));
 assert.match(html,/<option value="docx" selected="">Word/);
 assert.doesNotMatch(html,/<option value="txt"/);
 const callers=readdirSync('components').filter(name=>name.endsWith('.tsx')&&name!=='export-format.tsx').map(name=>({name,source:readFileSync(`components/${name}`,'utf8')})).filter(file=>file.source.includes('<ExportFormatSelect'));
 assert.equal(callers.length,24);
 for(const {name,source} of callers){
  const defaults=[...source.matchAll(/useState<ExportFormat>\(\s*["']([^"']+)["']\s*\)/g)];
  assert.ok(defaults.length,`${name}: export state must have an explicit initial format`);
  for(const [,format] of defaults)assert.equal(format,'docx',`${name}: default format`);
 }
});


test("Brain Break offers shared document formats and preserves literal activity content", async () => {
 const {createActivityBlob,activityRecord}=await import('../recess/exports');
 const content='Synthetic activity\n2 × 3 = 6\n**literal** ```notes```';
 const markdown=await createActivityBlob(content,'Test activity','md');
 assert.equal(await markdown.blob.text(),activityRecord(content,'Test activity','md'));
 const word=await createActivityBlob(content,'Test activity','docx');
 assert.equal(word.filename,'brain-break-test-activity.docx');
 assert.equal(Buffer.from(await word.blob.arrayBuffer()).subarray(0,2).toString(),'PK');
 const pdf=await createActivityBlob(content,'Test activity','pdf');
 assert.equal(Buffer.from(await pdf.blob.arrayBuffer()).subarray(0,5).toString(),'%PDF-');
 const source=readFileSync('recess/activity-export.tsx','utf8');
 assert.match(source,/useState<ExportFormat>\('docx'\)/);
 assert.match(source,/exportFormats.map/);
});
