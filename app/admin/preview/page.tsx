import Editor from "@/components/editor";
import { publicCourse } from "@/lib/content";
import { courseIds } from "@/lib/schema";
export const metadata = {
  title: "Editor preview",
  robots: { index: false, follow: false },
};
export default function Preview() {
  return <Editor previewCourses={courseIds.map(publicCourse)} />;
}
