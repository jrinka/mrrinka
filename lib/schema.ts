import { z } from "zod";
export const courseIds = [
  "language-literature",
  "literature",
  "english-10",
] as const;
export const sections = [
  "units",
  "assessment",
  "text-types",
  "resources",
  "practice",
] as const;
export const sectionNames = {
  units: "Units & texts",
  assessment: "Assessment",
  "text-types": "Text types & forms",
  resources: "Skills & Methods",
  practice: "Practice",
};
const safeUrl = z
  .string()
  .max(2000)
  .refine((v) => {
    if (!v) return true;
    if (v.startsWith("/uploads/") && !v.includes("..") && !v.includes("\\"))
      return true;
    try {
      return new URL(v).protocol === "https:";
    } catch {
      return false;
    }
  }, "Use an HTTPS link or an uploaded file.");
const photoUrl = z
  .string()
  .max(2000)
  .refine((v) => {
    if (!v) return true;
    if (/^\/(images|archive)\/[a-zA-Z0-9_-]+\.(jpg|png|webp)$/.test(v))
      return true;
    try {
      const u = new URL(v);
      return u.protocol === "https:" && u.hostname === "images.unsplash.com";
    } catch {
      return false;
    }
  }, "Use a built-in image or a direct images.unsplash.com image URL.");
export const resourceSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(120),
  url: safeUrl.refine(Boolean, "Add a link."),
  description: z.string().max(400),
});
export const itemSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string().trim().min(1).max(140),
    section: z.enum(sections),
    summary: z.string().max(500),
    body: z.string().max(50000),
    sharedFrom: z.object({ courseId: z.enum(courseIds), itemId: z.string().uuid() }).optional(),
    published: z.boolean(),
    image: photoUrl,
    imageAlt: z.string().max(200),
    imageCredit: z.string().max(150),
    imageSource: safeUrl,
    links: z.array(resourceSchema).max(30),
    relatedIds: z.array(z.string().uuid()).max(30),
    practiceKind: z.enum(["none", "paragraph", "close-reading"]),
  })
  .superRefine((item, ctx) => {
    if (
      item.image &&
      (!item.imageCredit.trim() ||
        !item.imageSource.trim() ||
        !item.imageAlt.trim())
    )
      ctx.addIssue({
        code: "custom",
        message:
          "Every image needs alt text, a photographer credit, and a source link.",
      });
  });
export const courseSchema = z
  .object({
    id: z.enum(courseIds),
    title: z.string().trim().min(1).max(140),
    shortTitle: z.string().trim().min(1).max(60),
    eyebrow: z.string().max(80),
    description: z.string().max(600),
    announcement: z.string().max(1000),
    featuredId: z.string().uuid().or(z.literal("")),
    items: z.array(itemSchema).max(150),
  })
  .superRefine((course, ctx) => {
    if (course.id === "english-10" && course.items.some(item => item.section === "text-types"))
      ctx.addIssue({ code: "custom", message: "Text-type guides belong to an IB course." });
    const ids = new Set(course.items.map((i) => i.id));
    if (ids.size !== course.items.length)
      ctx.addIssue({
        code: "custom",
        message: "Each page must have a unique ID.",
      });
    if (course.featuredId && !ids.has(course.featuredId))
      ctx.addIssue({
        code: "custom",
        message: "The featured unit no longer exists.",
      });
    for (const item of course.items) {
      if (item.relatedIds.some((id) => !ids.has(id) || id === item.id))
        ctx.addIssue({
          code: "custom",
          message:
            "Related pages must exist in this course and cannot link to themselves.",
        });
    }
  });
export type Course = z.infer<typeof courseSchema>;
export type CourseItem = z.infer<typeof itemSchema>;
export type CourseId = Course["id"];
export type Section = (typeof sections)[number];
export function courseSectionName(courseId: CourseId, section: Section) {
  if (section === "text-types")
    return courseId === "literature" ? "Literary forms" : "Text types";
  return sectionNames[section];
}
export function isCourseId(id: string): id is CourseId {
  return (courseIds as readonly string[]).includes(id);
}
