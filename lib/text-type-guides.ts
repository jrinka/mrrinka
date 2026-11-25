import type { CourseId } from "./schema";

export const textTypeGuideIds = {
  advertorial: "ccb7ce91-2ed6-4114-9626-e51733d172c0",
  podcast: "746d8c8a-0c8a-4ba0-9f37-0e38ffdcf686",
  letter: "027cb949-724f-4872-bef8-4f2599684139",
  webpage: "81d752ad-9f14-43a5-a7b5-34e14a7a7803",
  article: "b773dc6e-4794-4c80-a99f-8cdd183b20f4",
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

type AdditionalExample = {
  key: string;
  marker: string;
  title: string;
  shortTitle: string;
  description: string;
};

type TextTypeExample = {
  shortTitle: string;
  additional?: AdditionalExample[];
  courseId: CourseId;
  kind: "advertorial" | "podcast" | "letter" | "webpage" | "article" | "speech" | "opinion" | "blog" | "infographic" | "advertisement" | "charity-appeal" | "poetry" | "drama" | "nonfiction" | "prose" | "cartoon";
  title: string;
  description: string;
};

const examples: Record<string, TextTypeExample> = {
  [textTypeGuideIds.advertorial]: {
    shortTitle: "Stapelstein",
    courseId: "language-literature", kind: "advertorial", title: "Stapelstein — Katie Cloyd for Romper",
    description: "Trace how a parent’s story shifts between family experience, product claims and a recommendation in openly sponsored writing.",
  },
  [textTypeGuideIds.podcast]: {
    shortTitle: "The Happiness Lab",
    courseId: "language-literature", kind: "podcast", title: "The Happiness Lab — The War For Kindness",
    description: "Follow how two speakers make empathy understandable, practical and voluntary through framing, comparisons and a classroom example.",
  },
  [textTypeGuideIds.letter]: {
    shortTitle: "Letter to Thom",
    courseId: "language-literature", kind: "letter", title: "Letter to Thom — John Steinbeck",
    description: "Follow how a father combines reassurance, ethical distinctions and practical advice while respecting his son’s feelings.",
  },
  [textTypeGuideIds.webpage]: {
    shortTitle: "Redwoods Treewalk",
    courseId: "language-literature", kind: "webpage", title: "Redwoods Treewalk — Rotorua",
    description: "Connect photographs, language of wonder, practical details and visible choices to see how a webpage promotes an experience.",
  },
  [textTypeGuideIds.article]: {
    shortTitle: "Lensa AI",
    courseId: "language-literature", kind: "article", title: "Lensa AI and artists’ work — Brendan Paul Murphy",
    description: "Explore how familiar images make a technical dispute approachable while preserving concern about its consequences.",
    additional: [
      {
        key: "microdramas", marker: "Microdramas",
        shortTitle: "Microdramas", title: "Microdramas and binge-watching — Johnny Chan",
        description: "Examine how familiar examples and a reinforcing sequence explain sustained viewing, while qualifications limit the claims about AI and possible solutions.",
      },
    ],
  },
  [textTypeGuideIds.speech]: {
    shortTitle: "Helen Clark’s eulogy",
    courseId: "language-literature", kind: "speech", title: "Eulogy for Sir Edmund Hillary — Helen Clark",
    description: "Trace how extraordinary achievement, shared mourning and practical service become an invitation to continue a legacy of compassion.",
  },
  [textTypeGuideIds.opinion]: {
    shortTitle: "Netball",
    courseId: "language-literature", kind: "opinion", title: "Should Netball Be Our National Sport? — Alasdair McClintock",
    description: "Follow teasing reversals, self-deprecation and shared affection as a sports column builds its case for recognition.",
  },
  [textTypeGuideIds.blog]: {
    shortTitle: "Follow your dreams",
    courseId: "language-literature", kind: "blog", title: "Follow your dreams — Oliver Emberton",
    description: "Connect a conversational voice, bee illustrations and practical advice to see how the post makes focused effort seem necessary and achievable.",
  },
  [textTypeGuideIds.cartoon]: {
    shortTitle: "The History of Technology",
    courseId: "language-literature", kind: "cartoon", title: "The History of Technology — Andy Singer",
    description: "Compare two panels to see how a changed world and a repeated complaint challenge an assumption about progress.",
    additional: [
      {
        key: "comic", marker: "Sequential comic",
        shortTitle: "I Was Reading That!", title: "I Was Reading That! — Dave Roman",
        description: "Follow a book through six panels and examine how actions, dialogue and the final reply challenge a claim of superior reading.",
      },
    ],
  },
  [textTypeGuideIds.infographic]: {
    shortTitle: "Early years activity",
    courseId: "language-literature", kind: "infographic",
    title: "Physical activity for early years",
    description: "Follow an audience inference, examine the visual choices, and build an analytical response beside the source.",
    additional: [
      {
        key: "cycling", marker: "Cycling",
        shortTitle: "Shifting to Cycling", title: "The Benefits of Shifting to Cycling — ITDP",
        description: "Connect everyday journeys, projected benefits and policy action, with careful reading of charts and qualifications.",
      },
    ],
  },
  [textTypeGuideIds.advertisement]: {
    shortTitle: "FIJI Water",
    courseId: "language-literature", kind: "advertisement",
    title: "FIJI Water — No Added Chemicals",
    description: "Read the whole spread, zoom into its details, and trace how visual contrast and product claims build a preference.",
  },
  [textTypeGuideIds.charityAppeal]: {
    shortTitle: "The Elephant Sanctuary",
    courseId: "language-literature", kind: "charity-appeal",
    title: "The Elephant Sanctuary — 2018 Spring Appeal",
    description: "Connect named elephants, evidence of individual care and an annual grocery list with the invitation to join the team.",
    additional: [
      {
        key: "wwf", marker: "WWF",
        shortTitle: "WWF snow leopard appeal", title: "WWF — Adopt a snow leopard",
        description: "Compare how a live adoption webpage connects personal concern with ongoing conservation support.",
      },
    ],
  },
  [textTypeGuideIds.prose]: {
    shortTitle: "Moon Tiger",
    courseId: "literature", kind: "prose", title: "Moon Tiger — Penelope Lively",
    description: "Follow a childhood accident through three perspectives and examine how each changes our understanding of rivalry and blame.",
  },
  [textTypeGuideIds.nonfiction]: {
    shortTitle: "The Gastronomical Me",
    courseId: "literature", kind: "nonfiction",
    title: "The Gastronomical Me — M. F. K. Fisher",
    description: "Read a remembered meal through the contrast between enthusiastic hospitality and concealed distress.",
    additional: [
      {
        key: "divisions", marker: "Divisions Upon Greek Ground",
        shortTitle: "Divisions Upon Greek Ground", title: "Divisions Upon Greek Ground — Lawrence Durrell",
        description: "Trace changes in atmosphere through a secluded house, a noisy boat, a forceful sea and the final image of growth.",
      },
    ],
  },
  [textTypeGuideIds.drama]: {
    shortTitle: "Things I Know To Be True",
    courseId: "literature", kind: "drama",
    title: "Things I Know To Be True — Andrew Bovell",
    description: "Follow how a dispute about savings becomes a conflict over marriage, with dialogue and silence beside the analysis.",
    additional: [
      {
        key: "bay-at-nice", marker: "The Bay at Nice",
        shortTitle: "The Bay at Nice", title: "The Bay at Nice — David Hare",
        description: "Trace a daughter’s attempt to speak as an equal through questions, an offered embrace, a rehearsed speech and final stillness.",
      },
    ],
  },
  [textTypeGuideIds.poetry]: {
    shortTitle: "Up-Hill",
    courseId: "literature", kind: "poetry",
    title: "Up-Hill — Christina Rossetti",
    description: "Read the poem beside an analysis of voice, repeated questions and the developing promise of rest.",
    additional: [
      {
        key: "paperweight", marker: "Paperweight",
        shortTitle: "The Paperweight", title: "The Paperweight — Gjertrud Schnackenberg",
        description: "Follow shifts in perspective, time and scale, and develop a supported reading that makes room for uncertainty.",
      },
      {
        key: "caught", marker: "Caught",
        shortTitle: "Caught", title: "Caught — Susan Adams",
        description: "Follow changing comparisons and distinguish attraction, constraint and the choice to return.",
      },
    ],
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
