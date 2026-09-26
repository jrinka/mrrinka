export const dramaExample = {
  title: "Things I Know To Be True — Andrew Bovell",
  pdf: "/examples/things-i-know-to-be-true-extract.pdf",
  question: "How is dialogue used to communicate the emotional tension in the relationship between Fran and Bob?",
  context: "Bob has just learned that his wife has secretly been saving money.",
  credit: "Andrew Bovell, Things I Know To Be True. Supplied extract and guiding question. Source adapted by the examination paper. Rights remain with their respective holders.",
};

type Speech = { speaker?: string; text: string };
export const dramaPassages: { title: string; lines: Speech[] }[] = [
  { title: "Money and independence", lines: [
    { speaker: "FRAN", text: "It was mine. My wage. I earned it." },
    { speaker: "BOB", text: "Right. It’s just that every pay packet I ever earned went straight into a bank account with both our names on it. There was never a mine. Just ours." },
    { speaker: "FRAN", text: "It was my ‘Get Out’ money, Bob. I saw it happen to my mother. Stuck in a miserable marriage with a man she didn’t love because she couldn’t afford to leave. It wasn’t going to happen to me. So, I put a little away. Every pay. Until I had enough to buy some shares." },
    { speaker: "BOB", text: "Shares!" },
    { speaker: "FRAN", text: "Mining. Iron ore. The price goes through the roof and suddenly I’m a wealthy woman. I start to get nervous. I read the papers. I can see what’s coming so I sell. And then the price goes down. I played it well." },
    { speaker: "BOB", text: "Right." },
    { speaker: "FRAN", text: "I’m not justifying it… I don’t have to." },
    { speaker: "BOB", text: "No. But a man wouldn’t mind an explanation why he wasn’t let in on it." },
  ] },
  { title: "Questions and what staying means", lines: [
    { speaker: "FRAN", text: "I told you… I had to know I could go if I ever needed to." },
    { speaker: "BOB", text: "Did you… Ever need to?" },
    { text: "Her silence is the answer." },
    { speaker: "BOB", text: "What stopped you?" },
    { speaker: "FRAN", text: "The children. I stayed because of the kids." },
    { speaker: "BOB", text: "And me? Where was I in this picture?" },
    { speaker: "FRAN", text: "You can’t love someone for thirty years straight. You fall out of love. Or there’s no time for love. Or love is not the point. Getting by is the point. Raising children is the point. I’ll stop if you don’t want to hear this." },
    { speaker: "BOB", text: "No… I want to know." },
  ] },
  { title: "Settling and honesty", lines: [
    { speaker: "FRAN", text: "You fall out of love. You just do. And you think about, maybe, something else. Another life. But it passes. If you wait long enough, one day you realize that the man you did love is still there, still sitting across the table from you, still sleeping on the other side of the bed. And you settle for that." },
    { speaker: "BOB", text: "You settled for me." },
    { speaker: "FRAN", text: "I’m being honest, Bob." },
  ] },
];

export const dramaReadingSections: Record<string, { label: string; phase: string; passage: number | null }> = {
  "read-the-encounter": { label: "Read the encounter", phase: "Orient", passage: null },
  "mine-and-ours": { label: "Mine & ours", phase: "Analyse", passage: 0 },
  "the-question-and-the-silence": { label: "Question & silence", phase: "Analyse", passage: 1 },
  "the-children-and-the-missing-me": { label: "The missing ‘me’", phase: "Analyse", passage: 1 },
  "settling-and-being-honest": { label: "Settling & honesty", phase: "Analyse", passage: 2 },
  "build-an-analytical-response": { label: "Build a response", phase: "Write", passage: 2 },
  "practice-and-transfer": { label: "Practice & transfer", phase: "Write", passage: 1 },
};

export const dramaNoteFields = [
  { key: "exchange", label: "The exchange and what changes", hint: "What does one speaker say, and how does the reply accept, resist or change it?" },
  { key: "evidence", label: "Connected evidence", hint: "Choose short quotations from both speakers. Distinguish stage directions from imagined performance choices." },
  { key: "analysis", label: "Your analytical paragraph", hint: "Explain how the exchange develops emotional tension between Fran and Bob." },
] as const;
