"use client";
import { useRef, useState } from "react";

const examples = [
  {
    id: "literature", label: "Literature", title: "Robert Frost · Stopping by Woods on a Snowy Evening",
    question: "How does the poem’s movement develop the speaker’s relationship with the woods?",
    source: "https://poets.org/poem/stopping-woods-snowy-evening", sourceLabel: "Read the poem · Academy of American Poets",
    sentences: [
      "In Robert Frost’s ‘Stopping by Woods on a Snowy Evening’, a traveller pauses to watch snow falling in a secluded wood.",
      "The pause draws attention to the appeal of stillness before the speaker recalls obligations beyond the scene.",
      "By shifting from the sights and sounds of the woods to a repeated reminder of the journey ahead, Frost shows the speaker weighing the desire to stay against the need to continue.",
    ],
    notes: [
      "Identifies poet, title and the immediate situation, without treating Frost and the speaker as the same person.",
      "Moves from the literal pause to an interpretive tension: the attraction of stillness and the return of obligation.",
      "Answers the guiding question through the poem’s movement and repetition. It gives the body an argument to test rather than a list of devices.",
    ],
    evidence: "Test this reading against the quiet sounds, the turn at ‘But’, and the repeated final line. The ending recalls continuing obligations without narrating an actual departure. Avoid treating the woods as an automatic symbol for death.",
  },
  {
    id: "language-literature", label: "Language & Literature", title: "CDC · Becky’s anti-smoking advertisement",
    question: "How do language and image work together to persuade the audience to quit smoking?",
    source: "https://www.cdc.gov/tobacco/campaign/tips/resources/ads/pdf-print-ads/beckys-tip-print-ad-7x10.pdf", sourceLabel: "Open the advertisement · CDC",
    sentences: [
      "The CDC’s anti-smoking advertisement presents Becky alongside the oxygen equipment on which she depends.",
      "Addressing people who smoke, it turns the familiar idea of being attached to cigarettes into a visible physical constraint.",
      "Through the interaction of the headline and photographs, the advertisement presents smoking as a threat to independence, while its invitation to seek help frames quitting as a way to act on that warning.",
    ],
    notes: [
      "Identifies creator, text type and immediate situation, using information visible in the advertisement.",
      "Establishes a plausible audience and develops an interpretation of the relationship between language and image.",
      "Answers the guiding question and suggests two connected lines of analysis: the warning about dependence and the invitation to act.",
    ],
    evidence: "Test this reading against the headline’s ‘attached’, the visible oxygen tubing, and the offer of help. These details support the interpretation; they do not prove that every viewer will quit smoking.",
  },
];

export default function IntroductionExamples({initialExample}:{initialExample:string}) {
  const [selected,setSelected]=useState(initialExample==="language-literature"?1:0);
  const buttons=useRef<(HTMLButtonElement|null)[]>([]);
  function choose(index:number,focus=false){
    setSelected(index);
    if(focus)buttons.current[index]?.focus();
    const url=new URL(window.location.href);url.searchParams.set("example",examples[index].id);
    window.history.replaceState(null,"",url);
  }
  return <section id="worked-examples" className="intro-examples" aria-labelledby="examples-heading">
    <span className="mono">SAME METHOD / TWO APPLICATIONS</span>
    <h2 id="examples-heading">See the introduction take shape</h2>
    <p>Original teaching models, not official marked responses. Each offers one reading to test against its source.</p>
    <div role="tablist" aria-label="Worked example course" className="intro-example-tabs">
      {examples.map((example,index)=><button key={example.id} ref={node=>{buttons.current[index]=node;}} id={`tab-${example.id}`} type="button" role="tab" aria-selected={selected===index} aria-controls={`example-${example.id}`} tabIndex={selected===index?0:-1} onClick={()=>choose(index)} onKeyDown={event=>{
        if(["ArrowLeft","ArrowRight","Home","End"].includes(event.key)){
          event.preventDefault();choose(event.key==="Home"?0:event.key==="End"?1:1-selected,true);
        }
      }}>{example.label}</button>)}
    </div>
    {examples.map((example,index)=><div key={example.id} role="tabpanel" id={`example-${example.id}`} aria-labelledby={`tab-${example.id}`} hidden={selected!==index} tabIndex={0} className="intro-example-panel prose">
      <h3>{example.title}</h3>
      <p><strong>Practice guiding question:</strong> {example.question}</p>
      <a href={example.source}>{example.sourceLabel} ↗</a>
      <blockquote>{example.sentences.join(" ")}</blockquote>
      <h3>What each sentence does</h3>
      <ol className="intro-sentence-notes">{example.sentences.map((sentence,i)=><li key={sentence}><p><strong>{sentence}</strong></p><p>{example.notes[i]}</p></li>)}</ol>
      <aside className="lens-intro"><strong>Check the interpretation against the text</strong><p>{example.evidence}</p></aside>
      <p>The body must support these claims with precise details. An introduction establishes a direction; it does not prove the argument on its own.</p>
    </div>)}
  </section>;
}
