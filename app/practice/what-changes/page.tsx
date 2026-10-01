import Link from 'next/link';
import GlobalShell from '@/components/global-shell';
import WhatChanges from '@/components/what-changes';
export const metadata={title:'What changes?'};
export default function Page(){return <GlobalShell><div className="global-page-head"><span className="mono">TERMINOLOGY / PRACTICE</span><h1>What changes?</h1><p>Compare two versions. Notice the changed choice, explain its significance, then test your reading against another possibility.</p><p>Seven short comparisons using original classroom examples.</p><p>Want to review the terms first? <Link href="/practice/flashcards">Try term flashcards →</Link></p></div><WhatChanges/></GlobalShell>;}
