"use client";

import { useRef, useState } from 'react';
import Link from 'next/link';
import { categories, type Category, type Term } from '@/lib/terminology';
import { flashcardTerms, shuffleCards, type TermCourse } from '@/lib/term-flashcards';
import styles from './term-flashcards.module.css';

export default function TermFlashcards({initialCourse = "language-literature"}:{initialCourse?:TermCourse}) {
  const [course, setCourse] = useState<TermCourse>(initialCourse);
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [reverse, setReverse] = useState(false);
  const [deck, setDeck] = useState<Term[] | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [again, setAgain] = useState<Term[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const available = flashcardTerms(course, category);
  const card = deck?.[index];
  function reset() { setDeck(null); setIndex(0); setRevealed(false); setAgain([]); }
  function start(cards: Term[]) {
    setDeck(shuffleCards(cards)); setIndex(0); setRevealed(false); setAgain([]);
    requestAnimationFrame(() => heading.current?.focus());
  }
  function answer(revisit: boolean) {
    if (!card) return;
    if (revisit) setAgain(previous => [...previous, card]);
    setIndex(previous => previous + 1); setRevealed(false);
    requestAnimationFrame(() => heading.current?.focus());
  }
  return <section className={styles.practice} aria-label="Term flashcards">
    <div className={styles.settings}>
      <label>Practice course<select aria-label="Practice course" value={course} onChange={e => { setCourse(e.target.value as TermCourse); reset(); }}><option value="language-literature">Language &amp; Literature</option><option value="literature">Literature</option></select></label>
      <label>Focus<select aria-label="Focus" value={category} onChange={e => { setCategory(e.target.value as Category | 'all'); reset(); }}><option value="all">All terms</option>{categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
      <label>Show first<select aria-label="Show first" value={reverse ? 'definition' : 'term'} onChange={e => { setReverse(e.target.value === 'definition'); reset(); }}><option value="term">Term → explain it</option><option value="definition">Definition → name it</option></select></label>
    </div>
    <p className={styles.hint}>Literature includes visual terms for graphic novels. It leaves out entries focused on branding, target audiences and photographic focus. These are practice selections, not official course boundaries.</p>
    <p className={styles.hint}>Changing a setting starts a new set. Progress lasts until you leave or reload this page.</p>
    {!deck ? <div className={styles.card}><span className="mono">{available.length} TERMS</span><h2>Recall it, then check it.</h2><p>Explain the term in your own words before revealing the answer. Try to think of a moment from a text you know.</p><button className="button" disabled={!available.length} onClick={() => start(available)}>Start flashcards</button></div> : card ? <>
      <p className="mono" role="status">Card {index + 1} of {deck.length} · {again.length} to revisit</p>
      <article className={styles.card}>
        <span className="mono">{reverse ? 'NAME THE TERM' : 'EXPLAIN THE TERM'}</span>
        <h2 ref={heading} tabIndex={-1}>{reverse ? card.readings[0].definition : card.term}</h2>
        {!revealed ? <button className="button" onClick={() => setRevealed(true)}>Reveal answer</button> : <div>
          {reverse && <h3>{card.term}</h3>}
          {card.readings.map(reading => <div key={reading.context} className={styles.reading}>
            {card.readings.length > 1 && <span className="mono">{reading.context}</span>}
            <p>{reading.definition}</p>
            {reading.example && <p><strong>Example:</strong> {reading.example}</p>}
            <p><strong>Think about its use:</strong> {reading.analysis}</p>
          </div>)}
          <p className={styles.hint}>What could this choice do in a text you know? Its effect depends on the context.</p>
          <Link href={`/resources/analysis-reference#${card.id}`} target="_blank" rel="noopener noreferrer">Open this term in the reference ↗</Link>
        </div>}
      </article>
      {revealed && <div className={styles.actions}><button className="button secondary" onClick={() => answer(true)}>Revisit this</button><button className="button" onClick={() => answer(false)}>Got it</button></div>}
      <button className={styles.restart} onClick={reset}>Choose a new set</button>
    </> : <div className={styles.card}><h2 ref={heading} tabIndex={-1}>Set complete</h2><p>You marked {deck.length - again.length} of {deck.length} terms as familiar. {again.length ? `${again.length} are ready to revisit.` : 'Try applying a few to a passage you know.'}</p><div className={styles.actions}>{again.length > 0 && <button className="button" onClick={() => start(again)}>Revisit {again.length} {again.length === 1 ? 'term' : 'terms'}</button>}<button className="button secondary" onClick={() => start(available)}>Shuffle a fresh set</button><button className="button secondary" onClick={reset}>Change settings</button></div><p><Link href="/practice/what-changes">Put choices into context with What changes? →</Link></p></div>}
  </section>;
}
