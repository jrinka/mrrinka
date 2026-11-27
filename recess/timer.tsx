import { useEffect, useRef, useState } from 'react';

export default function Timer({ initial = 120 }: { initial?: number }) {
  const [seconds, setSeconds] = useState(initial);
  const [running, setRunning] = useState(false);
  const deadline = useRef(0);

  useEffect(() => {
    if (!running) return;
    const handle = setInterval(() => {
      const next = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setSeconds(next);
      if (!next) setRunning(false);
    }, 200);
    return () => clearInterval(handle);
  }, [running]);

  function toggle() {
    if (!running) deadline.current = Date.now() + seconds * 1000;
    setRunning(!running);
  }

  return <div className="timer">
    <span className={seconds === 0 ? 'time expired' : 'time'} role="timer">
      {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
    </span>
    <button className="control" disabled={seconds === 0} onClick={toggle}>{running ? 'Pause' : 'Start timer'}</button>
    <button className="control" onClick={() => { setRunning(false); setSeconds(initial); }}>Reset timer</button>
    <span aria-live="polite">{seconds === 0 ? 'Time’s up!' : ''}</span>
  </div>;
}
