import Link from "next/link";

export default function CourseSectionTabs({ courseId, active }: { courseId: "language-literature" | "literature"; active: "assessment" | "text-types" }) {
  return <nav className="course-section-tabs" aria-label="IB course sections">
    {(["assessment", "text-types"] as const).map((section, index) => <Link
      key={section}
      href={`/courses/${courseId}/${section}`}
      aria-current={active === section ? "page" : undefined}
    ><span className="mono">0{index + 1}</span>{section === "assessment" ? "Assessments" : "Text types"}</Link>)}
  </nav>;
}
