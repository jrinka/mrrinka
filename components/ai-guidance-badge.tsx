import { Sparkles } from "lucide-react";

export default function AiGuidanceBadge() {
  return (
    <span className="ai-guidance-badge" role="img" aria-label="AI guidance available" title="AI guidance available">
      <Sparkles size={19} aria-hidden="true" />
      <span className="mono" aria-hidden="true">AI</span>
    </span>
  );
}
