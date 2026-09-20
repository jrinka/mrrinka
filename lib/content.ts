import language from "@/content/language-literature.json";
import literature from "@/content/literature.json";
import english from "@/content/english-10.json";
import { courseSchema, type CourseId } from "./schema";
export const courses = [language, literature, english].map((c) =>
  courseSchema.parse(c),
);
export function getCourse(id: CourseId) {
  return courses.find((c) => c.id === id)!;
}
export function publicCourse(id: CourseId) {
  const course = getCourse(id);
  return { ...course, items: course.items.flatMap((item) => {
    if (!item.published) return [];
    if (!item.sharedFrom) return [item];
    const source = getCourse(item.sharedFrom.courseId).items.find(i => i.id === item.sharedFrom!.itemId);
    // A missing, unpublished, or chained source must never expose stale copied content.
    if (!source?.published || source.sharedFrom) return [];
    return [{ ...item, title: source.title, summary: source.summary, body: source.body, links: source.links }];
  }) };
}
