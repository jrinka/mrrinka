import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight, ArrowLeft, Download, Wrench } from "lucide-react";
import Shell from "@/components/shell";
import Markdown from "@/components/markdown";
import Practice from "@/components/practice";
import {
  ArchiveCardArt,
  ArchiveHero,
  archiveKeyword,
} from "@/components/archive-art";
import { publicCourse, courses } from "@/lib/content";
import {
  isCourseId,
  sectionNames,
  sections,
  type Section,
  type CourseItem,
} from "@/lib/schema";
type Props = { params: Promise<{ courseId: string; path?: string[] }> };

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
          <span className="mono">ASSESSMENT INDEX / ACTIVE DOSSIERS</span>
          <h1>{ibCourse ? "Assessment dossiers" : "Workshop & sandbox"}</h1>
          <p className="intro">
            {ibCourse
              ? "Start with the task in front of you. Each dossier gathers guidance, response-building tools, examples, and practice in one place."
              : "A flexible space for current assignments, experiments, and selected tools from elsewhere on the site."}
          </p>
        </div>
        {ibCourse && (
          <Link className="assessment-toolkit-jump" href="/resources">
            <Wrench size={18} />
            <span>
              <small className="mono">SHARED SYSTEM</small>
              <strong>Analysis toolkit</strong>
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
                  <span className="mono">
                    DOSSIER / {String(index + 1).padStart(2, "0")}
                  </span>
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
  const { courseId } = await params;
  return {
    title: isCourseId(courseId)
      ? publicCourse(courseId).title
      : "Course not found",
  };
}
export default async function CoursePage({ params }: Props) {
  const { courseId, path = [] } = await params;
  if (!isCourseId(courseId) || path.length > 2) notFound();
  const course = publicCourse(courseId);
  const section = path[0] as Section | undefined;
  if (section && !(sections as readonly string[]).includes(section)) notFound();
  const item = path[1]
    ? course.items.find((i) => i.id === path[1] && i.section === section)
    : undefined;
  if (path[1] && !item) notFound();
  const base = `/courses/${courseId}`;
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
              {String(n + 1).padStart(2, "0")} / {sectionNames[i.section]}
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
        {section ? sectionNames[section] : "Overview"}
      </div>
      {item ? (
        <>
          <Link className="back" href={`${base}/${section}`}>
            <ArrowLeft size={16} /> {sectionNames[section!]}
          </Link>
          <h1>{item.title}</h1>
          <p className="intro">{item.summary}</p>
          {item.section === "assessment" && courseId !== "english-10" && (
            <nav className="dossier-nav" aria-label="Dossier sections">
              <span className="mono">DOSSIER MAP</span>
              <a href="#understand-the-task">01 Understand</a>
              <a href="#build-the-response">02 Build</a>
              <a href="#study-examples">03 Examine</a>
              <a href="#practice">04 Practise</a>
            </nav>
          )}
          {item.image && (
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
          <Markdown>{item.body}</Markdown>
          {item.section === "assessment" && courseId !== "english-10" && (
            <aside className="dossier-toolkit">
              <span className="mono">METHODS / SHARED</span>
              <div>
                <h2>Analysis toolkit</h2>
                <p>Close reading, evidence, analytical verbs, comparison, and response-building methods shared across the IB courses.</p>
              </div>
              <Link href="/resources">Open the toolkit <ArrowUpRight size={17} /></Link>
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
          )}{" "}
          {item.relatedIds.length > 0 && (
            <section className="related">
              <div className="section-heading">
                <h2>Continue exploring</h2>
              </div>
              <div className="cards">
                {course.items
                  .filter((i) => item.relatedIds.includes(i.id))
                  .map(card)}
              </div>
            </section>
          )}
        </>
      ) : section === "assessment" ? (
        <AssessmentIndex
          courseId={courseId}
          items={course.items.filter((i) => i.section === "assessment")}
          href={href}
        />
      ) : section ? (
        <>
          <h1>{sectionNames[section]}</h1>
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
              }[section]
            }
          </p>
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
          {featured && (
            <section
              className={`featured ${featured.image ? "with-photo" : ""}`}
            >
              <div className="featured-copy">
                <span className="mono">
                  IN FOCUS / {sectionNames[featured.section]}
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
                  section={x.section as Section}
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
