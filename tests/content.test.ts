import test from "node:test";
import assert from "node:assert/strict";
import { courseSchema, itemSchema } from "../lib/schema";
import { courses, publicCourse } from "../lib/content";
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
