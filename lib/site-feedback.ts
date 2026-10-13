import { createHmac } from "node:crypto";
import { z } from "zod";

import { feedbackTargets, aiChoices, guideChoices, type FeedbackTarget } from "./site-feedback-options";
export { feedbackTargets, aiChoices, guideChoices, feedbackChoiceLabel, type FeedbackTarget } from "./site-feedback-options";

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
