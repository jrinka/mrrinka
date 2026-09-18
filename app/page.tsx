import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import GlobalShell from "@/components/global-shell";
import { courses, publicCourse } from "@/lib/content";

const dispatches = [
  { index: "01", title: "My calendar", note: "Eight-day cycle, class meetings, and the days ahead.", tag: "8-DAY CYCLE", href: "/calendar" },
  { index: "02", title: "Course directory", note: "Enter a course and continue from its current unit.", tag: "03 COURSES", href: "#courses" },
  { index: "03", title: "Writing & reference", note: "Analysis guides, models, and tools shared across classes.", tag: "COMMON TOOLS", href: "/resources" },
  { index: "04", title: "Practice console", note: "Short, guided activities for close reading and writing.", tag: "SKILL LAB", href: "/practice" },
];

export default function Home() {
  return (
    <GlobalShell>
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <span className="mono landing-kicker">ENGLISH / COURSE HUB</span>
          <h1>Read closely.<br />Make meaning.</h1>
          <p>Courses, texts, reference tools, and deliberate practice for the work ahead.</p>
          <a className="button" href="#dispatch">Open quick access <ArrowDownRight size={17} /></a>
        </div>
        <figure className="landing-plate">
          <div>
            <Image src="/archive/printing-workshop-stradanus.jpg" alt="An engraving of compositors setting type, proofing copy, and operating a printing press" fill sizes="(max-width: 800px) 100vw, 52vw" priority />
            <span className="landing-plate-label">PLATE / 00 — IMPRESS</span>
            <figcaption><span className="credit-license">PDM</span> / <a href="https://wellcomecollection.org/works/czcn5src" rel="noopener noreferrer" title="The printing workshop. Public Domain Mark. Source: Wellcome Collection.">WELLCOME</a></figcaption>
          </div>
        </figure>
      </section>

      <section className="dispatch-section" id="dispatch">
        <div className="landing-section-label"><span className="mono">QUICK ACCESS / 01—04</span><p>Common systems</p></div>
        <div className="dispatch-board">
          {dispatches.map((item) => (
            <Link className="dispatch-row" href={item.href} key={item.index}>
              <span className="dispatch-index">{item.index}</span>
              <span className="dispatch-copy"><strong>{item.title}</strong><small>{item.note}</small></span>
              <span className="dispatch-tag">{item.tag}</span>
              <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="course-directory" id="courses">
        <div className="landing-section-label"><span className="mono">COURSE DIRECTORY / 01—03</span><p>Choose your course</p></div>
        <div className="course-gateways">
          {courses.map((course, index) => {
            const visible = publicCourse(course.id);
            const featured = visible.items.find((item) => item.id === visible.featuredId);
            return (
              <Link className="course-gateway" href={`/courses/${course.id}`} key={course.id}>
                <span className="course-gateway-index">COURSE / {String(index + 1).padStart(2, "0")}</span>
                <h2>{course.title.replace("IB English A: ", "")}</h2>
                <p>{course.description}</p>
                <div className="course-gateway-current"><span>CURRENT FOCUS</span><strong>{featured?.title ?? "Course overview"}</strong></div>
                <ArrowUpRight size={20} aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </section>
    </GlobalShell>
  );
}
