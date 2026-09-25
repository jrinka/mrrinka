import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { ArrowUpRight, ArrowLeft, Download, Wrench } from "lucide-react";
import Shell from "@/components/shell";
import Markdown from "@/components/markdown";
import RefineryLinks from "@/components/refinery-links";
import { assessmentRefinery } from "@/lib/refineries";
import Practice from "@/components/practice";
import PaperOneDossier from "@/components/paper-one-dossier";
import TextTypeIndex from "@/components/text-type-index";
import TextTypeGuide from "@/components/text-type-guide";
import CourseSectionTabs from "@/components/course-section-tabs";
import { hasTextTypeExample } from "@/lib/text-type-guides";
import {
  ArchiveCardArt,
  ArchiveHero,
  archiveKeyword,
} from "@/components/archive-art";
import { publicCourse, courses } from "@/lib/content";
import {
  isCourseId,
  courseSectionName,
  sectionNames,
  sections,
  type Section,
  type CourseItem,
} from "@/lib/schema";
type Props = { params: Promise<{ courseId: string; path?: string[] }>; searchParams: Promise<{ view?: string | string[]; example?: string | string[] }> };

const assessmentCodes: Record<string, string> = {
  "Paper 1": "P1",
  "Paper 2": "P2",
  "Individual Oral": "IO",
  "Higher Level Essay": "HLE",
};

