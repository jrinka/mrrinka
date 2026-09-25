import { GuidePlate } from "@/components/archive-art";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import GlobalShell from "@/components/global-shell";
import { ibCourses, publicCourse } from "@/lib/content";

export const metadata: Metadata = { title: "Skills & Methods" };

export default function ResourcesPage() {
  const shared = new Map<
    string,
    {
      item: ReturnType<typeof publicCourse>["items"][number];
      courseId: (typeof ibCourses)[number]["id"];
      courses: string[];
    }
  >();

  for (const course of ibCourses) {
    for (const item of publicCourse(course.id).items.filter(
      (candidate) => candidate.section === "resources",
    )) {
      const existing = shared.get(item.title.toLowerCase());
      if (existing) existing.courses.push(course.shortTitle);
      else
        shared.set(item.title.toLowerCase(), {
          item,
          courseId: course.id,
          courses: [course.shortTitle],
        });
    }
  }

  const groups = [
    {title:"Reading a text",items:[
      {href:"/resources/critical-lenses",title:"Critical Lenses",summary:"Questions that open up a reading, with examples and further reading."},
      ...[...shared.values()].filter(({item})=>/TPCASTT|SOAPSTone/i.test(item.title)).map(({item,courseId})=>({href:`/courses/${courseId}/resources/${item.id}`,title:item.title,summary:item.summary})),
    ]},
    {title:"Building a response",items:[
      {href:"/resources/unpacking-questions",title:"Unpacking Paper 1 & Paper 2 questions",summary:"Worked breakdowns and original comparison prompts to practice with."},
      {href:"/resources/observation-to-analysis",title:"From observation to analysis",summary:"Evidence, meaning and an interactive sentence workshop."},
      {href:"/resources/paper-1-introductions",title:"Paper 1: Introductions & thesis statements",summary:"Step-by-step guidance with literary and non-literary worked examples."},
      {href:"/resources/hle-inquiries",title:"HLE: how an inquiry develops",summary:"Worked examples with Lady Susan and Timon of Athens."},
    ]},
    {title:"Language & reference",items:[
      {href:"/resources/analysis-reference",title:"Terms for analysis",summary:"Literary, rhetorical and visual terms: definitions, examples and possible analysis."},
      {href:"/resources/analytical-language",title:"Tone, transitions, verbs & sentence stems",summary:"Reference banks for precise language and connected ideas."},
      ...[...shared.values()].filter(({item})=>item.title!=="From observation to analysis"&&!/TPCASTT|SOAPSTone/i.test(item.title)).map(({item,courseId})=>({href:`/courses/${courseId}/resources/${item.id}`,title:item.title,summary:item.summary})),
    ]},
  ];
  return <GlobalShell>
    <div className="illustrated-guide-head"><div className="global-page-head"><span className="mono">SHARED SKILLS / METHODS</span><h1>Skills & Methods</h1><p>General English resources for reading, analysis, and writing—useful in English 10, IB, and beyond.</p></div><GuidePlate kind="methods" /></div>
    <div className="global-directory-list">{groups.map((group,index)=><section className="global-directory-group" key={group.title}><div className="global-directory-course"><span>{String(index+1).padStart(2,"0")}</span><h2>{group.title}</h2></div><div>{group.items.map(item=><Link href={item.href} key={item.href}><span><strong>{item.title}</strong><small>{item.summary}</small></span><ArrowUpRight size={18} aria-hidden="true"/></Link>)}</div></section>)}</div>
  </GlobalShell>;
}
