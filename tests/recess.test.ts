import test from 'node:test';
import assert from 'node:assert/strict';
import { feedback, canBuild, drawFromDeck } from '../recess/logic';
import { clockState, memoryPhases, drawingPhases } from '../recess/mini-game-data';

test('Wordle gives exact matches priority and does not overcount repeated letters', () => {
  assert.deepEqual(feedback('APPLE', 'ALLEY'), ['correct', 'present', 'absent', 'present', 'absent']);
  assert.deepEqual(feedback('LEVEL', 'LEVEL'), Array(5).fill('correct'));
});
test('Anagram Race uses each available letter at most once', () => {
  assert.equal(canBuild('CLASSROOM', 'CLASS'), true);
  assert.equal(canBuild('CLASSROOM', 'ROOMS'), true);
  assert.equal(canBuild('CLASSROOM', 'COCOA'), false);
});
test('Classroom decks exhaust their bank before repeating', () => {
  const items = ['one', 'two', 'three', 'four'];
  const deck: string[] = [];
  const first = drawFromDeck(items, deck, 2);
  const second = drawFromDeck(items, deck, 2, first);
  assert.equal(new Set([...first, ...second]).size, 4);
  assert.equal(new Set(drawFromDeck(items, deck, 4)).size, 4);
});
test('Recall switches after 15 seconds and finishes after 45, even after a tab sleeps', () => {
  assert.deepEqual(clockState(memoryPhases, 14999), { phase: 0, remaining: 1, done: false });
  assert.deepEqual(clockState(memoryPhases, 15000), { phase: 1, remaining: 30, done: false });
  assert.deepEqual(clockState(memoryPhases, 90000), { phase: 1, remaining: 0, done: true });
  assert.deepEqual(clockState(drawingPhases, 60000), { phase: 0, remaining: 0, done: true });
});
