// Short teaching summaries, not copied rubrics or a source of predicted marks.
// Sources and review notes: docs/ASSESSMENT-PROMPT-SOURCES.md.
const grounding = "Use these task landmarks only to frame diagnostic questions. Judge only details the student supplied; do not assume knowledge of the named work, unseen extract, visual features, or a rubric score. If evidence is missing, ask for it.";

const paper1 = "Paper 1: A response should move from accurate reading to an interpretation supported by relevant details, then explain and evaluate how particular authorial choices shape meaning. It should establish a clear focus early, ordinarily through the guiding question; a different focus needs to be a prominent formal or technical aspect of the passage. A list of techniques or a line-by-line summary is not enough. Attend to coherent development and precise language. Literature uses literary forms; Language and Literature uses non-literary text types.";

const paper2 = "Paper 2 is the same comparative literary task in both courses. The current rubric has five criteria, A, B1, B2, C and D, each worth five marks (25 total); do not award or predict marks in this coaching tool. Keep the student's chosen question central and use two literary works by different authors. Distinguish two jobs: analyse and evaluate how choices in each work shape meaning (B1), then analyse a meaningful similarity and/or difference between the works (B2). Both similarity and difference are not required. Because the exam is closed-book, precise references can support an idea without verbatim quotation. A list of parallels, plot summary, or two disconnected mini-essays does not establish a developed comparison.";

const io = "Individual Oral: a global issue should be focused, significant beyond one place, cross national boundaries, and have consequences in local everyday contexts. The student should eventually connect it to both chosen extracts and their wider works or body of work, explaining how authorial choices present it. The oral is not assessed as a comparison: do not require similarities, differences, a comparative thesis, or two different national cultures. One text and an uncertain observation are enough to begin exploration; ask for the second when useful. Language and Literature uses one literary work and one non-literary body of work; Literature uses a work originally in English and a work in translation. Do not presume eligibility from a title or author's nationality.";

const hle = "Higher Level Essay: test whether the student's own line of inquiry has an analytical focus on authorial choices and enough scope for a sustained 1,200–1,500-word essay about one eligible work or body of work. Ask whether their selected details can support an interpretation of the work beyond an isolated extract, and whether the inquiry can remain focused through a developing argument. Literature uses a literary work; Language and Literature may use an eligible literary work or non-literary body of work. Do not propose, rank, or rephrase inquiries for the student.";

export function refineryReference(kind:"analysis"|"comparison"|"global-issue"|"line-of-inquiry"|"passage", course?:string) {
  const task = kind === "comparison" ? paper2 : kind === "global-issue" ? io : kind === "line-of-inquiry" ? hle : kind === "passage" || course !== "english-10" ? paper1 : "General analysis: connect a precise observation to an authorial choice, explain how it works, and test the student's inference against the supplied text.";
  return `${grounding} ${task}`;
}

export function inquiryReference(kind:"global-issue"|"line-of-inquiry") {
  return `${grounding} ${kind === "global-issue" ? io : hle}`;
}
