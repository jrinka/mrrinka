import test from 'node:test';
import assert from 'node:assert/strict';
import {guessLetter, hangmanStatus, newHangmanRound} from '../recess/hangman-logic';

test('Hangman accepts lowercase and repeated letters without spending another chance', () => {
  let round = newHangmanRound('BALLOON');
  round = guessLetter(round, 'l');
  assert.deepEqual(round.guesses, ['L']);
  assert.equal(hangmanStatus(round).misses.length, 0);
  assert.equal(guessLetter(round, 'L'), round);
  round = guessLetter(round, 'x');
  assert.equal(guessLetter(round, 'X'), round);
  assert.equal(guessLetter(round, 'Enter'), round);
  assert.deepEqual(hangmanStatus(round).misses, ['X']);
});
test('Hangman wins when all distinct letters are found and locks the round', () => {
  const round = [...'BALON'].reduce(guessLetter, newHangmanRound('BALLOON'));
  assert.equal(hangmanStatus(round).won, true);
  assert.equal(guessLetter(round, 'Z'), round);
});
test('Six misses or revealing the answer ends play; a new word clears the round', () => {
  const round = [...'CDEFGH'].reduce(guessLetter, newHangmanRound('BALLOON'));
  assert.equal(hangmanStatus(round).done, true);
  assert.equal(hangmanStatus(round).misses.length, 6);
  assert.equal(guessLetter(round, 'A'), round);
  const revealed = {...newHangmanRound('ECHO'), revealed: true};
  assert.equal(guessLetter(revealed, 'E'), revealed);
  assert.deepEqual(newHangmanRound('echo'), {answer: 'ECHO', guesses: [], revealed: false});
});
