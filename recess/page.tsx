'use client';
import {useState,useEffect,useRef} from 'react';
import {flushSync} from 'react-dom';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/recess/components/ui/dialog';
import banks from './banks.json';
import {feedback,pick,shuffle,canBuild} from './logic';
import {drawFromBank} from './decks';
import {drawWordleWord} from './wordle-deck';
import {scatterLetters,drawScatterCategories} from './scatter';
import MiniGame from './mini-games';
import Hangman from './hangman';
import WordLadder from './word-ladder';
import Timer from './timer';
import MathGame from './math/games';
import {mathGames} from './math/data';
import ActivityExport from './activity-export';
import {miniGames} from './mini-game-data';
import {words,anagrams,definitions,debates} from './challenges';

const games = ['Wordle','Red Letter Yellow Letter','Scattergories','Anagram Race','Word Ladder','Reverse Dictionary','Hangman','Quick Debate',...miniGames.map(game=>game.name),...mathGames.map(game=>game.name)];
export default function Home() {
  const [active, setActive] = useState<number | null>(null);
  const [present, setPresent] = useState(false);
  const gameHeading = useRef<HTMLHeadingElement>(null);
  const previousGame = useRef<number | null>(null);

  useEffect(() => {
    if (active !== null) {
      previousGame.current = active;
      window.scrollTo(0, 0);
      gameHeading.current?.focus({ preventScroll: true });
    } else if (previousGame.current !== null) {
      document.getElementById(`game-card-${previousGame.current}`)?.focus();
    }
  }, [active]);
useEffect(()=>{const context=(document as Document & {modelContext?:{registerTool:(tool:unknown,options:unknown)=>void}}).modelContext;if(!context)return;const lifecycle=new AbortController();try{context.registerTool({name:'open_classroom_game',description:'Open one of the sixteen classroom games.',inputSchema:{type:'object',properties:{game:{type:'string',enum:games}},required:['game'],additionalProperties:false},annotations:{readOnlyHint:false},execute:(input:unknown)=>{const name=(input as {game?:string})?.game;const index=games.indexOf(name||'');if(index<0)throw new Error('Choose a listed game.');flushSync(()=>setActive(index));return {game:games[index],opened:true};}},{signal:lifecycle.signal});}catch{}return ()=>lifecycle.abort();},[]);
useEffect(()=>{const stop=(e:KeyboardEvent)=>{if(e.key==='Escape')setPresent(false)};window.addEventListener('keydown',stop);return()=>window.removeEventListener('keydown',stop)},[]);
if(active!==null)return <main className={'shell play-shell '+(present?'present':'')}><header><button className="back" onClick={()=>{setActive(null);setPresent(false)}}>← All games</button><span className="brand">brain break <span>✳</span></span><button className="control" onClick={()=>setPresent(!present)}>{present?'Exit presentation':'⛶ Present'}</button></header><div className="play-title"><div><p className="eyebrow">CLASSROOM PLAY / {String(active+1).padStart(2,'0')}</p><h1 ref={gameHeading} tabIndex={-1}>{games[active]}</h1></div><ActivityExport key={active} title={games[active]}/></div><Game key={active} id={active} onBack={()=>{setActive(null);setPresent(false)}}/><footer>{active>=12?'Download your activity before starting a new round to keep a copy.':active>=8?'Use a whiteboard desk or paper.':'Students answer aloud or on paper.'}<span>{present?'Press Esc to exit presentation.':'Choose Present for a larger game board.'}</span></footer></main>;
return <main className="shell"><header><a className="brand" href="/recess">b<span>✳</span> / brain break</a><a className="eyebrow home-link" href="/">← MR. RINKA’S CLASS</a></header><section className="intro"><div><h1 className="site-wordmark">Brain Break<span aria-hidden="true">_</span></h1><p>Word games, drawing challenges, and number puzzles for the class.</p></div><figure className="recess-archive-plate"><img src="/archive/blind-mans-buff-cole.jpg" alt="An eighteenth-century engraving of young men and women playing blind man’s buff outdoors" width={1200} height={765}/><span className="recess-archive-label">BLUFF</span><figcaption><a href="https://wellcomecollection.org/works/e9tvys4h" title="Blind man’s buff. Benjamin Cole after Francis Hayman, 1753. Wellcome Collection. Public Domain Mark." aria-label="Blind man’s buff, Benjamin Cole after Francis Hayman, 1753. Wellcome Collection. Public Domain Mark.">WELLCOME</a></figcaption></figure></section>
<div className="section-heading"><h2>Membean Pays Off</h2><span>Wordplay and such.</span></div><section className="game-grid" aria-label="Word games">{games.slice(0,8).map((g,i)=><button className={'game-card color-'+i%4} id={`game-card-${i}`} key={g} onClick={()=>setActive(i)}><span className="card-top">{String(i+1).padStart(2,'0')}<span>↗</span></span><div className="card-mark">{['W _ R D _','R / Y','A → Z','RE: MIX','COLD → WARM','? → !','_ _ _ _ _','THIS / THAT'][i]}</div><h3>{g}</h3><p>{['One hidden word. Six chances. Your vocabulary.','One category. Two letters. Think fast.','Same letter. Different answers.','One big word. How many small ones?','Change one letter per move. Choose from three levels.','A definition with a missing word.','Guess the letters. Save the stick figure.','Choose a side. Make your case.'][i]}</p><span className="card-footer">{i===0?'3–5':'2–3'} MIN <span>PLAY →</span></span></button>)}</section>
<div className="section-heading drawing-games-heading"><h2>Mom Says I'm Talented</h2><span>Drawing Breaks. Marker or screen.</span></div>
<section className="game-grid new-game-grid" aria-label="Drawing and observation games">{miniGames.map((game,i)=><button className={'game-card creative-card color-'+i} id={`game-card-${i+8}`} key={game.name} onClick={()=>setActive(i+8)}><span className="card-top">{String(i+9).padStart(2,'0')}<span>↗</span></span><div className="card-mark">{game.mark}</div><h3>{game.name}</h3><p>{game.description}</p><span className="card-footer">{i===3?'45':'60'} SEC + SHARE <span>PLAY →</span></span></button>)}</section>
<div className="section-heading math-section-heading"><h2>The Numbers Department</h2><span>For those who find metaphors insufficiently measurable.</span></div>
<section className="game-grid" aria-label="Math puzzles and brain breaks">{mathGames.map((game,i)=><button className="game-card math-card" id={`game-card-${i+12}`} key={game.name} onClick={()=>setActive(i+12)}><span className="card-top">{String(i+13).padStart(2,'0')}<span>↗</span></span><div className="card-mark">{game.mark}</div><h3>{game.name}</h3><p>{game.description}</p><span className="card-footer">{game.time}<span>PLAY →</span></span></button>)}</section><footer>Let me know if you have ideas for things I can add or improve. I'm open to suggestions that don't cost me money.<span>Made for the big screen.</span></footer></main>}

