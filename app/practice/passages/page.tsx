import type { Metadata } from "next";
import GlobalShell from "@/components/global-shell";
import PassagePractice from "@/components/passage-practice";

export const metadata: Metadata = { title: "Passage Practice" };

export default function PassagePracticePage() {
  return (
    <GlobalShell>
      <div className="global-page-head passage-page-head">
        <span className="mono">PRACTICE CONSOLE / LITERARY ANALYSIS</span>
        <h1>Passage Practice</h1>
        <p>Read an unfamiliar extract, make a claim about how it works, and get brief formative feedback.</p>
      </div>
      <PassagePractice />
    </GlobalShell>
  );
}

