import test from "node:test";
import assert from "node:assert/strict";
import { courseSchema, courseSectionName, itemSchema } from "../lib/schema";
import { courses, publicCourse } from "../lib/content";
import { getTextTypeExample, textTypeGuideIds } from "../lib/text-type-guides";
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
  const previous = { body: source.body, published: source.published, rubrics: source.rubrics };
  try {
    source.body = "A teacher revision to the shared source";
    source.rubrics = [{ id: crypto.randomUUID(), title: "Paper 2 rubric", url: "/rubrics/paper-2.pdf", description: "" }];
    const published = publicCourse("literature").items.find(i => i.id === reference.id);
    assert.equal(published?.body, source.body);
    assert.deepEqual(published?.rubrics, source.rubrics);
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

test("shared guidance can carry a different rubric for each course's Individual Oral", () => {
  const source = courses.find(c => c.id === "language-literature")!.items.find(i => i.title === "Individual Oral")!;
  const literature = courses.find(c => c.id === "literature")!.items.find(i => i.title === "Individual Oral")!;
  const sourceRubrics = source.rubrics;
  const literatureRubrics = literature.rubrics;
  const previousPublished = source.published;
  try {
    const langLitFile = { id: crypto.randomUUID(), title: "Language and Literature IO", url: "/rubrics/lang-lit-io.docx", description: "" };
    const literatureFile = { ...langLitFile, id: crypto.randomUUID(), title: "Literature IO", url: "/rubrics/literature-io.docx" };
    source.rubrics = [langLitFile];
    literature.rubrics = [literatureFile];
    const publishedOral = () => publicCourse("literature").items.find(i => i.id === literature.id);
    assert.deepEqual(publishedOral()?.rubrics, [literatureFile]);
    assert.equal(publishedOral()?.body, source.body);
    assert.deepEqual(publicCourse("language-literature").items.find(i => i.id === source.id)?.rubrics, [langLitFile]);
    literature.rubrics = [];
    assert.deepEqual(publishedOral()?.rubrics, []);
    delete literature.rubrics;
    assert.deepEqual(publishedOral()?.rubrics, [langLitFile]);
    source.published = false;
    assert.equal(publishedOral(), undefined);
  } finally {
    source.rubrics = sourceRubrics;
    literature.rubrics = literatureRubrics;
    source.published = previousPublished;
  }
});

test("IB text-type guides have clear course labels and routes back to Paper 1", () => {
  const guides = [
    { course: "language-literature" as const, id: textTypeGuideIds.podcast, label: "Text types" },
    { course: "language-literature" as const, id: textTypeGuideIds.letter, label: "Text types" },
    { course: "language-literature" as const, id: textTypeGuideIds.webpage, label: "Text types" },
    { course: "language-literature" as const, id: textTypeGuideIds.article, label: "Text types" },
    { course: "language-literature" as const, id: textTypeGuideIds.speech, label: "Text types" },
    { course: "language-literature" as const, id: textTypeGuideIds.opinion, label: "Text types" },
    { course: "language-literature" as const, id: textTypeGuideIds.blog, label: "Text types" },
    { course: "language-literature" as const, id: textTypeGuideIds.cartoon, label: "Text types" },
    { course: "language-literature" as const, id: textTypeGuideIds.infographic, label: "Text types" },
    { course: "literature" as const, id: textTypeGuideIds.poetry, label: "Literary forms" },
    { course: "literature" as const, id: textTypeGuideIds.drama, label: "Literary forms" },
    { course: "literature" as const, id: textTypeGuideIds.prose, label: "Literary forms" },
    { course: "literature" as const, id: textTypeGuideIds.nonfiction, label: "Literary forms" },
    { course: "language-literature" as const, id: textTypeGuideIds.advertisement, label: "Text types" },
    { course: "language-literature" as const, id: textTypeGuideIds.charityAppeal, label: "Text types" },
  ];
  for (const { course, id, label } of guides) {
    assert.equal(courseSectionName(course, "text-types"), label);
    const pages = publicCourse(course).items;
    const guide = pages.find(item => item.id === id);
    const paperOne = pages.find(item => item.title === "Paper 1" && item.section === "assessment");
    assert.equal(guide?.section, "text-types");
    assert.ok(guide?.body.includes(`/courses/${course}/assessment/${paperOne?.id}`));
    if (course === "literature") assert.ok(paperOne?.body.includes(`/courses/${course}/text-types/${id}`));
  }
  const paperOne = publicCourse("language-literature").items.find(item => item.section === "assessment" && item.title === "Paper 1");
  const stepTwo = paperOne?.body.match(/^### 2\..*\n([\s\S]*?)\n### 3\./m)?.[1];
  assert.ok(stepTwo);
  assert.deepEqual([...stepTwo.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]), ["/courses/language-literature/text-types"]);
  const english = structuredClone(courses.find(course => course.id === "english-10")!);
  english.items.push({ ...english.items[0], id: crypto.randomUUID(), section: "text-types" });
  assert.equal(courseSchema.safeParse(english).success, false);
});

test("numbered worked examples match the published guide headings in order", () => {
  for (const id of Object.values(textTypeGuideIds)) {
    const example = getTextTypeExample(id)!;
    const guide = publicCourse(example.courseId).items.find(item => item.id === id);
    assert.ok(guide, id);
    assert.ok(guide.body.includes("## Worked example\n"), guide.title);
    const additional = example.additional ?? [];
    const markers = [...guide.body.matchAll(/^## Additional worked example: (.+)$/gm)].map(match => match[1]);
    assert.deepEqual(additional.map(item => item.marker), markers, guide.title);
    assert.equal(new Set(additional.map(item => item.key)).size, additional.length, guide.title);
    for (const { shortTitle } of [example, ...additional]) assert.ok(shortTitle.trim(), guide.title);
  }
});
