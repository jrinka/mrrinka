import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import GlobalShell from "@/components/global-shell";
import { courses, publicCourse } from "@/lib/content";

export const metadata: Metadata = { title: "Writing & reference" };

export default function ResourcesPage() {
  return (
    <GlobalShell>
      <div className="global-page-head"><span className="mono">COMMON SYSTEM / REFERENCE</span><h1>Writing &amp; reference</h1><p>Shared analytical tools, guides, and models, organized by course.</p></div>
      <div className="global-directory-list">
        {courses.map((course, index) => {
          const resources = publicCourse(course.id).items.filter((item) => item.section === "resources");
          return <section className="global-directory-group" key={course.id}>
            <div className="global-directory-course"><span>0{index + 1}</span><h2>{course.shortTitle}</h2></div>
            <div>{resources.map((item) => <Link href={`/courses/${course.id}/resources/${item.id}`} key={item.id}><span><strong>{item.title}</strong><small>{item.summary}</small></span><ArrowUpRight size={18} /></Link>)}</div>
          </section>;
        })}
      </div>
    </GlobalShell>
  );
}
