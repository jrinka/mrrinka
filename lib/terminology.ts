import banks from './analysis-reference.json';
export const categories = [
 {id:'words',title:'Words & meaning',hint:'Diction, imagery, figurative language and associations'},
 {id:'voice',title:'Voice & perspective',hint:'Tone, register, speakers and viewpoints'},
 {id:'structure',title:'Structure & pattern',hint:'Arrangement, contrast, repetition and narrative movement'},
 {id:'sound',title:'Sound & poetic form',hint:'Rhythm, sound patterns, pauses and line breaks'},
 {id:'images',title:'Images & composition',hint:"Framing, gaze, color, layout and visual relationships"},
 {id:'persuasion',title:'Persuasion & context',hint:'Appeals, audiences, representation and cultural assumptions'},
] as const;
export type Category = typeof categories[number]['id'];
const slug=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
export type Term={id:string;term:string;categories:Category[];aliases:string[];readings:{context:string;definition:string;example:string|null;analysis:string}[]};
function category(group:string,term:string,bank:number):Category {
 if (/Register|Tone|Mood|Colloquialism|Narrative perspective|Free indirect/.test(term)) return 'voice';
 if (/Juxtaposition|Motif|Syntax|Anaphora|Parallelism|Tricolon|Antithesis|Foreshadowing|In medias res/.test(term)) return 'structure';
 if (group==='Sound & Poetic Form') return 'sound';
 if (/Context|Rhetoric|Purpose/.test(group)||/Bias|Intertextuality/.test(term)) return 'persuasion';
 return bank===1||group==='Visual & Multimodal'?'images':'words';
}
const byName=new Map<string,Term>();
const groupAliases:Record<string,string[]>={};
banks.forEach((bank,i)=>bank.groups.forEach(group=>{
 const members:string[]=[];
 group.entries.forEach(entry=>{
  const id=slug(entry.term);const cat=category(group.title,entry.term,i);
  const term=byName.get(id)??{id,term:entry.term,categories:[],aliases:[],readings:[]};
  if(!term.categories.includes(cat))term.categories.push(cat);
  term.aliases.push(`bank-${i}-${id}`);
  term.readings.push({context:i===0?'Language & literature':'Visual texts',definition:entry.definition,example:entry.example,analysis:entry.analysis});
  byName.set(id,term);members.push(id);
 });
 groupAliases[`bank-${i}-${slug(group.title)}`]=members;
}));
export const terms=[...byName.values()].sort((a,b)=>a.term.localeCompare(b.term));
export const legacyGroups=groupAliases;
export function matchesTerm(term:Term,query:string){
 const extra=term.id==='anchorage'?' text explaining an image caption labels meaning':term.id==='enjambment'?' sentence continues across a line break':'';
 const text=(term.term+' '+term.readings.map(r=>`${r.definition} ${r.example??''} ${r.analysis}`).join(' ')+extra).toLowerCase();
 return query.toLowerCase().trim().split(/\s+/).every(word=>text.includes(word));
}
