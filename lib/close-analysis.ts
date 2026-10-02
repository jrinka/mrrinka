import { z } from "zod";
export type CloseSource = {id:string; title:string; credit:string; context:string; prompt:string; images:string[]; url:string; transcript:string};
export const wordCount = (value:string) => value.trim().split(/\s+/).filter(Boolean).length;
export const closeRequest = z.object({
 sourceId:z.enum(["tourism","parenting","theatre"]), area:z.string().trim().min(1).max(100),
 feature:z.string().trim().min(3).max(200), evidence:z.string().trim().min(10).max(700),
 draft:z.string().trim().min(20).max(1800).refine(value=>wordCount(value)<=180,"Keep this to one short paragraph (180 words maximum)."),
 previousDraft:z.string().max(1800).default(""), reflection:z.string().max(500).default(""),
}).strict();