function Edit({title,description,children}:{title:string;description?:string;children:React.ReactNode}){const [open,setOpen]=useState(false);return <><button className="control" onClick={()=>setOpen(true)}>✎ {title}</button><Dialog open={open} onOpenChange={setOpen}><DialogContent className="teacher-dialog"><DialogTitle>{title}</DialogTitle><DialogDescription>{description||'Changes apply to this session. Close this panel to return to the game.'}</DialogDescription>{children}<button className="primary" onClick={()=>setOpen(false)}>Done</button></DialogContent></Dialog></>}
function Game({id,onBack}:{id:number;onBack:()=>void}){if(id>=12)return <MathGame kind={id-12}/>;if(id>=8)return <MiniGame kind={id-8} onBack={onBack}/>;if(id===0)return <Wordle/>;if(id===1)return <RedYellow/>;if(id===2)return <Scatter/>;if(id===4)return <WordLadder/>;if(id===6)return <Hangman/>;return <Challenge id={id}/>}
function Wordle(){const [answer,setAnswer]=useState(()=>drawWordleWord());const [draft,setDraft]=useState('');const [guesses,setGuesses]=useState<string[]>([]);const [guess,setGuess]=useState('');const [message,setMessage]=useState('');const [revealed,setRevealed]=useState(false);const [custom,setCustom]=useState('');const [bank,setBank]=useState(words.join('\n'));const [notice,setNotice]=useState('');const [wordIndex,setWordIndex]=useState(0);const done=guesses.includes(answer)||guesses.length>=6||revealed;
const reset=(word:string)=>{setAnswer(word);setGuesses([]);setGuess('');setMessage('');setRevealed(false);setWordIndex(v=>v+1)};
function submit(){if(!answer||done)return;if(!new RegExp(`^[A-Z]{${answer.length}}$`).test(guess)){setMessage(`Enter ${answer.length} letters.`);return}if(guesses.includes(guess)){setMessage('You already tried that word.');return}setGuesses([...guesses,guess]);setGuess('');setMessage(guess===answer?'Solved! Nice work.':guesses.length===5?`The word was ${answer}.`:'');}
function random(){const list=bank.split(/[\s,]+/).map(w=>w.toUpperCase()).filter(w=>/^[A-Z]{4,8}$/.test(w));if(!list.length){setNotice('Add at least one word of 4–8 letters.');return}reset(drawWordleWord(list,[answer]));setNotice('New hidden word ready.');}
return <><div className="toolbar"><p>Find the hidden {answer.length||5}-letter word in six guesses.</p><Edit title="Teacher setup" description="Use before projecting. The secret stays masked. A new word clears the current board."><label>Secret word (4–8 letters)<input type="password" autoComplete="off" value={custom} onChange={e=>setCustom(e.target.value)} placeholder="Enter your word"/></label><button className="primary" onClick={()=>{const w=custom.trim().toUpperCase();if(!/^[A-Z]{4,8}$/.test(w)){setNotice('Use 4–8 letters, with no spaces.');return}reset(w);setCustom('');setNotice('Your hidden word is ready.')}}>Use my word</button><label>Word bank — one per line<textarea value={bank} onChange={e=>{setBank(e.target.value)}} rows={7}/></label><button className="control" onClick={random}>Choose from bank</button><p role="status">{notice}</p></Edit></div><div className="board wordle-board"><div className="wordle-grid" style={{gridTemplateColumns:`repeat(${answer.length||5},1fr)`}} aria-label="Wordle board">{Array.from({length:6},(_,row)=>Array.from({length:answer.length||5},(_,col)=>{const letter=(guesses[row]||(row===guesses.length?guess:''))[col]||'';const state=guesses[row]?feedback(answer,guesses[row])[col]:'';return <span key={row+'-'+col} className={'tile '+state} aria-label={`Row ${row+1}, position ${col+1}: ${letter||'empty'} ${state}`}>{letter}</span>}))}</div><div className="legend"><span>✓ Correct position</span><span>↔ In the word</span><span>× Not in the word</span></div><form className="guess-form" onSubmit={e=>{e.preventDefault();submit()}}><input aria-label="Class guess" value={guess} onChange={e=>{setGuess(e.target.value.toUpperCase().replace(/[^A-Z]/g,'').slice(0,answer.length));setMessage('')}} maxLength={answer.length} disabled={done} autoComplete="off" placeholder="Class guess"/><button className="primary" disabled={done||!answer}>Try word</button></form><p className="status" role="status">{message|| (revealed?`The word was ${answer}.`:'Teacher accepts real words; no dictionary restriction.')}</p><div className="keyboard">{['QWERTYUIOP','ASDFGHJKL','ZXCVBNM'].map(row=><div key={row}>{row.split('').map(c=>{let state='';for(const g of guesses){g.split('').forEach((letter,i)=>{if(letter!==c)return;const f=feedback(answer,g)[i];if(f==='correct'||f==='present'&&state!=='correct'||!state)state=f})}return <button key={c} className={state} disabled={done} onClick={()=>setGuess(v=>(v+c).slice(0,answer.length))}>{c}</button>})}</div>)}<button className="control" disabled={done} onClick={()=>setGuess(g=>g.slice(0,-1))}>⌫ Delete</button></div><div className="actions"><button className="control" onClick={random}>New word</button><button className="control" disabled={done} onClick={()=>{setRevealed(true);setMessage(`The word was ${answer}.`)}}>Reveal answer</button></div></div></>}
function RedYellow(){const [initial]=useState(()=>{const cat=drawFromBank('ryl-categories',banks.ryl)[0];const word=pick(cat.examples).toUpperCase();return {cat,yellow:word[0],red:pick('ABCDEGILMNOPRSTU'.split('').filter(l=>!word.includes(l)))};});const [cat,setCat]=useState(initial.cat);const [yellow,setYellow]=useState(initial.yellow);const [red,setRed]=useState(initial.red);const [example,setExample]=useState('');const [round,setRound]=useState(1);function next(){const c=drawFromBank('ryl-categories',banks.ryl,1,[cat])[0];const word=pick(c.examples);const y=word[0].toUpperCase();const r=pick('ABCDEGILMNOPRSTU'.split('').filter(l=>!word.toUpperCase().includes(l)));setCat(c);setYellow(y);setRed(r);setExample('');setRound(n=>n+1)}function change(which:string){setExample('');if(which==='category'){const pool=banks.ryl.filter(c=>c.name!==cat.name&&c.examples.some(w=>w.startsWith(yellow.toLowerCase())&&!w.includes(red.toLowerCase())));if(pool.length)setCat(drawFromBank('ryl-swap-'+yellow+'-'+red,pool,1,[cat])[0]);else setExample('No alternative in the bank. Try a new round.');}if(which==='yellow'){const pool=[...new Set(cat.examples.filter(w=>!w.includes(red.toLowerCase())).map(w=>w[0].toUpperCase()))].filter(l=>l!==yellow);if(pool.length)setYellow(pick(pool));else setExample('No alternative in the bank. Try a new round.');}if(which==='red'){const pool='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l=>l!==red&&l!==yellow&&cat.examples.some(w=>w.startsWith(yellow.toLowerCase())&&!w.includes(l.toLowerCase())));if(pool.length)setRed(pick(pool));}}
return <><p className="rule">Fit the category. Start with yellow. Don’t use red anywhere.</p><div className="board"><div className="round-label">ROUND {round} <span>Click a card to replace only that card.</span></div><div className="ryl-grid"><button className="ryl-category" onClick={()=>change('category')}><small>CATEGORY ↻</small><strong>{cat.name}</strong></button><button className="ryl-yellow" onClick={()=>change('yellow')}><small>STARTS WITH ↻</small><strong>{yellow}</strong></button><button className="ryl-red" onClick={()=>change('red')}><small>DOESN’T CONTAIN ↻</small><strong>{red}</strong></button></div><div className="actions"><button className="primary" onClick={next}>New round ↻</button><button className="control" onClick={()=>setExample('Example: '+pick(cat.examples.filter(w=>w.startsWith(yellow.toLowerCase())&&!w.includes(red.toLowerCase()))))}>Show example</button></div><p className="reveal" aria-live="polite">{example}</p><Timer initial={60}/></div></>}
function Scatter(){const [cats,setCats]=useState(()=>drawScatterCategories());const [letter,setLetter]=useState(()=>drawFromBank('scatter-letters',scatterLetters)[0]);const [round,setRound]=useState(0);const [draft,setDraft]=useState(cats.join('\n'));const [error,setError]=useState('');const [answers,setAnswers]=useState('');const [scores,setScores]=useState([0,0,0]);function categories(){return drawScatterCategories(cats)}function next(){const c=categories();setCats(c);setDraft(c.join('\n'));setLetter(drawFromBank('scatter-letters',scatterLetters,1,[letter])[0]);setRound(r=>r+1);setAnswers('')}return <><div className="toolbar"><p>One answer per category, starting with the letter. Unique valid answers earn 1 point.</p><Edit title="Edit categories"><label>One category per line (1–12)<textarea rows={12} value={draft} onChange={e=>setDraft(e.target.value)}/></label><button className="primary" onClick={()=>{const c=draft.split('\n').map(s=>s.trim()).filter(Boolean);if(!c.length||c.length>12){setError('Enter 1–12 categories.');return}setCats(c);setError('Categories updated.')}}>Apply categories</button><p role="status">{error}</p></Edit></div><div className="board"><div className="scatter-layout"><div className="scatter-side"><span className="eyebrow">YOUR LETTER</span><button className="big-letter" aria-label="Roll a new letter" onClick={()=>setLetter(drawFromBank('scatter-letters',scatterLetters,1,[letter])[0])}>{letter}</button><button className="control" onClick={()=>setLetter(drawFromBank('scatter-letters',scatterLetters,1,[letter])[0])}>Roll letter ↻</button><Timer key={round}/></div><ol className="categories">{cats.map((c,i)=><li key={i}><span>{String(i+1).padStart(2,'0')}</span>{c}</li>)}</ol></div><div className="actions"><button className="primary" onClick={next}>New round ↻</button><button className="control" onClick={()=>{const c=categories();setCats(c);setDraft(c.join('\n'))}}>New categories</button></div><div className="scoring">{scores.map((s,i)=><label key={i}>Team {i+1}<input aria-label={'Team '+(i+1)+' score'} type="number" min={0} value={s} onChange={e=>setScores(a=>a.map((n,j)=>j===i?Math.max(0,Number(e.target.value)):n))}/></label>)}</div><label className="class-answers">Class answers<textarea value={answers} onChange={e=>setAnswers(e.target.value)} placeholder="Collect answers here after the timer ends…"/></label></div></>}
function Challenge({ id }: { id: number }) {
  const list = id === 3 ? anagrams : id === 5 ? definitions : debates;
  const indices = list.map((_, i) => i);
  const [index, setIndex] = useState(() => drawFromBank('challenge-' + id, indices)[0]);
  const [round, setRound] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [entry, setEntry] = useState('');
  const [accepted, setAccepted] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [custom, setCustom] = useState('');
  const [override, setOverride] = useState('');
  const source = override || anagrams[index % anagrams.length];
  const definition = definitions[index % definitions.length];

  function next() {
    setIndex(drawFromBank('challenge-' + id, indices, 1, [index])[0]);
    setRound(r => r + 1);
    setReveal(false);
    setEntry('');
    setAccepted([]);
    setMessage('');
    setOverride('');
  }

  function submitAnagram() {
    const value = entry.trim().toUpperCase();
    if (!/^[A-Z]{3,}$/.test(value) || !canBuild(source, value) || value === source) {
      setMessage('Use 3+ letters from the source word, without reusing extra letters.');
      return;
    }
    if (accepted.includes(value)) {
      setMessage('That word is already on the board.');
      return;
    }
    setAccepted([...accepted, value]);
    setEntry('');
    setMessage('Teacher checks that this is a real word.');
  }

  function applyPrompt() {
    const value = custom.trim();
    if (!value || (id === 3 && !/^[a-zA-Z]{6,24}$/.test(value))) {
      setMessage('Enter a valid prompt. Source words need 6–24 letters.');
      return;
    }
    setOverride(id === 3 ? value.toUpperCase() : value);
    setAccepted([]);
    setMessage('Prompt applied.');
    setReveal(false);
  }

  return <>
    <div className="toolbar">
      <p>{id === 3 ? 'Make smaller words from the source. Each letter can be used only as often as it appears.' :
        id === 5 ? 'Read the definition. Name the word.' : 'Choose a side. Take 30 seconds to prepare, then defend it with a reason.'}</p>
      {id !== 5 && <Edit title="Custom prompt">
        <label>{id === 3 ? 'Source word (6–24 letters)' : 'Your prompt'}
          <input value={custom} onChange={e => setCustom(e.target.value)} />
        </label>
        <button className="primary" onClick={applyPrompt}>Apply prompt</button>
        <p role="status">{message}</p>
      </Edit>}
    </div>
    <div className="board challenge-board">
      <p className="eyebrow">{id === 3 ? 'YOUR LETTERS' : id === 5 ? 'WHAT’S THE WORD?' : 'MAKE YOUR CASE'}</p>
      {id === 3 ? <h2 className="source-word">{source}</h2> :
        <h2 className="prompt">{id === 5 ? definition[1] : override || String(list[index])}</h2>}
      {id === 5 && <p className="hint">{definition[0].length} letters {reveal ? '' : '· First letter: ' + definition[0][0]}</p>}
      {id === 3 && <>
        <form className="guess-form" onSubmit={e => { e.preventDefault(); submitAnagram(); }}>
          <input aria-label="A smaller word" value={entry} onChange={e => setEntry(e.target.value)} placeholder="A smaller word" />
          <button className="primary">Add word</button>
        </form>
        <p className="status" role="status">{message || 'Real words only. The teacher makes the final call.'}</p>
        <div className="word-trail">{accepted.map(word => <button key={word} title="Remove word"
          onClick={() => setAccepted(a => a.filter(v => v !== word))}>{word} ×</button>)}</div>
      </>}
      {reveal && id === 5 && <p className="reveal" aria-live="polite">{definition[0]}</p>}
      <div className="actions">
        <button className="primary" onClick={next}>Next challenge ↻</button>
        {id === 5 && <button className="control" onClick={() => setReveal(!reveal)}>{reveal ? 'Hide answer' : 'Reveal word'}</button>}
      </div>
      <Timer key={round} initial={id === 7 ? 30 : 60} />
    </div>
  </>;
}
