import Link from 'next/link';
import { notFound } from 'next/navigation';
import GlobalShell from '@/components/global-shell';
import IOPlanning from '@/components/io-planning';
export const metadata = { title: 'IO analysis planning' };
export function generateStaticParams() { return [{ course: 'literature' }, { course: 'language-literature' }]; }
export default async function Page({ params }: { params: Promise<{ course: string }> }) {
  const { course } = await params;
  if (course !== 'literature' && course !== 'language-literature') notFound();
  const id = course === 'literature' ? 'fbf43751-e7ea-491b-b4dc-bcd596896401' : '82d7dfa3-e66b-4f94-8c58-91733c967e6c';
  return <GlobalShell><div className="global-page-head"><span className="mono">INDIVIDUAL ORAL / {course === 'literature' ? 'LITERATURE' : 'LANGUAGE & LITERATURE'}</span><h1>Analysis planning</h1><p>Record your evidence and interpretation before reducing them to speaking cues. Use the same clearly phrased global issue to guide both selections.</p><p><Link href={`/courses/${course}/assessment/${id}#analysis-planning-sheets`}>Return to the IO guide →</Link></p></div><IOPlanning key={course} course={course} /></GlobalShell>;
}
