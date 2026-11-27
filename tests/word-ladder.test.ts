import test from 'node:test';
import assert from 'node:assert/strict';
import { ladders } from '../recess/challenges';
import { drawFromBank } from '../recess/decks';
import { drawLadder, ladderBanks, ladderLevels, ladderStepError } from '../recess/word-ladders';

function distance(from: string, to: string) {
  return [...from].filter((letter, index) => letter !== to[index]).length;
}

test('all ladder routes can be played to completion and each level meets its move floor', () => {
  const pairs = new Set<string>();
  for (const level of ladderLevels) {
    for (const puzzle of ladderBanks[level]) {
      const { path, checkpoint } = puzzle;
      const start = path[0];
      const target = path[path.length - 1];
      const pair = [start, target].sort().join('-');
      assert.ok(!pairs.has(pair), pair);
      pairs.add(pair);
      for (let i = 1; i < path.length; i++) {
        assert.equal(ladderStepError(puzzle, path.slice(0, i), path[i]), undefined, path.join(' → '));
      }
      if (level === 'Stretch') {
        assert.equal(start.length, 5);
        assert.ok(distance(start, target) >= 4, pair);
      }
      if (level === 'Expert') {
        assert.ok(checkpoint && path.indexOf(checkpoint) > 0 && path.indexOf(checkpoint) < path.length - 1, pair);
        assert.ok(distance(start, checkpoint) + distance(checkpoint, target) >= 6, pair);
      }
    }
  }
});

test('classic resumes the original deck and advanced levels rotate independently', () => {
  const indices = ladders.map((_, i) => i);
  const [oldIndex] = drawFromBank('challenge-4', indices);
  const classicDraws = indices.slice(1).map(() => drawLadder('Classic').path);
  assert.equal(new Set([ladders[oldIndex], ...classicDraws]).size, indices.length);
  for (const level of ['Stretch', 'Expert'] as const) {
    const seen = ladderBanks[level].map(() => {
      drawLadder('Classic');
      return drawLadder(level);
    });
    assert.equal(new Set(seen).size, ladderBanks[level].length);
    assert.notEqual(drawLadder(level), seen.at(-1));
  }
});

test('an expert finish needs the checkpoint and accepts a different route through it', () => {
  const puzzle = ladderBanks.Expert.find(p => p.path[0] === 'BOOK')!;
  const shortcut = 'BOOK LOOK LOCK LUCK BUCK BACK PACK PACE'.split(' ');
  assert.match(ladderStepError(puzzle, shortcut, 'PAGE')!, /Reach TELL/);
  const alternative = 'BOOK COOK COOL TOOL TOLL TELL TALL TALE PALE PAGE'.split(' ');
  for (let i = 1; i < alternative.length; i++) {
    assert.equal(ladderStepError(puzzle, alternative.slice(0, i), alternative[i]), undefined);
  }
  assert.ok(ladderStepError(puzzle, ['BOOK', 'COOK'], 'BOOK'));
  assert.ok(ladderStepError(puzzle, ['BOOK'], 'COOL'));
  assert.ok(ladderStepError(puzzle, ['BOOK'], 'BOO'));
  assert.ok(ladderStepError(puzzle, ['BOOK'], 'BO0K'));
});
