import Link from "next/link";
import { redirect } from "next/navigation";
import { authorizedSession } from "@/lib/auth";
import { feedbackChoiceLabel, feedbackTargets, aiChoices, guideChoices } from "@/lib/site-feedback";
import { readSiteFeedback } from "@/lib/site-feedback-summary";

export const dynamic = "force-dynamic";
export const metadata = { title: "Site feedback", robots: { index: false, follow: false } };

export default async function FeedbackPage() {
  if (!(await authorizedSession())) redirect("/admin");
  let summary;
  try { summary = await readSiteFeedback(); } catch { summary = null; }
  return <main className="feedback-admin">
    <Link href="/admin" className="wordmark">mr rinka<span>_</span></Link>
    <div className="global-page-head"><span className="mono">TEACHER WORKSPACE / QUIET SIGNALS</span><h1>Site feedback</h1><p>Anonymous fixed-choice votes from the last 30 days. No student writing or contact details are collected, and no per-vote alerts are sent.</p></div>
    {!summary ? <p role="alert">Feedback totals are unavailable right now. Try again later.</p> : <>
      <p className="feedback-admin-total">{summary.total} {summary.total === 1 ? "vote" : "votes"} across selected pages</p>
      {summary.limited && <p className="hint">This view reached its 5,000-entry limit; older votes in the window are omitted.</p>}
      {!summary.rows.length ? <p>No feedback has been recorded in this window.</p> : <div className="feedback-admin-rows">{summary.rows.map(row => {
        const choices = feedbackTargets[row.target].type === "ai" ? aiChoices : guideChoices;
        return <section className="feedback-admin-row" key={`${row.target}-${row.model}`}>
          <div><h2>{row.label}</h2><span className="mono">{row.model === "none" ? "GUIDE" : row.model} / {row.total}</span></div>
          <dl>{choices.map(choice => <div key={choice}><dt>{feedbackChoiceLabel(choice)}</dt><dd>{row.counts[choice] ?? 0}</dd></div>)}</dl>
        </section>;
      })}</div>}
    </>}
    <p><Link href="/admin">← Back to editor</Link></p>
  </main>;
}
