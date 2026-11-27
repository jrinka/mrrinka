import { useRef, useState, type FormEvent } from 'react';
import Timer from './timer';
import { drawLadder, ladderLevels, ladderStepError, type LadderLevel, type LadderPuzzle } from './word-ladders';
import './word-ladder.css';

export default function WordLadder() {
  const [round, setRound] = useState(() => ({ level: 'Classic' as LadderLevel, puzzle: drawLadder('Classic') }));

  function deal(level: LadderLevel) {
    setRound({ level, puzzle: drawLadder(level, round.puzzle) });
  }

  return <>
    <div className="ladder-toolbar">
      <p className="rule">Change one letter per move. Use a real word every time.</p>
      <div className="ladder-levels" role="group" aria-label="Word Ladder difficulty">
        <span>Difficulty</span>
        {ladderLevels.map(level => (
          <button key={level} className="control" aria-pressed={level === round.level}
            onClick={() => { if (level !== round.level) deal(level); }}>
            {level}
          </button>
        ))}
      </div>
    </div>
    <LadderBoard key={round.puzzle.path.join(' ')} level={round.level} puzzle={round.puzzle}
      next={() => deal(round.level)} />
  </>;
}

function LadderBoard({ level, puzzle, next }: { level: LadderLevel; puzzle: LadderPuzzle; next: () => void }) {
  const { path, checkpoint } = puzzle;
  const start = path[0];
  const target = path[path.length - 1];
  const [trail, setTrail] = useState([start]);
  const [entry, setEntry] = useState('');
  const [message, setMessage] = useState('');
  const [exampleMoves, setExampleMoves] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const moves = trail.length - 1;
  const goal = path.length - 1;
  const solved = trail[moves] === target;
  const atCheckpoint = checkpoint !== undefined && trail.includes(checkpoint);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (solved) return;
    const word = entry.trim().toUpperCase();
    const error = ladderStepError(puzzle, trail, word);
    if (error) {
      setMessage(error);
      input.current?.focus();
      return;
    }
    setTrail([...trail, word]);
    setEntry('');
    setMessage(word === checkpoint ? `Checkpoint reached. Now head for ${target}.` : '');
    input.current?.focus();
  }

  function undo() {
    setTrail(trail.slice(0, -1));
    setEntry('');
    setMessage('');
    input.current?.focus();
  }

  const count = `${moves} ${moves === 1 ? 'move' : 'moves'}`;
  return <section className="board challenge-board ladder-board" aria-label={`${level} ladder`}>
    <p className="eyebrow">{level.toUpperCase()} · {start.length} LETTERS</p>
    <h2 className="ladder-target" aria-label={`${start} to ${target}`}>{start} <span aria-hidden="true">→</span> {target}</h2>
    {checkpoint && <p className={'ladder-checkpoint' + (atCheckpoint ? ' reached' : '')}>
      {atCheckpoint ? <>Checkpoint <strong>{checkpoint}</strong> reached ✓</> :
        <>Checkpoint · Reach <strong>{checkpoint}</strong> before <strong>{target}</strong>.</>}
    </p>}
    <p className="ladder-count">{count}{level !== 'Classic' && <> · Aim for {goal} moves or fewer</>}</p>
    <div className="word-trail" role="group" aria-label="Class ladder">
      {trail.map(word => <span key={word}>{word}</span>)}
    </div>
    <form className="guess-form" onSubmit={submit}>
      <input ref={input} aria-label="Next word in ladder" value={entry}
        placeholder="Next word" autoComplete="off" autoCapitalize="characters" spellCheck={false}
        disabled={solved} onChange={event => setEntry(event.target.value)} />
      <button className="primary" disabled={solved}>Add word</button>
    </form>
    <p className="status" role="status">{solved ? `Reached ${target} in ${count}!` :
      message || 'The teacher makes the final call on words.'}</p>
    {moves > 0 && <button className="control" onClick={undo}>Undo step</button>}
    <div className="actions">
      <button className="primary" onClick={next}>Next ladder</button>
      {exampleMoves < goal && <button className="control" onClick={() => setExampleMoves(n => Math.min(n + 1, goal))}>
        {exampleMoves === 0 ? 'Reveal first move' : 'Reveal one more move'}
      </button>}
      {exampleMoves < goal && <button className="control" onClick={() => setExampleMoves(goal)}>Show a solution</button>}
      {exampleMoves > 0 && <button className="control" onClick={() => setExampleMoves(0)}>Hide example</button>}
    </div>
    <div aria-live="polite">{exampleMoves > 0 && <p className="reveal ladder-example">
      <strong>Example route</strong> {path.slice(0, exampleMoves + 1).join(' → ')}{exampleMoves < goal && ' → …'}
    </p>}</div>
    <Timer initial={level === 'Classic' ? 60 : level === 'Stretch' ? 90 : 120} />
  </section>;
}
