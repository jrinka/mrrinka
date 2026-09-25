import type { CourseId } from "./schema";

export const textTypeGuideIds = {
  speech: "501e5fac-47a8-4c41-a081-ac57220685c2",
  opinion: "9860d817-e8b4-4a15-b499-b0df6b780f28",
  blog: "a6b9e918-4b25-4ae8-9f6c-08bd45c89173",
  cartoon: "64dc8a9a-f80c-4e62-8a60-55a641a7b7f7",
  infographic: "c1e54cf5-1489-440b-a98c-3e7107bacc62",
  advertisement: "cf482e4c-3555-4e12-afca-b63396aec3ea",
  charityAppeal: "b0a0e8bb-7dfb-4fd6-8da0-a19d3dc95e92",
  prose: "197e1470-54d4-470b-a22a-414e4d4d00b9",
  nonfiction: "63208637-86ff-4f34-b522-dad42e9ab1ac",
  drama: "5131f911-d916-4135-8415-ce6ad59606ff",
  poetry: "8889a1cf-bfb4-4930-bc54-b693504ae80a",
} as const;

type TextTypeExample = {
  courseId: CourseId;
  kind: "speech" | "opinion" | "blog" | "infographic" | "advertisement" | "charity-appeal" | "poetry" | "drama" | "nonfiction" | "prose" | "cartoon";
  title: string;
  description: string;
};

const examples: Record<string, TextTypeExample> = {
  [textTypeGuideIds.speech]: {
    courseId: "language-literature", kind: "speech", title: "Eulogy for Sir Edmund Hillary — Helen Clark",
    description: "Trace how extraordinary achievement, shared mourning and practical service become an invitation to continue a legacy of compassion.",
  },
  [textTypeGuideIds.opinion]: {
    courseId: "language-literature", kind: "opinion", title: "Should Netball Be Our National Sport? — Alasdair McClintock",
    description: "Follow teasing reversals, self-deprecation and shared affection as a sports column builds its case for recognition.",
  },
  [textTypeGuideIds.blog]: {
    courseId: "language-literature", kind: "blog", title: "Follow your dreams — Oliver Emberton",
    description: "Connect a conversational voice, bee illustrations and practical advice to see how the post makes focused effort seem necessary and achievable.",
  },
  [textTypeGuideIds.cartoon]: {
    courseId: "language-literature", kind: "cartoon", title: "The History of Technology — Andy Singer",
    description: "Compare two panels to see how a changed world and a repeated complaint challenge an assumption about progress.",
  },
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
    title: "The Elephant Sanctuary — 2018 Spring Appeal",
    description: "Connect named elephants, evidence of individual care and an annual grocery list with the invitation to join the team.",
  },
  [textTypeGuideIds.prose]: {
    courseId: "literature", kind: "prose", title: "Moon Tiger — Penelope Lively",
    description: "Follow a childhood accident through three perspectives and examine how each changes our understanding of rivalry and blame.",
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
  "language-literature": [],
  literature: [],
};

export function getTextTypeExample(itemId: string): TextTypeExample | undefined {
  return examples[itemId];
}

export function hasTextTypeExample(courseId: CourseId, itemId: string) {
  return getTextTypeExample(itemId)?.courseId === courseId;
}
