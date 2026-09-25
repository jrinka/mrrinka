export const cartoonExample = {
  "title": "The History of Technology — Andy Singer",
  "url": "/examples/singer-history-of-technology.png",
  "image": "/examples/singer-history-of-technology.png",
  "imageAlt": "Two-panel cartoon. At left, an unhappy prehistoric figure sits among trees, flowers and fish, saying ME NOT HAPPY. At right, a similarly unhappy suited man sits on a heap of manufactured objects below an industrial skyline and aircraft, saying STILL NOT HAPPY!",
  "imageCredit": "© Andy Singer. The History of Technology, from No Exit. Cartoon from the supplied examination page; original publication date and exam session are not identified on that page.",
  "question": "Discuss how text and image work together to communicate the message of the cartoon."
};
export const cartoonReadingSections: Record<string, {label:string;phase:string;location:string;note:string}> = {
  "read-the-two-panels-together": {
    "label": "Read both panels",
    "phase": "Orient",
    "location": "The complete comparison",
    "note": "Read left to right, then compare the figures and their surroundings. What changes, and what persists?"
  },
  "a-grand-title-and-a-very-small-history": {
    "label": "Title & historical scale",
    "phase": "Analyse",
    "location": "The title and panel boundary",
    "note": "Compare the scale promised by the title with the two scenes used to represent it. No Exit is the collection name."
  },
  "a-changed-setting-a-repeated-figure": {
    "label": "The repeated figure",
    "phase": "Analyse",
    "location": "Pose, expression and clothing",
    "note": "Compare the position of the arms, eyes and mouth in both panels. Put those similarities beside the changed clothing."
  },
  "from-natural-life-to-manufactured-clutter": {
    "label": "The two environments",
    "phase": "Analyse",
    "location": "Backgrounds and foregrounds",
    "note": "Follow the replacement of natural life with manufactured objects. Both panels are detailed; identify the different kinds of abundance."
  },
  "still-not-happy": {
    "label": "The force of still",
    "phase": "Analyse",
    "location": "The two speech balloons",
    "note": "Read ME NOT HAPPY beside STILL NOT HAPPY! The word still connects the complaints across the visual transformation."
  },
  "build-an-analytical-response": {
    "label": "Build a response",
    "phase": "Write",
    "location": "Connect wording and drawing",
    "note": "Select details that work together to question a particular assumption about progress. Avoid separate inventories of language and image."
  },
  "practice-and-transfer": {
    "label": "Practise & transfer",
    "phase": "Write",
    "location": "The title, settings and repeated complaint",
    "note": "Connect a detail from each environment to the title. Check your claim against the first figure’s explicit unhappiness."
  }
};
export const cartoonNoteFields = [
  {
    "key": "audience",
    "label": "The cartoon’s central argument",
    "hint": "What assumption does the comparison challenge? Go beyond the topic of technology."
  },
  {
    "key": "evidence",
    "label": "Words and images working together",
    "hint": "Connect precise wording with details from both panels."
  },
  {
    "key": "analysis",
    "label": "Your analytical paragraph",
    "hint": "Explain how the title and contrasting environments develop the message, accounting for the repeated unhappiness."
  }
] as const;