function AssessmentIndex({
  courseId,
  items,
  href,
}: {
  courseId: string;
  items: CourseItem[];
  href: (item: CourseItem) => string;
}) {
  const ibCourse = courseId !== "english-10";
  return (
    <>
      <div className="assessment-index-head">
        <div>
          <span className="mono">{ibCourse ? "IB ENGLISH A / ASSESSMENT INDEX" : "ENGLISH 10 / TASK GUIDES"}</span>
          <h1>{ibCourse ? "Assessments" : "Writing & discussion"}</h1>
          <p className="intro">
            {ibCourse
              ? "Start with an assessment. Find the method, criteria, practice, and tools you need to develop your response."
              : "Return to these guides as the texts change and the tasks ask for more independent thinking."}
          </p>
        </div>
        {ibCourse && (
          <Link className="assessment-toolkit-jump" href="/resources">
            <Wrench size={18} />
            <span>
              <small className="mono">SHARED SYSTEM</small>
              <strong>Skills & Methods</strong>
              <em>Methods used across assessments</em>
            </span>
            <ArrowUpRight size={18} />
          </Link>
        )}
      </div>
      <div className="assessment-grid">
        {items.map((assessment, index) => (
          <article className="assessment-card" key={assessment.id}>
            <Link href={href(assessment)}>
              {assessment.image && (
                <div className="assessment-card-image">
                  <Image
                    src={assessment.image}
                    alt={assessment.imageAlt}
                    fill
                    sizes="(max-width: 720px) 100vw, 40vw"
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                  <span className="mono">{archiveKeyword(assessment.image)}</span>
                </div>
              )}
              <div className="assessment-card-copy">
                <span className="assessment-code">
                  {assessmentCodes[assessment.title] ?? `W${index + 1}`}
                </span>
                <div>
                  <h2>{assessment.title}</h2>
                  <p>{assessment.summary}</p>
                  <div className="assessment-stages mono">
                    <span>ORIENT</span><span>BUILD</span><span>EXAMINE</span><span>PRACTISE</span>
                  </div>
                </div>
                <ArrowUpRight size={20} aria-hidden="true" />
              </div>
            </Link>
            {assessment.image && (
              <div className="assessment-card-credit"><ImageCredit item={assessment} /></div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}

function ImageCredit({ item }: { item: CourseItem }) {
  const archival = item.image.startsWith("/archive/");
  const met = item.imageSource.includes("metmuseum.org");
  const license = met ? "CC0" : "PDM";
  const collection = met ? "MET" : "WELLCOME";
  const archivalDetail = `${item.imageCredit}. ${license}.`;
  return (
    <>
      {archival ? (
        <>
          <span className="credit-license">{license}</span>
          <span aria-hidden="true"> / </span>
        </>
      ) : (
        "Photo by "
      )}
      {item.imageSource ? (
        <a
          href={item.imageSource}
          rel="noopener noreferrer"
          title={archival ? archivalDetail : undefined}
          aria-label={archival ? archivalDetail : undefined}
        >
          {archival ? collection : item.imageCredit}
        </a>
      ) : (
        item.imageCredit
      )}
      {!archival && " / Unsplash"}
    </>
  );
}

export async function generateMetadata({ params }: Props) {
  const { courseId, path = [] } = await params;
  if (!isCourseId(courseId)) return { title: "Course not found" };
  const course = publicCourse(courseId);
  const section = path[0];
  if (section && (sections as readonly string[]).includes(section)) {
    const typedSection = section as Section;
    const item = path[1] && course.items.find(candidate => candidate.section === section && candidate.id === path[1]);
    if (item) return { title: `${item.title} · ${course.shortTitle}`, description: item.summary };
    return { title: `${courseSectionName(courseId, typedSection)} · ${course.shortTitle}` };
  }
  return { title: course.title, description: course.description };
}
export default async function CoursePage({ params, searchParams }: Props) {
  const { courseId, path = [] } = await params;
  if (!isCourseId(courseId) || path.length > 2) notFound();
  const currentCourseId = courseId;
  if (!path.length && courseId !== "english-10") redirect(`/courses/${courseId}/assessment`);
  const course = publicCourse(courseId);
  const section = path[0] as Section | undefined;
  if (section && !(sections as readonly string[]).includes(section)) notFound();
  if (section === "text-types" && courseId === "english-10") notFound();
  const item = path[1]
    ? course.items.find((i) => i.id === path[1] && i.section === section)
    : undefined;
  if (path[1] && !item) notFound();
  const sharedGuides:Record<string,string>={"From observation to analysis":"/resources/observation-to-analysis","SOAPSTone: a rhetorical reading scaffold":"/resources/reading-methods/soapstone","TPCASTT: a poetry reading scaffold":"/resources/reading-methods/tpcastt"};
  if(item?.section==="resources"&&sharedGuides[item.title])redirect(sharedGuides[item.title]);
  const base = `/courses/${courseId}`;
  const isLangLitPaperOne =
    courseId === "language-literature" && item?.title === "Paper 1";
  const href = (i: CourseItem) => `${base}/${i.section}/${i.id}`;
  const featured = course.items.find((i) => i.id === course.featuredId);
  function card(i: CourseItem, n: number) {
    return (
      <article className="content-card" key={i.id}>
        <Link className="card-link" href={href(i)}>
          {i.image && (
            <div className="card-image">
              <Image
                src={i.image}
                alt={i.imageAlt}
                fill
                sizes="(max-width: 700px) 90vw, 30vw"
              />
            </div>
          )}
          <div className="card-copy">
            <span className="mono card-number">
              {String(n + 1).padStart(2, "0")} / {courseSectionName(currentCourseId, i.section)}
            </span>
            <h2>{i.title}</h2>
            <p>{i.summary}</p>
            <ArrowUpRight size={18} aria-hidden="true" />
          </div>
        </Link>
        {i.image && (
          <div className="card-credit">
            <ImageCredit item={i} />
          </div>
        )}
      </article>
    );
  }

  return (
    <Shell
      courseId={courseId}
      courseLabels={courses.map((c) => ({
        id: c.id,
        short: c.shortTitle,
        side: c.title.replace("IB English A: ", ""),
      }))}
    >
      <div className="breadcrumb mono">
        <Link href={base}>{course.eyebrow}</Link> /{" "}
        {section ? courseSectionName(courseId, section) : "Overview"}
      </div>
      {courseId !== "english-10" && (section === "assessment" || section === "text-types") && <CourseSectionTabs courseId={courseId} active={section} />}
      {item ? (
        <>
          <Link className="back" href={`${base}/${section}`}>
            <ArrowLeft size={16} /> {courseSectionName(courseId, section!)}
          </Link>
          <h1>{item.title}</h1>
          <p className="intro">{item.summary}</p>
          {item.image && item.section !== "assessment" && (
            <figure className="article-image">
              <div>
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 700px) 90vw, 70vw"
                  priority
                />
              </div>
              {item.imageCredit && (
                <figcaption>
                  <ImageCredit item={item} />
                </figcaption>
              )}
            </figure>
          )}
          {item.section === "assessment" && courseId !== "english-10" ? <PaperOneDossier body={item.body} workedExample={isLangLitPaperOne} literatureExample={courseId === "literature" && item.title === "Paper 1"} refinery={assessmentRefinery(item.title)} /> : item.section === "text-types" && hasTextTypeExample(courseId, item.id) ? <TextTypeGuide body={item.body} itemId={item.id} href={`${base}/text-types/${item.id}`} showExample={(await searchParams).view === "example"} exampleChoice={(await searchParams).example === "wwf" ? "wwf" : (await searchParams).example === "cycling" ? "cycling" : undefined} /> : <Markdown>{item.body}</Markdown>}
          {item.section === "assessment" && courseId !== "english-10" && (
            <aside className="dossier-toolkit">
              <span className="mono">METHODS / SHARED</span>
              <div>
                <h2>Skills & Methods</h2>
                <p>Close reading, evidence, analytical verbs, comparison, and response-building methods shared across the IB courses.</p>
              </div>
              <div><Link href="/resources">Explore skills & methods <ArrowUpRight size={17} /></Link><br /><Link href="/resources/critical-lenses">Critical Lenses <ArrowUpRight size={17} /></Link><br /><Link href={`${base}/text-types`}>{courseSectionName(courseId, "text-types")} <ArrowUpRight size={17} /></Link></div>
            </aside>
          )}
          {item.links.length > 0 && (
            <section className="resource-links">
              <h2>Materials</h2>
              {item.links.map((l) => (
                <a
                  key={l.id}
                  className="resource-link"
                  href={l.url}
                  rel="noopener noreferrer"
                >
                  <Download size={18} />
                  <span>
                    <strong>{l.title}</strong>
                    <small>{l.description}</small>
                  </span>
                  <ArrowUpRight size={16} />
                </a>
              ))}
            </section>
          )}
          {item.practiceKind !== "none" && (
            <Practice key={item.id} kind={item.practiceKind} />
          )}
        </>
      ) : section === "assessment" ? (
        <AssessmentIndex
          courseId={courseId}
          items={course.items.filter((i) => i.section === "assessment")}
          href={href}
        />
      ) : section === "text-types" ? (
        <TextTypeIndex courseId={courseId as "language-literature" | "literature"} items={course.items.filter(i => i.section === "text-types")} />
      ) : section ? (
        <>
          <h1>{courseSectionName(courseId, section)}</h1>
          <p className="intro">
            {
              {
                units: "Texts, ideas, and activities for the work ahead.",
                assessment:
                  "Task guidance and support for developing your response.",
                resources:
                  "Useful references to return to throughout the course.",
                practice:
                  "Try a skill, experiment with a choice, and sharpen your thinking.",
                "text-types": "Explore the choices that shape different kinds of texts.",
              }[section]
            }
          </p>
          {section === "resources" && <p className="intro"><Link href="/resources/critical-lenses">Critical Lenses — explore different ways of reading ↗</Link></p>}
          {section === "practice" && <RefineryLinks kind={courseId === "english-10" ? "analysis" : undefined} />}
          <div className="cards">
            {course.items.filter((i) => i.section === section).map(card)}
          </div>
          {!course.items.some((i) => i.section === section) && (
            <div className="empty">
              Materials will appear here as they are added.
            </div>
          )}
        </>
      ) : (
        <>
          <div className="course-hero">
            <div className="course-hero-copy">
              <h1>{course.title.replace("IB English A: ", "")}</h1>
              <p className="intro">{course.description}</p>
            </div>
            <ArchiveHero courseId={courseId} />
          </div>
          {course.announcement && (
            <div className="announcement">
              <span className="mono">CLASS NOTE</span>
              <p>{course.announcement}</p>
            </div>
          )}
          {courseId === "english-10" && (
            <>
              <div className="section-heading"><h2>Four ways into a text</h2><span className="mono">NOVEL / POETRY / DRAMA / ESSAY</span></div>
              <div className="e10-unit-index">
                {course.items.filter(i => i.section === "units").map((unit, index) => (
                  <Link key={unit.id} href={href(unit)}><span className="mono">0{index + 1}</span><div><h2>{unit.title}</h2><p>{unit.summary}</p></div><ArrowUpRight size={18} /></Link>
                ))}
              </div>
              <div className="section-heading"><h2>Writing & discussion</h2><span className="mono">RECURRING TASKS</span></div>
              <div className="cards">{course.items.filter(i => i.section === "assessment").map(card)}</div>
              <aside className="e10-progression"><span className="mono">CRA / DEVELOPING INDEPENDENCE</span><p>A supplied focus <span aria-hidden="true">→</span> Your choice of technique <span aria-hidden="true">→</span> Connected analysis across paragraphs</p><small>Support, length, and paragraph requirements depend on the task. Check the current task sheet.</small></aside>
            </>
          )}
          {featured && (
            <section
              className={`featured ${featured.image ? "with-photo" : ""}`}
            >
              <div className="featured-copy">
                <span className="mono">
                  IN FOCUS / {courseSectionName(courseId, featured.section)}
                </span>
                <h2>{featured.title}</h2>
                <p>{featured.summary}</p>
                <Link href={href(featured)} className="button">
                  Open unit <ArrowUpRight size={17} />
                </Link>
              </div>
              {featured.image ? (
                <figure
                  className={`featured-photo ${featured.image.startsWith("/archive/") ? "archival-photo" : ""}`}
                >
                  <Image
                    src={featured.image}
                    alt={featured.imageAlt}
                    fill
                    sizes="(max-width: 700px) 90vw, 30vw"
                    priority
                  />
                  {featured.image.startsWith("/archive/") && (
                    <span className="archive-stamp" aria-hidden="true">
                      {archiveKeyword(featured.image)}
                    </span>
                  )}
                  <figcaption>
                    <ImageCredit item={featured} />
                  </figcaption>
                </figure>
              ) : (
                <div className="type-art" aria-hidden="true">
                  Aa
                </div>
              )}
            </section>
          )}
          <div className="section-heading">
            <h2>Make your next move.</h2>
            <span className="mono">EXPLORE THE COURSE</span>
          </div>

          <div className="cards">
            {[
              {
                section: "resources",
                title: "The reference shelf",
                desc: "Guides, examples, and reading tools.",
              },
              {
                section: "assessment",
                title: "Build your response",
                desc: "Understand the task. Shape your ideas.",
              },
              {
                section: "practice",
                title: "Try it out",
                desc: "Short activities. Room to experiment.",
              },
            ].map((x, i) => (
              <article
                className="content-card archive-route-card"
                key={x.section}
              >
                <ArchiveCardArt
                  courseId={courseId}
                  section={x.section as Exclude<Section, "text-types">}
                />
                <Link className="archive-route-link" href={`${base}/${x.section}`}>
                  <div className="card-copy">
                    <span className="mono card-number">
                      0{i + 1} / {sectionNames[x.section as Section]}
                    </span>
                    <h2>{x.title}</h2>
                    <p>{x.desc}</p>
                    <ArrowUpRight size={18} />
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </>
      )}
    </Shell>
  );
}
