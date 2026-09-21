"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowUpRight, Check, Download, RefreshCw, Sparkles } from "lucide-react";
import { downloadRecord, formatPracticeRecord, type PracticeRecord } from "@/lib/practice-record";
import { passageBooks } from "@/lib/passage-books";

type Passage = {
  id: number | null;
  title: string;
  author: string;
  text: string;
  sourceUrl: string;
  wordCount: number;
};

type FallbackPassage = { title: string; author: string; passage: string };

const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

function stripBoilerplate(text: string) {
  const start = text.search(/\*\*\*\s*START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^\r\n]*\*\*\*/i);
  const end = text.search(/\*\*\*\s*END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^\r\n]*\*\*\*/i);
  const body = start >= 0 ? text.slice(text.indexOf("***", start + 3) + 3) : text;
  return (end >= 0 ? body.slice(0, body.search(/\*\*\*\s*END OF/i)) : body).trim();
}

function extractPassage(raw: string) {
  const paragraphs = stripBoilerplate(raw)
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => !/^chapter\b|^book\b|^contents$/i.test(p));
  const candidates: string[] = [];

  for (const paragraph of paragraphs) {
    const count = wordCount(paragraph);
    if (count >= 100 && count <= 200) candidates.push(paragraph);
    if (count > 200) {
      const sentences = paragraph.split(/(?<=[.!?])\s+/);
      for (let start = 0; start < sentences.length; start += 1) {
        let excerpt = "";
        for (const sentence of sentences.slice(start)) {
          const next = `${excerpt} ${sentence}`.trim();
          if (wordCount(next) > 200) break;
          excerpt = next;
          if (wordCount(excerpt) >= 100) {
            candidates.push(excerpt);
            break;
          }
        }
      }
    }
  }

  return candidates[Math.floor(Math.random() * candidates.length)] ?? null;
}

