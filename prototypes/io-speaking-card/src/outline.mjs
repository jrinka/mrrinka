export const WORD_LIMIT = 35;
export const BULLET_GROUPS = Object.freeze([[0], [1, 2], [3, 4], [5, 6], [7, 8], [9]].map(Object.freeze));
export function countWords(text) { return (text.match(/\S+/gu) || []).length; }
export function getBulletGroups(wholeFirst = false) {
  return (wholeFirst ? [0, 2, 1, 4, 3, 5] : [0, 1, 2, 3, 4, 5]).map(index => BULLET_GROUPS[index]);
}

// All document creation happens locally. This small ZIP writer uses stored entries,
// so the browser needs no external package, server, or network request.
const encoder = new TextEncoder();
const xml = text => String(text).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) { crc ^= byte; for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
  return (crc ^ 0xffffffff) >>> 0;
}
function zip(entries) {
  const locals = [], central = []; let offset = 0, centralSize = 0;
  const put16 = (view, at, value) => view.setUint16(at, value, true);
  const put32 = (view, at, value) => view.setUint32(at, value, true);
  for (const [path, content] of entries) {
    const name = encoder.encode(path), bytes = encoder.encode(content), crc = crc32(bytes);
    const local = new Uint8Array(30 + name.length + bytes.length); const lv = new DataView(local.buffer);
    put32(lv, 0, 0x04034b50); put16(lv, 4, 20); put16(lv, 6, 0x0800); put16(lv, 12, 0x0021); put32(lv, 14, crc); put32(lv, 18, bytes.length); put32(lv, 22, bytes.length); put16(lv, 26, name.length);
    local.set(name, 30); local.set(bytes, 30 + name.length); locals.push(local);
    const directory = new Uint8Array(46 + name.length); const dv = new DataView(directory.buffer);
    put32(dv, 0, 0x02014b50); put16(dv, 4, 20); put16(dv, 6, 20); put16(dv, 8, 0x0800); put16(dv, 14, 0x0021); put32(dv, 16, crc); put32(dv, 20, bytes.length); put32(dv, 24, bytes.length); put16(dv, 28, name.length); put32(dv, 42, offset);
    directory.set(name, 46); central.push(directory); offset += local.length; centralSize += directory.length;
  }
  const end = new Uint8Array(22); const ev = new DataView(end.buffer);
  put32(ev, 0, 0x06054b50); put16(ev, 8, entries.length); put16(ev, 10, entries.length); put32(ev, 12, centralSize); put32(ev, 16, offset);
  const result = new Uint8Array(offset + centralSize + end.length); let at = 0;
  for (const part of [...locals, ...central, end]) { result.set(part, at); at += part.length; }
  return result;
}
const paragraph = (text, style = 'Normal', numbered = false, keepNext = false) => `<w:p><w:pPr><w:pStyle w:val="${style}"/><w:keepLines/>${keepNext ? '<w:keepNext/>' : ''}${numbered ? '<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>' : ''}</w:pPr><w:r><w:t xml:space="preserve">${xml(text)}</w:t></w:r></w:p>`;

