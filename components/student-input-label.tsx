import { PencilLine } from "lucide-react";
import type { ReactNode } from "react";

export default function StudentInputLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`student-input-label ${className}`}><PencilLine size={15} aria-hidden="true"/>{children}</span>;
}
