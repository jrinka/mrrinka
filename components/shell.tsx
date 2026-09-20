import InteriorShell from "./interior-shell";
import type { CourseId } from "@/lib/schema";
export default function Shell({children,courseId,courseLabels}:{children:React.ReactNode;courseId:CourseId;courseLabels:{id:string;short:string;side:string}[]}) {
  return <InteriorShell courseId={courseId} courseLabels={courseLabels}>{children}</InteriorShell>;
}