export default function PassagePractice() {
  const [passage, setPassage] = useState<Passage | null>(null);
  const [response, setResponse] = useState("");
  const [feedback, setFeedback] = useState("");
  const [revision, setRevision] = useState("");
  const [revisionFeedback, setRevisionFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [records, setRecords] = useState<PracticeRecord[]>([]);
  const [loadingPassage, setLoadingPassage] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [exported, setExported] = useState(false);
  const [error, setError] = useState("");
  const loadController = useRef<AbortController | null>(null);
  const exportReset = useRef<ReturnType<typeof setTimeout> | null>(null);
  const responseWordCount = wordCount(response);
  const writingProgress = Math.min(responseWordCount / 250, 1);

  const loadPassage = useCallback(async () => {
    loadController.current?.abort();
    const controller = new AbortController();
    loadController.current = controller;
    setLoadingPassage(true);
    setError("");
    setFeedback("");
    setResponse("");
    setRevision("");
    setRevisionFeedback("");
    setSubmitted(false);

    const attempted = new Set<number>();
    try {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const available = passageBooks.filter(([id]) => !attempted.has(id));
        const [id, title, author] = available[Math.floor(Math.random() * available.length)];
        attempted.add(id);
        const result = await fetch(`/api/practice/gutenberg?id=${id}`, { signal: controller.signal });
        if (!result.ok) continue;
        const excerpt = extractPassage(await result.text());
        if (!excerpt) continue;
        setPassage({ id, title, author, text: excerpt, sourceUrl: `https://www.gutenberg.org/ebooks/${id}`, wordCount: wordCount(excerpt) });
        return;
      }

      const result = await fetch("/data/passage-practice.json", { signal: controller.signal });
      const fallbacks = (await result.json()) as FallbackPassage[];
      const item = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      setPassage({ id: null, title: item.title, author: item.author, text: item.passage, sourceUrl: "https://www.gutenberg.org/", wordCount: wordCount(item.passage) });
    } catch (caught) {
      if ((caught as Error).name !== "AbortError") setError("The archive did not respond. Try another passage.");
    } finally {
      if (!controller.signal.aborted) setLoadingPassage(false);
    }
  }, []);

  useEffect(() => {
    loadPassage();
    return () => {
      loadController.current?.abort();
      if (exportReset.current) clearTimeout(exportReset.current);
    };
  }, [loadPassage]);

  async function requestFeedback(refined = false) {
    const draft = refined ? revision : response;
    if (!passage || !draft.trim()) return;
    setLoadingFeedback(true);
    setError("");
    try {
      const result = await fetch("/api/practice/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passage: passage.text, response: draft, previousResponse: refined ? response : "" }),
      });
      const data = await result.json();
      if (!result.ok) throw new Error(data.error);
      if (refined) setRevisionFeedback(data.feedback);
      else {
        setFeedback(data.feedback);
        if (!data.refused) { setSubmitted(true); setRevision(draft); }
      }
      setRecords(current => [...current, {tool:"Passage Practice", createdAt:data.createdAt,model:data.model,policyVersion:data.policyVersion,evidence:`${passage.title} — ${passage.author}\n${passage.sourceUrl}\n\n${passage.text}`,draft,reflection:refined ? "Revision of the original response to this passage." : "",feedback:data.feedback,refused:data.refused}]);
    } catch (caught) {
      setError((caught as Error).message || "Feedback is unavailable right now.");
    } finally {
      setLoadingFeedback(false);
    }
  }

  function downloadOffline(mode:"extract"|"writing"|"both") {
    if (!passage) return;
    const source=`${passage.title} — ${passage.author}\n${passage.sourceUrl}\n\n${passage.text}`;
    const writing=`Your analysis\n${response||"(No analysis written)"}\n\nYour revision\n${revision||"(No revision written)"}`;
    downloadRecord(["Passage Practice — Literature Paper 1 skills",mode!=="writing"?source:"",mode!=="extract"?writing:""].filter(Boolean).join("\n\n"),`passage-${mode}.txt`);
  }
  function download() {
    if (!passage) return;
    const content = `${formatPracticeRecord(records)}\n\nCurrent working passage and draft (may not have feedback)\n\n${passage.title} — ${passage.author}\n${passage.sourceUrl}\n\n${passage.text}\n\n${response || "(No analysis written)"}\n\nCurrent refined draft (may not have feedback)\n\n${revision || "(No revision written)"}`;
    downloadRecord(content, "passage-practice-record.txt");
    setExported(true);
    if (exportReset.current) clearTimeout(exportReset.current);
    exportReset.current = setTimeout(() => setExported(false), 1800);
  }

  return (
    <div className="passage-console">
      <div className="passage-reading-column">
      <section className="passage-panel passage-source" aria-busy={loadingPassage}>
        <header className="passage-panel-head">
          <div><span className="mono">ARCHIVE SIGNAL / RANDOM EXTRACT</span><h2>{loadingPassage ? "Locating passage…" : passage?.title}</h2></div>
          <button className="button secondary" onClick={loadPassage} disabled={loadingPassage || loadingFeedback}><RefreshCw size={16} /> New passage</button>
        </header>
        {loadingPassage ? <div className="passage-loading"><i /><i /><i /><i /></div> : passage && <>
          <blockquote>{passage.text}</blockquote>
          <footer><span>{passage.author}</span><span className="mono">{passage.wordCount} WORDS</span><a href={passage.sourceUrl} target="_blank" rel="noreferrer">GUTENBERG <ArrowUpRight size={13} /></a></footer>
        </>}
      </section>

      <section className="offline-tools"><h3>Work offline</h3><div className="tool-actions"><button type="button" className="button secondary" disabled={!passage||loadingPassage} onClick={()=>downloadOffline("extract")}>Extract (.txt)</button><button type="button" className="button secondary" disabled={!passage||loadingPassage} onClick={()=>downloadOffline("writing")}>My writing (.txt)</button><button type="button" className="button secondary" disabled={!passage||loadingPassage} onClick={()=>downloadOffline("both")}>Extract + writing (.txt)</button></div></section>
      <div aria-live="polite">
        {feedback && <section className="passage-feedback"><span className="mono">FIRST RESPONSE</span><h2>Feedback</h2><p>{feedback}</p><small>AI feedback can be inaccurate. Check it against the passage.</small></section>}
        {revisionFeedback && <section className="passage-feedback"><span className="mono">REFINED RESPONSE</span><h2>Revision feedback</h2><p>{revisionFeedback}</p><small>Keep testing your interpretation against the passage.</small></section>}
      </div>
      </div>
      <div className="passage-writing-column">
      <section className="passage-panel passage-response">
        <header className="passage-panel-head"><div><span className="mono">ANALYSIS BAY / 01</span><h2>Your reading</h2></div><span className="mono">{responseWordCount} WORDS</span></header>
        <label htmlFor="passage-response">Analyse how the writing creates meaning or effect.</label>
        <div
          className="passage-writing-field"
          style={{ "--writing-progress": `${writingProgress * 100}%` } as CSSProperties}
        >
          <textarea id="passage-response" rows={11} readOnly={submitted} disabled={loadingFeedback || loadingPassage} maxLength={8000} value={response} onChange={(event) => { setResponse(event.target.value); setFeedback(""); }} placeholder="Start with a detail: a word, image, pattern, shift, or structural choice…" />
        </div>
        <div className="passage-actions"><button className="button" onClick={() => requestFeedback()} disabled={submitted || !passage || !response.trim() || loadingFeedback || loadingPassage}>{loadingFeedback ? <><RefreshCw className="spin" size={16} /> Reading…</> : <><Sparkles size={16} /> {submitted ? "Original submitted" : "Request feedback"}</>}</button><button className={`button secondary ${exported ? "is-confirmed" : ""}`} onClick={download} disabled={!passage} aria-live="polite">{exported ? <><Check size={16} /> Exported / ready</> : <><Download size={16} /> Save record</>}</button></div>
        <p className="passage-privacy">Feedback stays focused on your analysis of this passage. This tool cannot generate assessment work or act as a chatbot. Your writing is sent to MiniMax and processed by M3; it is not stored by this site. Do not include names, contact details, student IDs or other personally identifiable information. Save a record for teacher review or documentation; nothing is sent to your teacher automatically.</p>
      </section>

      {submitted && <section className="passage-panel passage-response passage-revision">
        <header className="passage-panel-head"><div><span className="mono">REFINE / 02</span><h2>Your refined reading</h2></div><span className="mono">{wordCount(revision)} WORDS</span></header>
        <label htmlFor="passage-revision">Use the feedback to revise your analysis. Your original stays above.</label>
        <div className="passage-writing-field"><textarea id="passage-revision" rows={10} maxLength={8000} disabled={loadingFeedback || loadingPassage} value={revision} onChange={event => {setRevision(event.target.value);setRevisionFeedback("");}} /></div>
        <div className="passage-actions"><button className="button" onClick={() => requestFeedback(true)} disabled={loadingFeedback || !revision.trim() || revision.trim() === response.trim()}>{loadingFeedback ? <><RefreshCw className="spin" size={16} /> Reading…</> : <><Sparkles size={16} /> Request revision feedback</>}</button><button className="button secondary" onClick={download}><Download size={16} /> Save record</button></div>
      </section>}
      {error && <p className="error" role="alert">{error}</p>}
      </div>
    </div>
  );
}
