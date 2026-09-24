import test from "node:test";
import assert from "node:assert/strict";
import { courseSchema, courseSectionName, itemSchema } from "../lib/schema";
import { courses, publicCourse } from "../lib/content";
import { textTypeGuideIds } from "../lib/text-type-guides";
test("all course seeds have valid references and working activities", () => {
  for (const course of courses) {
    assert.ok(courseSchema.safeParse(course).success);
    assert.equal(
      course.items.filter((i) => i.practiceKind !== "none").length,
      2,
    );
  }
});
test("unsafe material URLs are rejected", () => {
  const original = courses[0].items[0];
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,test",
    "http://example.com",
    "//evil.test",
    "/uploads/../secret",
    "/uploads/\\evil",
  ]) {
    const item = {
      ...original,
      links: [
        { id: crypto.randomUUID(), title: "Unsafe", url, description: "" },
      ],
    };
    assert.equal(itemSchema.safeParse(item).success, false, url);
  }
});
test("duplicate IDs and dangling related pages are rejected", () => {
  const course = structuredClone(courses[0]);
  course.items.push(course.items[0]);
  assert.equal(courseSchema.safeParse(course).success, false);
  const other = structuredClone(courses[0]);
  other.items[0].relatedIds.push(crypto.randomUUID());
  assert.equal(courseSchema.safeParse(other).success, false);
});
test("public course data excludes unpublished drafts", () => {
  const item = courses[0].items[0];
  const published = item.published;
  try {
    item.published = false;
    assert.ok(!publicCourse(courses[0].id).items.some((i) => i.id === item.id));
  } finally {
    item.published = published;
  }
});
test("images cannot be saved without visible credit and a source link", () => {
  const item = structuredClone(courses[0].items[0]);
  item.imageCredit = "";
  assert.equal(itemSchema.safeParse(item).success, false);
  item.imageCredit = "Photographer";
  item.imageSource = "";
  assert.equal(itemSchema.safeParse(item).success, false);
});

test("shared IB pages read the canonical source and respect publication", () => {
  const sourceCourse = courses.find(c => c.id === "language-literature")!;
  const source = sourceCourse.items.find(i => i.title === "Paper 2")!;
  const reference = courses.find(c => c.id === "literature")!.items.find(i => i.title === "Paper 2")!;
  assert.equal(reference.sharedFrom?.itemId, source.id);
  assert.equal(reference.body, "");
  const previous = { body: source.body, published: source.published };
  try {
    source.body = "A teacher revision to the shared source";
    assert.equal(publicCourse("literature").items.find(i => i.id === reference.id)?.body, source.body);
    source.published = false;
    assert.equal(publicCourse("literature").items.some(i => i.id === reference.id), false);
  } finally {
    Object.assign(source, previous);
  }
});

test("shared references point directly to existing canonical pages", () => {
  for (const course of courses) for (const item of course.items) {
    if (!item.sharedFrom) continue;
    const target = courses.find(c => c.id === item.sharedFrom!.courseId)?.items.find(i => i.id === item.sharedFrom!.itemId);
    assert.ok(target, `${item.title}: missing shared source`);
    assert.equal(target.sharedFrom, undefined, "Shared references must not form chains or cycles");
    assert.equal(target.section, item.section);
  }
});

test("IB text-type guides have clear course labels and routes back to Paper 1", () => {
  const guides = [
    { course: "language-literature" as const, id: textTypeGuideIds.infographic, label: "Text types" },
    { course: "literature" as const, id: textTypeGuideIds.poetry, label: "Literary forms" },
  ];
  for (const { course, id, label } of guides) {
    assert.equal(courseSectionName(course, "text-types"), label);
    const pages = publicCourse(course).items;
    const guide = pages.find(item => item.id === id);
    const paperOne = pages.find(item => item.title === "Paper 1" && item.section === "assessment");
    assert.equal(guide?.section, "text-types");
    assert.ok(guide?.body.includes(`/courses/${course}/assessment/${paperOne?.id}`));
    assert.ok(paperOne?.body.includes(`/courses/${course}/text-types/${id}`));
  }
  const english = structuredClone(courses.find(course => course.id === "english-10")!);
  english.items.push({ ...english.items[0], id: crypto.randomUUID(), section: "text-types" });
  assert.equal(courseSchema.safeParse(english).success, false);
});
