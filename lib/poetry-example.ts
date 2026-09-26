import { literatureExample } from "./literature-example";
import type { LiteraryReading } from "./literary-reading";

export const poetryExample: LiteraryReading = {
 title: "Up-Hill — Christina Rossetti", author: "CHRISTINA ROSSETTI", poem: true, poemAlternatingIndent: true,
 question: literatureExample.question, questionCredit: "Practice guiding question",
 context: "An unnamed questioner asks about an uphill journey; another voice responds. Read the sentences through their line breaks.",
 sources: [{ label: "Original poem", url: literatureExample.source }],
 credit: "Christina Rossetti, Up-Hill. Public-domain poem, checked against the Academy of American Poets source. Line numbers and stanza labels are editorial aids. On narrower panels, a numbered line may wrap. The question and analysis are original teaching material.",
 passages: literatureExample.stanzas.map((paragraphs, index) => ({ title: `Stanza ${index + 1} · lines ${index * 4 + 1}–${index * 4 + 4}`, paragraphs })),
 sections: {
  "read-the-dialogue-as-a-whole": { label: "Read the whole dialogue", phase: "Orient", passage: null },
  "difficulty-acknowledged-companionship-offered": { label: "Difficulty & companionship", phase: "Analyse", passage: 0 },
  "darkness-and-the-fear-of-missing-shelter": { label: "Finding shelter", phase: "Analyse", passage: 1 },
  "finding-the-door-and-being-welcomed": { label: "Being welcomed", phase: "Analyse", passage: 2 },
  "rest-widens-from-me-to-all": { label: "From me to all", phase: "Analyse", passage: 3 },
  "what-the-repeated-form-contributes": { label: "Form & repetition", phase: "Analyse", passage: null },
  "build-an-analytical-response": { label: "Build a response", phase: "Write", passage: null },
  "practice-and-transfer": { label: "Practice & transfer", phase: "Write", passage: 3 },
 },
 fields: [
  { key: "contrast", label: "The relationship you will explain", hint: "How does the final stanza hold exhaustion and the promise of rest together?" },
  { key: "evidence", label: "Connected evidence", hint: "Connect the traveler’s vulnerability with the widening from me to all." },
  { key: "analysis", label: "Your analytical paragraph", hint: "Explain how the exchange develops reassurance without claiming that the questions or difficulty disappear." },
 ],
 checks: ["Have I distinguished the voices from the poet?", "Have I explained the relationship between a question and its reply?", "Have I connected form with particular words and ideas?", "Does my claim account for both the promised rest and continuing exhaustion?"],
 filename: "up-hill-notes",
};
