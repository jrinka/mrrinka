import {words} from './challenges';
import {drawFromBank} from './decks';

const defaultSignature = [...words].sort().join(',');

export function drawWordleWord(bank: string[] = words, avoid: string[] = []): string {
  const unique = [...new Set(bank)].sort();
  const isDefault = unique.join(',') === defaultSignature;
  // Initial draws, new rounds, and teacher setup must use the same index order.
  // Preserve the shipped order so existing default-bank progress remains valid.
  return drawFromBank(isDefault ? 'wordle' : 'wordle-custom', isDefault ? words : unique, 1, avoid)[0];
}