export function buildDocument({course, sections, notes, wholeFirst = false, review = null, elapsed = '', reflection = ''}) {
  if (notes.length !== 10 || sections.length !== 6 || notes.some(note => typeof note !== 'string')) throw new Error('Use ten text bullets and six sections.');
  const groups = getBulletGroups(wholeFirst);
  const timing = [30, 165, 300, 435, 570, 600];
  const format = value => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
  let body = paragraph(review ? 'Individual Oral Rehearsal Record' : 'Individual Oral Ten Bullet Outline', 'Title');
  body += paragraph(course === 'literature' ? 'Literature · Two literary works' : 'Language & Literature · Literary work and non-literary body of work', 'Subtitle');
  if (review) body += paragraph('Recommended pacing: 10:00 is a target. Section splits are practice guidance, not required section lengths.', 'Subtitle');
  if (review) body += paragraph(`Rehearsal duration: ${elapsed}. Actual timings reflect marked transitions only. They do not predict an assessment mark.`, 'Normal');
  sections.forEach((section, index) => {
    body += paragraph(section.title.replace(/·/g, '').replace(/\s+/g, ' ').trim(), 'Heading1');
    if (review) body += paragraph(`Recommended window: ${format(index ? timing[index - 1] : 0)}–${format(timing[index])}`, 'Subtitle', false, true);
    groups[index].forEach((noteIndex, slot) => { body += paragraph(notes[noteIndex].trim() || '—', 'Normal', true, Boolean(review) || slot < groups[index].length - 1); });
    if (review) {
      const row = review[index];
      body += paragraph(row.end == null ? 'Actual timing: not reached / unmarked.' : `Actual length: ${format(row.duration)} · Actual end: ${format(row.end)} · ${row.marked ? 'Transition marked' : 'Ended with rehearsal'}.`, 'Subtitle');
    }
  });
  if (review) {
    body += paragraph('One change to test next time', 'Heading1');
    body += paragraph(reflection.trim() || '—');
    body += paragraph('An unmarked section may have been discussed. This record cannot infer coverage or assess the quality of analysis.', 'Subtitle');
  }
  const ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
  const entries = [
    ['[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/></Types>'],
    ['_rels/.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],
    ['word/document.xml', `<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="${ns}"><w:body>${body}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080"/></w:sectPr></w:body></w:document>`],
    ['word/styles.xml', `<?xml version="1.0" encoding="UTF-8"?><w:styles xmlns:w="${ns}"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/><w:color w:val="000000"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="${review ? 120 : 70}" w:line="${review ? 276 : 240}" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:after="180"/></w:pPr><w:rPr><w:rFonts w:ascii="Georgia" w:hAnsi="Georgia"/><w:sz w:val="36"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:rPr><w:sz w:val="19"/><w:color w:val="000000"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="Heading 1"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="${review ? 200 : 120}" w:after="${review ? 100 : 60}"/></w:pPr><w:rPr><w:b/><w:sz w:val="23"/></w:rPr></w:style></w:styles>`],
    ['word/numbering.xml', `<?xml version="1.0" encoding="UTF-8"?><w:numbering xmlns:w="${ns}"><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="singleLevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="360"/></w:tabs><w:ind w:left="360" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`],
    ['word/_rels/document.xml.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>'],
  ];
  return zip(entries);
}

export function downloadDocument(data, filename) {
  const blob = new Blob([buildDocument(data)], {type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
  const url = URL.createObjectURL(blob), link = document.createElement('a');
  link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30000);
}

// Import is atomic: never silently truncate an outline or replace part of a card.
// Plain text: one bullet per nonempty line, optional -, •, or 1. markers.
// Markdown exported by this card may have headings and wrapped/indented lines.
export function parseOutline(text, wholeFirst = false) {
  const lines = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').split('\n');
  const meaningful = lines.filter(line => line.trim() && !/^\s*#{1,6}\s/.test(line));
  const numbered = meaningful.some(line => /^\s*(?:[-*•] |\d+[.)] )/.test(line));
  const bullets = [];
  for (const line of meaningful) {
    const marker = /^\s*(?:[-*•] |\d+[.)] )(.*)$/.exec(line);
    if (marker) bullets.push(marker[1]);
    else if (numbered && /^\s+/.test(line) && bullets.length) bullets[bullets.length - 1] += '\n' + line.trim();
    else if (numbered) throw new Error('Use one bullet per line, or indent continuation lines. No notes were changed.');
    else bullets.push(line.trim());
  }
  if (bullets.length !== 10) throw new Error(`Found ${bullets.length} bullets. Import exactly ten; no notes were changed.`);
  const notes = Array(10).fill('');
  getBulletGroups(wholeFirst).flat().forEach((slot, index) => { notes[slot] = bullets[index]; });
  return notes;
}
export function formatCard({course, sections, notes, wholeFirst = false}, markdown = false) {
  if (notes.length !== 10 || sections.length !== 6) throw new Error('Use ten bullets and six sections.');
  const lines = [markdown ? '# Individual Oral speaking card' : 'Individual Oral speaking card',
    markdown ? `## ${course === 'literature' ? 'Literature · Two literary works' : 'Language & Literature · Literary work and non-literary body of work'}` :
    course === 'literature' ? 'Literature · Two literary works' : 'Language & Literature · Literary work and non-literary body of work'];
  let ordinal = 0;
  sections.forEach((section, index) => {
    lines.push('', (markdown ? '## ' : '') + section.title);
    for (const slot of getBulletGroups(wholeFirst)[index]) {
      lines.push(`${++ordinal}. ${(notes[slot] || (markdown ? '' : '[No cue entered]')).replace(/\r\n?/g, '\n').replace(/\n/g, '\n   ')}`);
    }
  });
  return lines.join('\n');
}
