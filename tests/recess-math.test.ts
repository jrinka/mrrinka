import test from 'node:test';
import assert from 'node:assert/strict';
import {parseArithmetic,validateEquation,equationBank,sameEquation,checkTwentyFour,solveTwentyFour,masksFor,matchSolutions,matchTrue,moveMatch} from '../recess/math/engine';
import {twentyFourBanks,oddsPuzzles,matchPuzzles} from '../recess/math/data';

test('arithmetic uses exact fractions, brackets and normal precedence',()=>{
  assert.equal(parseArithmetic('8/(3-8/3)').value.n,BigInt(24));
  assert.equal(parseArithmetic('8/(3-8/3)').value.d,BigInt(1));
  assert.equal(parseArithmetic('2+3×4').value.n,BigInt(14));
  assert.equal(parseArithmetic('(2+3)×4').value.n,BigInt(20));
  assert.equal(parseArithmetic('8÷4÷2').value.n,BigInt(1));
  assert.equal(parseArithmetic('9−3−2').value.n,BigInt(4));
});
test('arithmetic rejects executable input, unsupported operations and malformed expressions',()=>{
  for(const input of ['alert(1)','globalThis','2**3','Math.pow(2,3)','1/0','02+3','2(3+4)','2+','(1+2','1+2)','2.5+3','-2+3','4!','1=1','1'.repeat(81)])assert.throws(()=>parseArithmetic(input),input);
});
test('all generated equations are true and fit their requested grids',()=>{
  for(const length of [6,8] as const){const bank=equationBank(length);assert.ok(bank.length>100);assert.equal(new Set(bank).size,bank.length);assert.equal(new Set(bank.map(e=>{const [left,right]=e.split('=');return parseArithmetic(left).signature+'='+right;})).size,bank.length);for(const equation of bank)assert.equal(validateEquation(equation,length),equation);}
});
test('equation guesses must be true, correctly formed and the correct length',()=>{
  assert.equal(validateEquation('8 × 7 = 56',6),'8*7=56');
  for(const [equation,length] of [['8+7=16',6],['8/0=00',6],['12+8=20',8],['08+7=15',7],['1+1=02',6],['(8+7)=15',8],['15=8+7',6]] as const)assert.throws(()=>validateEquation(equation,length));
});
test('equation equivalence allows swapping operands but not arbitrary true equations',()=>{
  assert.equal(sameEquation('7+8=15','8+7=15'),true);
  assert.equal(sameEquation('7*8=56','8*7=56'),true);
  assert.equal(sameEquation('3*4+2=14','2+4*3=14'),true);
  assert.equal(sameEquation('9+6=15','8+7=15'),false);
  assert.equal(sameEquation('8-3=5','3-8=5'),false);
  assert.equal(sameEquation('8/2=4','2/8=4'),false);
});
test('24 accepts alternative solutions and checks number multiplicities',()=>{
  assert.match(checkTwentyFour('(6+4-2)*3',[2,3,4,6]),/Exactly 24/);
  assert.match(checkTwentyFour('6*4*(3-2)',[2,3,4,6]),/Exactly 24/);
  assert.match(checkTwentyFour('8/(3-8/3)',[3,3,8,8]),/Exactly 24/);
  assert.throws(()=>checkTwentyFour('24',[2,3,4,6]),/each of the four/);
  assert.throws(()=>checkTwentyFour('6*4',[2,3,4,6]),/each of the four/);
  assert.throws(()=>checkTwentyFour('(6+4-2)*2',[2,3,4,6]),/each of the four/);
  assert.throws(()=>checkTwentyFour('2+3+4+6',[2,3,4,6]),/makes 15/);
});
test('every supplied 24 set has an independently checked solution',()=>{
  for(const bank of Object.values(twentyFourBanks))for(const numbers of bank){const solution=solveTwentyFour(numbers);assert.ok(solution,JSON.stringify(numbers));assert.match(checkTwentyFour(solution,numbers),/Exactly 24/);}
  assert.equal(solveTwentyFour([1,1,1,1]),null);
});
test('all match puzzles start false and every accepted solution moves exactly one match',()=>{
  const bits=(n:number)=>n.toString(2).split('1').length-1;
  for(const puzzle of matchPuzzles){const start=masksFor(puzzle);assert.equal(matchTrue(start,puzzle.op),false);const solutions=matchSolutions(puzzle);assert.ok(solutions.length>0,JSON.stringify(puzzle));for(const solution of solutions){assert.equal(matchTrue(solution.masks,puzzle.op),true);assert.deepEqual(moveMatch(start,solution.from,solution.to),solution.masks);assert.equal(start.reduce((sum,mask,i)=>sum+bits(mask&~solution.masks[i]),0),1);assert.equal(start.reduce((sum,mask,i)=>sum+bits(solution.masks[i]&~mask),0),1);}}
});
test('match moves reject occupied destinations and absent source segments',()=>{
  const start=masksFor({digits:[6,4,4],op:'+'});
  assert.throws(()=>moveMatch(start,0,0));
  assert.throws(()=>moveMatch(start,0,2));
  assert.throws(()=>moveMatch(start,1,8));
  const alternative=matchSolutions({digits:[6,4,4],op:'+'});
  for(const solution of alternative)assert.equal(matchTrue(solution.masks,'+'),true);
});
test('probability answers agree with the illustrated equally likely outcomes',()=>{
  for(const puzzle of oddsPuzzles){const favorable=puzzle.outcomes.filter(o=>o.favorable).length,total=puzzle.outcomes.length;assert.ok(favorable>0&&favorable<total);assert.equal(new Set(puzzle.outcomes.map(o=>o.label)).size,total);const correct=puzzle.choices.filter(choice=>{const [n,d]=choice.split('/').map(Number);return n*total===d*favorable;});assert.equal(correct.length,1,puzzle.title);}
  assert.equal(oddsPuzzles.find(p=>p.title==='New information')!.outcomes.length,3);
  assert.equal(oddsPuzzles.find(p=>p.title==='The six is not guaranteed')!.outcomes.filter(o=>o.favorable).length,11);
});

test('TXT and Markdown records preserve expressions and backticks exactly',async()=>{
  const {activityRecord}=await import('../recess/exports');
  const work='My working: 8/(3-8/3)\n**not bold**\n```\n';
  assert.equal(activityRecord(work,'Twenty-Four, Somehow','txt'),work);
  const md=activityRecord(work,'Twenty-Four, Somehow','md');
  assert.ok(md.startsWith('# Twenty-Four, Somehow\n\n````text\n'));
  assert.ok(md.includes(work));assert.ok(md.endsWith('\n````\n'));
});
