"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AiGuidanceBadge from "@/components/ai-guidance-badge";
import { refineryKinds, refineries, type RefineryKind } from "@/lib/refineries";

export const refineryApplications: Record<RefineryKind, string> = {
  analysis: "GENERAL ANALYSIS · PAPER 1",
  comparison: "PAPER 2",
  "global-issue": "INDIVIDUAL ORAL",
  "line-of-inquiry": "HIGHER LEVEL ESSAY",
};

export default function RefineryLinks({ kind, related }: {
  kind?: RefineryKind;
  related?: Partial<Record<RefineryKind, ReactNode>>;
}) {
  const course = usePathname().match(/^\/courses\/(language-literature|literature)(?:\/|$)/)?.[1];
  return <div className="refinery-links">
    {(kind ? [kind] : refineryKinds).map(key => (
      <div className="refinery-choice" key={key}>
        <Link className="refinery-card" href={`/practice/refineries/${key}${course ? `?course=${course}` : ""}`}>
          <AiGuidanceBadge />
          <strong>{refineries[key].title}</strong>
          <span>{refineries[key].description}</span>
          <span className="mono">{refineryApplications[key]}</span>
        </Link>
        {related?.[key] && <div className="refinery-related">{related[key]}</div>}
      </div>
    ))}
  </div>;
}
