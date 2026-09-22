'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { feedback, drawFromDeck } from '../logic';
import { twentyFourBanks, oddsPuzzles, matchPuzzles } from './data';
import { equationBank, validateEquation, sameEquation, pretty, normalize, parseArithmetic, checkTwentyFour, solveTwentyFour, masksFor, moveMatch, matchTrue, matchText, matchSolutions, segmentNames } from './engine';
import './math.css';

// Timers are optional and never lock a student out of the puzzle.
function BreakTimer({ seconds = 90 }: { seconds?: number }) {
  const [enabled,setEnabled]=useState(false);
  const [remaining,setRemaining]=useState(seconds);
  const [running,setRunning]=useState(false);
  const deadline=useRef(0);
  useEffect(()=>{
    if(!running)return;
    const tick=()=>{const left=Math.max(0,Math.ceil((deadline.current-Date.now())/1000));setRemaining(left);if(left===0)setRunning(false);};
    const timer=setInterval(tick,200);
    return()=>clearInterval(timer);
  },[running]);
  return <div className="math-timer timer">
    {!enabled?<button className="control" onClick={()=>setEnabled(true)}>Add a {seconds}-second timer</button>:<>
      <span className="time" role="timer" aria-label={`${remaining} seconds remaining`}>{Math.floor(remaining/60)}:{String(remaining%60).padStart(2,'0')}</span>
      <button className="control" disabled={!remaining} onClick={()=>{if(!running)deadline.current=Date.now()+remaining*1000;setRunning(!running);}}>{running?'Pause timer':'Start timer'}</button>
      <button className="control" onClick={()=>{setRunning(false);setRemaining(seconds);}}>Reset timer</button>
      <button className="control" onClick={()=>{setRunning(false);setEnabled(false);setRemaining(seconds);}}>Hide timer</button>
      <span role="status">{remaining===0?'Time. Finish your thought—there is no lockout.':''}</span>
    </>}
  </div>;
}
function Source({ kind }: { kind:'equation'|'24'|'match'|'odds' }) {
  return <details className="source-note"><summary>Origins &amp; facilitation notes</summary>
    {kind==='equation'?<p>Inspired by <a href="https://faqs.nerdlegame.com/" target="_blank" rel="noopener noreferrer">Nerdle</a>. These are independently generated classroom puzzles, not the official daily game. Invite a reason for each guess. Multiplication and division come first; then addition and subtraction, left to right.</p>
    :kind==='24'?<p>A classroom version of the traditional make-24 arithmetic puzzle. Use all four numbers once with +, −, ×, ÷, and brackets. Try a different route after finding one. See <a href="https://nrich.maths.org/games/countdown?tab=teacher" target="_blank" rel="noopener noreferrer">NRICH’s Countdown</a> for a related target-number activity.</p>
    :kind==='match'?<p>A version of the traditional matchstick-equation puzzle, using seven-segment digits. Move one match between the digit positions shown. The operation and equals sign are fixed; rotating the whole display, adding matches, and making ≠ are outside this version’s rules. Any valid solution counts.</p>
    :<p>Original questions about fair, independent coins and dice. Ask for a prediction first, then discuss the equally likely outcomes. The highlighted grid explains the exact probability; it is not a simulation.</p>}
    <p>The timer is optional. Students can answer aloud, on a whiteboard, or here. Save activity downloads the visible puzzle and work; unrevealed hints and answers stay out.</p>
  </details>;
}
function useRound(size:number) {
  const [index,setIndex]=useState(0),[round,setRound]=useState(1);
  const deck=useRef<number[]>([]);
  const next=()=>{setIndex(drawFromDeck(Array.from({length:size},(_,i)=>i),deck.current,1,[index])[0]);setRound(r=>r+1);};
  return {index,round,next};
}
export default function MathGame({kind}:{kind:number}) {
  return kind===0?<EquationGame/>:kind===1?<TwentyFour/>:kind===2?<MatchGame/>:<OddsGame/>;
}

