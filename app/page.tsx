import ThemeToggle from "@/components/theme-toggle";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ibCourses } from "@/lib/content";

const sharedLinks = [
  { title: "Skills & Methods", note: "General English resources for reading, analysis, and writing.", label: "FOR EVERY COURSE", href: "/resources" },
  { title: "Practice", note: "Passages, workshops, and refineries.", label: "READ / WRITE / REVISE", href: "/practice" },
  { title: "My calendar", note: "The day cycle and class meetings.", label: "8-DAY CYCLE", href: "/calendar" },
  { title: "Recess", note: "Quick word games, drawing challenges, and classroom brain breaks by Mr. Rinka.", label: "CLASSROOM / BRAIN BREAKS", href: "/recess" },
];

export default function Home() {
  const links = [
    ...ibCourses.map(course => ({
      title: course.title.replace("IB English A: ", ""),
      note: course.id === "literature" ? "Paper 1, Paper 2, IO, and HLE." : "Paper 1, Paper 2, and the Individual Oral.",
      label: "IB ENGLISH A",
      href: `/courses/${course.id}`,
    })),
    ...sharedLinks,
  ];
  return (
    <div className="global-site entry-site">
      <a className="skip-link" href="#content">Skip to content</a>
      <header className="entry-header">
        <h1>Mr. Rinka<span aria-hidden="true">_</span></h1>
        <p><span lang="la">LEGE · SCRIBE · COGITA</span></p>
      </header>
      <main id="content" className="entry-main">
        <nav id="courses" className="entry-links" aria-label="Courses and shared tools">
          {links.map((link,index) => {
            // Recess is an independent document: load its own styles and runtime.
            const Destination = link.href === "/recess" ? "a" : Link;
            return <Destination className="entry-link" href={link.href} key={link.href}>
            <span className="entry-link-meta mono"><span>{String(index+1).padStart(2,"0")}</span>{link.label}</span>
            <h2>{link.title}</h2>
            <p>{link.note}</p>
            <ArrowUpRight size={19} aria-hidden="true" />
          </Destination>;
          })}
        </nav>
        <figure className="landing-plate entry-plate">
          <div>
            <Image src="/archive/printing-workshop-stradanus.jpg" alt="An engraving of compositors setting type, proofing copy, and operating a printing press" fill sizes="(max-width: 900px) 100vw, 40vw" priority />
            <span className="landing-plate-label">PLATE / 00 — IMPRESS</span>
            <figcaption><a href="https://wellcomecollection.org/" rel="noopener noreferrer" title="The printing workshop. Public Domain Mark. Source: Wellcome Collection.">WELLCOME</a></figcaption>
          </div>
        </figure>
      </main>
      <footer className="entry-footer mono"><ThemeToggle/><span>ENGLISH / LANGUAGE / LITERATURE</span><Link href="/admin">Teacher editor ↗</Link></footer>
    </div>
  );
}
