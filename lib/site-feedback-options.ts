export const feedbackTargets = {
  "passage-practice": { label: "Passage Practice", type: "ai" },
  "analysis-refinery": { label: "Analysis Refinery", type: "ai" },
  "comparison-refinery": { label: "Comparison Refinery", type: "ai" },
  "global-issue-refinery": { label: "Global Issue Refinery", type: "ai" },
  "line-of-inquiry-refinery": { label: "Line of Inquiry Refinery", type: "ai" },
  "observation-guide": { label: "From observation to analysis", type: "guide" },
  "questions-guide": { label: "Unpacking questions", type: "guide" },
  "introductions-guide": { label: "Introductions & thesis statements", type: "guide" },
  "lenses-guide": { label: "Critical Lenses", type: "guide" },
} as const;
export type FeedbackTarget = keyof typeof feedbackTargets;
export const aiChoices = ["helpful", "off-target", "too-leading", "technical-problem"] as const;
export const guideChoices = ["useful", "confusing", "incorrect", "broken-link"] as const;

export function feedbackChoiceLabel(choice: string) {
  return choice.replaceAll("-", " ").replace(/^./, first => first.toUpperCase());
}
