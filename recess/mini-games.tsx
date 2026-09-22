'use client';

import {useCallback,useEffect,useRef,useState} from 'react';
import DrawingPad from './drawing-pad';
import {ToggleGroup,ToggleGroupItem} from '@/recess/components/ui/toggle-group';
import {KeyRound,Umbrella,Apple,Clock,Scissors,Coffee,Fish,Crown,BookOpen,Lamp,Utensils,Leaf,Bell,Backpack,Carrot,Briefcase,Bike,Camera,Cloud,TrafficCone,Paintbrush,Rocket,Snail,Trophy,Banana,Glasses,Flower2,Mail,HardHat,Guitar,Ruler,Calculator} from 'lucide-react';
import {masterpieces,squiggles,blobPrompts,inventionSubjects,inventionPurposes,memoryObjects,drawingPhases,memoryPhases,clockState,type Phase} from './mini-game-data';

const objectIcons = {key:KeyRound,umbrella:Umbrella,apple:Apple,clock:Clock,scissors:Scissors,cup:Coffee,fish:Fish,crown:Crown,book:BookOpen,lamp:Lamp,spoon:Utensils,leaf:Leaf,bell:Bell,backpack:Backpack,carrot:Carrot,briefcase:Briefcase,bike:Bike,camera:Camera,cloud:Cloud,cone:TrafficCone,brush:Paintbrush,rocket:Rocket,snail:Snail,trophy:Trophy,banana:Banana,glasses:Glasses,flower:Flower2,mail:Mail,hat:HardHat,guitar:Guitar,ruler:Ruler,calculator:Calculator};

function shuffled<T,>(items:T[]):T[]{const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}

function useRoundClock(phases:Phase[]) {
  const [elapsed,setElapsed]=useState(0);
  const [running,setRunning]=useState(false);
  const started=useRef(0);
  const carried=useRef(0);
  const total=phases.reduce((sum,p)=>sum+p.seconds*1000,0);
  useEffect(()=>{
    if(!running)return;
    const tick=()=>{const time=Math.min(total,carried.current+Date.now()-started.current);setElapsed(time);if(time>=total){carried.current=total;setRunning(false);}};
    const interval=setInterval(tick,100);
    const onVisibility=()=>tick();
    document.addEventListener('visibilitychange',onVisibility);
    return()=>{clearInterval(interval);document.removeEventListener('visibilitychange',onVisibility);};
  },[running,total]);
  const start=useCallback(()=>{started.current=Date.now();setRunning(true);},[]);
  const pause=()=>{carried.current=Math.min(total,carried.current+Date.now()-started.current);setElapsed(carried.current);setRunning(false);};
  const reset=()=>{setRunning(false);carried.current=0;setElapsed(0);};
  return {...clockState(phases,elapsed),elapsed,running,start,pause,reset};
}

function SourceNote({kind}:{kind:number}) {
  return <details className="source-note"><summary>Origins &amp; facilitation notes</summary>
    {kind===0?<p><strong>Inspired by timed classroom drawing.</strong> The Art of Education University describes one-minute drawing rounds in <a href="https://theartofeducation.edu/podcasts/making-the-most-of-every-minute-ep-073/" target="_blank" rel="noopener noreferrer">Making the Most of Every Minute</a>. Brain Break adapts the format for whiteboard desks or a shared drawing screen. These prompts are original to Brain Break.</p>
    :kind===1?<p><strong>An original Brain Break variation on shape transformation.</strong> For a related creativity exercise, see <a href="https://www.ideo.com/journal/build-your-creative-confidence-30-circles-exercise" target="_blank" rel="noopener noreferrer">IDEO’s Thirty Circles</a>, which turns circles into recognizable objects. Our version uses a shared abstract line and a single drawing; it is not IDEO’s original exercise.</p>
    :kind===2?<p><strong>An original Brain Break activity.</strong> Two independent word banks generate an invention name; students imagine what it does and draw it in one minute. The names and format were created for this collection. There is no correct design, and drawing skill is not the point.</p>
    :<p><strong>Adapted from Kim’s Game.</strong> The <a href="https://www.scouts.org.uk/activities/play-kims-game/" target="_blank" rel="noopener noreferrer">Scouts’ version</a> asks players to observe objects, then recall them after they are covered. Brain Break uses eight projected symbols with 15 seconds to observe and 30 seconds to recall. Object names count; exact wording is not required.</p>}
    <p>{kind===3?'Invite students to write or sketch remembered objects, individually or in pairs. Reveal only when everyone is ready.':'Invite rough drawings, labels, or a partner contribution. Share interpretations rather than rank drawing ability.'} Allow another 30–60 seconds for sharing and erasing.</p>
    <p className="source-disclaimer">Sources credit the underlying activity or related inspiration. They do not imply endorsement or validation of this adaptation.</p>
  </details>;
}

