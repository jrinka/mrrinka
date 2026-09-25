export const maxMisses = 6;
export type HangmanRound = { answer: string; guesses: string[]; revealed: boolean };
export function newHangmanRound(answer: string): HangmanRound {
  return { answer: answer.toUpperCase(), guesses: [], revealed: false };
}
export function hangmanStatus(round: HangmanRound) {
  const misses = round.guesses.filter(letter => !round.answer.includes(letter));
  const won = [...round.answer].every(letter => round.guesses.includes(letter));
  return { misses, won, done: won || misses.length >= maxMisses || round.revealed };
}
export function guessLetter(round: HangmanRound, input: string): HangmanRound {
  const letter = input.toUpperCase();
  if (!/^[A-Z]$/.test(letter) || round.guesses.includes(letter) || hangmanStatus(round).done) return round;
  return { ...round, guesses: [...round.guesses, letter] };
}
