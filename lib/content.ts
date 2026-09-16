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
  return { ...course, items: course.items.filter((i) => i.published) };
}
