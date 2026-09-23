import { createHmac } from "node:crypto";
import { z } from "zod";

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
export const feedbackRequest = z.object({
  target: z.enum(Object.keys(feedbackTargets) as [FeedbackTarget, ...FeedbackTarget[]]),
  choice: z.enum([...aiChoices, ...guideChoices]),
  trap: z.string().max(0).default(""),
}).strict().superRefine((value, ctx) => {
  const choices: readonly string[] = feedbackTargets[value.target].type === "ai" ? aiChoices : guideChoices;
  if (!choices.includes(value.choice)) ctx.addIssue({ code: "custom", path: ["choice"], message: "Invalid feedback choice." });
});

export const feedbackCookie = "rinka-feedback-visitor";
export const feedbackPrefix = "site-feedback/v1/";
export function feedbackKey(date: Date, target: FeedbackTarget, visitor: string, secret: string) {
  const day = date.toISOString().slice(0, 10);
  const digest = createHmac("sha256", secret).update(`site-feedback-v1\0${day}\0${target}\0${visitor}`).digest("hex");
  return `${feedbackPrefix}${day}/${target}/${digest}.json`;
}
export function feedbackChoiceLabel(choice: string) {
  return choice.replaceAll("-", " ").replace(/^./, first => first.toUpperCase());
}
