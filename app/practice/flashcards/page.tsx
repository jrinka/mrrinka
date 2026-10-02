import Link from 'next/link';
import GlobalShell from '@/components/global-shell';
import TermFlashcards from '@/components/term-flashcards';
export const metadata = { title: 'Term flashcards' };
export default async function Page({searchParams}:{searchParams:Promise<{course?:string}>}) {
  const query = await searchParams;
  const course = query.course === 'literature' ? 'literature' : 'language-literature';
  return <GlobalShell><div className="global-page-head"><span className="mono">TERMINOLOGY / PRACTICE</span><h1>Term flashcards</h1><p>Build confidence with the vocabulary of analysis. Choose your course, recall a term, then check its meaning and consider how you could use it.</p><p>Knowing a label is a starting point. Analysis explains how a specific choice contributes to meaning.</p><p><Link href="/resources/analysis-reference">Browse Terms for analysis ↗</Link></p></div><TermFlashcards key={course} initialCourse={course} /></GlobalShell>;
}
