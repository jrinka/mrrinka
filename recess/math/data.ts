export const mathGames = [
  {name:'Equation Pending',mark:'? + ? = ?',description:'A hidden equation. Six guesses. The numbers are withholding information.',time:'2–4 MIN'},
  {name:'Twenty-Four, Somehow',mark:'→ 24',description:'Four numbers. One target. Brackets may be your personality now.',time:'1–2 MIN'},
  {name:'One Small Adjustment',mark:'− / +',description:'Move one match. Make the equation true. Resist moving the goalposts.',time:'30–90 SEC'},
  {name:'What Are the Odds?',mark:'P(REALLY?)',description:'Make a prediction. Discover how confidently wrong a person can be.',time:'1–2 MIN'},
];
export const twentyFourBanks = {
  warmup: [[2,3,4,6],[1,2,3,4],[2,2,4,4],[1,3,4,6],[3,3,4,4],[1,2,4,8],[1,3,5,6],[2,4,6,8],[3,4,5,6],[1,4,5,6],[2,3,6,9],[1,2,5,8]],
  stretch: [[3,3,8,8],[1,5,5,5],[1,3,4,6],[4,4,7,7],[3,3,7,7]],
};
export type Outcome = { label: string; favorable: boolean };
export type OddsPuzzle = { title:string; question:string; hint:string; explanation:string; choices:string[]; outcomes:Outcome[] };
const dice = (test:(a:number,b:number)=>boolean):Outcome[] => Array.from({length:36},(_,i)=>{const a=Math.floor(i/6)+1,b=i%6+1;return {label:`${a},${b}`,favorable:test(a,b)}});
const coins = (count:number,test:(s:string)=>boolean):Outcome[] => Array.from({length:2**count},(_,i)=>{const s=i.toString(2).padStart(count,'0').replace(/0/g,'H').replace(/1/g,'T');return {label:s,favorable:test(s)}});
export const oddsPuzzles:OddsPuzzle[] = [
 {title:'One head will do',question:'Toss two fair, independent coins. What is the chance of at least one head?',hint:'List the four equally likely ordered outcomes. “At least one” includes two.',explanation:'HH, HT, and TH qualify. Only TT fails. Count outcomes, not the two possible labels “heads or no heads”.',choices:['1/2','3/4','1/4'],outcomes:coins(2,s=>s.includes('H'))},
 {title:'Exactly is doing some work',question:'Toss three fair, independent coins. What is the chance of exactly two heads?',hint:'Count where the single tail could go. There are eight equally likely ordered outcomes.',explanation:'HHT, HTH, and THH qualify: three outcomes out of eight. HHH has too many heads.',choices:['1/2','3/8','2/3'],outcomes:coins(3,s=>s.split('H').length-1===2)},
 {title:'A very popular total',question:'Roll two fair six-sided dice. What is the chance their total is 7?',hint:'Treat the first die and second die as different. There are 36 ordered pairs.',explanation:'Six pairs total seven: (1,6), (2,5), (3,4), (4,3), (5,2), and (6,1). Six out of 36 simplifies to 1/6.',choices:['1/12','1/6','1/11'],outcomes:dice((a,b)=>a+b===7)},
 {title:'Double trouble',question:'Roll two fair six-sided dice. What is the chance of a double (both dice showing the same number)?',hint:'There is one matching second die for each first die.',explanation:'The six diagonal pairs qualify out of 36 equally likely outcomes: 1/6.',choices:['1/3','1/6','1/36'],outcomes:dice((a,b)=>a===b)},
 {title:'The six is not guaranteed',question:'Roll two fair six-sided dice. What is the chance of at least one 6?',hint:'Counting each die’s six separately counts (6,6) twice. Or count pairs with no six.',explanation:'Six pairs have a six on the first die, six on the second, with (6,6) shared. That makes 11 of 36, not 12.',choices:['1/3','11/36','1/6'],outcomes:dice((a,b)=>a===6||b===6)},
 {title:'One six. No more.',question:'Roll two fair six-sided dice. What is the chance of exactly one 6?',hint:'A six on the first die gives five choices for the other die; reverse the roles too.',explanation:'Five pairs start with 6 and five end with 6. Exclude (6,6). Ten out of 36 simplifies to 5/18.',choices:['11/36','5/18','1/3'],outcomes:dice((a,b)=>(a===6)!==(b===6))},
 {title:'The coin has no memory',question:'A fair coin landed heads five times in a row. It is tossed twice more, independently. What is the chance both new tosses are heads?',hint:'The past streak does not change either new toss. List just the next two tosses.',explanation:'Of HH, HT, TH, and TT, only HH qualifies. The previous results do not make tails “due”.',choices:['1/128','1/4','1/2'],outcomes:coins(2,s=>s==='HH')},
 {title:'New information',question:'Two fair coins were tossed. You are told only that at least one is heads. What is the chance both are heads?',hint:'Remove TT from the original four outcomes. No particular coin was identified.',explanation:'The information leaves HH, HT, and TH, each equally likely under this condition. Only HH has two heads. The wording matters: this is not “the first coin is heads”.',choices:['1/2','1/3','1/4'],outcomes:coins(2,s=>s==='HH').filter(o=>o.label!=='TT')},
 {title:'An even chance?',question:'Roll two fair six-sided dice. What is the chance their sum is even?',hint:'Two odds or two evens give an even sum.',explanation:'There are nine odd–odd pairs and nine even–even pairs. Eighteen of 36 is 1/2.',choices:['1/2','1/3','2/3'],outcomes:dice((a,b)=>(a+b)%2===0)},
 {title:'Product placement',question:'Roll two fair six-sided dice. What is the chance their product is odd?',hint:'Multiplying by any even number makes the product even.',explanation:'Both dice must be odd. Three odd choices on each die give nine pairs out of 36: 1/4.',choices:['1/2','1/4','3/4'],outcomes:dice((a,b)=>a%2===1&&b%2===1)},
 {title:'A majority decision',question:'Toss three fair, independent coins. What is the chance heads is in the majority?',hint:'Include both exactly two heads and exactly three heads.',explanation:'HHT, HTH, THH, and HHH qualify. Four of eight gives 1/2, as symmetry also suggests.',choices:['3/8','1/2','2/3'],outcomes:coins(3,s=>s.split('H').length-1>=2)},
 {title:'The bigger die',question:'Roll a red and a blue fair six-sided die. What is the chance red shows a strictly larger number than blue?',hint:'The two winning sides are symmetric, but doubles are ties.',explanation:'Six of 36 pairs are ties. The remaining 30 split equally: 15 red wins and 15 blue wins. So 15/36 = 5/12.',choices:['1/2','5/12','1/3'],outcomes:dice((a,b)=>a>b)},
];

export const matchPuzzles: import('./engine').MatchPuzzle[] = [
 {digits:[6,4,4],op:'+'},{digits:[1,1,3],op:'+'},{digits:[1,5,9],op:'+'},{digits:[2,3,6],op:'+'},
 {digits:[2,7,6],op:'+'},{digits:[3,2,4],op:'+'},{digits:[3,5,7],op:'+'},{digits:[4,5,7],op:'+'},
 {digits:[5,6,9],op:'+'},{digits:[6,1,5],op:'+'},{digits:[7,6,1],op:'+'},{digits:[8,5,6],op:'+'},
 {digits:[9,2,8],op:'+'},{digits:[9,5,5],op:'+'},{digits:[1,4,9],op:'-'},{digits:[1,9,2],op:'-'},{digits:[3,1,3],op:'-'},
];
