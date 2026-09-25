import {drawFromDeck} from './logic';

type DeckState = { signature: string; remaining: number[]; last: number[] };
const memory = new Map<string, DeckState>();
const prefix = 'brain-break-deck-v1:';

// Only a bank fingerprint and shuffled indices are saved, never teacher-entered words.
// Read on every draw so another tab's most recent progress is respected.
export function drawFromBank<T>(key: string, items: T[], count = 1, avoid: T[] = []): T[] {
  if (!items.length) return [];
  let hash = 2166136261;
  for (const char of JSON.stringify(items)) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  const signature = `${items.length}:${hash >>> 0}`;
  const validIndices = (value: unknown): value is number[] => Array.isArray(value) && value.every(i => Number.isInteger(i) && i >= 0 && i < items.length) && new Set(value).size === value.length;
  const validState = (value: unknown): value is DeckState => {
    const state = value as DeckState | null;
    return !!state && state.signature === signature && validIndices(state.remaining) && validIndices(state.last);
  };
  let state = memory.get(key);
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(prefix + key) || 'null');
    if (validState(stored)) state = stored;
  } catch { /* Private browsing or storage limits: keep an in-memory rotation. */ }
  if (!validState(state)) state = {signature, remaining: [], last: []};
  const indices = items.map((_, index) => index);
  const recent = [...state.last, ...avoid.map(item => items.indexOf(item)).filter(index => index >= 0)];
  const drawn = drawFromDeck(indices, state.remaining, count, recent);
  state.last = drawn;
  memory.set(key, state);
  try { localStorage.setItem(prefix + key, JSON.stringify(state)); } catch { /* Play still works without storage. */ }
  return drawn.map(index => items[index]);
}
