import type { ReactNode } from "react";

export default function SourceInformation({ children }: { children: ReactNode }) {
  return <>
    <details className="source-information"><summary>Source notes and credits</summary>{children}</details>
    <div className="source-information-print">{children}</div>
  </>;
}
