"use client";

import { useRef, useState } from "react";
import ExportFormatSelect from "./export-format";
import { downloadRecord, type ExportFormat } from "@/lib/practice-record";
import {
  paperTwoQuestions, questionPools, questionSource, drawQuestion, formatPaperTwoNotes, hasDraft,
  type PaperTwoDraft, type QuestionPool,
} from "@/lib/paper-two-practice";

export default function PaperTwoPractice() {
  const [pool, setPool] = useState<QuestionPool>("recent");
  const [questionId, setQuestionId] = useState<string>();
  const [seen, setSeen] = useState<string[]>([]);
  const [visited, setVisited] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<Record<string, PaperTwoDraft>>({});
  const [format, setFormat] = useState<ExportFormat>("txt");
  const questionRef = useRef<HTMLDivElement>(null);
  const question = paperTwoQuestions.find(q => q.id === questionId);
  const draft = questionId ? drafts[questionId] ?? {} : {};
  const exportable = Object.values(drafts).some(hasDraft);
  const count = paperTwoQuestions.filter(q => q.pool === pool).length;

  function focusQuestion() { requestAnimationFrame(() => questionRef.current?.focus()); }
  function draw(nextPool = pool) {
    const next = drawQuestion(nextPool, seen, questionId);
    setSeen(next.seen);
    setPool(nextPool);
    setQuestionId(next.question.id);
    setVisited(previous => previous.includes(next.question.id) ? previous : [...previous, next.question.id]);
    // Carry the chosen pair into a new question; keep previous drafts intact.
    setDrafts(previous => previous[next.question.id] ? previous : { ...previous, [next.question.id]: { workA: draft.workA ?? "", workB: draft.workB ?? "" } });
    focusQuestion();
  }
  function update(key: keyof PaperTwoDraft, value: string) {
    if (!questionId) return;
    setDrafts(previous => ({ ...previous, [questionId]: { ...previous[questionId], [key]: value } }));
  }

  return <section className="paper-two-practice" aria-labelledby="paper-two-practice-title">
    <header><span className="mono">PAPER 2 / QUESTION TO THESIS</span><h3 id="paper-two-practice-title">Start a comparative argument</h3>
      <p>Draw a question, choose two works you have read, and write a thesis that answers it. Aim for a claim you can support, then test it against details from both works.</p>
    </header>
    <div className="p2-question-controls">
      <div className="field"><label htmlFor="p2-question-bank">Question bank</label><select id="p2-question-bank" value={pool} onChange={e => { const next = e.target.value as QuestionPool; if (question) draw(next); else setPool(next); }}>{questionPools.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}</select></div>
      <button className="button" type="button" onClick={() => draw()}>{question ? "Draw another question" : "Draw a question"}</button>
    </div>
    <p className="hint">{count} questions in this bank. Questions do not repeat until you have drawn the whole bank. {pool !== "recent" && "These questions come from earlier syllabuses. Keep any genre or other limits in the wording; they are practice material, not a guide to the present exam format."}</p>
    {visited.length > 1 && <label className="field p2-return">Return to a question from this visit<select value={questionId} onChange={e => { const selected = paperTwoQuestions.find(q => q.id === e.target.value)!; setQuestionId(selected.id); setPool(selected.pool); focusQuestion(); }}>{visited.map((id, index) => { const q = paperTwoQuestions.find(item => item.id === id)!; return <option key={id} value={id}>{index + 1}. {questionSource(q)} — {q.text.slice(0, 55)}…</option>; })}</select></label>}
    <div ref={questionRef} tabIndex={-1} className="p2-question" aria-label="Selected Paper 2 question">
      {question ? <><p className="mono">{questionSource(question)}</p><blockquote>{question.text}</blockquote></> : <p>Your question will appear here. You can try the same pair of works with several questions or choose a new pair when needed.</p>}
    </div>
    {question && <div className="p2-draft">
      <section><h4>1. Read the whole question</h4><label className="field">What does this question ask you to explain or argue?<span className="hint">Identify the focus and any limits. If it asks “how,” your answer needs to examine the writing.</span><textarea rows={2} maxLength={2000} value={draft.focus ?? ""} onChange={e => update("focus", e.target.value)} /></label></section>
      <section><h4>2. Choose two works and test the connection</h4><p>Choose works by different authors that give you enough evidence for this question. A useful comparison can develop a similarity, a difference, or a relationship that changes as you read.</p>
        <div className="p2-work-pair">{(["A", "B"] as const).map(letter => <fieldset key={letter}><legend>Work {letter}</legend><label className="field">Title and author — work {letter}<input maxLength={250} value={draft[`work${letter}`] ?? ""} onChange={e => update(`work${letter}`, e.target.value)} /></label><label className="field">Evidence and choices — work {letter}<span className="hint">Note a precise moment, the writer’s choice, and what it suggests in relation to the question. Add a complication if one matters.</span><textarea rows={5} maxLength={4000} value={draft[`evidence${letter}`] ?? ""} onChange={e => update(`evidence${letter}`, e.target.value)} /></label></fieldset>)}</div>
      </section>
      <section><h4>3. Make a comparative claim</h4><details className="p2-question-reminder"><summary>Reread the question</summary><p>{question.text}</p></details><label className="field">My comparative thesis<span className="hint">In one or two sentences, answer the question through the relationship between the works. Explain what that relationship helps us understand. You do not need a list of three techniques.</span><textarea rows={4} maxLength={3000} value={draft.thesis ?? ""} onChange={e => update("thesis", e.target.value)} /></label>
        <details className="p2-self-check"><summary>Test your thesis before revising</summary><ul><li>Does it answer this question, including its particular wording?</li><li>Does it connect the works, rather than make two separate observations?</li><li>Can you support the claim by examining choices in both works?</li><li>Does any important detail complicate the claim or require a qualification?</li></ul><p>Another reading may also be convincing. Your job is to explain why yours fits the evidence. These questions help you revise; they do not produce a mark or a single correct answer.</p></details>
        <label className="field">My revised thesis <span className="hint">Optional. Keep the first version so you can see what changed.</span><textarea rows={4} maxLength={3000} value={draft.revision ?? ""} onChange={e => update("revision", e.target.value)} /></label>
      </section>
    </div>}
    <div className="p2-export"><ExportFormatSelect value={format} onChange={setFormat}/><button type="button" className="button secondary" disabled={!exportable} onClick={() => downloadRecord(formatPaperTwoNotes(drafts), "paper-2-thesis-practice.txt", format)}>Export all my planning</button></div>
    <p className="hint">Notes stay with each question during this visit. Export before leaving or refreshing. Your writing is not sent to the server.</p>
    <details className="p2-bank-note"><summary>About the question bank</summary><p>Questions come from the supplied IB English A past-paper catalogue, May 2010–May 2025. The recent bank contains 44 questions from 2023–2025, shared by Literature and Language &amp; Literature. The earlier banks retain the original questions and genre limits. Duplicate copies are counted once; only spacing has been standardized. Exam questions © International Baccalaureate Organization.</p></details>
  </section>;
}
