import type { Metadata } from "next";
import GlobalShell from "@/components/global-shell";
import PassagePractice from "@/components/passage-practice";
import { feedbackProvider } from "@/lib/feedback-service";

export const metadata: Metadata = { title: "Passage Practice" };

export default function PassagePracticePage() {
  return (
    <GlobalShell>
      <div className="global-page-head passage-page-head">
        <span className="mono">PRACTICE CONSOLE / LITERARY ANALYSIS</span>
        <h1>Passage Practice</h1>
        <p>Practice Literature Paper 1 close-reading skills with an unfamiliar literary extract. Write here for optional AI feedback, or download the extract and work offline. These short exercises are not full exam simulations.</p>
      </div>
      <PassagePractice provider={feedbackProvider()} />
    </GlobalShell>
  );
}
