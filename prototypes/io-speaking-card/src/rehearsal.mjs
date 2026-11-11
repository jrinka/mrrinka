export const LENGTHS = Object.freeze([30, 135, 135, 135, 135, 30]);
export const ENDPOINTS = Object.freeze([30, 165, 300, 435, 570, 600]);
export const TARGET = 600;

export function formatTime(seconds) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
}

export function getSections(course = 'langlit', wholeFirst = false) {
  const literature = course === 'literature';
  const first = [
    { title: literature ? 'Work 1 · Extract' : 'Literary work · Extract', action: 'Begin first extract', guidance: 'Develop close analysis of choices in the extract and connect them to the global issue.' },
    { title: literature ? 'Work 1 · Work as a whole' : 'Literary work · Work as a whole', action: 'Move to the first whole work', guidance: 'Extend your reasoning to relevant moments elsewhere in the literary work.' },
  ];
  const second = [
    { title: literature ? 'Work 2 · Extract' : 'Non-literary text · Extract', action: 'Begin second extract', guidance: 'Develop close analysis of choices in the second extract and connect them to the global issue.' },
    { title: literature ? 'Work 2 · Work as a whole' : 'Non-literary text · Body of work', action: literature ? 'Move to the second whole work' : 'Move to the body of work', guidance: literature ? 'Extend your reasoning to relevant moments elsewhere in the second literary work.' : 'Extend your reasoning to relevant texts in the same creator’s body of work.' },
  ];
  if (wholeFirst) { first.reverse(); second.reverse(); }
  return [
    { title: 'Introduction', action: 'Start introduction', guidance: 'Introduce the global issue and your selections.' },
    ...first, ...second,
    { title: 'Conclusion', action: 'Begin conclusion', guidance: 'Bring together what the two selections reveal about the global issue.' },
  ];
}

export class Rehearsal {
  constructor(now = () => performance.now()) { this.now = now; this.reset(); }
  reset() { this.state = 'ready'; this.accumulatedMs = 0; this.startedAt = null; this.ends = []; this.finishedAt = null; }
  elapsedMs() { return this.accumulatedMs + (this.state === 'running' ? Math.max(0, this.now() - this.startedAt) : 0); }
  elapsed() { return this.elapsedMs() / 1000; }
  start() { if (this.state === 'ready' || this.state === 'paused') { this.startedAt = this.now(); this.state = 'running'; return true; } return false; }
  pause() { if (this.state !== 'running') return false; this.accumulatedMs = this.elapsedMs(); this.startedAt = null; this.state = 'paused'; return true; }
  transition() { if (this.state !== 'running' || this.ends.length >= 5) return false; this.ends.push(this.elapsed()); return true; }
  finish() {
    if (!['running', 'paused'].includes(this.state) || this.elapsed() <= 0) return false;
    this.accumulatedMs = this.elapsedMs(); this.finishedAt = this.accumulatedMs / 1000; this.startedAt = null; this.state = 'review'; return true;
  }
  review() {
    if (this.state !== 'review') return null;
    const recorded = [...this.ends, this.finishedAt];
    return LENGTHS.map((recommended, i) => ({recommended, end: recorded[i] ?? null, duration: recorded[i] == null ? null : recorded[i] - (i === 0 ? 0 : recorded[i - 1]), marked: i < this.ends.length}));
  }
}
