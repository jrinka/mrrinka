// A deliberately small arithmetic parser. No JavaScript evaluation or executable input.
export type Fraction = { n: bigint; d: bigint };
const gcd = (a: bigint, b: bigint): bigint => b ? gcd(b, a % b) : a < BigInt(0) ? -a : a;
export function fraction(n: bigint, d = BigInt(1)): Fraction {
  if (!d) throw new Error('Division by zero is not allowed.');
  if (d < BigInt(0)) { n = -n; d = -d; }
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}
export function calculate(a: Fraction, op: string, b: Fraction): Fraction {
  if (op === '+') return fraction(a.n * b.d + b.n * a.d, a.d * b.d);
  if (op === '-') return fraction(a.n * b.d - b.n * a.d, a.d * b.d);
  if (op === '*') return fraction(a.n * b.n, a.d * b.d);
  if (op === '/') return fraction(a.n * b.d, a.d * b.n);
  throw new Error('Use +, −, ×, or ÷.');
}
export const normalize = (text: string) => text.replace(/[×xX]/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-').replace(/\s/g, '');
export function parseArithmetic(text: string): { value: Fraction; numbers: number[]; signature: string; steps: string[] } {
  const source = normalize(text);
  if (!source || source.length > 80 || !/^[0-9+*/()\-]+$/.test(source)) throw new Error('Use whole numbers, +, −, ×, ÷, and brackets only.');
  let position = 0;
  const numbers: number[] = [];
  const steps: string[] = [];
  const display = (v: Fraction) => v.d === BigInt(1) ? String(v.n) : `${v.n}/${v.d}`;
  type Node = { value: Fraction; signature: string };
  function atom(): Node {
    if (source[position] === '(') {
      position++;
      const result = expression();
      if (source[position++] !== ')') throw new Error('Check your brackets.');
      return result;
    }
    const number = /^\d{1,4}/.exec(source.slice(position))?.[0];
    if (!number || (number.length > 1 && number[0] === '0')) throw new Error('Use whole numbers without leading zeros. Put an operation between numbers.');
    position += number.length;
    numbers.push(Number(number));
    return { value: fraction(BigInt(number)), signature: number };
  }
  function join(a: Node, op: string, b: Node): Node {
    const terms = [a.signature, b.signature];
    if (op === '+' || op === '*') terms.sort();
    const value = calculate(a.value, op, b.value);
    steps.push(`${display(a.value)} ${pretty(op)} ${display(b.value)} = ${display(value)}`);
    return { value, signature: `(${terms[0]}${op}${terms[1]})` };
  }
  function product(): Node {
    let result = atom();
    while (source[position] === '*' || source[position] === '/') { const op = source[position++]; result = join(result, op, atom()); }
    return result;
  }
  function expression(): Node {
    let result = product();
    while (source[position] === '+' || source[position] === '-') { const op = source[position++]; result = join(result, op, product()); }
    return result;
  }
  const result = expression();
  if (position !== source.length) throw new Error('Check the expression: every number needs an operation between it and the next.');
  return { ...result, numbers, steps };
}
export const pretty = (text: string) => text.replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−');
export function validateEquation(text: string, length: number): string {
  const input = normalize(text);
  if (input.length !== length) throw new Error(`Use exactly ${length} characters, including =.`);
  if (!/^\d+(?:[+*/-]\d+)+=\d+$/.test(input)) throw new Error('Put a calculation on the left and one whole-number answer on the right. No brackets or negative numbers.');
  const [left, right] = input.split('=');
  const value = parseArithmetic(left).value;
  parseArithmetic(right);
  if (value.n !== BigInt(right) * value.d) throw new Error('That equation is not true. Multiply and divide before adding and subtracting.');
  return input;
}
export function sameEquation(a: string, b: string): boolean {
  const [al, ar] = a.split('='); const [bl, br] = b.split('=');
  return ar === br && parseArithmetic(al).signature === parseArithmetic(bl).signature;
}
export function equationBank(length: 6 | 8): string[] {
  const bank = new Set<string>();
  for (let a = 1; a <= 99; a++) for (let b = 1; b <= 20; b++) for (const op of ['+', '-', '*', '/']) {
    const value = calculate(fraction(BigInt(a)), op, fraction(BigInt(b)));
    if (value.d === BigInt(1) && value.n >= BigInt(0)) { const equation = `${a}${op}${b}=${value.n}`; if (equation.length === length) bank.add(equation); }
  }
  if (length === 8) for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) for (let c = 1; c <= 9; c++) {
    const equation = `${a}+${b}*${c}=${a + b * c}`;
    if (equation.length === length) bank.add(equation);
  }
  // Operand swaps count as the same puzzle, just as they do when checking guesses.
  const signatures = new Set<string>();
  return [...bank].filter(equation => {
    const [left,right] = equation.split('=');
    const key = parseArithmetic(left).signature + '=' + right;
    if (signatures.has(key)) return false;
    signatures.add(key); return true;
  });
}
export function checkTwentyFour(text: string, numbers: number[]): string {
  const parsed = parseArithmetic(text);
  if ([...parsed.numbers].sort((a,b)=>a-b).join(',') !== [...numbers].sort((a,b)=>a-b).join(',')) throw new Error('Use each of the four supplied numbers exactly once. Do not join digits or add new numbers.');
  if (parsed.value.n !== BigInt(24) * parsed.value.d) throw new Error(`That makes ${parsed.value.d === BigInt(1) ? parsed.value.n : `${parsed.value.n}/${parsed.value.d}`}. Keep going: the target is 24.`);
  return 'Exactly 24. All four numbers, each used once. Nicely done.';
}
export function solveTwentyFour(numbers: number[]): string | null {
  function search(items: { value: Fraction; expression: string }[]): string | null {
    if (items.length === 1) return items[0].value.n === BigInt(24) * items[0].value.d ? items[0].expression : null;
    for (let i=0;i<items.length;i++) for(let j=i+1;j<items.length;j++) {
      const rest=items.filter((_,k)=>k!==i&&k!==j);
      for (const [a,b] of [[items[i],items[j]],[items[j],items[i]]]) for(const op of ['+','-','*','/']) {
        if(op==='/'&&b.value.n===BigInt(0))continue;
        const answer=search([...rest,{value:calculate(a.value,op,b.value),expression:`(${a.expression}${op}${b.expression})`}]);
        if(answer)return answer;
      }
    }
    return null;
  }
  return search(numbers.map(n=>({value:fraction(BigInt(n)),expression:String(n)})));
}
// Seven-segment digits, in clockwise order from top, with the centre last.
export const segmentNames = ['top','upper right','lower right','bottom','lower left','upper left','middle'];
export const digitMasks = [63,6,91,79,102,109,125,7,127,111];
export type MatchPuzzle = { digits: number[]; op: '+' | '-' };
export type MatchSolution = { from: number; to: number; masks: number[] };
export const masksFor = (p: MatchPuzzle) => p.digits.map(d=>digitMasks[d]);
export function matchText(masks: number[], op: string) { const d=masks.map(m=>{const i=digitMasks.indexOf(m);return i<0?'?':String(i)});return `${d[0]} ${op} ${d[1]} = ${d[2]}`; }
export function matchTrue(masks: number[], op: string): boolean {
  const d=masks.map(m=>digitMasks.indexOf(m));
  return !d.includes(-1) && (op==='+'?d[0]+d[1]:d[0]-d[1])===d[2];
}
export function moveMatch(masks: number[], from: number, to: number): number[] {
  const next=[...masks];const a=Math.floor(from/7),b=Math.floor(to/7);
  if(from===to||a<0||b<0||a>=3||b>=3||!(next[a]&(1<<(from%7)))||(next[b]&(1<<(to%7))))throw new Error('Move one existing match to an empty position.');
  next[a]&=~(1<<(from%7));next[b]|=1<<(to%7);return next;
}
export function matchSolutions(p: MatchPuzzle): MatchSolution[] {
  const start=masksFor(p),solutions:MatchSolution[]=[];
  for(let from=0;from<21;from++)for(let to=0;to<21;to++){
    try{const masks=moveMatch(start,from,to);if(matchTrue(masks,p.op))solutions.push({from,to,masks});}catch{}
  }
  return solutions;
}
