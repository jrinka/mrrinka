'use client';

import {useEffect,useId,useRef,useState,type PointerEvent,type KeyboardEvent} from 'react';
import {ToggleGroup,ToggleGroupItem} from '@/recess/components/ui/toggle-group';
import {Pencil,Eraser,Undo2,Trash2,Download} from 'lucide-react';
import {drawingPng,downloadFile,fileName} from './exports';

type Point={x:number;y:number};
type Stroke={points:Point[];color:string;erase:boolean};
type History={strokes:Stroke[];undo:Stroke[][]};
const colors=[{name:'Black',value:'#191919'},{name:'Blue',value:'#244ab8'},{name:'Red',value:'#b42c24'}];
const WIDTH=900,HEIGHT=450;
function pathFor(points:Point[]){return points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');}

export default function DrawingPad({starter,locked,visible,lockedMessage,title}:{starter?:string;locked:boolean;visible:boolean;lockedMessage?:string;title:string}) {
  const [history,setHistory]=useState<History>({strokes:[],undo:[]});
  const [draft,setDraft]=useState<Stroke|null>(null);
  const [tool,setTool]=useState('pen');
  const [color,setColor]=useState(colors[0].value);
  const [keyboardPoint,setKeyboardPoint]=useState<Point|null>(null);
  const [notice,setNotice]=useState('');
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState<{url:string;name:string}|null>(null);
  useEffect(()=>()=>{if(saved)URL.revokeObjectURL(saved.url);},[saved]);
  const canvas=useRef<SVGSVGElement>(null);
  const save=async()=>{if(!canvas.current||saving)return;setSaving(true);try{const blob=await drawingPng(canvas.current,title);const name=fileName(title)+'.png';const url=downloadFile(blob,name);setSaved({url,name});setNotice('Drawing download ready (.png).');}catch{setNotice('Could not save the drawing. Please try again.');}finally{setSaving(false);}};
  const pointer=useRef<number|null>(null);
  const pending=useRef<Stroke|null>(null);
  const keyboardDown=useRef(false);
  const id=useId().replace(/:/g,'');
  const commit=(stroke:Stroke)=>setHistory(h=>({strokes:[...h.strokes,stroke],undo:[...h.undo.slice(-49),h.strokes]}));
  const finish=()=>{if(pending.current)commit(pending.current);pending.current=null;pointer.current=null;keyboardDown.current=false;setDraft(null);};
  useEffect(()=>{if(locked||!visible){if(pending.current){const stroke=pending.current;setHistory(h=>({strokes:[...h.strokes,stroke],undo:[...h.undo.slice(-49),h.strokes]}));}pending.current=null;pointer.current=null;keyboardDown.current=false;setDraft(null);}},[locked,visible]);
  const begin=(point:Point)=>{const stroke={points:[point,{x:point.x+.1,y:point.y}],color,erase:tool==='eraser'};pending.current=stroke;setDraft(stroke);};
  const extend=(point:Point)=>{const current=pending.current;if(!current)return;const last=current.points[current.points.length-1];if(Math.hypot(last.x-point.x,last.y-point.y)<1)return;const next={...current,points:[...current.points,point]};pending.current=next;setDraft(next);};
  const locate=(event:PointerEvent<SVGSVGElement>):Point=>{const matrix=event.currentTarget.getScreenCTM();if(!matrix)return {x:0,y:0};const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());return {x:Math.max(0,Math.min(WIDTH,p.x)),y:Math.max(0,Math.min(HEIGHT,p.y))};};
  const down=(event:PointerEvent<SVGSVGElement>)=>{if(locked||pointer.current!==null||!event.isPrimary||event.button!==0)return;event.preventDefault();event.currentTarget.focus({preventScroll:true});event.currentTarget.setPointerCapture(event.pointerId);pointer.current=event.pointerId;setKeyboardPoint(null);begin(locate(event));};
  const move=(event:PointerEvent<SVGSVGElement>)=>{if(pointer.current===event.pointerId&&!locked)extend(locate(event));};
  const up=(event:PointerEvent<SVGSVGElement>)=>{if(pointer.current!==event.pointerId)return;finish();if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);};
  const key=(event:KeyboardEvent<SVGSVGElement>)=>{
    if(locked)return;
    if(event.key===' '){event.preventDefault();if(keyboardDown.current){finish();setNotice('Pen lifted.');}else{const point=keyboardPoint||{x:WIDTH/2,y:HEIGHT/2};setKeyboardPoint(point);begin(point);keyboardDown.current=true;setNotice(tool==='eraser'?'Eraser down.':'Pen down.');}return;}
    if(event.key==='Escape'){event.preventDefault();finish();setNotice('Pen lifted.');return;}
    const directions:Record<string,Point>={ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1}};
    const direction=directions[event.key];if(!direction)return;event.preventDefault();const old=keyboardPoint||{x:WIDTH/2,y:HEIGHT/2};const step=event.shiftKey?2:12;const point={x:Math.max(0,Math.min(WIDTH,old.x+direction.x*step)),y:Math.max(0,Math.min(HEIGHT,old.y+direction.y*step))};setKeyboardPoint(point);if(keyboardDown.current)extend(point);
  };
  const strokes=draft?[...history.strokes,draft]:history.strokes;
  // A separate mask for each ink stroke applies only erasers drawn AFTER it.
  // The starter line is outside all masks, so it can never be erased.
  return <div className="drawing-pad">
    <div className="drawing-toolbar">
      <ToggleGroup className="drawing-tools" aria-label="Drawing tool" value={[tool]} onValueChange={values=>{if(values[0])setTool(values[0]);}}>
        <ToggleGroupItem value="pen"><Pencil aria-hidden="true"/>Pen</ToggleGroupItem>
        <ToggleGroupItem value="eraser"><Eraser aria-hidden="true"/>Eraser</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup className="drawing-colors" aria-label="Ink color" value={[color]} onValueChange={values=>{if(values[0]){setColor(values[0]);setTool('pen');}}}>
        {colors.map(c=><ToggleGroupItem key={c.value} value={c.value} aria-label={c.name+' ink'}><span className="ink-swatch" style={{background:c.value}} aria-hidden="true"/><span>{c.name}</span></ToggleGroupItem>)}
      </ToggleGroup>
      <div className="drawing-actions">
        <button className="control" disabled={saving||(!starter&&!history.strokes.length&&!draft)} onClick={save}><Download aria-hidden="true"/>{saving?'Saving…':'Save drawing'}<span className="export-format">.png</span></button>
        <button className="control" disabled={!history.undo.length} onClick={()=>{setHistory(h=>({strokes:h.undo[h.undo.length-1]||[],undo:h.undo.slice(0,-1)}));setNotice('Last drawing action undone.');}}><Undo2 aria-hidden="true"/>Undo</button>
        <button className="control" disabled={!history.strokes.length} onClick={()=>{setHistory(h=>({strokes:[],undo:[...h.undo.slice(-49),h.strokes]}));setNotice('Drawing cleared. Undo restores it.');}}><Trash2 aria-hidden="true"/>Clear drawing</button>
      </div>
    </div>
    <div className={'drawing-surface '+(locked?'drawing-locked':'')}>
      <svg ref={canvas} className={'drawing-canvas '+(tool==='eraser'?'erasing':'')} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} tabIndex={0} role="application" aria-label="Drawing area" aria-describedby={id+'-help'} aria-disabled={locked} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onLostPointerCapture={up} onKeyDown={key} onBlur={()=>{if(keyboardDown.current)finish();}}>
        <defs>{strokes.map((stroke,i)=>!stroke.erase&&<mask key={i} id={id+'-mask-'+i} maskUnits="userSpaceOnUse" x="0" y="0" width={WIDTH} height={HEIGHT}><rect width={WIDTH} height={HEIGHT} fill="white"/>{strokes.slice(i+1).filter(s=>s.erase).map((eraser,j)=><path key={j} d={pathFor(eraser.points)} stroke="black" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" fill="none"/>)}</mask>)}</defs>
        {starter&&<path data-starter-line="true" d={starter} transform="translate(180 82.5) scale(1.5)" stroke="#191919" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>}
        {strokes.map((stroke,i)=>!stroke.erase&&<path data-drawing-stroke="true" key={i} d={pathFor(stroke.points)} mask={`url(#${id}-mask-${i})`} stroke={stroke.color} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>)}
        {keyboardPoint&&!locked&&<circle data-drawing-cursor="true" cx={keyboardPoint.x} cy={keyboardPoint.y} r={tool==='eraser'?16:6} fill="none" stroke="#244ab8" strokeWidth="2"/>}
      </svg>
      {locked&&<span className="drawing-lock-label">{lockedMessage||'Drawing paused'}</span>}
    </div>
    <p className="drawing-help" id={id+'-help'}>Draw with a mouse, finger, or stylus.{starter?' The starter line stays put.':''} A new round clears the drawing; switching modes keeps it.</p>
    <details className="drawing-keyboard"><summary>Keyboard drawing</summary><p>Focus the drawing area. Arrow keys move; Space lowers or lifts the pen. Hold Shift for smaller steps. Escape lifts the pen.</p></details>
    <span className="drawing-notice" role="status">{notice}</span>{saved&&<a className="export-open" href={saved.url} target="_blank" rel="noopener noreferrer">Open saved image</a>}
  </div>;
}
