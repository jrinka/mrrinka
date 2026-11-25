import { ibAiPolicy } from "@/lib/refineries";

export default function RefineryBoundary() {
  return <details className="inquiry-explainer">
    <summary>Using AI for assessed work</summary>
    <p>Follow your teacher’s and school’s rules. Use the questions to test your ideas against your texts. You choose the evidence, develop the argument, and write the final wording yourself. Acknowledge any AI material you use. Only your teacher or examiner can award a mark.</p>
    <a href={ibAiPolicy}>IB academic integrity policy and AI guidance ↗</a>
  </details>;
}

export function RefineryDataNotice({ provider }: { provider: string }) {
  return <p className="passage-privacy">Requesting feedback sends your entries to {provider}. Leave out personal details such as student names, IDs, or contact information. This site does not store your writing or send it to your teacher.</p>;
}
