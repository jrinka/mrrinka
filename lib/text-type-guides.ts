import type { CourseId } from "./schema";

export const textTypeGuideIds = {
  infographic: "c1e54cf5-1489-440b-a98c-3e7107bacc62",
  poetry: "8889a1cf-bfb4-4930-bc54-b693504ae80a",
} as const;

export const plannedTextTypes: Record<"language-literature" | "literature", readonly string[]> = {
  "language-literature": ["Blog post", "Speech", "Charity appeal"],
  literature: ["Prose fiction", "Drama", "Literary nonfiction"],
};

export function hasTextTypeExample(courseId: CourseId, itemId: string) {
  return (courseId === "language-literature" && itemId === textTypeGuideIds.infographic)
    || (courseId === "literature" && itemId === textTypeGuideIds.poetry);
}