function EquationGame() {
  const [length,setLength]=useState<6|8>(6),[round,setRound]=useState(1);
  const bank=useMemo(()=>equationBank(length),[length]);
  const [answer,setAnswer]=useState('8+7=15');
  const [guess,setGuess]=useState(''),[guesses,setGuesses]=useState<string[]>([]);
  const [message,setMessage]=useState(''),[hint,setHint]=useState(false),[revealed,setRevealed]=useState(false);
  const [won,setWon]=useState(false);
  const deck=useRef<string[]>([]);
  const done=won||revealed||guesses.length===6;
  function newRound(size:6|8=length) {
    const pool=size===length?bank:equationBank(size);
    if(size!==length)deck.current=[];
    setLength(size);setAnswer(drawFromDeck(pool,deck.current,1,[answer])[0]);setGuess('');setGuesses([]);setMessage('');setHint(false);setRevealed(false);setWon(false);setRound(r=>r+1);
  }
  // A new visit starts with a fresh equation; no answer is fetched from a server.
  useEffect(()=>{setAnswer(bank[Math.floor(Math.random()*bank.length)]);},[]);
  function submit() {
    if(done)return;
    try {
      const valid=validateEquation(guess,length);
      if(guesses.includes(valid)){setMessage('You already tried that equation. It does not cost another guess.');return;}
      const solved=sameEquation(valid,answer);
      setGuesses([...guesses,valid]);setGuess('');setWon(solved);
      setMessage(solved?'Solved. Your equation matches the hidden calculation.':guesses.length===5?'Six guesses used. The calculation is shown below.':'Valid equation. Use the clues to narrow the next guess.');
    }catch(error){setMessage((error as Error).message);}
  }
  const answerVisible=done;
  const operators=[...new Set(answer.split('=')[0].replace(/[0-9]/g,''))].map(pretty).join(' and ');
  return <>
    <p className="rule">Find the hidden equation in six guesses. Every guess must be true. Swapping the numbers being added or multiplied is accepted; other rearrangements must match the hidden order.</p>
    <div className="math-mode" role="group" aria-label="Equation length">
      <button className="control" aria-pressed={length===6} onClick={()=>{if(length!==6)newRound(6);}}>Six characters</button>
      <button className="control" aria-pressed={length===8} onClick={()=>{if(length!==8)newRound(8);}}>Eight characters</button>
      <span>Changing length starts a new puzzle.</span>
    </div>
    <section className="board math-board" aria-label="Equation puzzle">
      <p className="eyebrow">ROUND {String(round).padStart(2,'0')} / {length} CHARACTERS</p>
      <div className="wordle-grid equation-grid" style={{gridTemplateColumns:`repeat(${length},1fr)`}} aria-label="Equation guess board">
        {Array.from({length:6},(_,row)=>{
          const text=guesses[row]||(row===guesses.length?normalize(guess):'');
          const states=guesses[row]?(sameEquation(guesses[row],answer)?Array(length).fill('correct'):feedback(answer,guesses[row])):[];
          return Array.from({length},(_,col)=><span className={`tile ${states[col]||''}`} key={`${row}-${col}`} aria-label={`Row ${row+1}, position ${col+1}: ${pretty(text[col]||'empty')} ${states[col]||''}`}>{pretty(text[col]||'')}</span>);
        })}
      </div>
      <p className="math-legend">Green: correct position · Yellow: elsewhere · Grey: absent or an extra repeat.</p>
      <form className="guess-form equation-entry" onSubmit={e=>{e.preventDefault();submit();}}>
        <input aria-label="Your equation" placeholder={length===6?'e.g. 8+7=15':'e.g. 12+34=46'} value={guess} maxLength={40} autoComplete="off" spellCheck={false} disabled={done} onChange={e=>{setGuess(e.target.value);setMessage('');}}/>
        <button className="primary" disabled={done}>Check equation</button>
      </form>
      <div className="math-keyboard" role="group" aria-label="Equation keyboard">{'1234567890+-*/='.split('').map(key=><button className="control" key={key} disabled={done} aria-label={`Enter ${pretty(key)}`} onClick={()=>setGuess(g=>normalize(g).length<length?normalize(g)+key:g)}>{pretty(key)}</button>)}<button className="control" disabled={done} onClick={()=>setGuess(g=>g.slice(0,-1))}>Delete</button></div>
      <p role="status" className="math-status">{message||'Use × or *, and ÷ or /. Invalid equations do not use a guess.'}</p>
      <div className="actions"><button className="control" onClick={()=>setHint(true)} disabled={hint||done}>Give me a hint</button><button className="control" onClick={()=>{setRevealed(true);setMessage('Answer revealed. Try a new equation when ready.');}} disabled={done}>Reveal equation</button><button className="primary" onClick={()=>newRound()}>New equation ↻</button></div>
      {hint&&!done&&<p className="math-hint">The hidden calculation uses {operators}. Its answer has {answer.split('=')[1].length} digits.</p>}
      {answerVisible&&<div className="math-explanation"><h2>{pretty(answer)}</h2><p>{won?'Your calculation is equivalent under the stated swapping rule.':'The hidden calculation was:'}</p><ol>{parseArithmetic(answer.split('=')[0]).steps.map((step,i)=><li key={i}>{step}</li>)}</ol></div>}
      <BreakTimer key={round} seconds={180}/>
    </section><Source kind="equation"/>
  </>;
}
function TwentyFour() {
  const [difficulty,setDifficulty]=useState<'warmup'|'stretch'>('warmup');
  return <><p className="rule">Make exactly 24 using all four numbers once each. Use +, −, ×, ÷, and brackets. Fractions along the way are allowed; joining digits, powers, and new numbers are not.</p>
    <div className="math-mode" role="group" aria-label="24 difficulty">{(['warmup','stretch'] as const).map(d=><button className="control" key={d} aria-pressed={difficulty===d} onClick={()=>setDifficulty(d)}>{d==='warmup'?'Standard':'A little unreasonable'}</button>)}<span>Changing level starts a new puzzle.</span></div>
    <TwentyFourRounds key={difficulty} difficulty={difficulty}/><Source kind="24"/></>;
}
function TwentyFourRounds({difficulty}:{difficulty:'warmup'|'stretch'}) {
  const bank=twentyFourBanks[difficulty];const {index,round,next}=useRound(bank.length);
  return <TwentyFourPuzzle key={round} numbers={bank[index]} round={round} next={next}/>;
}
function TwentyFourPuzzle({numbers,round,next}:{numbers:number[];round:number;next:()=>void}) {
  const [entry,setEntry]=useState(''),[status,setStatus]=useState(''),[hint,setHint]=useState(false),[show,setShow]=useState(false);
  const solution=useMemo(()=>solveTwentyFour(numbers),[numbers]);
  return <section className="board math-board" aria-label="Make 24 puzzle"><p className="eyebrow">ROUND {String(round).padStart(2,'0')} / TARGET 24</p>
    <div className="number-cards" aria-label={`Available numbers: ${numbers.join(', ')}`}>{numbers.map((n,i)=><span key={i}>{n}</span>)}</div>
    <form className="math-expression-form" onSubmit={e=>{e.preventDefault();try{setStatus(checkTwentyFour(entry,numbers));}catch(error){setStatus((error as Error).message);}}}>
      <label>Your expression<input value={entry} onChange={e=>{setEntry(e.target.value);setStatus('');}} maxLength={80} placeholder="Use the four numbers. Brackets welcome." autoComplete="off" spellCheck={false}/></label><button className="primary">Check my 24</button>
    </form><p className="math-status" role="status">{status||'There is a solution. It may not be the first route you try.'}</p>
    <div className="actions"><button className="control" disabled={hint} onClick={()=>setHint(true)}>Give me a hint</button><button className="control" disabled={show} onClick={()=>setShow(true)}>Show one solution</button><button className="primary" onClick={next}>New numbers ↻</button></div>
    {hint&&<p className="math-hint">Think 6 × 4, 8 × 3, or 12 × 2. You can also divide by a fraction to make a number bigger. One possible first step: {solution?parseArithmetic(solution).steps[0]:''}.</p>}
    {show&&solution&&<div className="math-explanation"><h2>{pretty(solution)} = 24</h2><p>One route, not the only permitted route. Your expression is checked on its own merits.</p><ol>{parseArithmetic(solution).steps.map((step,i)=><li key={i}>{step}</li>)}</ol></div>}
    <BreakTimer/></section>;
}
function MatchGame() {
  const {index,round,next}=useRound(matchPuzzles.length);
  return <><p className="rule">Move exactly one match to make a true equation. Click an occupied segment, then an empty outlined slot. Only the digits change; the operation and = stay fixed.</p><MatchRound key={round} index={index} round={round} next={next}/><Source kind="match"/></>;
}
function MatchRound({index,round,next}:{index:number;round:number;next:()=>void}) {
  const puzzle=matchPuzzles[index];const start=useMemo(()=>masksFor(puzzle),[puzzle]);
  const [masks,setMasks]=useState(start),[selected,setSelected]=useState<number|null>(null),[moved,setMoved]=useState(false),[hint,setHint]=useState(false),[reveal,setReveal]=useState(false),[status,setStatus]=useState('');
  const solution=useMemo(()=>matchSolutions(puzzle)[0],[puzzle]);
  const reset=()=>{setMasks(start);setSelected(null);setMoved(false);setReveal(false);setStatus('Move reset. Try another position.');};
  function choose(position:number) {
    if(moved||reveal)return;
    const occupied=Boolean(masks[Math.floor(position/7)]&(1<<(position%7)));
    if(occupied){setSelected(selected===position?null:position);setStatus(selected===position?'Selection cancelled.':'Match selected. Now choose an empty outlined slot.');return;}
    if(selected===null){setStatus('Choose an occupied match first.');return;}
    const updated=moveMatch(start,selected,position);setMasks(updated);setSelected(null);setMoved(true);
    setStatus(matchTrue(updated,puzzle.op)?'True equation. Exactly one match moved. That works.':'Not quite. Each shape must be a digit and the equation must be true. Reset the move to try again.');
  }
  return <section className="board math-board" aria-label="Matchstick puzzle"><p className="eyebrow">ROUND {String(round).padStart(2,'0')} / MOVE ONE MATCH</p>
    <p className="match-start">Starting equation: {matchText(start,puzzle.op)}</p>
    <div className="match-board">{masks.map((mask,digit)=><div className="match-part" key={digit}>
      {digit>0&&<span className="match-operator" aria-hidden="true">{digit===1?puzzle.op:'='}</span>}
      <div className="match-digit" role="group" aria-label={['First number','Second number','Result'][digit]}>
        {segmentNames.map((name,segment)=>{const position=digit*7+segment,lit=Boolean(mask&(1<<segment));return <button type="button" className={`match-segment segment-${segment} ${lit?'lit':'empty'} ${selected===position?'selected':''}`} key={segment} aria-label={`${['First number','Second number','Result'][digit]}: ${name}, ${lit?'occupied':'empty'}`} aria-pressed={selected===position} disabled={moved||reveal} onClick={()=>choose(position)}><span aria-hidden="true"/></button>;})}
      </div>
    </div>)}</div>
    <p className="match-reading">Current equation: {matchText(masks,puzzle.op)}</p>
    <p className="math-status" role="status">{status||'Move within one digit or between two digits. Every true one-match solution counts.'}</p>
    <div className="actions"><button className="control" onClick={reset}>Reset move</button><button className="control" disabled={hint} onClick={()=>setHint(true)}>Give me a hint</button><button className="control" disabled={reveal} onClick={()=>{setMasks(solution.masks);setSelected(null);setReveal(true);setStatus('One solution is shown below.');}}>Show one solution</button><button className="primary" onClick={next}>New puzzle ↻</button></div>
    {hint&&!reveal&&<p className="math-hint">One route starts by taking a match from the {['first number','second number','result'][Math.floor(solution.from/7)]}.</p>}
    {reveal&&<div className="math-explanation"><h2>{matchText(solution.masks,puzzle.op)}</h2><p>Take the {segmentNames[solution.from%7]} match from the {['first number','second number','result'][Math.floor(solution.from/7)]}; place it in the {segmentNames[solution.to%7]} slot of the {['first number','second number','result'][Math.floor(solution.to/7)]}. The match count stays the same.</p></div>}
    <BreakTimer/>
  </section>;
}
function OddsGame() {
  const {index,round,next}=useRound(oddsPuzzles.length);
  return <><p className="rule">Predict first. Then count the possibilities. No speed bonus for confident guessing.</p><OddsRound key={round} index={index} round={round} next={next}/><Source kind="odds"/></>;
}
function OddsRound({index,round,next}:{index:number;round:number;next:()=>void}) {
  const puzzle=oddsPuzzles[index];const [selected,setSelected]=useState(''),[show,setShow]=useState(false),[hint,setHint]=useState(false),[notes,setNotes]=useState('');
  const favorable=puzzle.outcomes.filter(o=>o.favorable).length,total=puzzle.outcomes.length;
  const correct=(choice:string)=>{const [n,d]=choice.split('/').map(Number);return n*total===d*favorable;};
  const answer=puzzle.choices.find(correct)!;
  return <section className="board math-board" aria-label="Probability puzzle"><p className="eyebrow">ROUND {String(round).padStart(2,'0')} / {puzzle.title.toUpperCase()}</p><h2 className="odds-question">{puzzle.question}</h2>
    <div className="odds-options" role="group" aria-label="Your prediction">{puzzle.choices.map(choice=><button className={`control ${show&&correct(choice)?'odds-correct':''}`} key={choice} aria-pressed={selected===choice} disabled={show} onClick={()=>setSelected(choice)}>{choice}{show&&correct(choice)?' ✓':''}</button>)}</div>
    <p className="math-prediction">{selected?`Your prediction: ${selected}`:'No prediction recorded yet.'}</p>
    <p className="math-status" role="status">{show?(selected?(correct(selected)?'Your prediction checks out. Here is why.':'A useful wrong turn. Here is what the outcomes show.'):'Here is the outcome count.'):selected?`Your prediction: ${selected}. Ready to test it?`:'Choose an answer, or take a class vote before revealing.'}</p>
    <label className="odds-notes">Your reasoning (optional)<textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} maxLength={3000} placeholder="What makes that probability seem right?"/></label>
    <div className="actions"><button className="control" disabled={hint||show} onClick={()=>setHint(true)}>Give me a hint</button><button className="primary" disabled={show} onClick={()=>setShow(true)}>Reveal &amp; explain</button><button className="control" onClick={next}>New question ↻</button></div>
    {hint&&!show&&<p className="math-hint">{puzzle.hint}</p>}
    {show&&<div className="math-explanation"><h2>{favorable} of {total} = {answer}</h2><p>{puzzle.explanation}</p><p>All boxes below are equally likely. Highlighted boxes meet the condition.{puzzle.outcomes[0].label.includes(',')?' Pairs show first die, second die.':' H = heads; T = tails.'}</p>
      <div className={`outcome-grid ${total>8?'many-outcomes':''}`} aria-label="Equally likely outcomes">{puzzle.outcomes.map(o=><span key={o.label} className={o.favorable?'favorable':''} aria-label={`${o.label}: ${o.favorable?'meets condition':'does not meet condition'}`}>{o.label}{o.favorable?' ✓':''}</span>)}</div>
    </div>}
    <BreakTimer/>
  </section>;
}
