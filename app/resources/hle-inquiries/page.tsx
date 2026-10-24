import Link from "next/link";
import GlobalShell from "@/components/global-shell";
import styles from "./inquiry-guide.module.css";

export const metadata = { title: "HLE: how a line of inquiry develops" };

const steps = [
  {
    title: "Start with an observation",
    example: "The chair says that everyone has a voice, but Mira never gets to read her letter.",
    explanation: "This identifies a specific mismatch between what a character says and what happens. It gives the inquiry something concrete to investigate.",
  },
  {
    title: "Trace a pattern",
    example: "Each statement about participation is followed by another moment in which Mira remains unheard.",
    explanation: "The repeated contrast connects the opening, middle, and ending. The focus moves from one incident to the way the scene is organized.",
  },
  {
    title: "Locate the writer’s choices",
    example: "The writer repeats inclusive words such as “every,” “we,” and “everyone,” then places them beside Mira’s unanswered gestures.",
    explanation: "The focus becomes the relationship between dialogue and action. Naming repetition alone would not explain what is distinctive about this scene.",
  },
  {
    title: "Connect the choices to meaning",
    example: "The language makes the meeting sound open, while the chair’s actions control who can actually speak.",
    explanation: "A broad topic such as power becomes a particular tension: the appearance of participation can conceal exclusion. This is a possible reading to investigate.",
  },
  {
    title: "Form a working inquiry",
    example: "How does the contrast between inclusive language and unanswered gestures in “The Welcome” shape the portrayal of authority?",
    explanation: "The question brings together the text, a specific relationship between choices, and an area of meaning. An answer would need to explain how the details work together.",
  },
];

export default function Page() {
  return (
    <GlobalShell>
      <Link className="back" href="/resources">← Skills &amp; Methods</Link>
      <div className="global-page-head">
        <span className="mono">HLE / WORKED EXAMPLE</span>
        <h1>How an inquiry develops</h1>
        <p>A line of inquiry develops as a reader connects details, recognizes a pattern, and asks how the writer’s choices shape meaning.</p>
      </div>
      <div className={styles.guide}>
        <p className={styles.introduction}>This worked example shows that process. The short scene below supplies all the context needed to follow the explanation.</p>
        <section className={styles.source} aria-labelledby="scene-title">
          <span className="mono">ORIGINAL TEACHING EXAMPLE</span>
          <h2 id="scene-title">“The Welcome”</h2>
          <p className={styles.context}>At a neighborhood meeting, Mira waits to read a letter to the committee.</p>
          <div className={styles.excerpts}>
            <div><h3>Opening</h3><p>“Every family has a voice here,” the chair said. At the back of the room, Mira held a folded letter.</p></div>
            <div><h3>Middle</h3><p>“We have heard everyone.” Mira raised her hand. The chair turned to the next item on the agenda.</p></div>
            <div><h3>Ending</h3><p>“Thank you for speaking so openly.” Chairs scraped. Mira smoothed the creases in her letter, then folded it again.</p></div>
          </div>
        </section>
        <section className={styles.development} aria-labelledby="development-title">
          <h2 id="development-title">From observation to working inquiry</h2>
          <ol className={styles.flow}>
            {steps.map((step, index) => (
              <li className={styles.step} key={step.title}>
                <div className={styles.stepHeading}>
                  <span className={styles.number} aria-hidden="true">{index + 1}</span>
                  <h3>{step.title}</h3>
                </div>
                <div className={styles.stepBody}>
                  <p className={styles.example}>{step.example}</p>
                  <div className={styles.explanation}><h4>How the thinking develops</h4><p>{step.explanation}</p></div>
                </div>
                {index < steps.length - 1 && <span className={styles.arrow} aria-hidden="true">↓</span>}
              </li>
            ))}
          </ol>
        </section>
        <section className={styles.revisit} aria-labelledby="revisit-title">
          <h2 id="revisit-title">The inquiry can change as the reading develops</h2>
          <p>Mira’s raised hand complicates a reading of her silence as simple acceptance. She tries to participate, but the chair moves on. Returning to that detail makes the focus more precise: the scene presents an attempt to speak being ignored.</p>
          <p>The working question leaves room for that distinction. It may stay the same while the argument develops, or change when further evidence shifts the focus.</p>
          <p className={styles.return}><span aria-hidden="true">↳ </span>Return to the details, reconsider the pattern, and refine the question where needed.</p>
        </section>
        <section className={styles.takeaway} aria-labelledby="takeaway-title">
          <h2 id="takeaway-title">What this shows about an HLE inquiry</h2>
          <p>Each step narrows the focus while making the reasoning more specific. “Power” is a topic; the relationship between inclusive language and exclusion gives the writer’s choices a clear place in the investigation.</p>
          <p>This miniature scene illustrates the thinking. In an HLE, the inquiry develops through close reading across a studied work or body of work. The stages can overlap and repeat as the evidence becomes clearer.</p>
        </section>
      </div>
    </GlobalShell>
  );
}
