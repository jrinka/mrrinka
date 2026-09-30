"use client";

import { useEffect, useRef, useState } from "react";
import { ioClock, ioModes, ioOrders, ioStageAt, ioStages, type IOCourse, type IOMode, type IOOrder } from "@/lib/individual-oral";
import styles from "./individual-oral.module.css";

export function IOTimingMap({ course }: { course: IOCourse }) {
  const [order, setOrder] = useState<IOOrder>("extract-first");
  return <div className={styles.tool}>
    <h3>Follow the 10-minute route</h3>
    <label className={styles.selectLabel}>Order within each selection
      <select value={order} onChange={event => setOrder(event.target.value as IOOrder)}>
        {ioOrders.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
      </select>
    </label>
    <p>For the non-literary selection, “work as a whole” refers to the body of work. The mixed option starts with the extract for selection 1 and the work as a whole for selection 2. The two parts of each selection stay together. You may also reverse the order of the two selections.</p>
    <ol className={styles.timeline}>{ioStages(course, order).map(stage => <li key={stage.title}>
      <span className={styles.time}>{ioClock(stage.start)}–{ioClock(stage.end)}<small>{ioClock(stage.duration)}</small></span>
      <div><strong>{stage.title}</strong><p>{stage.purpose}</p></div>
    </li>)}</ol>
    <p className={styles.note}>Prepared response ends at 10:00. Teacher questions follow for 5 minutes.</p>
  </div>;
}

export function IOPracticeTimer({ course }: { course: IOCourse }) {
  const [mode, setMode] = useState<IOMode>("full");
  const [order, setOrder] = useState<IOOrder>("extract-first");
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const accumulated = useRef(0);
  const startedAt = useRef(0);
  const total = ioModes.find(item => item.id === mode)!.seconds;
  const complete = elapsed >= total;
  const stage = mode === "full" ? ioStageAt(ioStages(course, order), elapsed) : undefined;
  const status = complete ? "Practice complete" : stage?.title ?? ioModes.find(item => item.id === mode)!.title;
  useEffect(() => {
    if (!running) return;
    function tick() {
      const next = Math.min(total, accumulated.current + (Date.now() - startedAt.current) / 1000);
      setElapsed(next);
      if (next >= total) { accumulated.current = total; setRunning(false); }
    }
    const timer = window.setInterval(tick, 100);
    const sync = () => tick();
    document.addEventListener("visibilitychange", sync);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", sync); };
  }, [running, total]);
  function reset() { setRunning(false); accumulated.current = 0; setElapsed(0); }
  function toggle() {
    if (running) {
      accumulated.current = Math.min(total, accumulated.current + (Date.now() - startedAt.current) / 1000);
      setElapsed(accumulated.current); setRunning(false);
    } else { startedAt.current = Date.now(); setRunning(true); }
  }
  return <div className={styles.tool} aria-label="IO practice timer">
    <h3>Practice timer</h3>
    <div className={styles.controls}>
      <label className={styles.selectLabel}>Practice mode<select value={mode} onChange={event => { reset(); setMode(event.target.value as IOMode); }}>
        {ioModes.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
      </select></label>
      {mode === "full" && <label className={styles.selectLabel}>Practice order<select value={order} disabled={running || elapsed > 0} onChange={event => setOrder(event.target.value as IOOrder)}>
        {ioOrders.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
      </select></label>}
    </div>
    <p className={styles.note}>For the non-literary selection, “work as a whole” refers to the body of work. Reset the timer before changing the practice order.</p>
    <p className={styles.timerStatus} role="status">{status}</p>
    <div className={styles.clock} role="timer" aria-label={`${ioClock(Math.ceil(total - elapsed))} remaining`}>{ioClock(Math.ceil(total - elapsed))}<span>remaining</span></div>
    <p>{ioClock(elapsed)} elapsed{stage ? ` · This section ends at ${ioClock(stage.end)}` : ""}</p>
    <progress className={styles.progress} aria-label="Practice progress" value={elapsed} max={total} />
    <div className={styles.controls}><button className="button" onClick={toggle} disabled={complete}>{running ? "Pause" : elapsed > 0 ? "Resume" : "Start"}</button><button className="button secondary" onClick={reset}>Reset</button></div>
    {mode === "mini" && <p className={styles.note}>Half-IO practice with one selection. Follow your teacher's task sheet for the internal timings.</p>}
    <p className={styles.note}>No audio is recorded or uploaded. The timer pauses only when you press Pause; leaving or reloading this page resets it.</p>
  </div>;
}


export function IORehearsalNotes({ course }: { course: IOCourse }) {
  const [notes, setNotes] = useState("");
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const key = `mrrinka:io-rehearsal-notes:${course}`;
  useEffect(() => {
    try { setNotes(localStorage.getItem(key) ?? ""); setSaved(true); }
    catch { setSaved(false); }
    setReady(true);
  }, [key]);
  function update(value: string) {
    setNotes(value);
    try { localStorage.setItem(key, value); setSaved(true); }
    catch { setSaved(false); }
  }
  function download() {
    const url = URL.createObjectURL(new Blob(["IO rehearsal notes\n\n" + notes], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = `io-rehearsal-notes-${course}.txt`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className={styles.tool} aria-label="Rehearsal notes">
    <h3>My rehearsal notes</h3>
    <label className={styles.notesLabel} htmlFor="io-rehearsal-notes">What did you notice, and what will you try next?</label>
    <p id="io-notes-help">Record a section or timestamp, the problem you noticed, and one change to test. Add a date when you return so you can track what improves.</p>
    <textarea id="io-rehearsal-notes" className={styles.notesInput} rows={8} value={notes} disabled={!ready} onChange={event => update(event.target.value)} aria-describedby="io-notes-help io-notes-storage" placeholder={"At 3:20 I’m speaking too fast. Next time: pause after the claim and explain fewer examples more fully.\n\nMy analysis of the second selection as a whole is thin. Next time: choose a precise moment beyond the extract and explain what it adds to my interpretation."} />
    <p id="io-notes-storage" className={styles.note} role="status">{!ready ? "Loading your notes…" : saved ? "Saved in this browser on this device. These notes are not sent to your teacher or uploaded. Download a copy to keep them if browser data is cleared." : "This browser could not save your notes. Keep this page open and download a copy before leaving."}</p>
    <button className="button secondary" onClick={download} disabled={!ready || !notes.trim()}>Download my notes</button>
  </div>;
}
