import type { CourseId } from "./schema";

export const textTypeGuideIds = {
  infographic: "c1e54cf5-1489-440b-a98c-3e7107bacc62",
  advertisement: "cf482e4c-3555-4e12-afca-b63396aec3ea",
  charityAppeal: "b0a0e8bb-7dfb-4fd6-8da0-a19d3dc95e92",
  nonfiction: "63208637-86ff-4f34-b522-dad42e9ab1ac",
  drama: "5131f911-d916-4135-8415-ce6ad59606ff",
  poetry: "8889a1cf-bfb4-4930-bc54-b693504ae80a",
} as const;

type TextTypeExample = {
  courseId: CourseId;
  kind: "infographic" | "advertisement" | "charity-appeal" | "poetry" | "drama" | "nonfiction";
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
  [textTypeGuideIds.charityAppeal]: {
    courseId: "language-literature", kind: "charity-appeal",
    title: "WWF — Adopt a snow leopard",
    description: "Trace how an animal portrait, adoption language and a practical contribution connect personal concern with conservation work.",
  },
  [textTypeGuideIds.nonfiction]: {
    courseId: "literature", kind: "nonfiction",
    title: "The Gastronomical Me — M. F. K. Fisher",
    description: "Read a remembered meal through the contrast between enthusiastic hospitality and concealed distress.",
  },
  [textTypeGuideIds.drama]: {
    courseId: "literature", kind: "drama",
    title: "Things I Know To Be True — Andrew Bovell",
    description: "Follow how a dispute about savings becomes a conflict over marriage, with dialogue and silence beside the analysis.",
  },
  [textTypeGuideIds.poetry]: {
    courseId: "literature", kind: "poetry",
    title: "Up-Hill — Christina Rossetti",
    description: "Read the poem beside an analysis of voice, repeated questions and the developing promise of rest.",
  },
};

export const plannedTextTypes: Record<"language-literature" | "literature", readonly string[]> = {
  "language-literature": ["Blog post", "Opinion/commentary", "Speech"],
  literature: ["Prose fiction"],
};

export function getTextTypeExample(itemId: string): TextTypeExample | undefined {
  return examples[itemId];
}

export function hasTextTypeExample(courseId: CourseId, itemId: string) {
  return getTextTypeExample(itemId)?.courseId === courseId;
}
