import { Rehearsal, getSections, formatTime, ENDPOINTS, TARGET } from './rehearsal.mjs';
import { countWords, parseOutline, formatCard, getBulletGroups, downloadDocument, WORD_LIMIT } from './outline.mjs';

const wordLabel = text => `${countWords(text)} words${countWords(text) > WORD_LIMIT ? ' · above optional 30–35 guidance' : ''}`;
const $ = id => document.getElementById(id);
const rehearsal = new Rehearsal();
let sections = getSections();
const notes = Array(10).fill('');
let announcementPhase = -1;
const announce = message => { $('announcement').textContent = message; };
const position = () => Math.min(rehearsal.ends.length, 5);
const friendlyTime = seconds => formatTime(seconds).replace(/^0/, '');

function drawRoute() {
  const groups = getBulletGroups($('whole-first').checked);
  let bulletNumber = 0;
  $('route-list').replaceChildren(...sections.map((section, index) => {
    const item = document.createElement('li');
    item.className = 'route-item';
    item.id = `route-${index}`;
    const number = document.createElement('span'); number.className = 'route-number'; number.textContent = String(index + 1).padStart(2, '0');
    const name = document.createElement('div'); name.className = 'route-name'; name.textContent = section.title;
    const meta = document.createElement('span'); meta.className = 'route-meta'; meta.id = `route-meta-${index}`; name.append(meta);
    const time = document.createElement('div'); time.className = 'route-time';
    time.textContent = `${friendlyTime(index === 0 ? 0 : ENDPOINTS[index - 1])}–${friendlyTime(ENDPOINTS[index])}`;
    const length = document.createElement('small'); length.textContent = index === 0 || index === 5 ? '0:30' : '2:15'; time.append(length);
    const fields = document.createElement('div'); fields.className = 'bullet-fields';
    for (const noteIndex of groups[index]) {
      bulletNumber++;
      const field = document.createElement('div'); field.className = 'bullet-field';
      const label = document.createElement('label'); label.htmlFor = `bullet-${noteIndex}`; label.textContent = `Bullet ${bulletNumber}`;
      const counter = document.createElement('span'); counter.className = 'word-counter'; counter.id = `bullet-count-${noteIndex}`; counter.textContent = wordLabel(notes[noteIndex]);
      const input = document.createElement('textarea'); input.id = `bullet-${noteIndex}`; input.rows = 2; input.value = notes[noteIndex];
      input.setAttribute('aria-describedby', counter.id); input.setAttribute('autocomplete', 'off');
      input.placeholder = index === 0 ? 'Global issue · selections · direction of comparison' : index === 5 ? 'What does the comparison reveal about the global issue?' : 'Evidence reference · authorial choice · connection to the global issue';
      input.addEventListener('input', () => {
        notes[noteIndex] = input.value;
        counter.textContent = wordLabel(input.value);
      });
      const heading = document.createElement('div'); heading.className = 'bullet-label'; heading.append(label, counter);
      field.append(heading, input); fields.append(field);
    }
    item.append(number, name, time, fields); return item;
  }));
}

function render() {
  const seconds = rehearsal.elapsed();
  const current = position();
  const reviewing = rehearsal.state === 'review';
  $('practice-view').hidden = reviewing; $('review-view').hidden = !reviewing;
  $('elapsed').textContent = formatTime(seconds);
  $('run-status').textContent = {ready:'Ready', running:'Running', paused:'Paused', review:'Finished'}[rehearsal.state];
  $('toggle-run').textContent = {ready:'Start rehearsal', running:'Pause', paused:'Resume', review:'Start rehearsal'}[rehearsal.state];
  $('reset').disabled = rehearsal.state === 'ready';
  $('finish').disabled = !['running','paused'].includes(rehearsal.state) || seconds <= 0;
  $('course').disabled = rehearsal.state !== 'ready'; $('whole-first').disabled = rehearsal.state !== 'ready';
  $('track-cursor').style.left = `${Math.min(100, seconds / TARGET * 100)}%`;
  $('target-note').textContent = seconds < 570 ? 'Ten-minute target · no automatic cutoff' : seconds < 600 ? 'Near ten minutes · finish naturally' : `${friendlyTime(seconds - 600)} past the target · finish naturally`;
  $('current-title').textContent = sections[current].title;
  $('current-guidance').textContent = sections[current].guidance;
  $('mark-transition').hidden = current === 5;
  $('mark-transition').disabled = rehearsal.state !== 'running';
  $('mark-transition').textContent = current < 5 ? sections[current + 1].action : 'Conclusion';
  $('checkpoint-note').textContent = current === 5
    ? (seconds < 600 ? 'Aim to finish naturally near 10:00.' : 'The target has passed. Complete your conclusion, then review.')
    : seconds < ENDPOINTS[current]
      ? `Recommended transition at ${friendlyTime(ENDPOINTS[current])} · ${friendlyTime(ENDPOINTS[current] - seconds)} away`
      : `Recommended checkpoint ${friendlyTime(ENDPOINTS[current])} has passed. Finish the idea, then move when ready.`;
  sections.forEach((_, i) => {
    const item = $(`route-${i}`); const marked = i < rehearsal.ends.length;
    item.className = `route-item${marked ? ' marked' : i === current ? ' current' : ''}`;
    if (i === current) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current');
    $(`route-meta-${i}`).textContent = marked ? `Marked end · ${friendlyTime(rehearsal.ends[i])}` : i === current ? 'Your current section' : 'Not marked yet';
  });
  const phase = ENDPOINTS.filter(end => seconds >= end).length;
  if (rehearsal.state === 'running' && phase !== announcementPhase) {
    if (phase > 0) announce(phase === 6 ? 'Ten-minute target reached. Finish naturally; the timer continues.' : `Recommended checkpoint ${friendlyTime(ENDPOINTS[phase - 1])} reached. Move when your idea is complete.`);
    announcementPhase = phase;
  }
}

