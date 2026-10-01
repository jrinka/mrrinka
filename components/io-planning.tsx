"use client";
import { useEffect, useState } from 'react';
import ExportFormatSelect from './export-format';
import { downloadRecord, type ExportFormat } from '@/lib/practice-record';
import { blankIOPlan, validIOPlan, ioPlanText, planningHeaders, type PlanningSelection, type PlanningRow } from '@/lib/io-planning';
import { ioSelections, ioWholeLabel, type IOCourse } from '@/lib/individual-oral';
import styles from './io-planning.module.css';

export default function IOPlanning({ course }: { course: IOCourse }) {
  const [plan, setPlan] = useState(() => blankIOPlan(course));
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('docx');
  const [exporting, setExporting] = useState(false);
  const key = `mrrinka:io-analysis-plan:v1:${course}`;
  useEffect(() => {
    try { const raw = localStorage.getItem(key); if (raw) { const data: unknown = JSON.parse(raw); if (validIOPlan(data, course)) setPlan(data); } setSaved(true); } catch { setSaved(false); }
    setReady(true);
  }, [key, course]);
  function save(next: typeof plan) {
    setPlan(next);
    try { localStorage.setItem(key, JSON.stringify(next)); setSaved(true); } catch { setSaved(false); }
  }
  function selection(index: number, next: PlanningSelection) { save({ ...plan, selections: plan.selections.map((s, i) => i === index ? next : s) }); }
  function row(index: number, group: 'close' | 'whole', position: number, field: keyof PlanningRow, value: string) {
    const s = plan.selections[index];
    selection(index, { ...s, [group]: s[group].map((r, i) => i === position ? { ...r, [field]: value } : r) });
  }
  async function download() {
    setExporting(true);
    await downloadRecord(ioPlanText(plan), `io-analysis-planning-${course}`, format, plan);
    setExporting(false);
  }
  return <div className={styles.planner}>
    <div className={styles.export}><ExportFormatSelect value={format} onChange={setFormat} /><button className="button" disabled={!ready || exporting} onClick={download}>{exporting ? 'Preparing download…' : 'Download planning worksheet'}</button><p>Word stays editable. PDF is for reading and printing. Download a blank worksheet or include the notes you type below.</p></div>
    <p role="status" className={styles.hint}>{!ready ? 'Loading your notes…' : saved ? 'Saved in this browser on this device. Download a copy to keep; these notes are not uploaded or sent to your teacher.' : 'This browser could not save your notes. Download a copy before leaving.'}</p>
    <label className={styles.field}>My provisional global issue<textarea rows={2} disabled={!ready} value={plan.issue} onChange={e => save({ ...plan, issue: e.target.value })} /></label>
    {plan.selections.map((s, i) => <section className={styles.selection} key={i} aria-label={`Selection ${i + 1}`}>
      <span className="mono">SELECTION {i + 1}</span><h2>{ioSelections(course)[i]}</h2>
      <label className={styles.field}>Work / creator<textarea aria-label={`Selection ${i + 1}: Work / creator`} rows={2} disabled={!ready} value={s.work} onChange={e => selection(i, { ...s, work: e.target.value })} /></label>
      <label className={styles.field}>Extract location and context<textarea aria-label={`Selection ${i + 1}: Extract location and context`} rows={2} disabled={!ready} value={s.extract} onChange={e => selection(i, { ...s, extract: e.target.value })} /></label>
      {(['close', 'whole'] as const).map(group => { const title = group === 'close' ? 'Close analysis' : ioWholeLabel(course, i); const headers = planningHeaders(group === 'whole'); return <div key={group}><h3 className={styles.sectionTitle}>{title}</h3><div className={styles.columnHeads} aria-hidden="true"><strong>{headers[0]}</strong><strong>{headers[1]}</strong></div>{s[group].map((r, n) => <div className={styles.row} key={n}>{(['evidence', 'analysis'] as const).map((field, col) => <label key={field}><span className={styles.mobileLabel}>{headers[col]}</span><textarea rows={4} disabled={!ready} aria-label={`Selection ${i + 1}, ${title}, row ${n + 1}: ${headers[col]}`} value={r[field]} onChange={e => row(i, group, n, field, e.target.value)} /></label>)}</div>)}</div>; })}
      <label className={styles.field}>The connection I need to explain<span className={styles.hint}>What does the evidence beyond the extract add? Where might my interpretation need qualification?</span><textarea aria-label={`Selection ${i + 1}: The connection I need to explain`} rows={4} disabled={!ready} value={s.connection} onChange={e => selection(i, { ...s, connection: e.target.value })} /></label>
    </section>)}
    <div className={styles.export}><button className="button" disabled={!ready || exporting} onClick={download}>Download {format.toUpperCase()} worksheet</button><p>Uses the export format selected above. Planning only, not an assessment-room form.</p></div>
  </div>;
}
