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

  async function requestFeedback() {
    if (!passage || !response.trim()) return;
    setLoadingFeedback(true);
    setError("");
    try {
      const result = await fetch("/api/practice/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passage: passage.text, response }),
      });
      const data = await result.json();
      if (!result.ok) throw new Error(data.error);
      setFeedback(data.feedback);
      setRecords(current => [...current, {tool:"Passage Practice", createdAt:data.createdAt,model:data.model,policyVersion:data.policyVersion,evidence:`${passage.title} — ${passage.author}\n${passage.sourceUrl}\n\n${passage.text}`,draft:response,feedback:data.feedback,refused:data.refused}]);
    } catch (caught) {
      setError((caught as Error).message || "Feedback is unavailable right now.");
    } finally {
      setLoadingFeedback(false);
    }
  }

  function download() {
    if (!passage) return;
    const content = `${formatPracticeRecord(records)}\n\n## Current working passage and draft (may not have feedback)\n\n${passage.title} — ${passage.author}\n${passage.sourceUrl}\n\n${passage.text}\n\n${response || "(No analysis written)"}`;
    downloadRecord(content, "passage-practice-record.md");
    setExported(true);
    if (exportReset.current) clearTimeout(exportReset.current);
    exportReset.current = setTimeout(() => setExported(false), 1800);
  }

  return (
    <div className="passage-console">
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

      <section className="passage-panel passage-response">
        <header className="passage-panel-head"><div><span className="mono">ANALYSIS BAY / 01</span><h2>Your reading</h2></div><span className="mono">{responseWordCount} WORDS</span></header>
        <label htmlFor="passage-response">Analyse how the writing creates meaning or effect.</label>
        <div
          className="passage-writing-field"
          style={{ "--writing-progress": `${writingProgress * 100}%` } as CSSProperties}
        >
          <textarea id="passage-response" rows={11} disabled={loadingFeedback || loadingPassage} maxLength={8000} value={response} onChange={(event) => { setResponse(event.target.value); setFeedback(""); }} placeholder="Start with a detail: a word, image, pattern, shift, or structural choice…" />
        </div>
        <div className="passage-actions"><button className="button" onClick={requestFeedback} disabled={!passage || !response.trim() || loadingFeedback || loadingPassage}>{loadingFeedback ? <><RefreshCw className="spin" size={16} /> Reading…</> : <><Sparkles size={16} /> Request feedback</>}</button><button className={`button secondary ${exported ? "is-confirmed" : ""}`} onClick={download} disabled={!passage} aria-live="polite">{exported ? <><Check size={16} /> Exported / ready</> : <><Download size={16} /> Save record</>}</button></div>
        <p className="passage-privacy">Feedback stays focused on your analysis of this passage. This tool cannot generate assessment work or act as a chatbot. Your writing is sent to MiniMax and is not stored by this site. Save a record for teacher review or documentation; nothing is sent to your teacher automatically.</p>
      </section>

      {error && <p className="error" role="alert">{error}</p>}
      {feedback && <section className="passage-feedback" aria-live="polite"><span className="mono">M3 / FORMATIVE RESPONSE</span><h2>Feedback</h2><p>{feedback}</p><small>AI feedback can be inaccurate. Treat it as a second reader, not a final judgment.</small></section>}
    </div>
  );
}