function renderReview() {
  const seconds = rehearsal.finishedAt;
  $('review-elapsed').textContent = formatTime(seconds);
  const difference = Math.round(Math.abs(seconds - TARGET));
  $('review-target').textContent = difference === 0 ? 'At the ten-minute target' : `${friendlyTime(difference)} ${seconds < TARGET ? 'before' : 'after'} the ten-minute target`;
  $('review-summary').textContent = `${rehearsal.ends.length} of 5 section transitions marked. Compare where you spent time with the recommended route; these times do not predict an assessment mark.`;
  $('review-rows').replaceChildren(...rehearsal.review().map((row, i) => {
    const tr = document.createElement('tr');
    const title = document.createElement('td'); title.textContent = sections[i].title;
    if (row.end != null) { const note = document.createElement('small'); note.textContent = row.marked ? 'Transition marked' : 'Ended with rehearsal'; title.append(note); }
    const recommended = document.createElement('td'); recommended.textContent = friendlyTime(row.recommended);
    const actual = document.createElement('td'); actual.textContent = row.duration == null ? '—' : friendlyTime(row.duration);
    const end = document.createElement('td'); end.textContent = row.end == null ? 'Not reached / unmarked' : friendlyTime(row.end);
    if (row.end != null) {
      const offset = Math.round(row.end - ENDPOINTS[i]); const note = document.createElement('small');
      note.textContent = offset === 0 ? 'At recommended end' : `${friendlyTime(Math.abs(offset))} ${offset < 0 ? 'before' : 'after'} recommended end`; end.append(note);
    }
    tr.append(title, recommended, actual, end); return tr;
  }));
  const groups = getBulletGroups($('whole-first').checked); let ordinal = 0;
  $('review-outline').replaceChildren(...sections.map((section,index) => {
    const group = document.createElement('section'); const heading = document.createElement('h3'); heading.textContent = section.title;
    const list = document.createElement('ol'); list.start = ordinal + 1;
    for (const noteIndex of groups[index]) { const bullet = document.createElement('li'); bullet.textContent = notes[noteIndex] || 'No note entered'; list.append(bullet); ordinal++; }
    group.append(heading,list); return group;
  }));
}

async function exportNotes(includeRehearsal = false, format = 'docx') {
  if (includeRehearsal && rehearsal.state !== 'review') return;
  try {
    const data = {course:$('course').value, sections:[...sections], notes:[...notes], wholeFirst:$('whole-first').checked, review:includeRehearsal ? rehearsal.review() : null, elapsed:formatTime(rehearsal.finishedAt || 0), reflection:includeRehearsal ? $('reflection').value : ''};
    if (format === 'docx') downloadDocument(data, includeRehearsal ? 'IO_Rehearsal_Record.docx' : 'IO_Ten_Bullet_Outline.docx');
    else {
      const content = formatCard(data, format === 'md');
      let blob;
      if (format === 'md') blob = new Blob([content], {type:'text/markdown;charset=utf-8'});
      else {
        const {createCardPdf} = await import('./export-client.mjs');
        blob = await createCardPdf(data.course, data.sections, data.notes, getBulletGroups(data.wholeFirst));
      }
      const url = URL.createObjectURL(blob), link = document.createElement('a');
      link.href = url; link.download = `IO_Ten_Bullet_Outline.${format}`;
      document.body.append(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 30000);
    }
    announce(includeRehearsal ? 'Rehearsal record exported. Your notes remain in this tab.' : 'Ten-bullet outline exported. Your notes remain in this tab.');
  } catch { announce('The document could not be exported. Your notes are still in this tab; try exporting again.'); }
}

