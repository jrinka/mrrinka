'use client';
import {useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogTitle, DialogDescription} from './components/ui/dialog';
import {words, anagrams} from './challenges';
import {drawFromBank} from './decks';
import {guessLetter, hangmanStatus, maxMisses, newHangmanRound} from './hangman-logic';
import './hangman.css';

const wordBank = [...new Set([...words, ...anagrams.filter(word => word.length <= 12), ...'BALLOON CHAPTER MYSTERY JOURNEY WHISPER RHYTHM PUZZLE LANGUAGE METAPHOR DIALOGUE SYMBOL LIBRARY HORIZON ECHO SHADOW CURIOSITY'.split(' ')])];

export default function Hangman() {
  const [round, setRound] = useState(() => newHangmanRound(drawFromBank('hangman', wordBank)[0]));
  const [setup, setSetup] = useState(false);
  const [custom, setCustom] = useState('');
  const [error, setError] = useState('');
  const {misses, won, done} = hangmanStatus(round);
  const visibleWord = [...round.answer].map(letter => done || round.guesses.includes(letter) ? letter : '_');
  const status = won ? 'Solved! Nice work.' : round.revealed ? `The word was ${round.answer}.` : done ? `Out of guesses. The word was ${round.answer}.` : `${maxMisses - misses.length} ${maxMisses - misses.length === 1 ? 'miss' : 'misses'} left.`;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (setup || event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
      const target = event.target;
      if (target instanceof Element && target.closest('input, textarea, select, [contenteditable], [role="dialog"]')) return;
      if (!/^[a-z]$/i.test(event.key)) return;
      event.preventDefault();
      setRound(current => guessLetter(current, event.key));
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setup]);

  return <>
    <div className="toolbar">
      <p>Guess one letter at a time. Find the word before six misses. Click a letter or use your keyboard.</p>
      <button className="control" onClick={() => {setError(''); setSetup(true);}}>✎ Teacher setup</button>
    </div>
    <Dialog open={setup} onOpenChange={open => {setSetup(open); if (!open) setCustom('');}}>
      <DialogContent className="teacher-dialog">
        <DialogTitle>Teacher setup</DialogTitle>
        <DialogDescription>Set a word before projecting. The word stays masked; applying it starts a new round.</DialogDescription>
        <form onSubmit={event => {
          event.preventDefault();
          const answer = custom.trim().toUpperCase();
          if (!/^[A-Z]{4,12}$/.test(answer)) {setError('Use 4–12 letters, with no spaces or punctuation.'); return;}
          setRound(newHangmanRound(answer)); setCustom(''); setError(''); setSetup(false);
        }}>
          <label>Secret word (4–12 letters)<input type="password" autoComplete="off" value={custom} onChange={event => setCustom(event.target.value)} /></label>
          <p role="status">{error}</p>
          <button className="primary" type="submit">Use my word</button>
        </form>
        <button className="control" onClick={() => {setSetup(false); setCustom('');}}>Cancel</button>
      </DialogContent>
    </Dialog>
    <div className="board hangman-board">
      <div className="hangman-layout">
        <svg className="hangman-drawing" viewBox="0 0 220 230" role="img" aria-label={`Hangman drawing: ${misses.length} of ${maxMisses} misses`}>
          <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M25 215H195M55 215V20H145V47M55 55L90 20" />
            {misses.length >= 1 && <circle cx="145" cy="70" r="23" />}
            {misses.length >= 2 && <path d="M145 93V155" />}
            {misses.length >= 3 && <path d="M145 108L112 135" />}
            {misses.length >= 4 && <path d="M145 108L178 135" />}
            {misses.length >= 5 && <path d="M145 155L116 191" />}
            {misses.length >= 6 && <path d="M145 155L174 191" />}
          </g>
        </svg>
        <div className="hangman-puzzle">
          <p className="eyebrow">{round.answer.length} LETTERS / SIX CHANCES</p>
          <p className="hangman-word" aria-label={`Word: ${visibleWord.join(' ')}`}>
            {visibleWord.map((letter, index) => <span key={index} className={done && !round.guesses.includes(letter) ? 'hangman-revealed' : ''}>{letter}</span>)}
          </p>
          <p className="hangman-status" role="status" aria-atomic="true">{status}</p>
          <p className="hangman-misses">Missed letters: <strong>{misses.join(' · ') || 'None yet'}</strong></p>
        </div>
      </div>
      <div className="hangman-keyboard" role="group" aria-label="Guess a letter">
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => {
          const tried = round.guesses.includes(letter);
          const correct = tried && round.answer.includes(letter);
          return <button key={letter} className={tried ? correct ? 'hangman-hit' : 'hangman-miss' : ''} disabled={done || tried} aria-label={`${letter}${tried ? correct ? ', in the word' : ', not in the word' : ''}`} onClick={() => setRound(current => guessLetter(current, letter))}>{letter}<span aria-hidden="true">{tried ? correct ? '✓' : '×' : ''}</span></button>;
        })}
      </div>
      <div className="actions">
        <button className="primary" onClick={() => setRound(newHangmanRound(drawFromBank('hangman', wordBank, 1, [round.answer])[0]))}>New word ↻</button>
        <button className="control" disabled={done} onClick={() => setRound(current => ({...current, revealed: true}))}>Reveal answer</button>
      </div>
    </div>
  </>;
}
