import type { CourseId } from "./schema";

export const textTypeGuideIds = {
  infographic: "c1e54cf5-1489-440b-a98c-3e7107bacc62",
  advertisement: "cf482e4c-3555-4e12-afca-b63396aec3ea",
  poetry: "8889a1cf-bfb4-4930-bc54-b693504ae80a",
} as const;

type TextTypeExample = {
  courseId: CourseId;
  kind: "infographic" | "advertisement" | "poetry";
  title: string;
  description: string;
};

const examples: Record<string, TextTypeExample> = {
  [textTypeGuideIds.infographic]: {
    courseId: "language-literature", kind: "infographic",
    title: "Physical activity for early years",
    description: "Follow an audience inference, examine the visual choices, and build an analytical response beside the source.",
  },
  [textTypeGuideIds.advertisement]: {
    courseId: "language-literature", kind: "advertisement",
    title: "FIJI Water — No Added Chemicals",
    description: "Read the whole spread, zoom into its details, and trace how visual contrast and product claims build a preference.",
  },
  [textTypeGuideIds.poetry]: {
    courseId: "literature", kind: "poetry",
    title: "Up-Hill — Christina Rossetti",
    description: "Read the poem beside an analysis of voice, repeated questions and the developing promise of rest.",
  },
};

export const plannedTextTypes: Record<"language-literature" | "literature", readonly string[]> = {
  "language-literature": ["Charity appeal", "Blog post", "Opinion/commentary", "Speech"],
  literature: ["Prose fiction", "Drama", "Literary nonfiction"],
};

export function getTextTypeExample(itemId: string): TextTypeExample | undefined {
  return examples[itemId];
}

export function hasTextTypeExample(courseId: CourseId, itemId: string) {
  return getTextTypeExample(itemId)?.courseId === courseId;
}