function toggleRun() {
  if (rehearsal.state === 'review') return false;
  if (rehearsal.state === 'running') { rehearsal.pause(); announce(`Paused at ${friendlyTime(rehearsal.elapsed())}.`); }
  else { rehearsal.start(); announce(rehearsal.accumulatedMs ? 'Rehearsal resumed.' : 'Rehearsal started. Introduction.'); }
  render(); return true;
}
function markTransition() {
  if (!rehearsal.transition()) return false;
  render(); announce(`Now in ${sections[position()].title}. Transition marked at ${friendlyTime(rehearsal.elapsed())}.`);
  if (position() === 5) $('finish').focus();
  return true;
}
function finish() {
  if (!rehearsal.finish()) return false;
  renderReview(); render(); $('review-heading').focus(); announce('Rehearsal finished. Review your timings.'); return true;
}
function clearRehearsal() {
  rehearsal.reset(); announcementPhase = -1; $('reflection').value = ''; render(); $('toggle-run').focus(); announce('Rehearsal cleared. Ready to start.');
}
function requestReset() { $('reset-dialog').showModal(); }
function configure() {
  if (rehearsal.state !== 'ready') return;
  sections = getSections($('course').value, $('whole-first').checked);
  $('course-note').textContent = $('course').value === 'literature' ? 'Use two literary works. This route keeps the two works in balance.' : 'This route puts the literary work first, then the non-literary body of work.';
  drawRoute(); render();
}
$('toggle-run').addEventListener('click', toggleRun);
$('mark-transition').addEventListener('click', markTransition);
$('finish').addEventListener('click', finish);
$('reset').addEventListener('click', requestReset);
$('new-rehearsal').addEventListener('click', () => $('reflection').value ? requestReset() : clearRehearsal());
$('cancel-reset').addEventListener('click', () => $('reset-dialog').close());
$('confirm-reset').addEventListener('click', () => { $('reset-dialog').close(); clearRehearsal(); });
$('course').addEventListener('change', configure);
$('whole-first').addEventListener('change', configure);
$('export-outline').addEventListener('click', () => exportNotes());
$('export-pdf').addEventListener('click', () => exportNotes(false, 'pdf'));
$('export-markdown').addEventListener('click', () => exportNotes(false, 'md'));
$('import-outline').addEventListener('change', async () => {
  const file = $('import-outline').files?.[0];
  if (!file) return;
  try {
    if (file.size > 100000) throw new Error('Choose a plain-text outline under 100 KB. No notes were changed.');
    const imported = parseOutline(await file.text(), $('whole-first').checked);
    pendingImport = imported;
    $('import-dialog').showModal();
  } catch (error) { $('import-status').textContent = error.message; }
  finally { $('import-outline').value = ''; }
});
let pendingImport = null;
$('cancel-import').addEventListener('click', () => { pendingImport = null; $('import-dialog').close(); });
$('import-dialog').addEventListener('cancel', () => { pendingImport = null; });
$('confirm-import').addEventListener('click', () => {
  if (!pendingImport) return;
  notes.splice(0, 10, ...pendingImport); pendingImport = null;
  drawRoute(); render(); if (rehearsal.state === 'review') renderReview();
  $('import-dialog').close(); $('import-status').textContent = 'Ten cues imported in the current section order. Nothing was uploaded.';
});
$('export-rehearsal').addEventListener('click', () => exportNotes(true));

// Optional browser agent access uses the same actions and state as the visible controls.
const context = document.modelContext;
if (context?.registerTool) {
  const lifecycle = new AbortController();
  try {
    Promise.resolve(context.registerTool({
      name: 'read_io_rehearsal', title: 'Read rehearsal timing',
      description: 'Read the current timer, rehearsal state, marked transitions, and finished review.',
      inputSchema: {type:'object',properties:{},additionalProperties:false},
      annotations: {readOnlyHint:true,untrustedContentHint:false},
      execute(input) {
        if (input == null || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length) throw new Error('Expected an empty object.');
        return {state:rehearsal.state,elapsed:formatTime(rehearsal.elapsed()),section:sections[position()].title,markedEndTimes:rehearsal.ends.map(formatTime),review:rehearsal.review()};
      },
    }, {signal:lifecycle.signal})).catch(() => {});
    Promise.resolve(context.registerTool({
      name:'control_io_rehearsal',title:'Control rehearsal',
      description:'Start, pause, resume, mark the next section transition, or finish and open review. Does not clear a rehearsal.',
      inputSchema:{type:'object',properties:{action:{type:'string',enum:['start','pause','resume','mark_transition','finish']}},required:['action'],additionalProperties:false},
      annotations:{readOnlyHint:false,untrustedContentHint:false},
      execute(input) {
        if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== 1 || !['start','pause','resume','mark_transition','finish'].includes(input.action)) throw new Error('Choose a supported rehearsal action.');
        const allowed = {start:rehearsal.state==='ready',pause:rehearsal.state==='running',resume:rehearsal.state==='paused',mark_transition:rehearsal.state==='running' && position()<5,finish:['running','paused'].includes(rehearsal.state) && rehearsal.elapsed()>0};
        if (!allowed[input.action]) throw new Error('This action is not available in the current rehearsal state.');
        if (input.action==='mark_transition') markTransition(); else if (input.action==='finish') finish(); else toggleRun();
        return {state:rehearsal.state,elapsed:formatTime(rehearsal.elapsed()),section:sections[position()].title};
      },
    }, {signal:lifecycle.signal})).catch(() => {});
    window.addEventListener('pagehide', () => lifecycle.abort(), {once:true});
  } catch { /* The ordinary timer is available without browser agent support. */ }
}
$('reflection').value = '';
drawRoute(); render();
window.setInterval(() => { if (rehearsal.state === 'running') render(); }, 200);
document.addEventListener('visibilitychange', render);
