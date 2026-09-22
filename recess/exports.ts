export function fileName(title:string) {
  return 'brain-break-'+title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80);
}

export function downloadFile(blob:Blob,name:string) {
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();
  return url;
}

// Export only the displayed activity. Hidden solutions and teacher setup stay out.
export function activityText(root:HTMLElement,title:string) {
  const read=(node:Node):string=>{
    if(node.nodeType===Node.TEXT_NODE)return node.textContent||'';
    if(!(node instanceof Element))return '';
    const style=getComputedStyle(node);
    if(style.display==='none'||style.visibility==='hidden'||node.matches('[hidden],[aria-hidden="true"],header,footer,.play-title,.activity-export,.drawing-mode,.drawing-pad,.source-note,.keyboard,.actions,.mini-clock-controls,.timer,.mini-finish,.teacher-dialog,svg'))return '';
    if(node.matches('button')&&!node.matches('.ryl-grid button,.big-letter,.word-trail button,.odds-options button'))return '';
    if(node instanceof HTMLInputElement||node instanceof HTMLTextAreaElement){
      if(node instanceof HTMLInputElement&&['password','hidden','checkbox','radio'].includes(node.type))return '';
      return node.value?`\n${node.getAttribute('aria-label')||'Response'}: ${node.value}\n`:'';
    }
    if(node.matches('.wordle-grid')){
      return '\n'+Array.from(node.children).map(e=>e.getAttribute('aria-label')).filter(label=>label&&!label.includes(': empty')).join('\n')+'\n';
    }
    const content=Array.from(node.childNodes).map(read).join('');
    const block=/^(DIV|SECTION|P|H[1-6]|LI|LABEL|FORM|OL|UL)$/.test(node.tagName)||node.matches('.word-trail>*');
    return block?'\n'+content+'\n':content+' ';
  };
  const content=read(root).replace(/[ \t]+/g,' ').replace(/ *\n */g,'\n').replace(/\n{3,}/g,'\n\n').trim();
  return `BRAIN BREAK / Mr. Rinka\n${title}\n\n${content}${root.querySelector('.drawing-pad')?'\n\nDrawings can be downloaded separately with Save drawing.':''}\n`;
}

export async function drawingPng(svg:SVGSVGElement,title:string):Promise<Blob> {
  const copy=svg.cloneNode(true) as SVGSVGElement;
  copy.setAttribute('xmlns','http://www.w3.org/2000/svg');copy.setAttribute('width','900');copy.setAttribute('height','450');
  copy.querySelectorAll('[data-drawing-cursor]').forEach(node=>node.remove());
  const source=new Blob([new XMLSerializer().serializeToString(copy)],{type:'image/svg+xml;charset=utf-8'});
  const url=URL.createObjectURL(source);
  try {
    const image=new Image();
    await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error('Drawing could not be prepared.'));image.src=url;});
    const canvas=document.createElement('canvas');
    const context=canvas.getContext('2d');
    if(!context)throw new Error('Image export is unavailable in this browser.');
    context.font='bold 24px Arial';
    const lines:string[]=[];let line='';
    for(const word of title.split(/\s+/)){const next=line?line+' '+word:word;if(line&&context.measureText(next).width>850){lines.push(line);line=word;}else line=next;}
    if(line)lines.push(line);
    const header=62+Math.max(1,lines.length)*30;
    canvas.width=1800;canvas.height=(header+474)*2;
    context.scale(2,2);context.fillStyle='#fff';context.fillRect(0,0,900,header+474);
    context.fillStyle='#191919';context.font='14px Arial';context.fillText('BRAIN BREAK / Mr. Rinka',24,28);
    context.font='bold 24px Arial';lines.forEach((text,i)=>context.fillText(text,24,61+i*30));
    context.drawImage(image,0,header,900,450);
    return await new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Drawing could not be saved.')),'image/png'));
  } finally {URL.revokeObjectURL(url);}
}

// Keep mathematical operators and student Markdown literal in a Markdown viewer.
export function activityRecord(content:string,title:string,format:'txt'|'md') {
  if(format==='txt')return content;
  const longest=Math.max(0,...(content.match(/`+/g)||[]).map(run=>run.length));
  const fence='`'.repeat(Math.max(3,longest+1));
  return `# ${title}\n\n${fence}text\n${content}\n${fence}\n`;
}
