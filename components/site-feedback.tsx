"use client";

import { useState } from "react";
import { aiChoices, feedbackChoiceLabel, feedbackTargets, guideChoices, type FeedbackTarget } from "@/lib/site-feedback";

export default function SiteFeedback({ target }: { target: FeedbackTarget }) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [trap, setTrap] = useState("");
  const choices = feedbackTargets[target].type === "ai" ? aiChoices : guideChoices;

  async function send(choice: string) {
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/site-feedback", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, choice, trap }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setStatus(result.alreadyCounted ? "Already counted today. Thank you." : "Thank you. Your vote was recorded.");
    } catch {
      setStatus("Could not save your vote. Please try again later.");
    } finally {
      setBusy(false);
    }
  }

  return <details className="site-feedback">
    <summary>Feedback</summary>
    <div className="site-feedback-body">
      <p>{feedbackTargets[target].type === "ai" ? "How was this AI guidance?" : "How was this page?"}</p>
      <div className="site-feedback-choices">{choices.map(choice => <button type="button" key={choice} disabled={busy || status.includes("recorded") || status.includes("counted")} onClick={() => void send(choice)}>{feedbackChoiceLabel(choice)}</button>)}</div>
      <label className="site-feedback-trap" aria-hidden="true">Leave this field empty<input type="text" value={trap} onChange={event => setTrap(event.target.value)} tabIndex={-1} autoComplete="off" /></label>
      <small>No writing or contact information is sent. One vote per page each day.</small>
      {status && <p className="site-feedback-status" role="status">{status}</p>}
    </div>
  </details>;
}
