export function feedback(answer:string,guess:string){const result=Array(guess.length).fill('absent');const remaining=answer.split('');for(let i=0;i<guess.length;i++)if(guess[i]===answer[i]){result[i]='correct';remaining[i]='';}for(let i=0;i<guess.length;i++)if(result[i]!=='correct'){const j=remaining.indexOf(guess[i]);if(j!==-1){result[i]='present';remaining[j]='';}}return result as string[];}
export function pick<T>(items:T[]):T{return items[Math.floor(Math.random()*items.length)];}
export function shuffle<T>(items:T[]):T[]{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function canBuild(source:string,word:string){const pool=source.toUpperCase().split('');return word.toUpperCase().split('').every(c=>{const i=pool.indexOf(c);if(i<0)return false;pool.splice(i,1);return true;});}

// Deal from a shuffled bank before refilling it. Avoid recent choices at a refill.
export function drawFromDeck<T>(items:T[],deck:T[],count=1,avoid:T[]=[]):T[]{
  const selected:T[]=[];
  for(let i=0;i<Math.min(count,items.length);i++){
    if(!deck.some(item=>!selected.includes(item))){deck.length=0;deck.push(...shuffle(items.filter(item=>!selected.includes(item))));}
    let index=deck.findLastIndex(item=>!selected.includes(item)&&!avoid.includes(item));
    if(index<0)index=deck.findLastIndex(item=>!selected.includes(item));
    if(index<0)break;
    selected.push(deck.splice(index,1)[0]);
  }
  return selected;
}
