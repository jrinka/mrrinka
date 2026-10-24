import Link from 'next/link';
import GlobalShell from '@/components/global-shell';
import WhatChanges from '@/components/what-changes';
import {changeExercises} from '@/lib/what-changes';
import {feedbackProvider} from '@/lib/feedback-service';
import AiGuidanceBadge from '@/components/ai-guidance-badge';
export const metadata={title:'What changes?'};
export default function Page(){return <GlobalShell><div className="global-page-head"><span className="mono">TERMINOLOGY / PRACTICE</span><h1>What changes?</h1><AiGuidanceBadge/><p>Compare two versions. Notice the changed choice, explain its significance, then test your reading against another possibility.</p><p>{changeExercises.length} short comparisons using original classroom examples, with authored guidance for every comparison and optional AI feedback.</p><p>Want to review the terms first? <Link href="/practice/flashcards">Try term flashcards →</Link></p></div><WhatChanges provider={feedbackProvider()}/></GlobalShell>;}
