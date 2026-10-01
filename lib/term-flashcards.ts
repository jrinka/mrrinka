import { terms, type Category } from './terminology';
export type TermCourse = 'literature' | 'language-literature';
// These entries primarily address advertising or photographic technique.
// Keep visual composition and perspective: they also apply to graphic novels.
const nonLiteraryFocus = new Set(['logo-slogan', 'target-audience', 'depth-of-field']);
export function flashcardTerms(course: TermCourse, category: Category | 'all' = 'all') {
  return terms.filter(term => (course !== 'literature' || !nonLiteraryFocus.has(term.id)) &&
    (category === 'all' || term.categories.includes(category)));
}
export function shuffleCards<T>(cards: readonly T[]): T[] {
  const result = [...cards];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
