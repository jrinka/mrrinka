import banks from './banks.json';
import {drawFromBank} from './decks';
import {shuffle} from './logic';

export const scatterLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(letter => !'XQZ'.includes(letter));
const broad = banks.scatter.filter(category => category.startsWith('Something'));
const familiar = banks.scatter.filter(category => !category.startsWith('Something'));

export function drawScatterCategories(avoid: string[] = []): string[] {
  return shuffle([
    ...drawFromBank('scatter-broad', broad, 8, avoid),
    ...drawFromBank('scatter-specific', familiar, 4, avoid),
  ]);
}