export default function MiniGame({kind,onBack}:{kind:number;onBack:()=>void}) {
  const [index,setIndex]=useState(0);
  const [onScreen,setOnScreen]=useState(false);
  const [shapeIndex,setShapeIndex]=useState(0);
  const [round,setRound]=useState(1);
  const [objects,setObjects]=useState(()=>memoryObjects.slice(0,8));
  const [revealed,setRevealed]=useState(false);
  const [erasing,setErasing]=useState(false);
  const [invention,setInvention]=useState<[string,string]|null>(null);
  const [reelWords,setReelWords]=useState<[string,string]>(['?','?']);
  const [spinning,setSpinning]=useState(false);
  const lastInvention=useRef<[string,string]|null>(null);
  const deck=useRef<number[]>([]);
  const phases=kind===3?memoryPhases:drawingPhases;
  const clock=useRoundClock(phases);
  const startClock=clock.start;
  useEffect(()=>{
    if(!spinning)return;
    const pick=(words:string[])=>words[Math.floor(Math.random()*words.length)];
    const subject=pick(inventionSubjects);
    const purposes=inventionPurposes.filter(word=>subject!==lastInvention.current?.[0]||word!==lastInvention.current?.[1]);
    const target:[string,string]=[subject,pick(purposes)];
    // Reduced motion reveals the same random result without animated cycling.
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      lastInvention.current=target;setReelWords(target);setInvention(target);setSpinning(false);startClock();return;
    }
    const started=Date.now();
    const tick=()=>{
      const elapsed=Date.now()-started;
      if(elapsed>=1800){clearInterval(interval);lastInvention.current=target;setReelWords(target);setInvention(target);setSpinning(false);startClock();return;}
      setReelWords([elapsed>=1000?target[0]:pick(inventionSubjects),pick(inventionPurposes)]);
    };
    const interval=setInterval(tick,120);
    tick();
    return()=>clearInterval(interval);
  },[spinning,startClock]);
  const begun=clock.running||clock.elapsed>0;
  const showObjects=kind===3&&((begun&&clock.phase===0&&!clock.done&&clock.running)||revealed);
  const prompt=kind===0?masterpieces[index]:kind===1?blobPrompts[index]:'';
  const reset=()=>{setSpinning(false);clock.reset();setRevealed(false);setErasing(false);};
  const start=()=>{if(kind===2&&!invention)setSpinning(true);else clock.start();};
  const next=()=>{
    const length=kind===0?masterpieces.length:kind===1?blobPrompts.length:1;
    if(kind<2){if(!deck.current.length)deck.current=shuffled(Array.from({length},(_,i)=>i).filter(i=>i!==index));setIndex(deck.current.pop()??0);}
    if(kind===1)setShapeIndex(current=>(current+1+Math.floor(Math.random()*(squiggles.length-1)))%squiggles.length);
    if(kind===2){setInvention(null);setReelWords(['?','?']);}
    if(kind===3){const previous=new Set(objects.map(o=>o.icon));setObjects(shuffled(memoryObjects.filter(o=>!previous.has(o.icon))).slice(0,8));}
    setRound(n=>n+1);reset();
  };
  const status=spinning?'Consulting the invention department.':kind===2&&!invention?'Press Start to discover your invention.':erasing?(onScreen?'Clear your drawing when you are ready.':'Erase your desk.'):clock.done?(kind===3&&!revealed?'Time. Keep your answers ready.':'Markers down. Compare with a neighbor.'):!begun?(kind===1?(onScreen?'The starter line is ready.':'Copy the starter line before starting.'):'Ready when you are.'):!clock.running?'Paused.':phases[clock.phase].label;

  return <>
    <div className="mini-instructions"><p>{kind===0?(onScreen?'Draw below. You have 60 seconds. Rough sketches are entirely acceptable.':'Draw on your desk. You have 60 seconds. Rough sketches are entirely acceptable.'):kind===1?(onScreen?'Turn the starter line into something in 60 seconds. Draw around it; the original line stays visible.':'Copy the line onto your desk. Then take 60 seconds to turn it into something. Keep the original mark visible.'):kind===2?'Spin a name. Draw the invention. Your 60 seconds begin when both words land.': 'Study eight objects for 15 seconds. When they disappear, write or sketch what you remember in 30 seconds.'}</p><span className="mini-material">{kind===3?'Marker or paper':onScreen?'Mouse, touch, or stylus':'Whiteboard desk + marker'}</span></div>
    {kind<3&&<div className="drawing-mode"><span className="drawing-mode-label">Draw on</span><ToggleGroup className="drawing-mode-options" aria-label="Drawing location" value={[onScreen?'screen':'desk']} onValueChange={values=>{if(values[0])setOnScreen(values[0]==='screen');}}><ToggleGroupItem value="desk"><span className="mode-check" aria-hidden="true">{onScreen?'':'✓'}</span>Whiteboard / paper</ToggleGroupItem><ToggleGroupItem value="screen"><span className="mode-check" aria-hidden="true">{onScreen?'✓':''}</span>On screen</ToggleGroupItem></ToggleGroup><span className="drawing-mode-hint">{onScreen?'Use the drawing area below.':'Use your whiteboard desk or paper.'}</span></div>}
    <section className={'board mini-board mini-kind-'+kind+(onScreen?' onscreen-board':'')} aria-label="Classroom challenge">
      <div className="mini-round"><span className="eyebrow">ROUND {String(round).padStart(2,'0')}</span><span>{kind===3?'15 SEC LOOK + 30 SEC RECALL':'60 SECONDS'}</span></div>
      <div className="mini-stage-status" role="status">{status}</div>
      {kind===3?<div className="memory-stage">
        {showObjects?<div className="memory-grid" aria-label={revealed?'Objects revealed':'Objects to remember'}>{objects.map(object=>{const Icon=objectIcons[object.icon as keyof typeof objectIcons];return <div className="memory-object" key={object.icon}><Icon aria-hidden="true" strokeWidth={1.7}/><span>{object.label}</span></div>;})}</div>
        :<div className="memory-covered"><span aria-hidden="true">{!begun?'?':!clock.running&&!clock.done?'Ⅱ':'…'}</span><h2>{!begun?'Eight objects. One brief inspection.':!clock.running&&!clock.done?'Inspection paused.':'What was here?'}</h2><p>{!begun?'The objects appear when you start the timer.':!clock.running&&!clock.done?'The objects stay covered until you resume.':'Write or sketch the objects you remember on your desk.'}</p></div>}
      </div>:<>
        {kind===1&&!onScreen&&<svg className="starter-line" viewBox="0 0 360 190" role="img" aria-label={'Starter line: '+squiggles[shapeIndex].name}><path d={squiggles[shapeIndex].path} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        {kind===2?<>
          <div className={'invention-machine'+(spinning?' is-spinning':'')} aria-hidden="true">
            {reelWords.map((word,i)=><div className="invention-reel" key={i}><span className="invention-reel-label">{i===0?'01 / SUBJECT':'02 / PURPOSE'}</span><div className="invention-window"><strong key={word}>{word}</strong></div></div>)}
          </div>
          <h2 className="sr-only" aria-live="polite" aria-atomic="true">{invention?`Your invention: ${invention.join(' ')}.`:'Your invention will appear when you press Start.'}</h2>
          <p className="mini-prompt-note">{invention?'Draw it. Add labels if the engineering is unclear.':spinning?'A breakthrough is being considered.':'The name is provided. What it does is your problem.'}</p>
        </>:<h2 className="mini-prompt">{prompt}</h2>}
      </>}
      <div className="mini-clock-controls">
        <span className="mini-clock" role="timer" aria-label={`${clock.remaining} seconds remaining`}>{Math.floor(clock.remaining/60)}:{String(clock.remaining%60).padStart(2,'0')}</span>
        {!clock.done&&<button className="primary" disabled={spinning} onClick={clock.running?clock.pause:start}>{spinning?'Spinning…':clock.running?'Pause':begun?'Resume':kind===2?'Start':'Start timer'}</button>}
        <button className="control" disabled={spinning||(kind===2&&!invention)} onClick={reset}>{kind<3?'Restart timer':'Restart round'}</button>
        <button className="control" onClick={next}>{kind===3?'New objects':kind===2?'New invention':'New prompt'} ↻</button>
      </div>
      {kind<3&&<div hidden={!onScreen}><DrawingPad key={round} title={kind===2?(invention?.join(' ')||'Potentially Life-Changing Inventions'):prompt} starter={kind===1?squiggles[shapeIndex].path:undefined} locked={clock.done||(begun&&!clock.running)||(kind===2&&!invention)} lockedMessage={kind===2&&!invention?'Your drawing starts when the words land.':undefined} visible={onScreen}/></div>}
      {clock.done&&<div className="mini-finish">
        {kind===3&&!revealed?<button className="primary" onClick={()=>setRevealed(true)}>Reveal objects</button>:<>
          <p>{erasing?'A fresh desk. A fresh start.':kind===3?'Compare with the objects above. A sketch or an ordinary object name counts.':'Share one interpretation with a neighbor. There is no best drawing.'}</p>
          <button className="primary" onClick={erasing?onBack:()=>setErasing(true)}>{erasing?'Back to all games':onScreen?'Next: finish drawing':'Next: erase desks'}</button>
        </>}
      </div>}
    </section>
    <SourceNote kind={kind}/>
  </>;
}
